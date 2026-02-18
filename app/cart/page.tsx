import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/shop/Navbar'
import CartClient from './CartClient'
import { redirect } from 'next/navigation'

export default async function CartPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: cartItems } = await supabase
    .from('cart_items')
    .select('*, products(*, shops(name))')
    .eq('user_id', user.id)

  return (
    <>
      <Navbar />
      <main className="pt-16 max-w-5xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl mb-8">ตะกร้าสินค้า</h1>
        <CartClient initialItems={cartItems || []} />
      </main>
    </>
  )
}
