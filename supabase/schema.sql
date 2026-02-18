-- ========================================
-- MONO SHOP — Supabase Database Schema
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
  insert into profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

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

-- policy นี้ต้องสร้างหลัง order_items เพราะอ้างอิงตารางนั้น
create policy "Shop owners can view orders of their products" on orders
  for select using (
    exists (
      select 1 from order_items oi
      join products p on p.id = oi.product_id
      join shops s on s.id = p.shop_id
      where oi.order_id = orders.id and s.owner_id = auth.uid()
    )
  );

-- ======= SEED DATA (ตัวอย่าง) =======
-- หมายเหตุ: รันหลังจากสร้าง user ผ่าน Auth แล้ว
