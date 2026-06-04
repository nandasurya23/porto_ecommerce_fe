import { addDays, formatISO } from "date-fns";
import type { AuthUser } from "@/types/auth";
import type { CartItem } from "@/types/cart";
import type { InventoryLog } from "@/types/inventory";
import type { Order, OrderItem } from "@/types/order";
import type { Payment } from "@/types/payment";
import type { Product, ProductVariant } from "@/types/product";
import type { Shipment } from "@/types/shipment";

const STORAGE_KEYS = {
  auth: "porto-auth",
  cart: "porto-cart",
  products: "porto-products",
  orders: "porto-orders",
  payments: "porto-payments",
  inventory: "porto-inventory",
  shipments: "porto-shipments",
} as const;

function id(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function now(): string {
  return formatISO(new Date());
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function seedProducts(): Product[] {
  return [
    {
      id: "prod-1",
      slug: "aero-runner-pro",
      name: "Aero Runner Pro",
      category: "Running",
      description: "Lightweight running shoe with responsive cushioning and breathable mesh.",
      material: "Engineered mesh, EVA foam",
      basePrice: 1299000,
      status: "PUBLISHED",
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
      ],
      variants: [
        { id: "var-1", sku: "ARP-BLK-40", color: "Black", size: "40", price: 1299000, stock: 12, weight: 0.8, status: "ACTIVE" },
        { id: "var-2", sku: "ARP-BLK-41", color: "Black", size: "41", price: 1299000, stock: 4, weight: 0.8, status: "ACTIVE" },
        { id: "var-3", sku: "ARP-WHT-40", color: "White", size: "40", price: 1349000, stock: 0, weight: 0.8, status: "ACTIVE" },
      ],
      createdAt: now(),
    },
    {
      id: "prod-2",
      slug: "street-heritage-low",
      name: "Street Heritage Low",
      category: "Lifestyle",
      description: "Daily wear silhouette with durable outsole and premium suede overlay.",
      material: "Suede, rubber outsole",
      basePrice: 1099000,
      status: "PUBLISHED",
      images: [
        "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1200&q=80",
      ],
      variants: [
        { id: "var-4", sku: "SHL-BRN-39", color: "Brown", size: "39", price: 1099000, stock: 8, weight: 0.9, status: "ACTIVE" },
        { id: "var-5", sku: "SHL-BRN-40", color: "Brown", size: "40", price: 1099000, stock: 3, weight: 0.9, status: "ACTIVE" },
        { id: "var-6", sku: "SHL-NVY-41", color: "Navy", size: "41", price: 1149000, stock: 6, weight: 0.9, status: "ACTIVE" },
      ],
      createdAt: now(),
    },
    {
      id: "prod-3",
      slug: "trail-core-mid",
      name: "Trail Core Mid",
      category: "Trail",
      description: "Mid-cut trail shoe built for grip, stability, and all-weather use.",
      material: "Ripstop nylon, rubber",
      basePrice: 1499000,
      status: "PUBLISHED",
      images: [
        "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80",
      ],
      variants: [
        { id: "var-7", sku: "TCM-GRN-40", color: "Olive", size: "40", price: 1499000, stock: 2, weight: 1, status: "ACTIVE" },
        { id: "var-8", sku: "TCM-GRN-41", color: "Olive", size: "41", price: 1499000, stock: 7, weight: 1, status: "ACTIVE" },
        { id: "var-9", sku: "TCM-ORG-42", color: "Orange", size: "42", price: 1549000, stock: 1, weight: 1, status: "ACTIVE" },
      ],
      createdAt: now(),
    },
  ];
}

function seedOrders(products: Product[]): Order[] {
  const product = products[0];
  const variant = product.variants[0];
  const item: OrderItem = {
    id: id("item"),
    productName: product.name,
    variantName: `${variant.color} / ${variant.size}`,
    quantity: 1,
    price: variant.price,
    image: product.images[0],
  };

  return [
    {
      id: "order-1",
      orderNumber: "ORD-10001",
      customerName: "Alya Putri",
      customerEmail: "alya@example.com",
      status: "PENDING_PAYMENT",
      paymentStatus: "PENDING",
      totalAmount: item.price + 25000,
      shippingAmount: 25000,
      shippingMethod: "JNE Regular",
      address: "Jl. Merdeka No. 12, Bandung",
      subtotal: item.price,
      items: [item],
      createdAt: formatISO(addDays(new Date(), -1)),
      updatedAt: now(),
    },
  ];
}

function seedPayments(orders: Order[]): Payment[] {
  return [
    {
      id: "pay-1",
      orderId: orders[0].id,
      code: "PAY-884422",
      method: "VA BCA",
      amount: orders[0].totalAmount,
      expiryAt: formatISO(addDays(new Date(), 1)),
      status: "PENDING",
    },
  ];
}

function seedInventoryLogs(): InventoryLog[] {
  return [
    {
      id: "log-1",
      variantId: "var-2",
      productName: "Aero Runner Pro",
      sku: "ARP-BLK-41",
      movementType: "ADJUSTMENT",
      previousStock: 5,
      currentStock: 4,
      note: "Manual stock correction",
      changedBy: "Admin",
      createdAt: now(),
    },
  ];
}

function seedShipments(): Shipment[] {
  return [];
}

function ensureSeeded(): void {
  const products = read<Product[]>(STORAGE_KEYS.products, []);
  if (products.length === 0) {
    const seededProducts = seedProducts();
    const seededOrders = seedOrders(seededProducts);
    write(STORAGE_KEYS.products, seededProducts);
    write(STORAGE_KEYS.orders, seededOrders);
    write(STORAGE_KEYS.payments, seedPayments(seededOrders));
    write(STORAGE_KEYS.inventory, seedInventoryLogs());
    write(STORAGE_KEYS.shipments, seedShipments());
    write(STORAGE_KEYS.cart, []);
  }
}

export function bootstrapMockState(): void {
  ensureSeeded();
}

export function getCurrentUser(): AuthUser | null {
  ensureSeeded();
  return read<AuthUser | null>(STORAGE_KEYS.auth, null);
}

export function setCurrentUser(user: AuthUser | null): void {
  write(STORAGE_KEYS.auth, user);
}

export function loginWithMock(email: string, password: string): { user: AuthUser; token: string } {
  if (password !== "password123") {
    throw new Error("Email atau password salah.");
  }

  const user: AuthUser = {
    id: email.includes("admin")
      ? "user-admin"
      : email.includes("warehouse")
        ? "user-warehouse"
        : "user-customer",
    name: email.includes("admin") ? "Admin User" : email.includes("warehouse") ? "Warehouse User" : "Customer User",
    email,
    role: email.includes("admin")
      ? "ADMIN"
      : email.includes("warehouse")
        ? "WAREHOUSE"
        : "CUSTOMER",
  };

  setCurrentUser(user);
  return { user, token: `mock-token-${user.id}` };
}

export function registerWithMock(name: string, email: string): { user: AuthUser; token: string } {
  const user: AuthUser = {
    id: id("user"),
    name,
    email,
    role: "CUSTOMER",
  };

  setCurrentUser(user);
  return { user, token: `mock-token-${user.id}` };
}

export function logoutMock(): void {
  setCurrentUser(null);
}

export function getProducts(): Product[] {
  ensureSeeded();
  return read<Product[]>(STORAGE_KEYS.products, []);
}

export function getFeaturedProducts(): Product[] {
  return getProducts().filter((product) => product.status === "PUBLISHED").slice(0, 3);
}

export function findProductBySlug(slug: string): Product | null {
  return getProducts().find((product) => product.slug === slug) ?? null;
}

export function findProductById(productId: string): Product | null {
  return getProducts().find((product) => product.id === productId) ?? null;
}

export function getCartItems(): CartItem[] {
  ensureSeeded();
  return read<CartItem[]>(STORAGE_KEYS.cart, []);
}

export function setCartItems(items: CartItem[]): void {
  write(STORAGE_KEYS.cart, items);
}

export function addCartItem(payload: Omit<CartItem, "id">): CartItem[] {
  const items = getCartItems();
  const existing = items.find((item) => item.variantId === payload.variantId);

  if (payload.stock <= 0) {
    throw new Error("Stok tidak tersedia.");
  }

  if (existing) {
    existing.quantity = Math.min(payload.stock, existing.quantity + payload.quantity);
  } else {
    items.push({ ...payload, quantity: Math.min(payload.stock, payload.quantity), id: id("cart") });
  }

  setCartItems(items);
  return items;
}

export function updateCartItemQuantity(itemId: string, quantity: number): CartItem[] {
  const items = getCartItems().map((item) => ({
    ...item,
    quantity: item.id === itemId ? Math.max(1, Math.min(item.stock || 1, quantity)) : item.quantity,
  }));
  setCartItems(items);
  return items;
}

export function removeCartItem(itemId: string): CartItem[] {
  const items = getCartItems().filter((item) => item.id !== itemId);
  setCartItems(items);
  return items;
}

export function clearCart(): void {
  setCartItems([]);
}

export function getOrders(): Order[] {
  ensureSeeded();
  return read<Order[]>(STORAGE_KEYS.orders, []);
}

export function getOrderById(orderId: string): Order | null {
  return getOrders().find((order) => order.id === orderId) ?? null;
}

export function getPayments(): Payment[] {
  ensureSeeded();
  return read<Payment[]>(STORAGE_KEYS.payments, []);
}

export function getPaymentByOrderId(orderId: string): Payment | null {
  return getPayments().find((payment) => payment.orderId === orderId) ?? null;
}

export function createOrderFromCart(payload: {
  shippingMethod: string;
  address: string;
  customer: AuthUser;
}): Order {
  const cartItems = getCartItems();
  if (cartItems.length === 0) {
    throw new Error("Cart tidak boleh kosong.");
  }
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingAmount = 25000;
    const order: Order = {
      id: id("order"),
      orderNumber: `ORD-${Math.floor(Math.random() * 90000 + 10000)}`,
      customerName: payload.customer.name,
      customerEmail: payload.customer.email,
      status: "PENDING_PAYMENT",
      paymentStatus: "PENDING",
      subtotal,
      totalAmount: subtotal + shippingAmount,
      shippingAmount,
      shippingMethod: payload.shippingMethod,
    address: payload.address,
    items: cartItems.map((item) => ({
      id: id("item"),
      productName: item.productName,
      variantName: `${item.color} / ${item.size}`,
      quantity: item.quantity,
      price: item.price,
      image: item.image ?? "",
    })),
    createdAt: now(),
    updatedAt: now(),
  };

  const orders = [order, ...getOrders()];
  write(STORAGE_KEYS.orders, orders);
  write(
    STORAGE_KEYS.payments,
    [
      {
        id: id("pay"),
        orderId: order.id,
        code: `PAY-${Math.floor(Math.random() * 900000 + 100000)}`,
        method: "VA BCA",
        amount: order.totalAmount,
        expiryAt: formatISO(addDays(new Date(), 1)),
        status: "PENDING",
      },
      ...getPayments(),
    ],
  );
  clearCart();

  const refreshed = getOrderById(order.id);
  if (!refreshed) {
    throw new Error("Gagal membuat order.");
  }

  return refreshed;
}

export function simulatePayment(orderId: string, status: "PAID" | "FAILED"): { order: Order; payment: Payment } {
  const orders = getOrders();
  const order = orders.find((item) => item.id === orderId);
  if (!order) {
    throw new Error("Order tidak ditemukan.");
  }

  const payment = getPayments().find((item) => item.orderId === orderId);
  if (!payment) {
    throw new Error("Payment tidak ditemukan.");
  }

  const updatedPayment: Payment = {
    ...payment,
    status: status === "PAID" ? "PAID" : "FAILED",
  };

  const updatedOrder: Order = {
    ...order,
    paymentStatus: status === "PAID" ? "PAID" : "FAILED",
    status: status === "PAID" ? "PROCESSING" : order.status,
    updatedAt: now(),
  };

  write(
    STORAGE_KEYS.payments,
    getPayments().map((item) => (item.id === payment.id ? updatedPayment : item)),
  );
  write(
    STORAGE_KEYS.orders,
    orders.map((item) => (item.id === order.id ? updatedOrder : item)),
  );

  return { order: updatedOrder, payment: updatedPayment };
}

export function updateOrderStatus(orderId: string, status: Order["status"]): Order {
  const orders = getOrders();
  const order = orders.find((item) => item.id === orderId);
  if (!order) {
    throw new Error("Order tidak ditemukan.");
  }

  const updated = {
    ...order,
    status,
    updatedAt: now(),
  };

  write(
    STORAGE_KEYS.orders,
    orders.map((item) => (item.id === orderId ? updated : item)),
  );

  return updated;
}

export function updateShipment(orderId: string, shipment: Partial<Shipment>): Shipment {
  const current = read<Shipment[]>(STORAGE_KEYS.shipments, []);
  const existing = current.find((item) => item.orderId === orderId);

  const updated: Shipment = {
    id: existing?.id ?? id("ship"),
    orderId,
    courier: shipment.courier ?? existing?.courier ?? "JNE Regular",
    trackingNumber: shipment.trackingNumber ?? existing?.trackingNumber ?? "",
    status: shipment.status ?? existing?.status ?? "WAITING_FOR_PICKUP",
    createdAt: existing?.createdAt ?? now(),
  };

  const next = existing ? current.map((item) => (item.orderId === orderId ? updated : item)) : [updated, ...current];
  write(STORAGE_KEYS.shipments, next);
  return updated;
}

export function getShipments(): Shipment[] {
  ensureSeeded();
  return read<Shipment[]>(STORAGE_KEYS.shipments, []);
}

export function getInventoryLogs(): InventoryLog[] {
  ensureSeeded();
  return read<InventoryLog[]>(STORAGE_KEYS.inventory, []);
}

export function appendInventoryLog(log: InventoryLog): InventoryLog[] {
  const logs = [log, ...getInventoryLogs()];
  write(STORAGE_KEYS.inventory, logs);
  return logs;
}

export function updateVariantStock(variantId: string, nextStock: number): Product[] {
  const products = getProducts();
  const nextProducts = products.map((product) => ({
    ...product,
    variants: product.variants.map((variant) =>
      variant.id === variantId ? { ...variant, stock: nextStock } : variant,
    ),
  }));
  write(STORAGE_KEYS.products, nextProducts);
  return nextProducts;
}

export function createProduct(payload: Omit<Product, "id" | "createdAt">): Product {
  const product: Product = {
    ...payload,
    id: id("prod"),
    createdAt: now(),
  };

  const next = [product, ...getProducts()];
  write(STORAGE_KEYS.products, next);
  return product;
}

export function updateProduct(productId: string, payload: Partial<Omit<Product, "id" | "createdAt">>): Product {
  const products = getProducts();
  const current = products.find((item) => item.id === productId);
  if (!current) {
    throw new Error("Product tidak ditemukan.");
  }

  const updated: Product = {
    ...current,
    ...payload,
    variants: payload.variants ?? current.variants,
  };

  write(
    STORAGE_KEYS.products,
    products.map((item) => (item.id === productId ? updated : item)),
  );

  return updated;
}

export function archiveProduct(productId: string): Product {
  return updateProduct(productId, { status: "ARCHIVED" });
}

export function upsertProductVariant(productId: string, variant: ProductVariant): Product {
  const product = findProductById(productId);
  if (!product) {
    throw new Error("Product tidak ditemukan.");
  }

  const exists = product.variants.some((item) => item.id === variant.id);
  const nextVariants = exists
    ? product.variants.map((item) => (item.id === variant.id ? variant : item))
    : [variant, ...product.variants];

  return updateProduct(productId, { variants: nextVariants });
}
