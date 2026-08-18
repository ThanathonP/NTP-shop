import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

export default async function PlatformDashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user!.id).single()
  if (profile?.role !== 'admin') redirect('/admin')

  const [{ data: orders }, { data: orderItems }, { data: shops }, { data: profiles }, { count: totalProducts }, { count: activeProducts }] =
    await Promise.all([
      supabase.from('orders').select('id, status, total_price, created_at'),
      supabase.from('order_items').select('quantity, unit_price, product_id, orders(status, created_at), products(name, shop_id, shops(name))'),
      supabase.from('shops').select('id, name, is_active, created_at'),
      supabase.from('profiles').select('id, created_at'),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    ])

  return (
    <DashboardClient
      orders={orders || []}
      orderItems={(orderItems || []) as any}
      shops={shops || []}
      profiles={profiles || []}
      totalProducts={totalProducts || 0}
      activeProducts={activeProducts || 0}
    />
  )
}
