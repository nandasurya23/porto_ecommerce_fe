export type WishlistItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  stock: number;
  colorCount: number;
  sizeCount: number;
  addedAt: string;
};
