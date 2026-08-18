import type { Metadata } from 'next'
import { Sarabun, Playfair_Display } from 'next/font/google'
import { createClient } from '@/lib/supabase/server'
import { AppStateProvider } from '@/components/shop/AppStateContext'
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
  title: 'NTP — ร้านค้าออนไลน์',
  description: 'สินค้าคัดสรร คุณภาพพรีเมียม',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  let cartCount = 0
  if (user) {
    const [{ data: profileData }, { count }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('cart_items').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
    ])
    profile = profileData
    cartCount = count || 0
  }

  return (
    <html lang="th">
      <body className={`${sarabun.variable} ${playfair.variable} font-sans bg-[#F7F5F2] text-[#1A1A1A]`}>
        <AppStateProvider initialUser={profile} initialCartCount={cartCount}>
          {children}
        </AppStateProvider>
      </body>
    </html>
  )
}
