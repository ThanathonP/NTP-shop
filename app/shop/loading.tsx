import Navbar from '@/components/shop/Navbar'

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="pt-16 max-w-7xl mx-auto px-6 py-12" aria-busy="true" aria-label="กำลังโหลดสินค้า">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="h-9 w-48 bg-[#EDE8E0] animate-pulse" />
          <div className="h-11 w-full md:w-64 bg-[#EDE8E0] animate-pulse" />
        </div>
        <div className="flex gap-2 flex-wrap mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 w-24 bg-[#EDE8E0] animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white overflow-hidden">
              <div className="h-60 bg-[#EDE8E0] animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-[#EDE8E0] animate-pulse" />
                <div className="h-4 w-1/2 bg-[#EDE8E0] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  )
}
