// scripts/seed-shops.js — สร้างร้านค้าหลายร้าน พร้อมสินค้าตัวอย่าง สำหรับโชว์เดโม
// รัน: node scripts/seed-shops.js
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')
const { img, PRODUCTS_BY_CATEGORY } = require('./seed-data')

const envPath = path.join(__dirname, '..', '.env.local')
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (match && !process.env[match[1]]) process.env[match[1]] = match[2] || ''
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — set them in .env.local')
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const SHOPS = [
  {
    slug: 'home-decor',
    email: 'homedecor@ntp-shop.local',
    name: 'บ้านสวยดี Home & Decor',
    description: 'ของแต่งบ้านสไตล์มินิมอล อบอุ่น ยกระดับทุกมุมห้องให้มีชีวิตชีวา',
    category: 'ของตกแต่งบ้าน',
    banner_url: img('home', 3, { w: 800, h: 400 }),
  },
  {
    slug: 'kitchen',
    email: 'kitchen@ntp-shop.local',
    name: 'ครัวคุณนายบ้าน',
    description: 'เครื่องครัวและของใช้ในบ้าน คัดสรรคุณภาพ ใช้ได้ทุกวัน ทนทาน',
    category: 'ครัวเรือน',
    banner_url: img('household', 2, { w: 800, h: 400 }),
  },
  {
    slug: 'fashion',
    email: 'fashion@ntp-shop.local',
    name: 'MINIMAL Wear',
    description: 'เสื้อผ้าและเครื่องประดับสไตล์มินิมอล เรียบง่ายแต่มีเอกลักษณ์',
    category: 'แฟชัน',
    banner_url: img('fashion', 1, { w: 800, h: 400 }),
  },
  {
    slug: 'skincare',
    email: 'skincare@ntp-shop.local',
    name: 'GlowLab Skincare',
    description: 'สกินแคร์คุณภาพสูง ดูแลผิวทุกสภาพ จากส่วนผสมที่อ่อนโยนและได้ผลจริง',
    category: 'สกินแคร์',
    banner_url: img('skincare', 0, { w: 800, h: 400 }),
  },
  {
    slug: 'stationery',
    email: 'stationery@ntp-shop.local',
    name: 'เครื่องเขียนดีดี',
    description: 'อุปกรณ์เครื่องเขียนและงานฝีมือครบครัน สำหรับทำงาน เรียน และไดอารี่',
    category: 'เครื่องเขียน',
    banner_url: img('stationery', 3, { w: 800, h: 400 }),
  },
]

const SEED_PASSWORD = 'NtpShop@2024!'

async function getOrCreateOwner(shop) {
  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email: shop.email,
    password: SEED_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: shop.name },
  })

  if (!createErr) return created.user.id

  if (!createErr.message.includes('already been registered')) {
    throw new Error(`สร้าง user ให้ร้าน "${shop.name}" ไม่ได้: ` + createErr.message)
  }

  const { data: list } = await supabase.auth.admin.listUsers()
  const existing = list.users.find((u) => u.email === shop.email)
  if (!existing) throw new Error(`หา user ของร้าน "${shop.name}" ไม่เจอ`)
  return existing.id
}

async function getOrCreateShopRecord(shop, ownerId) {
  await supabase.from('profiles').upsert(
    { id: ownerId, email: shop.email, full_name: shop.name, role: 'shop_owner' },
    { onConflict: 'id' }
  )

  const { data: existing } = await supabase
    .from('shops')
    .select('id, name')
    .eq('owner_id', ownerId)
    .maybeSingle()

  if (existing) {
    console.log(`✅ ใช้ร้านที่มีอยู่: "${existing.name}" (${existing.id})`)
    return existing.id
  }

  const { data: created, error } = await supabase
    .from('shops')
    .insert({
      owner_id: ownerId,
      name: shop.name,
      description: shop.description,
      banner_url: shop.banner_url,
      is_active: true,
    })
    .select()
    .single()

  if (error) throw new Error(`สร้างร้าน "${shop.name}" ไม่ได้: ` + error.message)
  console.log(`✅ สร้างร้านใหม่: "${created.name}" (${created.id})`)
  return created.id
}

async function seedProductsForShop(shopId, shop) {
  const products = PRODUCTS_BY_CATEGORY[shop.category]
  if (!products) throw new Error(`ไม่พบสินค้าตัวอย่างของหมวด "${shop.category}"`)

  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('shop_id', shopId)

  if (count && count > 0) {
    console.log(`   ⏭️  ร้าน "${shop.name}" มีสินค้าอยู่แล้ว ${count} รายการ ข้ามการ seed`)
    return 0
  }

  const rows = products.map((p) => ({ ...p, shop_id: shopId, category: shop.category, is_active: true }))
  const { data, error } = await supabase.from('products').insert(rows).select('id')

  if (error) {
    console.error(`   ❌ เพิ่มสินค้าร้าน "${shop.name}" ไม่ได้:`, error.message)
    return 0
  }

  console.log(`   ✅ เพิ่มสินค้า ${data.length} รายการให้ร้าน "${shop.name}"`)
  return data.length
}

async function main() {
  console.log(`🌱 เริ่ม seed ${SHOPS.length} ร้านค้า...\n`)

  let totalProducts = 0

  for (const shop of SHOPS) {
    const ownerId = await getOrCreateOwner(shop)
    const shopId = await getOrCreateShopRecord(shop, ownerId)
    totalProducts += await seedProductsForShop(shopId, shop)
  }

  console.log(`\n🎉 เสร็จแล้ว! ${SHOPS.length} ร้านค้า, เพิ่มสินค้ารวม ${totalProducts} รายการ`)
  console.log(`   รหัสผ่านร้านค้าตัวอย่างทั้งหมด: ${SEED_PASSWORD}`)
}

main().catch((e) => {
  console.error('❌ Error:', e.message)
  process.exit(1)
})
