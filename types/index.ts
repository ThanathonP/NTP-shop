export type Role = 'customer' | 'shop_owner' | 'admin'
export type OrderStatus = 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: Role
  avatar_url: string | null
  created_at: string
}

export interface Shop {
  id: string
  owner_id: string
  name: string
  description: string | null
  logo_url: string | null
  banner_url: string | null
  is_active: boolean
  created_at: string
}

export interface Product {
  id: string
  shop_id: string
  name: string
  description: string | null
  price: number
  stock_qty: number
  image_url: string | null
  category: string | null
  is_active: boolean
  created_at: string
  shops?: Shop
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  products?: Product
}

export interface Order {
  id: string
  user_id: string
  status: OrderStatus
  total_price: number
  shipping_address: {
    name: string
    phone: string
    address: string
    province: string
    postal_code: string
  }
  note: string | null
  created_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  products?: Product
}
