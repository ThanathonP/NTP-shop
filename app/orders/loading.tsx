import Navbar from '@/components/shop/Navbar'

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="pt-16 max-w-4xl mx-auto px-6 py-12" aria-busy="true" aria-label="กำลังโหลดคำสั่งซื้อ">
        <div className="h-9 w-48 bg-[#EDE8E0] animate-pulse mb-8" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#E8E4DF] overflow-hidden">
              <div className="h-12 bg-[#F7F5F2] border-b border-[#E8E4DF]" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-full bg-[#EDE8E0] animate-pulse" />
                <div className="h-4 w-2/3 bg-[#EDE8E0] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
