// สีชาร์ตทั้งหมดในหน้า dashboard — เลือกจาก validated categorical palette (8 สีเรียงตามลำดับที่ผ่านการ
// ตรวจสอบ CVD-safety/contrast แล้ว อย่าสลับลำดับหรือเลือกสีใหม่มาแทรกโดยไม่ตรวจสอบ) บวกโทนของเว็บเอง (INK/ACCENT)
export const INK = '#1A1A1A'
export const ACCENT = '#C8A882'
export const MUTED = '#898781'
export const GRIDLINE = '#E8E4DF'
export const SURFACE = '#FFFFFF'

// slot 1-8 ตามลำดับที่ผ่านการ validate (blue, orange, aqua, yellow, magenta, green, violet, red)
export const CATEGORICAL = ['#2a78d6', '#eb6834', '#1baf7a', '#eda100', '#e87ba4', '#008300', '#4a3aa7', '#e34948']

export const TREND_ORDERS_COLOR = CATEGORICAL[0] // blue
export const TREND_REVENUE_COLOR = CATEGORICAL[1] // orange

// สีสถานะคำสั่งซื้อ — ใช้ค่าเดียวกับที่ badge ทั่วเว็บใช้อยู่แล้ว (ORDER_STATUS_COLOR) เพื่อความสอดคล้อง
export const STATUS_HEX: Record<string, string> = {
  pending: '#eda100',
  confirmed: '#2a78d6',
  shipping: '#4a3aa7',
  delivered: '#1baf7a',
  cancelled: '#e34948',
}

export const echartsBaseTextStyle = {
  fontFamily: 'var(--font-sarabun), system-ui, sans-serif',
  color: INK,
}
