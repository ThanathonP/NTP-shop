// scripts/seed.js — เพิ่มสินค้าตัวอย่างลง Supabase
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://gzreffssadjpevbqhien.supabase.co'
const SERVICE_ROLE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6cmVmZnNzYWRqcGV2YnFoaWVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTM5OTEyMSwiZXhwIjoyMDg2OTc1MTIxfQ.2EXTByo4wIzTO0tZU5c-loUTAtsvpfuMWqhm-xkbtRo'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// รูปจาก Unsplash แบ่งตามหมวด
const imgs = {
  home: [
    'photo-1586023492125-27b2c045efd7',
    'photo-1555041469-a586c61ea9bc',
    'photo-1507473885765-e6ed057f782c',
    'photo-1616486338812-3dadae4b4ace',
    'photo-1578662996442-48f60103fc96',
    'photo-1513519245088-0e12902e5a38',
    'photo-1545205597-3d9d02c29597',
    'photo-1594938298603-a736ac4e14a6',
    'photo-1600121848594-d8644e57abab',
    'photo-1484101403633-562f891dc89a',
  ],
  household: [
    'photo-1556909114-f6e7ad7d3136',
    'photo-1590794056226-79ef3a8147e1',
    'photo-1585771724684-38269d6639fd',
    'photo-1526170375885-4d8ecf77b99f',
    'photo-1584568694244-14fbdf83bd30',
    'photo-1583842761844-dd35c24afc71',
    'photo-1567538096630-e0c55bd6374c',
    'photo-1610824352934-c10d87b700cc',
    'photo-1593618998160-e34014e67546',
    'photo-1558618666-fcd25c85cd64',
  ],
  fashion: [
    'photo-1441986300917-64674bd600d8',
    'photo-1485511216827-7e24d8ec1b7d',
    'photo-1523381210434-271e8be1f52b',
    'photo-1542291026-7eec264c27ff',
    'photo-1553062407-98eeb64c6a62',
    'photo-1600185365483-26d7a4cc7519',
    'photo-1584917865442-de89df76afd3',
    'photo-1572635196237-14b3f281503f',
    'photo-1549298916-b41d501d3772',
    'photo-1548036328-c9fa89d128fa',
  ],
  skincare: [
    'photo-1556228578-0d85b1a4d571',
    'photo-1611080626919-7cf5a9dbab12',
    'photo-1570194065650-d99fb4bedf0a',
    'photo-1608248543803-ba4f8c70ae0b',
    'photo-1596462502278-27bfdc403348',
    'photo-1583241475880-083f84372725',
    'photo-1619451683986-a49d53b72fac',
    'photo-1614159566656-f65d4c9e5d19',
    'photo-1615486364404-40f2c3c3d837',
    'photo-1631390583958-b3a03e6d93a1',
  ],
  stationery: [
    'photo-1585776245991-cf89dd7fc73a',
    'photo-1568441537544-89ef32e9a30d',
    'photo-1456735190827-d1262f71b8a3',
    'photo-1497633762265-9d179a990aa6',
    'photo-1513542789411-b6a5d4f31634',
    'photo-1503676260728-1c00da094a0b',
    'photo-1434030216411-0b793f4b4173',
    'photo-1471107340929-a87cd0f5b5f3',
    'photo-1484069560501-87d72b0e3d05',
    'photo-1544816565-aa8c1166648f',
  ],
}

const img = (key, i) => {
  const list = imgs[key]
  return `https://images.unsplash.com/${list[i % list.length]}?w=400&h=400&fit=crop&q=80`
}

const PRODUCTS_BY_CATEGORY = {
  ของตกแต่งบ้าน: [
    { name: 'แจกันเซรามิคลายดอกไม้', description: 'แจกันเซรามิคทรงสูง ลายดอกไม้ญี่ปุ่น เหมาะสำหรับตกแต่งโต๊ะและหิ้ง', price: 350, stock_qty: 45, image_url: img('home', 0) },
    { name: 'กรอบรูปไม้สักทอง', description: 'กรอบรูปไม้สักแท้ ขนาด 4x6 นิ้ว เคลือบสีทองอร่อย ให้บรรยากาศวินเทจ', price: 280, stock_qty: 60, image_url: img('home', 1) },
    { name: 'เทียนหอมอโรมา', description: 'เทียนหอมจากขี้ผึ้งธรรมชาติ กลิ่น Vanilla & Sandalwood ติดนาน 40 ชั่วโมง', price: 190, stock_qty: 80, image_url: img('home', 2) },
    { name: 'โคมไฟตั้งโต๊ะผ้าลินิน', description: 'โคมไฟตั้งโต๊ะโช้ดผ้าลินินธรรมชาติ ให้แสงอบอุ่น ฐานไม้สัก', price: 890, stock_qty: 25, image_url: img('home', 3) },
    { name: 'ผ้าม่านโปร่งลินิน', description: 'ผ้าม่านลินินโปร่งแสง ขนาด 140x250 ซม. กรองแสงได้ดี ลดความร้อน', price: 650, stock_qty: 30, image_url: img('home', 4) },
    { name: 'ภาพตกแต่งผนังมินิมอล', description: 'ภาพพิมพ์ศิลปะมินิมอลบนผ้าใบ ขนาด 40x50 ซม. ไม่มีกรอบ', price: 420, stock_qty: 40, image_url: img('home', 5) },
    { name: 'พรมทอมือลายเรขาคณิต', description: 'พรมทอมือจากขนสัตว์ธรรมชาติ ลายเรขาคณิต ขนาด 120x180 ซม.', price: 1200, stock_qty: 15, image_url: img('home', 6) },
    { name: 'หมอนอิงผ้ากำมะหยี่', description: 'หมอนอิงผ้ากำมะหยี่นุ่มสัมผัสดี ขนาด 45x45 ซม. มีซิปถอดซักได้', price: 390, stock_qty: 55, image_url: img('home', 7) },
    { name: 'กระถางเซรามิคสีพาสเทล', description: 'กระถางเซรามิคเคลือบผิวด้าน สีพาสเทลอ่อน เหมาะกับต้นไม้ในบ้าน', price: 220, stock_qty: 70, image_url: img('home', 8) },
    { name: 'นาฬิกาแขวนผนังไม้', description: 'นาฬิกาแขวนผนังทรงกลม ทำจากไม้วอลนัทแท้ เดินเงียบไร้เสียงรบกวน', price: 580, stock_qty: 35, image_url: img('home', 9) },
    { name: 'ชั้นวางของลอยผนัง', description: 'ชั้นวางของไม้สนลอยผนัง ขนาด 60x15 ซม. รับน้ำหนักได้ 5 กก.', price: 750, stock_qty: 28, image_url: img('home', 0) },
    { name: 'โมบายแขวนมาคราเม่', description: 'โมบายแขวนทำจากเชือกมาคราเม่ฝ้ายธรรมชาติ ตกแต่งมุมห้องสไตล์โบฮีเมียน', price: 340, stock_qty: 50, image_url: img('home', 1) },
    { name: 'ที่วางเทียนทองเหลือง', description: 'ที่วางเทียนแท่งทองเหลืองแท้ ทรงสูง ขัดมันสวยงาม เซ็ต 3 ชิ้น', price: 460, stock_qty: 42, image_url: img('home', 2) },
    { name: 'กระจกวงรีกรอบทอง', description: 'กระจกทรงวงรีกรอบโลหะสีทองแอนทีก ขนาด 40x60 ซม. แขวนผนังหรือตั้งพิง', price: 980, stock_qty: 20, image_url: img('home', 3) },
    { name: 'ผ้าคลุมโซฟาถัก', description: 'ผ้าคลุมโซฟาถักจากเส้นฝ้ายหนา ขนาด 130x150 ซม. กันหนาวได้ดี', price: 850, stock_qty: 22, image_url: img('home', 4) },
    { name: 'ตะกร้าสานเส้นหวาย', description: 'ตะกร้าสานจากเส้นหวายธรรมชาติ มีฝาปิด ขนาดกลาง ใส่ของได้มาก', price: 310, stock_qty: 48, image_url: img('home', 5) },
    { name: 'ของตกแต่งเรซิน', description: 'ของตกแต่งโต๊ะทำจากเรซินใส มีดอกไม้แห้งฝังอยู่ภายใน', price: 180, stock_qty: 90, image_url: img('home', 6) },
    { name: 'ไฟ LED ตกแต่งห้อง', description: 'ไฟ LED ตกแต่งห้อง ยาว 5 เมตร มีรีโมท ปรับสีและความสว่างได้', price: 290, stock_qty: 65, image_url: img('home', 7) },
    { name: 'กล่องเก็บของไม้ไผ่', description: 'กล่องเก็บของทำจากไม้ไผ่ธรรมชาติ มีฝาสไลด์ ขนาด 30x20x10 ซม.', price: 420, stock_qty: 38, image_url: img('home', 8) },
    { name: 'ต้นไม้ปลอมประดับ', description: 'ต้นไม้ประดิษฐ์คุณภาพสูง เหมือนจริง ไม่ต้องรดน้ำ ความสูง 60 ซม.', price: 380, stock_qty: 52, image_url: img('home', 9) },
    { name: 'แผ่นรองแก้วหิน', description: 'แผ่นรองแก้วหินอ่อนธรรมชาติ เซ็ต 4 ชิ้น กันรอยโต๊ะ ดูดซับน้ำได้ดี', price: 250, stock_qty: 75, image_url: img('home', 0) },
    { name: 'กรอบภาพคอลลาจ', description: 'กรอบภาพคอลลาจไม้สัก วางได้ 9 รูป ขนาด 4x6 นิ้ว แขวนผนัง', price: 490, stock_qty: 30, image_url: img('home', 1) },
  ],

  ครัวเรือน: [
    { name: 'ชุดหม้อสแตนเลส 3 ใบ', description: 'ชุดหม้อสแตนเลส 304 เกรด A ฝาแก้วทนความร้อน ใช้ได้กับเตาแม่เหล็กไฟฟ้า', price: 1290, stock_qty: 20, image_url: img('household', 0) },
    { name: 'กระทะเคลือบหิน', description: 'กระทะเคลือบแกรนิต 28 ซม. ไม่ติด ไม่มีสาร PFOA ด้ามจับไม่ร้อน', price: 890, stock_qty: 35, image_url: img('household', 1) },
    { name: 'ชุดช้อนส้อมมีดสแตนเลส', description: 'ชุดช้อนส้อมมีดสแตนเลส 18/8 จำนวน 24 ชิ้น บรรจุในกล่องไม้สวยงาม', price: 450, stock_qty: 45, image_url: img('household', 2) },
    { name: 'แก้วน้ำบอโรซิลิเกต', description: 'แก้วน้ำแบบ High Borosilicate ทนความร้อนเย็น จุ 350 มล. เซ็ต 4 ใบ', price: 180, stock_qty: 80, image_url: img('household', 3) },
    { name: 'ชุดจานชามเซรามิค 6 ใบ', description: 'ชุดจานชามเซรามิคเนื้อเนียน สีขาวครีม เข้าเตาไมโครเวฟและเครื่องล้างจาน', price: 650, stock_qty: 30, image_url: img('household', 4) },
    { name: 'ที่วางจานไม้ไผ่', description: 'ที่วางจานแนวตั้งทำจากไม้ไผ่ วางได้ 6 ใบ ประหยัดพื้นที่ตู้ครัว', price: 280, stock_qty: 55, image_url: img('household', 5) },
    { name: 'กระบอกน้ำสแตนเลส', description: 'กระบอกน้ำเก็บความเย็น 24 ชั่วโมง เก็บความร้อน 12 ชั่วโมง จุ 500 มล.', price: 490, stock_qty: 60, image_url: img('household', 6) },
    { name: 'กล่องข้าวสามชั้น', description: 'กล่องข้าวสามชั้น BPA-Free มีช้อนส้อมในตัว ล็อคกันรั่ว เข้าไมโครเวฟได้', price: 320, stock_qty: 50, image_url: img('household', 7) },
    { name: 'ผ้ากันเปื้อนลายสก๊อต', description: 'ผ้ากันเปื้อนผ้าฝ้ายหนา ลายสก๊อต มีสายคล้องคอและเอว ปรับขนาดได้', price: 190, stock_qty: 70, image_url: img('household', 8) },
    { name: 'กระดานหั่นไม้ไผ่', description: 'กระดานหั่นทำจากไม้ไผ่ป้องกันเชื้อโรคตามธรรมชาติ ขนาด 38x25 ซม.', price: 350, stock_qty: 48, image_url: img('household', 9) },
    { name: 'ที่กรองกาแฟเซรามิค', description: 'Dripper เซรามิคสำหรับดริปกาแฟ ทรง V60 เคลือบผิวด้าน ทนความร้อน', price: 580, stock_qty: 25, image_url: img('household', 0) },
    { name: 'ชุดถ้วยชากาโน', description: 'ชุดถ้วยชากาโนเซรามิค มีจานรอง จำนวน 4 ชุด บรรจุในกล่องของขวัญ', price: 720, stock_qty: 22, image_url: img('household', 1) },
    { name: 'กล่องเก็บอาหาร 5 ชิ้น', description: 'ชุดกล่องเก็บอาหารแบบสุญญากาศ 5 ขนาด ไล่อากาศออกได้ ยืดอายุอาหาร', price: 290, stock_qty: 65, image_url: img('household', 2) },
    { name: 'ที่เปิดขวดไม้วอลนัท', description: 'ที่เปิดขวดทำจากไม้วอลนัทแท้ ดีไซน์สวยงาม ของขวัญชั้นดี', price: 120, stock_qty: 100, image_url: img('household', 3) },
    { name: 'ราวแขวนผ้าสแตนเลส', description: 'ราวแขวนผ้าอาบน้ำสแตนเลส 304 ยาว 60 ซม. ติดตั้งง่าย ไม่เจาะผนัง', price: 380, stock_qty: 40, image_url: img('household', 4) },
    { name: 'ถังขยะสแตนเลสฝาสวิง', description: 'ถังขยะสแตนเลสฝาสวิง จุ 8 ลิตร ทรงทรงสูง สวยงามเหมาะสำหรับครัวสมัยใหม่', price: 550, stock_qty: 30, image_url: img('household', 5) },
    { name: 'ที่แขวนกระดาษทิชชูไม้', description: 'ที่แขวนกระดาษทิชชูทำจากไม้สน ติดผนัง สวยงาม ทนทาน', price: 260, stock_qty: 55, image_url: img('household', 6) },
    { name: 'ชุดเครื่องปรุงรสแบบแท่ง', description: 'ชุดขวดเครื่องปรุงสแตนเลส 4 ขวด พร้อมถาด ใส่เกลือ พริกไทย น้ำตาล', price: 420, stock_qty: 38, image_url: img('household', 7) },
    { name: 'ตะกร้าผักผลไม้สาน', description: 'ตะกร้าใส่ผักผลไม้สานจากหวาย 3 ชั้น ระบายอากาศได้ดี ประหยัดพื้นที่', price: 310, stock_qty: 42, image_url: img('household', 8) },
    { name: 'แก้วกาแฟเซรามิคมีฝา', description: 'แก้วกาแฟเซรามิคจุ 400 มล. มีฝาซิลิโคนกันฝุ่น ล้างเครื่องล้างจานได้', price: 220, stock_qty: 75, image_url: img('household', 9) },
    { name: 'ตะแกรงวางของในซิงก์', description: 'ตะแกรงวางของในอ่างล้างจานสแตนเลส ปรับขนาดได้ 25-35 ซม.', price: 340, stock_qty: 45, image_url: img('household', 0) },
    { name: 'ที่คีบอาหารสแตนเลส', description: 'ที่คีบอาหารสแตนเลส 304 ปลายซิลิโคน กันลื่น ยาว 25 ซม. 2 ชิ้น', price: 160, stock_qty: 90, image_url: img('household', 1) },
  ],

  แฟชัน: [
    { name: 'เสื้อยืดออร์แกนิคคอตตอน', description: 'เสื้อยืดผ้า Organic Cotton 100% น้ำหนักเบา ระบายอากาศได้ดี มีหลายสี', price: 490, stock_qty: 100, image_url: img('fashion', 0) },
    { name: 'กระเป๋าหนังแฮนด์เมด', description: 'กระเป๋าถือหนังวัวแท้ ทำมือ ทรงสี่เหลี่ยม มีช่องซิป ขนาด 30x20 ซม.', price: 1890, stock_qty: 15, image_url: img('fashion', 1) },
    { name: 'รองเท้าผ้าใบ Canvas', description: 'รองเท้าผ้าใบ Canvas คลาสสิก พื้นยาง สวมใส่สบาย มีหลายสีให้เลือก', price: 990, stock_qty: 50, image_url: img('fashion', 2) },
    { name: 'หมวกสาน Panama', description: 'หมวกสานสไตล์ Panama ผ้า 100% ปีกกว้าง กันแดดได้ดี ทรงสวยงาม', price: 580, stock_qty: 40, image_url: img('fashion', 3) },
    { name: 'ผ้าพันคอผ้าไหมพิมพ์ลาย', description: 'ผ้าพันคอผ้าไหมธรรมชาติ พิมพ์ลายดอกไม้ ขนาด 70x180 ซม. มีหลายลาย', price: 750, stock_qty: 35, image_url: img('fashion', 4) },
    { name: 'สร้อยคอสเตนเลสสีทอง', description: 'สร้อยคอสเตนเลส 316L เคลือบทองจริง ยาว 45 ซม. ไม่ลอก ไม่แพ้', price: 390, stock_qty: 70, image_url: img('fashion', 5) },
    { name: 'ต่างหูเงินแท้ Sterling', description: 'ต่างหูเงินแท้ 925 ลายใบไม้ น้ำหนักเบา ไม่แพ้ผิว มีก้านเกี่ยวและแป้น', price: 480, stock_qty: 60, image_url: img('fashion', 6) },
    { name: 'แว่นตากันแดด UV400', description: 'แว่นตากันแดดกรอบโลหะบาง เลนส์ Polarized UV400 ป้องกันแสงสะท้อน', price: 890, stock_qty: 45, image_url: img('fashion', 7) },
    { name: 'เข็มขัดหนังแท้สายบาง', description: 'เข็มขัดหนังวัวแท้สายบาง 2 ซม. หัวเข็มขัดโลหะสีเงิน ปรับขนาดได้', price: 590, stock_qty: 40, image_url: img('fashion', 8) },
    { name: 'นาฬิกาข้อมือสไตล์มินิมอล', description: 'นาฬิกาข้อมือหน้าปัดสะอาด สายหนังแท้ ระบบ Japanese Quartz กันน้ำ 3ATM', price: 1990, stock_qty: 20, image_url: img('fashion', 9) },
    { name: 'กระเป๋าสตางค์หนังนิ่ม', description: 'กระเป๋าสตางค์หนังนุ่มพับ 2 ชั้น มีช่องบัตร 8 ช่อง ช่องแบงค์ 2 ช่อง', price: 690, stock_qty: 55, image_url: img('fashion', 0) },
    { name: 'เสื้อเชิ้ตลินินโอเวอร์ไซส์', description: 'เสื้อเชิ้ตลินิน 100% ทรง Oversized ระบายอากาศ เย็นสบาย ใส่ได้ทุกโอกาส', price: 890, stock_qty: 45, image_url: img('fashion', 1) },
    { name: 'กางเกงขายาวผ้าฝ้าย', description: 'กางเกงขายาวผ้าฝ้ายฟอกนุ่ม ทรง Wide Leg เอวยางยืด ใส่สบาย', price: 790, stock_qty: 50, image_url: img('fashion', 2) },
    { name: 'กระโปรงลินินทรง A-Line', description: 'กระโปรงลินิน ทรง A ความยาวกลางเข่า มีซิปหลัง สวมใส่ง่าย ดูสะอาด', price: 680, stock_qty: 42, image_url: img('fashion', 3) },
    { name: 'เดรสซาตินสลิป', description: 'เดรสซาตินเนื้อนุ่ม สไตล์ Slip Dress สายเดี่ยวปรับได้ ยาวถึงเข่า', price: 1290, stock_qty: 30, image_url: img('fashion', 4) },
    { name: 'แจ็คเก็ตเดนิมฟอกสี', description: 'แจ็คเก็ตเดนิมโอเวอร์ไซส์ฟอกสีธรรมชาติ ทรงคลาสสิก ใส่ได้ทุกฤดู', price: 1490, stock_qty: 25, image_url: img('fashion', 5) },
    { name: 'ถุงเท้าผ้าฝ้ายออร์แกนิค', description: 'ถุงเท้าผ้าฝ้ายออร์แกนิค 5 คู่ ระบายอากาศ ดูดซับเหงื่อ ไม่เกิดกลิ่น', price: 190, stock_qty: 120, image_url: img('fashion', 6) },
    { name: 'ผ้าคลุมไหล่โมดอล', description: 'ผ้าคลุมไหล่เนื้อโมดอล นุ่มเบาพิเศษ ขนาด 90x180 ซม. มีหลายสี', price: 850, stock_qty: 38, image_url: img('fashion', 7) },
    { name: 'กำไลหินธรรมชาติ', description: 'กำไลหินมงคลธรรมชาติ หินโรสควอตซ์ ขนาดลูกหิน 8 มม. ร้อยยืดได้', price: 320, stock_qty: 80, image_url: img('fashion', 8) },
    { name: 'กระเป๋าเป้ผ้า Canvas', description: 'กระเป๋าเป้ Canvas ขนาด 20L ช่อง Laptop 15 นิ้ว สายปรับได้ มีหลายสี', price: 1190, stock_qty: 40, image_url: img('fashion', 9) },
    { name: 'สร้อยข้อมือลูกปัด', description: 'สร้อยข้อมือลูกปัดเพชรพญานาค ทำมือ เสริมดวงตามความเชื่อ สีสันสวยงาม', price: 250, stock_qty: 90, image_url: img('fashion', 0) },
    { name: 'โบว์ติคผ้าเซตติน', description: 'โบว์ติคผ้าซาตินขนาดใหญ่ สำหรับประดับผม ผ้าเนื้อดี มีหลายสีพาสเทล', price: 150, stock_qty: 110, image_url: img('fashion', 1) },
  ],

  สกินแคร์: [
    { name: 'เซรั่มวิตามินซีเข้มข้น 20%', description: 'เซรั่มวิตามินซี L-Ascorbic Acid 20% ผสม Ferulic Acid ฟื้นฟูผิวหมองคล้ำ', price: 890, stock_qty: 50, image_url: img('skincare', 0) },
    { name: 'ครีมบำรุงหน้า Ceramide', description: 'ครีมบำรุงหน้า Ceramide Complex เสริมเกราะป้องกันผิว เหมาะสำหรับผิวแห้ง', price: 750, stock_qty: 45, image_url: img('skincare', 1) },
    { name: 'โทนเนอร์กรดไฮยาลูโรนิก', description: 'โทนเนอร์ Hyaluronic Acid ดูแลความชุ่มชื้นผิว 72 ชั่วโมง ไม่มีแอลกอฮอล์', price: 580, stock_qty: 60, image_url: img('skincare', 2) },
    { name: 'ซันสกรีน SPF50+ PA++++', description: 'ซันสกรีนเนื้อบางเบา SPF50+ PA++++ กันน้ำ ไม่อุดตัน เหมาะทุกสภาพผิว', price: 490, stock_qty: 80, image_url: img('skincare', 3) },
    { name: 'มาสก์หน้าแผ่นวิตามิน', description: 'มาสก์หน้าแผ่น Vitamin C + Niacinamide บำรุงผิวใน 20 นาที กล่อง 10 แผ่น', price: 120, stock_qty: 150, image_url: img('skincare', 4) },
    { name: 'คลีนเซอร์อ่อนโยน Centella', description: 'คลีนเซอร์ Centella Asiatica สูตรอ่อนโยน ล้างสะอาด ไม่ทำให้ผิวแห้งตึง', price: 380, stock_qty: 70, image_url: img('skincare', 5) },
    { name: 'น้ำมิเซลล่าออร์แกนิค', description: 'น้ำมิเซลล่าออร์แกนิค ล้างเครื่องสำอางได้หมดจด ไม่ต้องล้างน้ำตาม', price: 290, stock_qty: 75, image_url: img('skincare', 6) },
    { name: 'อายครีมลดรอยคล้ำ', description: 'อายครีม Caffeine + Peptide ลดรอยคล้ำใต้ตา ลดถุงใต้ตา บำรุงรอบดวงตา', price: 680, stock_qty: 40, image_url: img('skincare', 7) },
    { name: 'ลิปบาล์มน้ำผึ้งแมนูก้า', description: 'ลิปบาล์มน้ำผึ้งแมนูก้า + Shea Butter บำรุงริมฝีปากให้นุ่มชุ่มชื้น', price: 180, stock_qty: 120, image_url: img('skincare', 8) },
    { name: 'สครับน้ำตาลอ้อยลาเวนเดอร์', description: 'สครับน้ำตาลอ้อยผสมลาเวนเดอร์ออร์แกนิค ขัดเซลล์ผิวตาย ผิวนุ่มเนียน', price: 320, stock_qty: 65, image_url: img('skincare', 9) },
    { name: 'ไนท์ครีมเรตินอล 0.5%', description: 'ไนท์ครีมเรตินอล 0.5% ผสม Bakuchiol ฟื้นฟูผิวขณะนอนหลับ ลดริ้วรอย', price: 990, stock_qty: 30, image_url: img('skincare', 0) },
    { name: 'อมพูลบำรุงผิว 10 ขวด', description: 'อมพูลบำรุงผิวเข้มข้น Niacinamide 10% ลดสิว ลดรูขุมขนกว้าง ผิวกระจ่างใส', price: 1290, stock_qty: 25, image_url: img('skincare', 1) },
    { name: 'เอสเซนส์กลูต้าไธโอน', description: 'เอสเซนส์กลูต้าไธโอนจากญี่ปุ่น ผิวขาวกระจ่างใส ลดจุดด่างดำ เห็นผลใน 4 สัปดาห์', price: 850, stock_qty: 35, image_url: img('skincare', 2) },
    { name: 'ครีมบำรุงมือโกจิเบอร์รี่', description: 'ครีมบำรุงมือ Goji Berry + Collagen ซึมเร็ว ไม่เหนียว มือนุ่มชุ่มชื้นตลอดวัน', price: 280, stock_qty: 85, image_url: img('skincare', 3) },
    { name: 'เจลอาบน้ำเกลือแร่ทะเล', description: 'เจลอาบน้ำเกลือแร่ทะเลสด ผสม Vitamin E บำรุงผิวขณะอาบน้ำ กลิ่นหอมสดชื่น', price: 390, stock_qty: 60, image_url: img('skincare', 4) },
    { name: 'ครีมแก้ผิวหมองคล้ำ Alpha Arbutin', description: 'ครีม Alpha Arbutin 2% + HA ลดความหมองคล้ำ เพิ่มความชุ่มชื้น เหมาะทุกสภาพผิว', price: 720, stock_qty: 40, image_url: img('skincare', 5) },
    { name: 'แป้งฝุ่นแร่ธาตุ SPF30', description: 'แป้งฝุ่นแร่ธาตุ Mineral Foundation SPF30 คุมมัน ปกปิดรูขุมขน เบาบางเป็นธรรมชาติ', price: 490, stock_qty: 45, image_url: img('skincare', 6) },
    { name: 'เซรั่มเปปไทด์ 10%', description: 'เซรั่ม Peptide Complex 10% ฟื้นฟูความยืดหยุ่นผิว ลดริ้วรอย บำรุงผิวลึก', price: 1090, stock_qty: 28, image_url: img('skincare', 7) },
    { name: 'มอยเจอร์ไรเซอร์ SPF30', description: 'ครีมบำรุงผสมกันแดด SPF30 ใช้แทน 2 สเต็ป เนื้อบางเบา สำหรับตอนเช้า', price: 650, stock_qty: 50, image_url: img('skincare', 8) },
    { name: 'แพ็คมาสก์ดินขาว Kaolin', description: 'มาสก์ดินขาว Kaolin Clay ลดความมัน ขับสิว ลดรูขุมขน ล้างออกง่าย ปริมาณ 100 กรัม', price: 450, stock_qty: 55, image_url: img('skincare', 9) },
    { name: 'น้ำตบ Toner Pad รีฟิล', description: 'แผ่น Toner Pad ชุบน้ำตบ Niacinamide + AHA ทำความสะอาดและบำรุงพร้อมกัน 60 แผ่น', price: 380, stock_qty: 65, image_url: img('skincare', 0) },
    { name: 'บาล์มทำความสะอาดเมคอัพ', description: 'Cleansing Balm สูตร Oil-free ละลายเครื่องสำอาง Waterproof ได้หมดจด ไม่อุดตัน', price: 520, stock_qty: 48, image_url: img('skincare', 1) },
  ],

  เครื่องเขียน: [
    { name: 'ปากกา Gel 0.5mm 12 ด้าม', description: 'ปากกา Gel น้ำหมึกดำลื่นไหล ขนาด 0.5mm เซ็ต 12 ด้าม เขียนนาน ไม่เมื่อย', price: 85, stock_qty: 200, image_url: img('stationery', 0) },
    { name: 'ดินสอกด 0.5mm Premium', description: 'ดินสอกดเนื้อดี ด้ามยางจับสบาย มีที่เก็บไส้ในด้าม พร้อมยางลบเสริม', price: 120, stock_qty: 150, image_url: img('stationery', 1) },
    { name: 'สมุด Bullet Journal A5', description: 'สมุด Dotted Grid A5 กระดาษ 120gsm ไม่โปร่งแสง ปก Hardcover 160 หน้า', price: 380, stock_qty: 60, image_url: img('stationery', 2) },
    { name: 'แฟ้มผ้าซิป A4 ลายผ้า', description: 'แฟ้มซิปผ้ากันน้ำ ขนาด A4 มีช่องซิปด้านใน ใส่เอกสารและอุปกรณ์ได้มาก', price: 290, stock_qty: 75, image_url: img('stationery', 3) },
    { name: 'เทปวาชิลาย เซ็ต 5 ม้วน', description: 'เทปวาชิลายน่ารัก เซ็ต 5 ม้วน ลายดอกไม้ กว้าง 15 มม. สีพาสเทล', price: 180, stock_qty: 100, image_url: img('stationery', 4) },
    { name: 'กรรไกรสแตนเลสด้ามยาง', description: 'กรรไกรสแตนเลส 8 นิ้ว ด้ามจับยางนิ่ม ตัดคม ไม่เมื่อย เหมาะงานฝีมือ', price: 150, stock_qty: 80, image_url: img('stationery', 5) },
    { name: 'ไม้บรรทัดอะคริลิคใสพิมพ์กริด', description: 'ไม้บรรทัดอะคริลิคใส ยาว 30 ซม. พิมพ์กริดและมม. คุณภาพสูง ไม่ฉีกหัก', price: 75, stock_qty: 120, image_url: img('stationery', 6) },
    { name: 'ยางลบไร้สารพิษ Mono', description: 'ยางลบเนื้อนุ่ม ลบสะอาดไม่ฝาก ไม่เป็นผง ไม่มีสารพิษ เซ็ต 3 ชิ้น', price: 45, stock_qty: 300, image_url: img('stationery', 7) },
    { name: 'ที่เหลาดินสอไฟฟ้า USB', description: 'ที่เหลาดินสอไฟฟ้าชาร์จ USB เหลาคมเป็นแท่งกลม ปลอดภัย ใช้ได้กับดินสอ 6-8 มม.', price: 590, stock_qty: 35, image_url: img('stationery', 8) },
    { name: 'สีไม้ 36 สี Professional', description: 'สีไม้ Faber-Castell Style 36 สี แกนสีแข็ง ระบายง่าย เม็ดสีคมชัด สำหรับมืออาชีพ', price: 890, stock_qty: 30, image_url: img('stationery', 9) },
    { name: 'สีน้ำ 24 สี พร้อมพาเลต', description: 'สีน้ำ 24 สี พร้อมพาเลตผสมสี และพู่กัน 2 ด้าม เหมาะสำหรับผู้เริ่มต้น', price: 520, stock_qty: 40, image_url: img('stationery', 0) },
    { name: 'ชุดพู่กัน 12 ด้าม', description: 'พู่กันสีน้ำ ขนแพะ 12 ขนาด ตั้งแต่ 000 ถึง 10 ปลายพู่กันคม ยืดหยุ่นดี', price: 380, stock_qty: 45, image_url: img('stationery', 1) },
    { name: 'สติกเกอร์ตกแต่งไดอารี่', description: 'สติกเกอร์ตกแต่งสมุด 10 แผ่น ลายน่ารัก ดอกไม้ สัตว์ ตัวอักษร สีสันสดใส', price: 95, stock_qty: 200, image_url: img('stationery', 2) },
    { name: 'โพสต์อิทชุด 5 ขนาด', description: 'โพสต์อิทกาวแน่น 5 ขนาด 4 สีต่อชุด จำนวน 350 แผ่น รวม ไม่ทิ้งคราบ', price: 160, stock_qty: 130, image_url: img('stationery', 3) },
    { name: 'ไดอารี่ 2026 Hardcover', description: 'ไดอารี่ปี 2026 ปก Hardcover กระดาษ 80gsm มีช่องจดรายวัน รายสัปดาห์ และรายเดือน', price: 320, stock_qty: 50, image_url: img('stationery', 4) },
    { name: 'สมุดวาดภาพ Sketchbook A4', description: 'Sketchbook A4 กระดาษ 160gsm ปก Hardcover 80 หน้า เหมาะสำหรับวาดภาพสีน้ำและดินสอ', price: 290, stock_qty: 55, image_url: img('stationery', 5) },
    { name: 'กาวลาเท็กซ์ไม่มีกลิ่น', description: 'กาวลาเท็กซ์ไม่มีกลิ่น แห้งใส ยึดได้แน่น ขนาด 125 มล. สำหรับงานฝีมือ', price: 120, stock_qty: 100, image_url: img('stationery', 6) },
    { name: 'เครื่องเย็บกระดาษ Mini', description: 'เครื่องเย็บกระดาษขนาดเล็ก แนบแน่น เย็บได้ 20 แผ่น มาพร้อมลวดเย็บ 1 กล่อง', price: 180, stock_qty: 70, image_url: img('stationery', 7) },
    { name: 'ซองจดหมายลายน่ารัก', description: 'ซองจดหมายลายน่ารัก พร้อมกระดาษเขียน เซ็ต 20 ชุด ลายดอกไม้และสัตว์', price: 65, stock_qty: 200, image_url: img('stationery', 8) },
    { name: 'กล่องดินสอลายผ้า', description: 'กล่องดินสอผ้าลายสวย ซิปแน่น ใส่อุปกรณ์ได้มาก ขนาด 20x8x4 ซม.', price: 180, stock_qty: 85, image_url: img('stationery', 9) },
    { name: 'ปากกาเน้นข้อความ Pastel 6 สี', description: 'ปากกา Highlighter สีพาสเทล เซ็ต 6 สี หัวตัดเฉียง เน้นคมชัด หมึกน้ำไม่เลอะ', price: 140, stock_qty: 160, image_url: img('stationery', 0) },
    { name: 'ปากกาหัวพู่กัน Brush Pen', description: 'ปากกาหัวพู่กัน สีดำ เนื้อหมึกเข้มสม่ำเสมอ เส้นบางหนาปรับได้ สำหรับ Hand lettering', price: 95, stock_qty: 180, image_url: img('stationery', 1) },
  ],
}

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
    user_metadata: { full_name: 'MONŌ Admin' },
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
    { id: userId, email: SEED_EMAIL, full_name: 'MONŌ Admin', role: 'shop_owner' },
    { onConflict: 'id' }
  )

  const { data: shop, error: shopErr } = await supabase
    .from('shops')
    .insert({
      owner_id: userId,
      name: 'MONŌ Store',
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
