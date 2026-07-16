// scripts/seed.js — เพิ่มสินค้าตัวอย่างลง Supabase
// รัน: node scripts/seed.js
const fs = require('fs')
const path = require('path')
const { createClient } = require('@supabase/supabase-js')

// โหลดค่าจาก .env.local (ไม่ได้ใช้ dotenv เพื่อลด dependency)
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

const { PRODUCTS_BY_CATEGORY } = require('./seed-data')

async function getOrCreateShop() {
  // ดึง shop ที่มีอยู่ก่อน
  const { data: shops } = await supabase.from('shops').select('id, name').limit(1)
  if (shops && shops.length > 0) {
    console.log(`✅ ใช้ shop ที่มีอยู่: "${shops[0].name}" (${shops[0].id})`)
    return shops[0].id
  }

  // ถ้าไม่มี shop ให้สร้าง seed user + shop ใหม่
  console.log('ไม่พบ shop — กำลังสร้าง seed user และ shop...')

  const SEED_EMAIL = 'admin@mono-shop.local'
  const SEED_PASSWORD = 'MonoShop@2024!'

  let userId
  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email: SEED_EMAIL,
    password: SEED_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: 'NTP Admin' },
  })

  if (createErr) {
    if (createErr.message.includes('already been registered')) {
      const { data: list } = await supabase.auth.admin.listUsers()
      userId = list.users.find((u) => u.email === SEED_EMAIL)?.id
    } else {
      throw new Error('สร้าง user ไม่ได้: ' + createErr.message)
    }
  } else {
    userId = created.user.id
  }

  // upsert profile เผื่อกรณี profiles table ถูก drop แล้วสร้างใหม่
  await supabase.from('profiles').upsert(
    { id: userId, email: SEED_EMAIL, full_name: 'NTP Admin', role: 'shop_owner' },
    { onConflict: 'id' }
  )

  const { data: shop, error: shopErr } = await supabase
    .from('shops')
    .insert({
      owner_id: userId,
      name: 'NTP Store',
      description: 'ร้านค้าออนไลน์คัดสรรสินค้าคุณภาพ สไตล์มินิมอล',
      is_active: true,
    })
    .select()
    .single()

  if (shopErr) throw new Error('สร้าง shop ไม่ได้: ' + shopErr.message)
  console.log(`✅ สร้าง shop ใหม่: "${shop.name}" (${shop.id})`)
  console.log(`   Seed admin: ${SEED_EMAIL} / ${SEED_PASSWORD}`)
  return shop.id
}

async function main() {
  console.log('🌱 เริ่ม seed สินค้า...\n')

  const shopId = await getOrCreateShop()

  let totalInserted = 0
  let totalSkipped = 0

  for (const [category, products] of Object.entries(PRODUCTS_BY_CATEGORY)) {
    // ลบสินค้าเดิมในหมวดนี้ออกก่อน (ถ้าต้องการ re-seed)
    // await supabase.from('products').delete().eq('shop_id', shopId).eq('category', category)

    const rows = products.map((p) => ({ ...p, shop_id: shopId, category, is_active: true }))

    const { data, error } = await supabase.from('products').insert(rows).select('id')

    if (error) {
      console.error(`❌ หมวด "${category}":`, error.message)
      totalSkipped += rows.length
    } else {
      console.log(`✅ หมวด "${category}": เพิ่ม ${data.length} รายการ`)
      totalInserted += data.length
    }
  }

  console.log(`\n🎉 เสร็จแล้ว! เพิ่มสินค้า ${totalInserted} รายการ (ข้าม ${totalSkipped} รายการ)`)
}

main().catch((e) => {
  console.error('❌ Error:', e.message)
  process.exit(1)
})
