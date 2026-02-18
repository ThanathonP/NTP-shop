import type { Metadata } from 'next'
import { Sarabun, Playfair_Display } from 'next/font/google'
import './globals.css'

const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sarabun',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'MONŌ — ร้านค้าออนไลน์',
  description: 'สินค้าคัดสรร คุณภาพพรีเมียม',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className={`${sarabun.variable} ${playfair.variable} font-sans bg-[#F7F5F2] text-[#1A1A1A]`}>
        {children}
      </body>
    </html>
  )
}
