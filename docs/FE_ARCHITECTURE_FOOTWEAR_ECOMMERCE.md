# FE Architecture — Footwear E-Commerce Operations Platform

## 1. Architecture Overview

This frontend is designed as a scalable Next.js application for a footwear e-commerce operations platform. It supports three main user areas:

```txt
Customer Storefront
Admin Dashboard
Warehouse Dashboard
```

The frontend communicates with a separate backend built using **Golang + Gin + PostgreSQL** through REST APIs.

Frontend responsibilities:

```txt
- Render customer-facing storefront.
- Handle product browsing and variant selection.
- Manage cart and checkout UI.
- Support simulated payment flow.
- Display customer order tracking.
- Provide admin product and order management UI.
- Provide warehouse fulfillment UI.
- Handle role-based routing and protected layouts.
- Provide strong form validation and API feedback.
```

Backend responsibilities:

```txt
- Authentication and authorization.
- Product, variant, and inventory business logic.
- Cart and checkout processing.
- Payment simulation logic.
- Order lifecycle and transaction safety.
- Database persistence.
```

---

## 2. Recommended Tech Stack

```txt
Next.js App Router
TypeScript
Tailwind CSS
React Hook Form
Zod
TanStack Query
Zustand
Lucide Icons
Recharts
Date-fns
```

### Why This Stack

```txt
Next.js App Router:
- Good routing structure for storefront, admin, and warehouse areas.
- Supports server and client components.
- Good SEO support for product pages.

TypeScript:
- Safer API contracts.
- Better maintainability.
- Avoids runtime bugs from weak typing.

Tailwind CSS:
- Fast UI development.
- Consistent spacing and responsive design.
- Easy design token mapping.

React Hook Form + Zod:
- Strong form handling.
- Schema-based validation.
- Clean error messages.

TanStack Query:
- API request state management.
- Caching and refetching.
- Loading/error state standardization.

Zustand:
- Lightweight client state for cart UI, auth UI state, filters, and layout preferences.

Lucide Icons:
- Clean and consistent icon style.
```

---

## 3. High-Level Frontend Structure

```txt
frontend/
├── app/
│   ├── (public)/
│   ├── (auth)/
│   ├── (customer)/
│   ├── admin/
│   ├── warehouse/
│   ├── forbidden/
│   ├── not-found.tsx
│   └── layout.tsx
├── components/
├── features/
├── hooks/
├── lib/
├── services/
├── stores/
├── types/
├── constants/
├── styles/
└── middleware.ts
```

This structure separates route groups, shared UI components, feature-specific modules, API services, global stores, and common utilities.

---

## 4. Route Group Design

```txt
app/
├── (public)/
│   ├── page.tsx
│   └── products/
│       ├── page.tsx
│       └── [slug]/page.tsx
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (customer)/
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── orders/page.tsx
│   └── orders/[id]/page.tsx
├── admin/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── products/
│   ├── inventory/
│   ├── orders/
│   ├── payments/
│   └── reports/
└── warehouse/
    ├── layout.tsx
    ├── page.tsx
    ├── orders/
    └── shipments/
```

### Route Group Principles

```txt
- Public storefront routes are separated from protected operational routes.
- Admin and warehouse have their own layouts.
- Customer routes are protected when they require account data.
- Auth pages should redirect logged-in users to the correct dashboard.
```

---

## 5. Feature-Based Architecture

The frontend should be organized by business feature, not by generic technical folders only.

```txt
features/
├── auth/
├── products/
├── cart/
├── checkout/
├── orders/
├── payments/
├── inventory/
├── shipments/
├── admin-dashboard/
└── warehouse-dashboard/
```

Each feature can contain:

```txt
components/
queries.ts
mutations.ts
schemas.ts
types.ts
utils.ts
```

Example:

```txt
features/products/
├── components/
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── ProductFilters.tsx
│   ├── ProductGallery.tsx
│   ├── VariantSelector.tsx
│   └── ProductForm.tsx
├── queries.ts
├── mutations.ts
├── schemas.ts
├── types.ts
└── utils.ts
```

---

## 6. Component Architecture

### 6.1 Shared Components

```txt
components/
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Textarea.tsx
│   ├── Badge.tsx
│   ├── Modal.tsx
│   ├── Drawer.tsx
│   ├── Table.tsx
│   ├── Pagination.tsx
│   ├── EmptyState.tsx
│   ├── LoadingState.tsx
│   └── ErrorState.tsx
├── layout/
│   ├── StoreHeader.tsx
│   ├── StoreFooter.tsx
│   ├── AdminSidebar.tsx
│   ├── AdminTopbar.tsx
│   ├── WarehouseSidebar.tsx
│   └── ProtectedLayout.tsx
└── feedback/
    ├── ToastProvider.tsx
    └── ConfirmDialog.tsx
```

### 6.2 Component Rules

```txt
- Components must be typed.
- Avoid any type.
- Avoid deeply nested component trees when not needed.
- UI components must be reusable but not over-abstracted.
- Feature components should stay inside their feature folder.
- Shared components should not contain business-specific logic.
```

---

## 7. API Layer Architecture

All API calls must go through a centralized API client.

```txt
services/
├── api-client.ts
├── endpoints.ts
├── auth.service.ts
├── product.service.ts
├── cart.service.ts
├── order.service.ts
├── payment.service.ts
├── inventory.service.ts
└── shipment.service.ts
```

### API Client Responsibilities

```txt
- Attach base URL.
- Attach auth token if needed.
- Parse JSON response.
- Normalize API errors.
- Handle unauthorized responses.
```

Example API flow:

```txt
Page / Component
        ↓
Feature query/mutation
        ↓
Service function
        ↓
API client
        ↓
Golang REST API
```

---

## 8. API Response Typing

Define shared API response types.

```txt
types/
├── api.ts
├── auth.ts
├── product.ts
├── cart.ts
├── order.ts
├── payment.ts
├── inventory.ts
└── shipment.ts
```

Example shape:

```ts
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
};
```

Rules:

```txt
- Do not use any.
- Do not duplicate API types across files.
- Keep DTO types aligned with backend response.
- Use type aliases or interfaces consistently.
```

---

## 9. State Management Strategy

Use the correct tool for the correct state.

### 9.1 Server State

Use TanStack Query for:

```txt
- Product listing
- Product detail
- Cart data
- Orders
- Payments
- Admin dashboard data
- Inventory data
- Shipment data
```

### 9.2 Client State

Use Zustand for:

```txt
- Cart drawer open/close
- Product filter UI state
- Sidebar collapsed state
- Temporary checkout step state
- Auth UI state if needed
```

### 9.3 Form State

Use React Hook Form for:

```txt
- Login/register
- Product create/edit
- Variant create/edit
- Address form
- Checkout form
- Shipment form
- Stock update form
```

---

## 10. Authentication Architecture

Auth frontend requirements:

```txt
- Login page
- Register page
- Current user fetch
- Protected route guard
- Role-based redirect
- Logout flow
```

Possible auth flow:

```txt
User login
        ↓
Frontend sends credentials to Golang API
        ↓
API returns access token and user profile
        ↓
Frontend stores auth state
        ↓
Frontend calls /auth/me to verify session
        ↓
User is routed based on role
```

Role-based redirect:

```txt
CUSTOMER → /
ADMIN → /admin
WAREHOUSE → /warehouse
SUPER_ADMIN → /admin
```

### Protected Layout Strategy

```txt
ProtectedLayout
├── Check auth loading
├── If unauthenticated → redirect login
├── If role not allowed → redirect forbidden
└── Render children
```

Important:

```txt
Frontend route protection improves UX only.
Backend must still enforce authorization.
```

---

## 11. Layout Architecture

### 11.1 Storefront Layout

```txt
StoreHeader
Main content
StoreFooter
```

Storefront header includes:

```txt
Logo
Product navigation
Search
Cart icon
User menu
```

### 11.2 Admin Layout

```txt
AdminSidebar
AdminTopbar
Main dashboard content
```

Admin sidebar includes:

```txt
Dashboard
Products
Inventory
Orders
Payments
Reports
```

### 11.3 Warehouse Layout

```txt
WarehouseSidebar
WarehouseTopbar
Main warehouse content
```

Warehouse sidebar includes:

```txt
Dashboard
Orders
Packing
Shipments
Stock Alert
```

---

## 12. Data Fetching Pattern

Use feature-level query files.

Example:

```txt
features/products/queries.ts
features/products/mutations.ts
```

Query naming convention:

```txt
useProductsQuery
useProductDetailQuery
useAdminProductsQuery
useInventoryQuery
useOrdersQuery
useOrderDetailQuery
```

Mutation naming convention:

```txt
useCreateProductMutation
useUpdateProductMutation
useAddToCartMutation
useCheckoutMutation
useSimulatePaymentSuccessMutation
useUpdateOrderStatusMutation
```

After mutation success:

```txt
- Invalidate related queries.
- Show success toast.
- Redirect only when needed.
- Preserve user context when possible.
```

---

## 13. Form Architecture

Each complex form should have:

```txt
schema.ts
form component
submit mutation
error mapper
```

Example:

```txt
features/products/schemas.ts
features/products/components/ProductForm.tsx
features/products/mutations.ts
```

Rules:

```txt
- All form input types must be explicit.
- Zod schema must match backend validation expectation.
- Backend validation errors should map to field errors when possible.
- Submit button must show loading state.
- Prevent double submit.
```

---

## 14. Design System Architecture

Use a lightweight custom design system.

```txt
components/ui
constants/theme.ts
styles/globals.css
```

### Design Principles

```txt
- Clean and sharp layout.
- Compact spacing for dashboard.
- Strong product presentation for storefront.
- Minimal visual noise.
- Consistent status badges.
- Consistent table behavior.
```

### UI Rules

```txt
- Avoid excessive rounded corners.
- Avoid heavy shadows.
- Avoid nested cards where plain sections work better.
- Avoid generic SaaS gradient blocks.
- Use clear spacing scale.
- Use readable typography.
```

---

## 15. Status Badge System

Create reusable badge variants for order, payment, shipment, and stock status.

```txt
components/ui/StatusBadge.tsx
```

Status groups:

```txt
Payment:
PENDING
PAID
FAILED
EXPIRED
CANCELLED

Order:
PENDING_PAYMENT
PROCESSING
PACKED
SHIPPED
DELIVERED
CANCELLED

Shipment:
WAITING_FOR_PICKUP
PICKED_UP
IN_TRANSIT
OUT_FOR_DELIVERY
DELIVERED

Stock:
AVAILABLE
LOW_STOCK
OUT_OF_STOCK
```

---

## 16. Table Architecture

Admin and warehouse modules will use tables heavily.

Required table features:

```txt
- Search
- Filter
- Pagination
- Status badge
- Row action
- Empty state
- Loading state
```

For MVP, custom table components are enough. TanStack Table can be added later if table logic grows.

---

## 17. Cart Architecture

Cart should be API-backed, not only local state.

Cart flow:

```txt
User adds variant to cart
        ↓
POST /cart/items
        ↓
Invalidate cart query
        ↓
Update cart badge and cart page
```

Frontend cart responsibilities:

```txt
- Show current cart.
- Validate quantity before submit.
- Display stock warnings.
- Let backend be source of truth for final cart state.
```

Do not rely only on localStorage for cart if user is logged in.

---

## 18. Checkout Architecture

Checkout should use a step-based UI but final calculation must come from backend.

```txt
Step 1: Address
Step 2: Shipping
Step 3: Review
Step 4: Place order
```

Frontend sends selected address and shipping method to backend. Backend returns created order with final amount.

After order created:

```txt
Redirect to /orders/[id]/payment
```

---

## 19. Simulated Payment Architecture

The frontend should call a payment simulation endpoint.

```txt
POST /api/v1/payments/:order_id/simulate-success
```

Frontend behavior:

```txt
- Show confirmation dialog before simulating success.
- Disable button while request is running.
- Show success toast after payment success.
- Refetch order detail.
- Redirect to order detail or update payment page state.
```

Important:

```txt
The frontend must not directly change order/payment status locally without backend confirmation.
```

---

## 20. File Upload Architecture

For MVP, backend uses local storage.

Frontend upload use cases:

```txt
- Product images
```

Future upload use cases:

```txt
- Return photos
- Custom footwear reference images
- Invoice files
```

Frontend should send multipart/form-data to backend.

Rules:

```txt
- Validate file type.
- Validate file size.
- Show preview before upload when useful.
- Show upload progress if available.
```

Allowed product image types:

```txt
image/jpeg
image/png
image/webp
```

---

## 21. Error Handling Architecture

Create a centralized error utility.

```txt
lib/errors.ts
```

Responsibilities:

```txt
- Normalize API errors.
- Extract field errors.
- Extract user-facing message.
- Avoid exposing raw backend errors.
```

Common behavior:

```txt
401 → Redirect login
403 → Redirect forbidden
404 → Show not found
409 → Show conflict message
422 → Map validation errors
500 → Show general error message
```

---

## 22. Folder Structure Detail

```txt
frontend/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   └── products/
│   │       ├── page.tsx
│   │       └── [slug]/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (customer)/
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   └── orders/
│   │       ├── page.tsx
│   │       └── [id]/page.tsx
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── products/
│   │   ├── inventory/
│   │   ├── orders/
│   │   └── payments/
│   └── warehouse/
│       ├── layout.tsx
│       ├── page.tsx
│       └── orders/
├── components/
│   ├── ui/
│   ├── layout/
│   └── feedback/
├── features/
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── payments/
│   ├── inventory/
│   └── shipments/
├── services/
├── stores/
├── hooks/
├── lib/
├── types/
├── constants/
└── styles/
```

---

## 23. Naming Convention

### Files

```txt
PascalCase for components:
ProductCard.tsx
AdminSidebar.tsx

camelCase for utilities:
formatCurrency.ts
parseApiError.ts

kebab-case for route folders where needed:
custom-orders
```

### Hooks

```txt
useProductsQuery
useCreateProductMutation
useCartStore
useAuthGuard
```

### Types

```txt
Product
ProductVariant
CartItem
Order
Payment
Shipment
InventoryLog
```

---

## 24. Environment Variables

```txt
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_APP_NAME=Footwear Commerce
```

Do not expose private backend secrets in frontend environment variables.

---

## 25. Performance Guidelines

```txt
- Use Next.js Image for product images if compatible with backend image URLs.
- Paginate product and admin listing data.
- Debounce product search input.
- Avoid fetching full admin data when only summary is needed.
- Use TanStack Query caching properly.
- Split heavy dashboard charts if needed.
```

---

## 26. Accessibility Guidelines

```txt
- Buttons must have clear labels.
- Forms must have accessible labels.
- Inputs must show validation messages.
- Color should not be the only status indicator.
- Keyboard navigation should work for menus and modals.
- Images should have alt text.
```

---

## 27. Testing Strategy

Minimum recommended testing:

```txt
- Unit test utility functions.
- Test form schemas.
- Test status mapping helpers.
- Test important components like VariantSelector.
```

Future testing:

```txt
- Integration test checkout flow.
- E2E test login → add to cart → checkout → simulate payment.
- E2E test admin create product → variant appears in storefront.
```

Recommended tools:

```txt
Vitest
React Testing Library
Playwright for E2E later
```

---

## 28. Development Workflow

Recommended flow:

```txt
1. Build UI shell and route layouts.
2. Build auth flow.
3. Build product listing and product detail.
4. Build cart flow.
5. Build checkout flow.
6. Build simulated payment UI.
7. Build customer order tracking.
8. Build admin product management.
9. Build inventory management.
10. Build warehouse order processing.
```

---

## 29. MVP Architecture Boundary

MVP includes:

```txt
- Customer storefront
- Auth
- Product variants
- Cart
- Checkout
- Simulated payment
- Order detail and order history
- Admin product management
- Admin inventory
- Admin order management
- Warehouse order processing
```

MVP excludes:

```txt
- Real payment gateway
- Real shipping API
- Supabase Storage
- Return/refund management
- Custom footwear request
- Coupon system
- Product reviews
- Wishlist
```

---

## 30. Portfolio Notes

This architecture is intentionally designed to show the user's frontend strength while still supporting a serious backend system.

The frontend demonstrates:

```txt
- Role-based application structure
- E-commerce UX
- Operational dashboard UX
- Typed API integration
- Form-heavy admin workflows
- Status lifecycle UI
- Data fetching patterns
- Realistic error and loading states
```

Recommended portfolio summary:

```txt
Built a role-based frontend architecture for a footwear e-commerce operations platform using Next.js, TypeScript, Tailwind CSS, TanStack Query, Zustand, React Hook Form, and Zod. The frontend integrates with a Golang REST API and supports storefront shopping, cart checkout, simulated payment, order tracking, admin product management, inventory control, and warehouse fulfillment workflows.
```
