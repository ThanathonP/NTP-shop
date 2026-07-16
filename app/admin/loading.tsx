export default function Loading() {
  return (
    <div className="p-8" aria-busy="true" aria-label="กำลังโหลดข้อมูล">
      <div className="h-9 w-40 bg-[#EDE8E0] animate-pulse mb-2" />
      <div className="h-4 w-56 bg-[#EDE8E0] animate-pulse mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white border border-[#E8E4DF] p-6 space-y-3">
            <div className="h-5 w-20 bg-[#EDE8E0] animate-pulse" />
            <div className="h-7 w-16 bg-[#EDE8E0] animate-pulse" />
          </div>
        ))}
      </div>
      <div className="h-64 bg-white border border-[#E8E4DF] animate-pulse" />
    </div>
  )
}
