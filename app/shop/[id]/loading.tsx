import Navbar from '@/components/shop/Navbar'

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="pt-16 max-w-7xl mx-auto px-6 py-12" aria-busy="true" aria-label="กำลังโหลดสินค้า">
        <div className="h-4 w-64 bg-[#EDE8E0] animate-pulse mb-8" />
        <div className="grid md:grid-cols-2 gap-12">
          <div className="h-[480px] bg-[#EDE8E0] animate-pulse" />
          <div className="flex flex-col justify-center space-y-4">
            <div className="h-4 w-24 bg-[#EDE8E0] animate-pulse" />
            <div className="h-10 w-3/4 bg-[#EDE8E0] animate-pulse" />
            <div className="h-8 w-32 bg-[#EDE8E0] animate-pulse" />
            <div className="h-20 w-full bg-[#EDE8E0] animate-pulse" />
            <div className="h-12 w-full bg-[#EDE8E0] animate-pulse mt-4" />
          </div>
        </div>
      </main>
    </>
  )
}
