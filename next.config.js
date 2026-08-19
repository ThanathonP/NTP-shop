/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  experimental: {
    // ปิด client-side router cache สำหรับหน้า dynamic (ค่า default ของ Next คือ cache ไว้ 30 วิ)
    // ถ้าไม่ปิด: กด "เพิ่มลงตะกร้า" ที่หน้าอื่นแล้วรีบกดไอคอนตะกร้าใน Navbar จะเห็นข้อมูลเก่าที่ cache ไว้
    // ก่อนหน้านี้ ไม่ใช่ข้อมูลล่าสุดจาก DB — ตะกร้า/คำสั่งซื้อต้องสดใหม่เสมอ ยอมเสียความเร็ว prefetch เล็กน้อย
    staleTimes: {
      dynamic: 0,
    },
  },
}

module.exports = nextConfig
