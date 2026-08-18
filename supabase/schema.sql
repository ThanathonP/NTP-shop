-- ========================================
-- NTP SHOP — Supabase Database Schema
-- วางใน SQL Editor ของ Supabase แล้วกด Run
-- ========================================

-- Enable UUID
create extension if not exists "uuid-ossp";

-- ======= PROFILES =======
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text default 'customer' check (role in ('customer', 'shop_owner', 'admin')),
  avatar_url text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ======= SHOPS =======
create table shops (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  description text,
  logo_url text,
  banner_url text,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table shops enable row level security;

create policy "Anyone can view active shops" on shops
  for select using (is_active = true);

create policy "Owner can manage own shop" on shops
  for all using (auth.uid() = owner_id);

-- ======= PRODUCTS =======
create table products (
  id uuid default uuid_generate_v4() primary key,
  shop_id uuid references shops(id) on delete cascade not null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  stock_qty integer default 0,
  image_url text,
  category text,
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table products enable row level security;

create policy "Anyone can view active products" on products
  for select using (is_active = true);

create policy "Shop owner can manage products" on products
  for all using (
    auth.uid() = (select owner_id from shops where id = products.shop_id)
  );

-- ======= CART =======
create table cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  quantity integer default 1,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

alter table cart_items enable row level security;

create policy "Users can manage own cart" on cart_items
  for all using (auth.uid() = user_id);

-- ======= ORDERS =======
create table orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  status text default 'pending' check (status in ('pending','confirmed','shipping','delivered','cancelled')),
  total_price numeric(10,2) not null,
  shipping_address jsonb,
  note text,
  created_at timestamptz default now()
);

alter table orders enable row level security;

create policy "Users can view own orders" on orders
  for select using (auth.uid() = user_id);

create policy "Users can create orders" on orders
  for insert with check (auth.uid() = user_id);

-- ======= ORDER ITEMS =======
create table order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) not null,
  quantity integer not null,
  unit_price numeric(10,2) not null
);

alter table order_items enable row level security;

create policy "Users can view own order items" on order_items
  for select using (
    auth.uid() = (select user_id from orders where id = order_items.order_id)
  );

create policy "Shop owners can view their order items" on order_items
  for select using (
    exists (
      select 1 from products p
      join shops s on s.id = p.shop_id
      where p.id = order_items.product_id and s.owner_id = auth.uid()
    )
  );

-- ไม่มี insert policy มาก่อน ทำให้ checkout สร้าง order สำเร็จแต่ insert order_items ไม่ได้เลย
-- (แถว order ถูกสร้างแต่ไม่มีรายการสินค้าอยู่ข้างใน)
create policy "Users can create order items for their own orders" on order_items
  for insert with check (
    auth.uid() = (select user_id from orders where id = order_items.order_id)
  );

-- ใช้ security definer function แทนการ query order_items ตรงๆ ใน policy ของ orders
-- เพราะ order_items เองก็มี policy ที่ query กลับไปที่ orders (auth.uid() = orders.user_id)
-- ถ้า policy ของ orders เข้าไป query order_items ตรงๆ จะเกิด RLS ประเมินวนกลับไปกลับมา
-- ("infinite recursion detected in policy for relation orders") — security definer function
-- รันด้วยสิทธิ์เจ้าของ function (ไม่ถูก RLS บล็อก) จึงตัดวงจรนี้ได้
create or replace function shop_owns_order(order_id uuid)
returns boolean as $$
  select exists (
    select 1 from order_items oi
    join products p on p.id = oi.product_id
    join shops s on s.id = p.shop_id
    where oi.order_id = shop_owns_order.order_id and s.owner_id = auth.uid()
  );
$$ language sql security definer set search_path = public stable;

-- policy นี้ต้องสร้างหลัง order_items เพราะอ้างอิงตารางนั้น (ผ่านฟังก์ชันด้านบน)
create policy "Shop owners can view orders of their products" on orders
  for select using (shop_owns_order(id));

-- ไม่มี update policy มาก่อนเลย ทำให้ปุ่มเปลี่ยนสถานะคำสั่งซื้อใน /admin/orders ใช้งานไม่ได้จริง
create policy "Shop owners can update orders of their products" on orders
  for update using (shop_owns_order(id));

-- ======= SITE ADMIN (role='admin') =======
-- ให้สิทธิ์ role="admin" ดูแลข้อมูลทั้งระบบ: ดู/ปิดร้านค้าใดก็ได้, ดูสินค้า/คำสั่งซื้อทั้งหมด,
-- ดูและเปลี่ยน role ของผู้ใช้คนไหนก็ได้ — แยกจากสิทธิ์ shop_owner ที่เห็นได้แค่ร้านตัวเอง
create or replace function is_admin()
returns boolean as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$ language sql security definer set search_path = public stable;

create policy "Admins can view all shops" on shops
  for select using (is_admin());
create policy "Admins can manage all shops" on shops
  for update using (is_admin());

create policy "Admins can view all products" on products
  for select using (is_admin());

create policy "Admins can view all orders" on orders
  for select using (is_admin());
create policy "Admins can view all order items" on order_items
  for select using (is_admin());

create policy "Admins can view all profiles" on profiles
  for select using (is_admin());
create policy "Admins can update all profiles" on profiles
  for update using (is_admin());

-- กัน user ทั่วไป self-escalate role ตัวเองผ่าน "Users can update own profile"
-- (เปลี่ยน role ได้ก็ต่อเมื่อคนที่สั่งเปลี่ยนเป็น admin เท่านั้น ไม่งั้นค่า role จะถูกเซ็ตกลับเป็นค่าเดิมเงียบๆ)
create or replace function prevent_role_self_escalation()
returns trigger as $$
begin
  if new.role <> old.role and not is_admin() then
    new.role := old.role;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger enforce_role_change_permission
  before update on profiles
  for each row execute function prevent_role_self_escalation();

-- ======= SEED DATA (ตัวอย่าง) =======
-- หมายเหตุ: รันหลังจากสร้าง user ผ่าน Auth แล้ว
