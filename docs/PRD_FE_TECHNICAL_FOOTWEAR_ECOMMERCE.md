# PRD FE Technical — Footwear E-Commerce Operations Platform

## 1. Product Overview

**Product Name:** Footwear E-Commerce Operations Platform  
**Product Type:** Full-stack e-commerce operations system for footwear products  
**Frontend Scope:** Customer shopping app, admin dashboard, warehouse dashboard, and operational UI for product, order, inventory, and payment simulation workflows.

This product is designed as a portfolio-grade e-commerce system focused on footwear sales. The system is not just a simple online store. It includes product variants by size and color, cart, checkout, simulated payment, order lifecycle, inventory management, admin operations, and warehouse-ready order processing.

The backend will be built separately using **Golang + Gin + PostgreSQL**, while the frontend will consume REST APIs from the backend.

---

## 2. Project Goals

The frontend must demonstrate strong real-world e-commerce and operations capabilities, including:

- Clean customer shopping experience.
- Product catalog with footwear-specific variant selection.
- Cart and checkout flow.
- Simulated payment flow without Xendit, Midtrans, or external gateway.
- Order tracking for customers.
- Admin product, order, and inventory management.
- Warehouse order processing workflow.
- Role-based UI rendering.
- Production-minded frontend architecture.
- Strong form validation and API error handling.
- Responsive UI for desktop and mobile.

---

## 3. Target Users

### 3.1 Customer

Customers can browse products, select size and color, add products to cart, checkout, simulate payment, and track orders.

### 3.2 Admin

Admins manage products, categories, variants, stock, orders, payments, and basic sales overview.

### 3.3 Warehouse Staff

Warehouse staff process paid orders, update packing status, input tracking numbers, and manage shipment status.

### 3.4 Super Admin

Super Admin can access all modules, including user management and operational settings if implemented in later phases.

---

## 4. User Roles

```txt
CUSTOMER
ADMIN
WAREHOUSE
SUPER_ADMIN
```

Role-based UI behavior:

```txt
CUSTOMER:
- Access customer storefront
- Manage cart
- Checkout
- View own orders
- Simulate payment for own pending order

ADMIN:
- Access admin dashboard
- Manage products
- Manage variants and stock
- Manage all orders
- View payment records

WAREHOUSE:
- Access warehouse dashboard
- View paid/processing orders
- Update packing and shipment status
- Input tracking number

SUPER_ADMIN:
- Access all admin and warehouse modules
```

---

## 5. Tech Stack

### 5.1 Core Frontend

```txt
Next.js App Router
TypeScript
Tailwind CSS
React Hook Form
Zod
TanStack Query
Zustand
Lucide Icons
```

### 5.2 Supporting Libraries

```txt
clsx / class-variance-authority for class composition
sonner or custom toast system for notifications
date-fns for date formatting
recharts for dashboard charts
```

### 5.3 Not Used

The frontend should not depend on heavy UI templates or generic AI-looking component kits.

```txt
Do not use shadcn/ui as the main design dependency.
Do not overuse card-in-card layouts.
Do not overuse gradients.
Do not use excessive border radius.
Do not use excessive shadows.
Do not use any type in TypeScript.
Do not hardcode API data directly inside pages.
```

Lucide Icons are required as the primary icon set. Other icon libraries can be added only if necessary.

---

## 6. Backend Contract Assumption

The frontend will consume a Golang REST API.

Base API example:

```txt
http://localhost:8080/api/v1
```

Authentication will use JWT-based access token.

Expected auth behavior:

```txt
- Login returns user profile and access token.
- Token is stored securely on the frontend side.
- API requests include Authorization: Bearer <token>.
- Protected routes redirect unauthenticated users to login.
- Unauthorized role access shows forbidden page or redirects to allowed dashboard.
```

---

## 7. Main Frontend Modules

## 7.1 Public Storefront

### Pages

```txt
/
/products
/products/[slug]
/cart
/checkout
/login
/register
```

### Features

```txt
- Homepage hero section
- Featured products
- Product listing
- Product filtering
- Product sorting
- Product detail page
- Size selector
- Color selector
- Stock availability display
- Add to cart
- Cart drawer or cart page
- Login/register flow
```

### Product Listing Requirements

Product listing should support:

```txt
- Search by keyword
- Filter by category
- Filter by size
- Filter by color
- Filter by price range
- Filter by stock availability
- Sort by newest
- Sort by price low to high
- Sort by price high to low
```

### Product Card UI

Each product card should show:

```txt
- Product image
- Product name
- Category
- Starting price
- Available colors indicator
- Available size summary
- Stock status
```

### Product Detail UI

Product detail page should include:

```txt
- Product image gallery
- Product name
- Price
- Variant color selector
- Variant size selector
- Stock status for selected variant
- Add to cart button
- Product description
- Material details
- Size guide
- Shipping information
- Return policy summary
- Related products
```

Variant selection behavior:

```txt
- User must select color and size before adding to cart.
- Disabled sizes should appear if stock is 0.
- Price should update if selected variant has different price.
- Stock warning should appear when stock is low.
```

---

## 7.2 Cart Module

### Page

```txt
/cart
```

### Features

```txt
- View cart items
- Update quantity
- Remove item
- Show selected product variant
- Show price summary
- Show subtotal
- Proceed to checkout
```

### Validation

```txt
- Quantity cannot be less than 1.
- Quantity cannot exceed available stock.
- Removed item should update cart summary immediately.
- Empty cart should show meaningful empty state.
```

---

## 7.3 Checkout Module

### Page

```txt
/checkout
```

### Checkout Steps

```txt
1. Shipping address
2. Shipping method
3. Order summary
4. Place order
```

### Features

```txt
- Select existing address
- Add new address
- Select dummy shipping courier
- Review cart items
- Confirm order
- Create order through API
```

### Dummy Shipping Options

```txt
JNE Regular
J&T Express
SiCepat
DHL Express
```

Shipping cost can come from backend or frontend placeholder config during MVP. Final amount must be confirmed by backend response.

---

## 7.4 Simulated Payment Module

### Pages

```txt
/orders/[id]/payment
/orders/[id]
```

### Features

```txt
- Show pending payment details
- Show payment code
- Show payment method
- Show payment amount
- Show expiry time
- Button to simulate payment success
- Button to simulate payment failure for testing
```

Important UX:

```txt
- Payment is not automatically successful after checkout.
- User must click simulated payment action.
- After success, frontend refetches order detail.
- Order status changes from PENDING_PAYMENT to PROCESSING.
```

This keeps the frontend aligned with a gateway-ready backend flow.

---

## 7.5 Customer Order Module

### Pages

```txt
/orders
/orders/[id]
```

### Features

```txt
- Order history
- Order detail
- Order status timeline
- Payment status display
- Shipment information
- Tracking number display
- Order item summary
```

### Order Status Timeline

```txt
PENDING_PAYMENT
PAID
PROCESSING
PACKED
SHIPPED
DELIVERED
CANCELLED
```

Timeline UI should clearly show completed, current, and upcoming steps.

---

## 7.6 Admin Dashboard

### Pages

```txt
/admin
/admin/products
/admin/products/create
/admin/products/[id]
/admin/categories
/admin/inventory
/admin/orders
/admin/orders/[id]
/admin/payments
/admin/reports
```

### Admin Dashboard Features

```txt
- Total revenue
- Total orders
- Pending payment orders
- Processing orders
- Low stock variants
- Recent orders
- Best-selling products
```

Dashboard should use cards, tables, and charts carefully. Avoid noisy UI.

---

## 7.7 Product Management

### Features

```txt
- Create product
- Edit product
- Archive product
- Upload product images
- Manage product status
- Add variants
- Edit variants
- Update stock
```

### Product Status

```txt
DRAFT
PUBLISHED
ARCHIVED
```

### Product Form Fields

```txt
Product name
Slug
Category
Description
Material
Base price
Status
Images
```

### Variant Form Fields

```txt
SKU
Color
Size
Price
Stock
Weight
Status
```

Variant rules:

```txt
- SKU must be unique.
- Stock cannot be negative.
- Price must be greater than 0.
- Size is required.
- Color is required.
```

---

## 7.8 Inventory Management

### Page

```txt
/admin/inventory
```

### Features

```txt
- View all product variants
- Search by product name or SKU
- Filter by low stock
- Filter by out of stock
- Update stock
- View inventory movement logs
```

### Low Stock Indicator

```txt
Stock 0 = Out of Stock
Stock 1-5 = Low Stock
Stock above 5 = Available
```

Inventory log should show:

```txt
- Product variant
- Movement type
- Previous stock
- Current stock
- Quantity changed
- Note
- Changed by
- Created date
```

---

## 7.9 Admin Order Management

### Pages

```txt
/admin/orders
/admin/orders/[id]
```

### Features

```txt
- View all orders
- Filter by status
- Filter by payment status
- Search by order number or customer
- View order detail
- Update order status
- View payment detail
- View shipment detail
```

Order table columns:

```txt
Order number
Customer
Total amount
Payment status
Order status
Created date
Action
```

Order detail should show:

```txt
- Customer info
- Shipping address
- Order items
- Payment detail
- Shipment detail
- Status timeline
- Internal status logs
```

---

## 7.10 Warehouse Dashboard

### Pages

```txt
/warehouse
/warehouse/orders
/warehouse/orders/[id]
/warehouse/shipments
```

### Features

```txt
- View paid orders ready to process
- Mark order as packed
- Create shipment
- Input courier and tracking number
- Mark order as shipped
- View shipment status
```

Warehouse should not access product pricing management or admin reports unless role allows it.

---

## 8. Design Direction

The UI should feel like a modern footwear commerce platform with operational dashboard depth.

### Visual Style

```txt
Clean
Modern
Bold
Functional
Premium but not overdesigned
```

### Avoid

```txt
- Too much gradient
- Too much shadow
- Excessive rounded corners
- Card inside card everywhere
- Generic SaaS template appearance
- Overly playful colors
- Too much whitespace
```

### Recommended Direction

```txt
- Strong product imagery
- Clean product grid
- Neutral background
- Dark text hierarchy
- Sharp sections
- Compact dashboard layout
- Clear tables
- Strong status badges
```

### Suggested Color System

```txt
Primary: Charcoal / black tone
Secondary: Neutral gray
Accent: Deep red, electric blue, or muted orange
Success: Green
Warning: Amber
Danger: Red
Background: White / off-white
```

The exact color palette can be defined in the design system file.

---

## 9. Form Validation Requirements

All forms must use React Hook Form and Zod.

Forms include:

```txt
Login
Register
Address form
Product form
Variant form
Stock update form
Checkout form
Shipment form
Payment simulation action confirmation
```

Validation messages should be user-friendly and not expose backend internals.

Example:

```txt
Bad: database constraint failed
Good: This SKU is already used by another variant.
```

---

## 10. API Error Handling

Frontend must handle:

```txt
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
409 Conflict
422 Validation Error
500 Internal Server Error
```

User-facing behavior:

```txt
- Show toast for action feedback.
- Show inline form error for validation failures.
- Redirect to login on unauthenticated requests.
- Show forbidden page for unauthorized role access.
- Show retry state on failed data fetch.
```

---

## 11. Loading, Empty, and Error States

Every data-driven page must include:

```txt
Loading state
Empty state
Error state
Success state where applicable
```

Examples:

```txt
Product listing empty:
No products found for the selected filters.

Cart empty:
Your cart is empty. Start exploring footwear products.

Admin orders empty:
No orders match the selected filters.
```

---

## 12. Responsiveness

Minimum supported layout:

```txt
Mobile: 360px and above
Tablet: 768px and above
Desktop: 1024px and above
Large desktop: 1440px and above
```

Customer storefront must be fully mobile-friendly.

Admin dashboard can prioritize desktop but must remain usable on tablet. For mobile admin, tables can switch to stacked rows or horizontal scroll.

---

## 13. SEO Requirements

Storefront pages should support:

```txt
Dynamic title
Dynamic description
Open Graph image
Product slug URLs
Canonical URL where applicable
```

Admin and warehouse pages should not be indexed.

---

## 14. Security-Oriented FE Requirements

```txt
- Never trust role data only from frontend.
- Protected routes must still depend on backend authorization.
- Do not expose internal admin API keys.
- Do not store sensitive data in localStorage if avoidable.
- Validate all forms before submit.
- Sanitize rendered content if rich text is implemented.
```

For MVP, token storage strategy can be decided based on backend auth implementation. Prefer HTTP-only cookie if backend supports it. If using localStorage during development, document it clearly as MVP-only.

---

## 15. Main Acceptance Criteria

The FE MVP is considered complete when:

```txt
- Customer can register/login.
- Customer can browse products.
- Customer can select size/color variant.
- Customer can add item to cart.
- Customer can checkout.
- Customer can simulate payment success.
- Customer can see order status updated.
- Admin can create/edit products.
- Admin can create/edit variants.
- Admin can view and manage orders.
- Admin can view inventory.
- Warehouse can process paid orders.
- Role-based pages are protected.
- All main forms have validation.
- Loading, empty, and error states exist.
```

---

## 16. Out of Scope for MVP

```txt
Real payment gateway integration
Real shipping API integration
Supabase Storage
Xendit
Midtrans
Advanced coupon engine
Product reviews
Wishlist
Return/refund management
Custom footwear request
Invoice PDF generation
Multi-language support
Real-time notifications
```

These can be added in later phases.

---

## 17. Future Phase Features

```txt
- Return and refund management
- Custom footwear request and quotation
- Coupon system
- Wishlist
- Product reviews
- Invoice PDF
- Email notification
- Midtrans/Xendit integration
- S3 or Supabase Storage migration
- Sales analytics
- Audit log dashboard
```

---

## 18. Portfolio Positioning

Recommended portfolio title:

```txt
Footwear E-Commerce Operations Platform
```

Recommended description:

```txt
A full-stack footwear commerce system built with Next.js and Golang, featuring product variants by size and color, cart checkout, simulated payment workflow, transaction-safe order lifecycle, admin product management, inventory tracking, and warehouse order processing.
```

Frontend highlight:

```txt
The frontend was built with a role-based architecture covering customer storefront, admin dashboard, and warehouse operations. It includes reusable UI components, typed API contracts, form validation, protected routes, data fetching states, and operational workflows aligned with a Golang REST API backend.
```
