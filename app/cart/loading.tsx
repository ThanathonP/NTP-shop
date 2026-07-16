import Navbar from '@/components/shop/Navbar'

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="pt-16 max-w-5xl mx-auto px-6 py-12" aria-busy="true" aria-label="กำลังโหลดตะกร้าสินค้า">
        <div className="h-9 w-40 bg-[#EDE8E0] animate-pulse mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white p-4 flex gap-4 items-center border border-[#E8E4DF]">
                <div className="w-20 h-20 bg-[#EDE8E0] animate-pulse flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-[#EDE8E0] animate-pulse" />
                  <div className="h-4 w-2/3 bg-[#EDE8E0] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-64 bg-[#EDE8E0] animate-pulse" />
        </div>
      </main>
    </>
  )
}
