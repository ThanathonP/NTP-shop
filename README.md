# NTP Shop — Full-Stack E-Commerce

Next.js 14 + Supabase + Tailwind CSS + Vercel

## 🗂️ โครงสร้างโปรเจ็ค

```
ntp-shop/
├── app/
│   ├── page.tsx              # หน้าแรก (Homepage)
│   ├── shop/                 # หน้าร้านค้า/สินค้าทั้งหมด
│   ├── cart/                 # ตะกร้าสินค้า
│   ├── checkout/             # ชำระเงิน
│   ├── orders/               # ติดตามคำสั่งซื้อ
│   ├── auth/
│   │   ├── login/            # เข้าสู่ระบบ
│   │   └── register/         # สมัครสมาชิก
│   ├── admin/                # หลังบ้าน (shop_owner + admin เท่านั้น)
│   │   ├── page.tsx          # Dashboard
│   │   ├── products/         # จัดการสินค้า (CRUD)
│   │   ├── orders/           # จัดการคำสั่งซื้อ
│   │   └── shop/             # ข้อมูลร้านค้า
│   └── api/
│       └── auth/logout/      # Logout API
├── components/
│   └── shop/
│       ├── Navbar.tsx
│       └── ProductCard.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser client
│   │   ├── server.ts         # Server client
│   │   └── middleware.ts     # Auth middleware
│   └── utils.ts
├── types/index.ts
├── supabase/schema.sql       # ⬅️ รัน SQL นี้ใน Supabase ก่อน!
└── middleware.ts
```

---

## 🚀 วิธีติดตั้งและ Deploy

### ขั้นตอนที่ 1 — สร้าง Supabase Project (ฟรี)

1. ไปที่ [https://supabase.com](https://supabase.com) → Sign Up ฟรี
2. กด **New Project**
3. ตั้งชื่อโปรเจ็ค เลือก Region ใกล้สุด (Singapore)
4. ไปที่ **SQL Editor** → วาง SQL จากไฟล์ `supabase/schema.sql` → กด **Run**
5. ไปที่ **Project Settings → API** → Copy:
   - `Project URL`
   - `anon public` key
   - `service_role` key

### ขั้นตอนที่ 2 — ตั้งค่า Environment Variables

```bash
# copy ไฟล์ตัวอย่าง
cp .env.local.example .env.local
```

แก้ไข `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciO...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciO...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### ขั้นตอนที่ 3 — รัน Dev Server

```bash
npm install
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

---

### ขั้นตอนที่ 4 — Deploy ขึ้น Vercel (ฟรี)

#### วิธีที่ 1: ผ่าน GitHub (แนะนำ)
1. Push โค้ดขึ้น GitHub
2. ไปที่ [https://vercel.com](https://vercel.com) → Import Repository
3. ใน **Environment Variables** ให้ใส่ค่าเดียวกับ `.env.local`
4. กด **Deploy** — เสร็จสิ้น! ได้ URL ฟรีทันที

#### วิธีที่ 2: ผ่าน Vercel CLI
```bash
npm i -g vercel
vercel
```

---

## 🔐 ระบบ Role

| Role | สิทธิ์ |
|------|-------|
| `customer` | ดูสินค้า, สั่งซื้อ, ดูออเดอร์ตัวเอง |
| `shop_owner` | ทุกอย่างของ customer + เข้า Admin Panel จัดการร้านตัวเอง |
| `admin` | เข้าถึงทุกอย่าง |

> หมายเหตุ: เปลี่ยน role ได้ใน Supabase Dashboard → Table Editor → profiles

---

## ✨ ฟีเจอร์ทั้งหมด

**หน้าบ้าน (Customer)**
- หน้าแรก + Hero Section
- ดูสินค้าทั้งหมด + ค้นหา + กรองหมวดหมู่
- ตะกร้าสินค้า (เพิ่ม/ลด/ลบ)
- Checkout + กรอกที่อยู่จัดส่ง
- ติดตามสถานะออเดอร์

**หลังบ้าน (Shop Owner)**
- Dashboard + สถิติ
- จัดการสินค้า (เพิ่ม/แก้ไข/ลบ)
- จัดการคำสั่งซื้อ + เปลี่ยนสถานะ
- ตั้งค่าข้อมูลร้านค้า
