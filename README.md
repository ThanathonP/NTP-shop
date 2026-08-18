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
│   ├── admin/                # หลังบ้าน (ผู้ใช้ที่ล็อกอินแล้วทุกคนเข้าได้ เพื่อสร้าง/จัดการร้านของตัวเอง)
│   │   ├── page.tsx          # Dashboard
│   │   ├── products/         # จัดการสินค้า (CRUD)
│   │   ├── orders/           # จัดการคำสั่งซื้อ
│   │   ├── shop/             # ข้อมูลร้านค้า
│   │   └── platform/         # เฉพาะ role="admin" — ร้านค้า/ผู้ใช้/คำสั่งซื้อทั้งระบบ
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

ผู้ใช้ทุกคนที่ล็อกอินแล้วมีสิทธิ์เหมือนกันหมด ไม่มีการแบ่ง role ระหว่างลูกค้ากับเจ้าของร้าน:
- ซื้อสินค้าจากร้านไหนก็ได้เสมอ ไม่ว่าจะมีร้านค้าของตัวเองหรือไม่
- อยากมีร้านค้าเป็นของตัวเองเมื่อไหร่ก็เข้า `/admin/shop` แล้วสร้างได้ทันที ไม่ต้องขอสิทธิ์ก่อน

มีเพียง role เดียวที่มีสิทธิ์พิเศษแยกออกมาจริง:

| Role | สิทธิ์ |
|------|-------|
| `customer` / `shop_owner` | ค่า default ในฐานข้อมูล ไม่มีผลต่อสิทธิ์การใช้งานใดๆ (เก็บไว้เผื่อใช้แสดงผลเฉยๆ) |
| `admin` | เห็นเมนู "จัดการเว็บไซต์" เพิ่มใน `/admin` — ดู/ปิดร้านค้าทุกร้าน, ดูคำสั่งซื้อทั้งระบบ, ดู/เปลี่ยน role ผู้ใช้ทุกคน |

> เปลี่ยนใครให้เป็น admin ได้จากหน้า `/admin/platform/users` (ต้องล็อกอินด้วยบัญชี admin ก่อน) หรือแก้ตรงๆ ใน Supabase Dashboard → Table Editor → profiles

---

## 🔑 บัญชีทดลองใช้งาน (Demo Accounts)

สร้างไว้ให้แล้วผ่าน `node scripts/seed-shops.js` และสคริปต์สร้างบัญชีทดสอบ —รหัสผ่านเป็นรหัสง่ายๆ สำหรับทดลองใช้เท่านั้น **ไม่ควรใช้ pattern นี้กับบัญชีจริง**

| Email | Password | หมายเหตุ |
|---|---|---|
| customer1@ntp-shop.local | customer1 | บัญชีลูกค้าทั่วไป ยังไม่มีร้านค้า |
| customer2@ntp-shop.local | customer2 | บัญชีลูกค้าทั่วไป ยังไม่มีร้านค้า |
| customer3@ntp-shop.local | customer3 | บัญชีลูกค้าทั่วไป ยังไม่มีร้านค้า |
| shopowner1@ntp-shop.local | shopowner1 | มีร้าน "ร้านทดสอบ 1" ให้แล้ว |
| shopowner2@ntp-shop.local | shopowner2 | มีร้าน "ร้านทดสอบ 2" ให้แล้ว |
| shopowner3@ntp-shop.local | shopowner3 | มีร้าน "ร้านทดสอบ 3" ให้แล้ว |
| admin@email.com | admin@1234 | บัญชีผู้ดูแลระบบ เข้า `/admin/platform/*` ได้ |

ทุกบัญชี (ยกเว้น admin) ล็อกอินแล้วเข้า `/admin` เพื่อสร้างร้านค้าของตัวเองเพิ่มได้ทันทีถ้าต้องการ

---

## ✨ ฟีเจอร์ทั้งหมด

**หน้าบ้าน (Customer)**
- หน้าแรก + Hero Section
- ดูสินค้าทั้งหมด + ค้นหา + กรองหมวดหมู่
- ตะกร้าสินค้า (เพิ่ม/ลด/ลบ)
- Checkout + กรอกที่อยู่จัดส่ง
- ติดตามสถานะออเดอร์

**หลังบ้าน (ผู้ใช้ที่มีร้านค้าของตัวเอง)**
- สร้างร้านค้าได้เองทันทีที่ต้องการ ไม่ต้องรออนุมัติ
- Dashboard + สถิติ
- จัดการสินค้า (เพิ่ม/แก้ไข/ลบ)
- จัดการคำสั่งซื้อ + เปลี่ยนสถานะ
- ตั้งค่าข้อมูลร้านค้า

**ผู้ดูแลระบบ (Admin)**
- ดูร้านค้าทั้งหมดในระบบ + เปิด/ปิดการใช้งานร้าน
- ดูคำสั่งซื้อทั้งหมดในระบบ (ทุกร้าน)
- ดูผู้ใช้ทั้งหมด + เปลี่ยน role
