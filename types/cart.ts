export type CartItem = {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  slug: string;
  image?: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  stock: number;
  subtotal?: number;
};

export type CartSummary = {
  subtotal: number;
  shipping: number;
  total: number;
};
