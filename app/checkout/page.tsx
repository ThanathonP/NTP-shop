import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CheckoutClient from './CheckoutClient'

export default async function CheckoutPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: cartItems } = await supabase
    .from('cart_items')
    .select('*, products(*)')
    .eq('user_id', user.id)

  return <CheckoutClient initialItems={cartItems || []} />
}
