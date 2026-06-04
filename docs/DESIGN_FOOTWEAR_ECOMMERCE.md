# DESIGN.md — Footwear E-Commerce Operations Platform

## 1. Design Overview

**Product Name:** Footwear E-Commerce Operations Platform  
**Design Scope:** Customer storefront, customer account area, cart, checkout, simulated payment, order tracking, admin dashboard, product management, inventory management, order management, payment management, and warehouse fulfillment UI.

This design document defines the visual direction, layout rules, component patterns, interaction behavior, and page-by-page UI requirements for the frontend. It must stay aligned with:

```txt
PRD_FE_TECHNICAL_FOOTWEAR_ECOMMERCE.md
FE_ARCHITECTURE_FOOTWEAR_ECOMMERCE.md
```

The product should look like a real footwear commerce operations system, not a generic landing page or template-generated SaaS dashboard. The design must feel premium, clean, operational, and practical.

---

## 2. Design Goals

The frontend design must achieve these goals:

```txt
- Make the customer shopping flow simple and trustworthy.
- Make footwear variant selection clear: size, color, stock, and price.
- Make cart, checkout, payment, and order tracking easy to understand.
- Make admin operations fast and table-friendly.
- Make warehouse tasks focused and low-friction.
- Avoid decorative UI that hurts usability.
- Avoid excessive gradients, shadows, rounded corners, and card-in-card layouts.
- Create a design that looks portfolio-grade and business-realistic.
```

The visual language should communicate:

```txt
- Footwear retail
- Inventory operation
- Modern commerce
- Premium but not luxury-overdone
- Clean industrial workflow
- Serious full-stack product
```

---

## 3. Design Personality

### 3.1 Keywords

```txt
Clean
Sharp
Premium
Operational
Structured
Fast
Modern
Inventory-aware
Dashboard-friendly
```

### 3.2 What It Should Feel Like

The customer side should feel like a modern footwear store. The admin and warehouse side should feel like a real internal operations tool.

```txt
Customer side:
- Product-first
- Visual
- Easy browsing
- Clear price and size selection
- Strong checkout confidence

Admin side:
- Data-first
- Fast scanning
- Clear action buttons
- Status visibility
- Practical tables

Warehouse side:
- Task-first
- Minimal distraction
- Clear next action
- Shipment and packing focused
```

---

## 4. Visual Direction

### 4.1 Main Style

```txt
Style: Modern commerce + clean operations dashboard
Mood: Professional, premium, practical
Shape: Mostly sharp with subtle radius
Spacing: Compact but breathable
Visual weight: Strong typography, clear table rows, clean cards
```

### 4.2 Avoid

```txt
- Over-gradient background
- Excessive glassmorphism
- Excessive shadow
- Overly rounded cards
- Card inside card inside card
- Too much whitespace that makes dashboard feel empty
- Generic AI-template look
- Random decorative blobs
- Too many colors in one page
- Heavy animation that slows operational work
```

### 4.3 Use

```txt
- Strong product imagery
- Clear grid system
- Thin borders
- Subtle background contrast
- Sharp section division
- Clean table design
- Status badges
- Product variant chips
- Timeline UI for orders
- Compact dashboard cards
```

---

## 5. Color System

The color system should support both storefront and dashboard.

### 5.1 Core Palette

```txt
Background Primary: #FFFFFF
Background Secondary: #F6F7F8
Background Muted: #F1F3F5
Text Primary: #111827
Text Secondary: #4B5563
Text Muted: #6B7280
Border: #E5E7EB
Border Strong: #D1D5DB
Primary Dark: #111827
Primary Action: #1F2937
Accent: #B91C1C
Success: #15803D
Warning: #B45309
Danger: #B91C1C
Info: #2563EB
```

### 5.2 Usage Rules

```txt
Primary dark:
- Main CTA
- Header text
- Dashboard sidebar active state

Accent red:
- Important promo
- Sale label
- Critical highlight
- Brand accent, not everywhere

Gray scale:
- Layout structure
- Borders
- Table separation
- Secondary text

Green:
- Paid
- Delivered
- In stock
- Success toast

Yellow/orange:
- Pending payment
- Low stock
- Processing

Red:
- Error
- Out of stock
- Cancelled
- Failed payment

Blue:
- Shipment
- Info
- Tracking
```

### 5.3 Background Rules

```txt
Customer storefront:
- Mostly white background
- Soft gray sections for category/product blocks
- Product cards remain clean

Admin dashboard:
- Light gray app background
- White content surface
- Thin borders
- Minimal shadow

Warehouse dashboard:
- More compact and direct
- High contrast statuses
- Clear order priority indicators
```

---

## 6. Typography

### 6.1 Recommended Font Direction

Use a clean sans-serif font.

```txt
Primary font examples:
- Inter
- Geist Sans
- Plus Jakarta Sans
```

### 6.2 Type Scale

```txt
Display / Hero: 48px - 64px
Page Title: 28px - 36px
Section Title: 22px - 28px
Card Title: 16px - 18px
Body: 14px - 16px
Small Text: 12px - 13px
Table Text: 13px - 14px
Badge Text: 11px - 12px
```

### 6.3 Font Weight

```txt
Hero: 700 / 800
Page title: 700
Section title: 600 / 700
Card title: 600
Body: 400 / 500
Button: 600
Table header: 600
Badge: 600
```

### 6.4 Typography Rules

```txt
- Do not use too many font sizes in one page.
- Product name should be easy to scan.
- Price must be visually stronger than secondary info.
- Dashboard title must be clear but not oversized.
- Tables should use compact but readable type.
```

---

## 7. Spacing System

Use consistent spacing based on 4px/8px scale.

```txt
4px  = micro spacing
8px  = small gap
12px = form/control internal spacing
16px = standard component gap
24px = section/card spacing
32px = large block spacing
48px = page section spacing
64px = hero/major section spacing
```

### 7.1 Layout Spacing Rules

```txt
- Storefront sections should feel premium but not empty.
- Dashboard pages should be compact enough for operational work.
- Form fields should have clear vertical rhythm.
- Tables should not have oversized row height.
- Product detail should have stronger spacing than dashboard.
```

---

## 8. Border Radius & Shadow Rules

### 8.1 Radius

```txt
Small controls: 6px
Inputs: 6px - 8px
Product cards: 10px - 12px
Dashboard cards: 8px - 10px
Modals: 12px
Large hero image: 14px - 16px max
```

### 8.2 Shadow

Use shadow only when it supports hierarchy.

```txt
Allowed:
- Header subtle shadow on scroll
- Modal shadow
- Dropdown shadow
- Popover shadow

Avoid:
- Every card having strong shadow
- Floating dashboard cards everywhere
- Soft blurry AI-template shadows
```

Preferred card style:

```txt
background: white
border: 1px solid #E5E7EB
shadow: none or very subtle
```

---

## 9. Icon System

Primary icon library:

```txt
Lucide Icons
```

### 9.1 Icon Usage

```txt
Shopping: ShoppingBag, ShoppingCart, Package, Truck
Products: Boxes, Tags, Image, Layers
Inventory: Warehouse, AlertTriangle, Archive
Orders: Receipt, ClipboardList, Clock, CheckCircle
Payment: CreditCard, Wallet, CircleDollarSign
User: User, Users, Shield
Navigation: Menu, Search, Filter, ChevronDown, ChevronRight
Actions: Plus, Edit, Trash, Eye, Download, Upload
Status: Check, X, AlertCircle, Info
```

### 9.2 Icon Rules

```txt
- Use 16px icons inside buttons and table actions.
- Use 18px - 20px icons in navigation.
- Use 24px icons in empty states.
- Do not mix many icon styles.
- Icons must support the label, not replace critical text.
```

---

## 10. Layout System

## 10.1 Customer Storefront Layout

Structure:

```txt
Top Announcement Bar optional
Header / Navbar
Main Content
Footer
```

Header contains:

```txt
- Logo
- Products link
- Category links optional
- Search
- Cart icon
- Account menu
```

Desktop layout:

```txt
Max width: 1200px - 1280px
Header height: 72px
Product grid: 4 columns
Hero: two-column or large editorial layout
```

Mobile layout:

```txt
Header height: 64px
Use hamburger menu
Product grid: 2 columns
Filters open as drawer
Cart can be drawer or full page
```

## 10.2 Admin Dashboard Layout

Structure:

```txt
Sidebar
Topbar
Main Content Area
```

Sidebar contains:

```txt
Dashboard
Products
Inventory
Orders
Payments
Reports
Settings optional
```

Topbar contains:

```txt
Page title
Search optional
User menu
Notification optional
```

Main content rules:

```txt
- Use page header with title and primary action.
- Use KPI cards at top when needed.
- Use data table as primary content for operational pages.
- Use detail pages for complex records.
- Do not overload one page with too many nested panels.
```

## 10.3 Warehouse Dashboard Layout

Structure:

```txt
Compact sidebar or top navigation
Main task list
Order detail panel
Shipment actions
```

Warehouse UI should prioritize speed:

```txt
- Large status badges
- Clear primary action
- Quick filters: Paid, Processing, Packed, Shipped
- Tracking number input must be easy to find
- Packing checklist should be visible on order detail
```

---

## 11. Responsive Breakpoints

```txt
Mobile: 0 - 639px
Tablet: 640px - 1023px
Desktop: 1024px - 1279px
Large Desktop: 1280px+
```

### 11.1 Mobile Rules

```txt
- Product filters must become drawer.
- Admin tables can become horizontal scroll or mobile cards.
- Checkout steps stack vertically.
- Product gallery becomes swipe-friendly.
- Cart summary sticks near bottom only when it does not block actions.
```

### 11.2 Desktop Rules

```txt
- Product listing uses grid with sidebar filters.
- Product detail uses two-column layout.
- Checkout uses main form + sticky summary.
- Admin pages use sidebar + wide table.
- Warehouse pages use split list/detail when enough space.
```

---

# 12. Core UI Components

## 12.1 Button

Variants:

```txt
Primary
Secondary
Outline
Ghost
Danger
Link
```

Sizes:

```txt
sm: 32px height
md: 40px height
lg: 48px height
```

Rules:

```txt
- Primary button uses dark background.
- Danger button only for destructive action.
- Checkout/pay button must be visually dominant.
- Table action buttons should be compact.
- Loading button must disable duplicate submit.
```

## 12.2 Input

Input states:

```txt
Default
Focused
Error
Disabled
Read-only
```

Rules:

```txt
- Label always visible.
- Error message under field.
- Placeholder should not replace label.
- Use input masks only where useful, such as phone or currency.
```

## 12.3 Select

Use for:

```txt
Category
Size
Color
Status
Courier
Payment method
Sort order
```

Rules:

```txt
- Avoid huge select for product filters if chip/filter UI is better.
- Status select must show current value clearly.
```

## 12.4 Badge

Badge types:

```txt
Status badge
Stock badge
Role badge
Discount badge
Category badge
```

Badge should be compact, readable, and consistent.

## 12.5 Card

Card usage:

```txt
Product card
Dashboard KPI card
Order summary card
Payment instruction card
Empty state card
```

Rules:

```txt
- Use one surface level only.
- Avoid multiple nested cards.
- Use border instead of strong shadow.
```

## 12.6 Data Table

Used heavily in admin and warehouse.

Table features:

```txt
- Search
- Filter
- Sort
- Pagination
- Row action
- Status badge
- Empty state
- Loading skeleton
```

Rules:

```txt
- Header row has muted background.
- Row hover is subtle.
- Actions are aligned right.
- Important columns stay visible on smaller screens.
- Avoid making every cell visually heavy.
```

## 12.7 Modal / Dialog

Used for:

```txt
Confirm delete
Update status
Simulate payment confirmation
Quick stock adjustment
Upload image
```

Rules:

```txt
- Modal title must be direct.
- Primary action must match intent.
- Dangerous actions require confirmation.
- Avoid putting complex multi-step forms in small modal.
```

## 12.8 Drawer

Used for:

```txt
Mobile navigation
Mobile filter
Cart drawer optional
Order quick detail optional
```

Rules:

```txt
- Drawer should not replace full detail page for complex admin tasks.
- Cart drawer may show mini cart, but checkout remains a page.
```

## 12.9 Toast

Toast types:

```txt
Success
Error
Warning
Info
```

Used for:

```txt
- Add to cart success
- Login success
- Form submit success
- API error
- Payment simulation result
- Stock update result
```

Rules:

```txt
- Toast message must be short.
- Critical errors should also show inline state, not toast only.
```

## 12.10 Skeleton Loading

Skeleton used for:

```txt
Product grid
Product detail
Cart summary
Order table
Dashboard cards
```

Rules:

```txt
- Use skeleton matching final layout.
- Do not show spinner for entire page when skeleton is better.
```

---

# 13. Status Badge System

## 13.1 Order Status

```txt
PENDING_PAYMENT  -> Warning
PAID             -> Success
PROCESSING       -> Info
PACKED           -> Info
SHIPPED          -> Blue / Info
DELIVERED        -> Success
CANCELLED        -> Danger
RETURN_REQUESTED -> Warning
REFUNDED         -> Neutral / Info
```

## 13.2 Payment Status

```txt
PENDING   -> Warning
PAID      -> Success
FAILED    -> Danger
EXPIRED   -> Neutral
CANCELLED -> Neutral
```

## 13.3 Inventory Status

```txt
IN_STOCK  -> Success
LOW_STOCK -> Warning
OUT_STOCK -> Danger
```

## 13.4 Product Status

```txt
DRAFT     -> Neutral
PUBLISHED -> Success
ARCHIVED  -> Neutral
```

## 13.5 Shipment Status

```txt
WAITING_FOR_PICKUP -> Warning
PACKED             -> Info
SHIPPED            -> Info
IN_TRANSIT         -> Blue
DELIVERED          -> Success
FAILED_DELIVERY    -> Danger
```

---

# 14. Customer Storefront Pages

## 14.1 Homepage `/`

Purpose:

```txt
Introduce the footwear brand/store and guide users to product discovery.
```

Sections:

```txt
1. Hero section
2. Featured categories
3. Featured products
4. New arrivals
5. Why buy from us
6. Store operation highlight
7. Final CTA
8. Footer
```

Hero requirements:

```txt
- Strong headline
- Short supporting copy
- Product image or editorial footwear visual
- Primary CTA: Shop Products
- Secondary CTA: View New Arrivals
```

Design direction:

```txt
- Large clean hero
- White/dark contrast
- Minimal decorative background
- Product image should be dominant
```

## 14.2 Product Listing `/products`

Purpose:

```txt
Allow users to browse, filter, search, and sort footwear products.
```

Layout desktop:

```txt
Left filter sidebar
Right product grid
Top search and sort bar
```

Layout mobile:

```txt
Top search
Filter drawer button
Sort dropdown
Two-column product grid
```

Filter UI:

```txt
Category
Size
Color
Price range
Stock availability
```

Product grid rules:

```txt
- 4 columns desktop
- 3 columns medium desktop/tablet
- 2 columns mobile
- Keep product image ratio consistent
- Show stock status and starting price
```

## 14.3 Product Detail `/products/[slug]`

Purpose:

```txt
Help customer understand product, select variant, and add item to cart.
```

Layout desktop:

```txt
Left: image gallery
Right: product info, price, variant selector, stock, add to cart
Below: details tabs/sections
```

Required sections:

```txt
Product gallery
Product title
Category
Price
Color selector
Size selector
Stock availability
Quantity selector
Add to cart
Size guide
Description
Material info
Care instruction
Shipping info
Related products
```

Variant selector rules:

```txt
- Size must show unavailable/disabled state when stock is 0.
- Color selection must update gallery if images are available.
- Add to cart disabled until required variant is selected.
- Stock warning appears when remaining stock is low.
```

## 14.4 Cart `/cart`

Purpose:

```txt
Allow customers to review selected variants before checkout.
```

Cart item must show:

```txt
Product image
Product name
Size
Color
Price
Quantity control
Subtotal
Remove action
Stock warning if quantity is close to limit
```

Cart summary must show:

```txt
Subtotal
Estimated shipping placeholder
Discount placeholder if coupon is future phase
Total estimate
Checkout button
```

Empty cart state:

```txt
Icon: ShoppingCart
Title: Your cart is empty
Description: Start adding footwear products to continue checkout.
CTA: Browse Products
```

## 14.5 Checkout `/checkout`

Purpose:

```txt
Collect address, shipping option, and payment method before creating order.
```

Checkout steps:

```txt
1. Shipping Address
2. Shipping Method
3. Payment Method
4. Review Order
```

Layout desktop:

```txt
Left: checkout form steps
Right: sticky order summary
```

Layout mobile:

```txt
Stacked steps
Order summary below or collapsible
```

Required UI:

```txt
Address form
Courier selection
Payment method selection
Order item summary
Total amount
Place order button
```

Payment methods for MVP:

```txt
BANK_TRANSFER_SIMULATION
QRIS_SIMULATION
COD optional
```

## 14.6 Simulated Payment Page `/orders/[id]/payment`

Purpose:

```txt
Represent a payment waiting page without external gateway.
```

Required UI:

```txt
Order number
Payment code
Payment method
Total amount
Payment status badge
Payment expiry info optional
Payment instruction box
Simulate Payment Success button
Simulate Payment Failed button optional
Back to order detail link
```

Design rules:

```txt
- Clearly label this as simulated payment in portfolio/demo environment.
- Payment success button should be primary.
- Failed simulation should be secondary/danger outline.
```

## 14.7 Order List `/orders`

Purpose:

```txt
Allow customers to see order history.
```

Order card/table must show:

```txt
Order number
Created date
Total amount
Payment status
Order status
Main product preview
Action: View detail
```

Filters:

```txt
All
Pending Payment
Processing
Shipped
Delivered
Cancelled
```

## 14.8 Order Detail `/orders/[id]`

Purpose:

```txt
Show complete order status, items, payment, and shipment information.
```

Required UI:

```txt
Order number
Order status timeline
Payment status
Items list
Shipping address
Shipment info
Tracking number
Total breakdown
Pay now / simulate payment button if pending
```

Timeline:

```txt
Pending Payment -> Paid -> Processing -> Packed -> Shipped -> Delivered
```

---

# 15. Authentication Pages

## 15.1 Login `/login`

Required UI:

```txt
Email field
Password field
Submit button
Error message
Register link
Demo account helper optional
```

Rules:

```txt
- Keep login simple.
- Redirect based on role after login.
- Do not expose token visually.
```

## 15.2 Register `/register`

Required UI:

```txt
Name
Email
Password
Confirm password
Phone optional
Submit button
Login link
```

Validation:

```txt
- Name required
- Email valid
- Password minimum 8 chars
- Confirm password must match
```

---

# 16. Admin Dashboard Pages

## 16.1 Admin Dashboard `/admin`

Purpose:

```txt
Give admin a quick overview of commerce operations.
```

KPI cards:

```txt
Total Revenue
Total Orders
Pending Payment
Processing Orders
Low Stock Variants
Total Products
```

Sections:

```txt
Recent orders
Best selling products optional
Revenue chart optional
Low stock alert table
```

Design rules:

```txt
- KPI cards compact.
- Use strong number hierarchy.
- Do not overdecorate chart area.
```

## 16.2 Product Management `/admin/products`

Purpose:

```txt
Manage product catalog.
```

Required UI:

```txt
Product table
Search product
Filter by category
Filter by status
Create product button
Row actions: View, Edit, Archive/Delete
```

Columns:

```txt
Product
Category
Starting Price
Variants
Stock Summary
Status
Updated At
Actions
```

## 16.3 Product Create/Edit `/admin/products/create`, `/admin/products/[id]/edit`

Purpose:

```txt
Create and update product content, images, and variants.
```

Product form fields:

```txt
Name
Slug
Category
Description
Base price
Status
Product images
```

Variant form fields:

```txt
SKU
Size
Color
Price
Stock
Weight
Status
```

Design rules:

```txt
- Split form into clear sections.
- Product basic info first.
- Images second.
- Variants in editable table/repeater.
- Avoid making a giant single form without grouping.
```

## 16.4 Inventory `/admin/inventory`

Purpose:

```txt
Monitor and update size/color stock.
```

Required UI:

```txt
Inventory table
Search SKU/product
Filter low stock
Filter out of stock
Stock adjustment action
Inventory log link or drawer
```

Columns:

```txt
SKU
Product
Size
Color
Current Stock
Stock Status
Last Updated
Action
```

Stock adjustment modal:

```txt
Current stock
Adjustment type: increase/decrease/set
Quantity
Reason/note
Confirm button
```

## 16.5 Admin Orders `/admin/orders`

Purpose:

```txt
Manage all customer orders.
```

Required UI:

```txt
Order table
Search order number/customer
Filter by order status
Filter by payment status
Filter by date
Row action: View detail
```

Columns:

```txt
Order Number
Customer
Total
Payment Status
Order Status
Created At
Actions
```

## 16.6 Admin Order Detail `/admin/orders/[id]`

Purpose:

```txt
Allow admin to inspect order and update operational status.
```

Required sections:

```txt
Order summary
Customer info
Payment info
Order items
Shipping address
Shipment info
Status timeline
Admin actions
```

Admin actions:

```txt
Update order status
Create shipment
Input tracking number
Cancel order if allowed
```

## 16.7 Payments `/admin/payments`

Purpose:

```txt
Monitor simulated payment records.
```

Required UI:

```txt
Payment table
Filter status
Filter method
Search payment code/order number
```

Columns:

```txt
Payment Code
Order Number
Customer
Method
Amount
Status
Paid At
Actions
```

## 16.8 Reports `/admin/reports`

Purpose:

```txt
Show basic operational reporting for portfolio value.
```

MVP report widgets:

```txt
Revenue summary
Order count by status
Top products
Low stock products
Payment status distribution
```

Design rules:

```txt
- Use simple charts only.
- Chart should support decisions, not decoration.
- Use Recharts only where useful.
```

---

# 17. Warehouse Pages

## 17.1 Warehouse Dashboard `/warehouse`

Purpose:

```txt
Show warehouse staff what needs to be processed.
```

KPI cards:

```txt
Ready to Process
Packed Today
Shipped Today
Low Stock Alerts
```

Main sections:

```txt
Orders needing packing
Recent shipments
Quick filters
```

## 17.2 Warehouse Orders `/warehouse/orders`

Purpose:

```txt
Process paid/processing orders.
```

Required UI:

```txt
Order queue table/list
Filter by status
View order detail
Mark as packed
Create shipment
```

Columns:

```txt
Order Number
Items Count
Customer
Status
Paid At
Action
```

## 17.3 Warehouse Order Detail `/warehouse/orders/[id]`

Required sections:

```txt
Order items pick list
Variant details: SKU, size, color, quantity
Customer shipment address
Packing checklist
Shipment form
Status action
```

Packing checklist example:

```txt
Items picked
Size verified
Color verified
Package sealed
Label attached
```

## 17.4 Shipments `/warehouse/shipments`

Purpose:

```txt
Manage shipment status and tracking numbers.
```

Required UI:

```txt
Shipment table
Courier
Tracking number
Shipment status
Update status action
```

---

# 18. Form Design Standards

All forms should use:

```txt
React Hook Form
Zod validation
Clear labels
Inline error messages
Disabled submit while loading
Toast after success/error
```

## 18.1 Form Layout

```txt
Small form: single column
Medium form: two-column on desktop
Long admin form: grouped sections
Variant input: table/repeater style
```

## 18.2 Error Message Style

```txt
- Text color danger
- Font size 12px - 13px
- Direct and human-readable
```

Examples:

```txt
Name is required.
Please enter a valid email address.
Stock cannot be lower than 0.
Please select a size before adding to cart.
```

---

# 19. Empty State Standards

Every major data view must have empty state.

Examples:

```txt
Product list empty:
No products found.
Try changing your filters or search keyword.

Cart empty:
Your cart is empty.
Start adding footwear products to continue checkout.

Orders empty:
No orders yet.
Your completed checkout will appear here.

Admin products empty:
No products have been created.
Create your first footwear product.

Warehouse queue empty:
No orders need processing right now.
```

Empty state should include:

```txt
Icon
Title
Short description
CTA when useful
```

---

# 20. Error State Standards

Error state should be specific.

```txt
Network error:
We could not connect to the server. Please try again.

Unauthorized:
Your session has expired. Please login again.

Forbidden:
You do not have permission to access this page.

Not found:
The requested data could not be found.

Validation:
Show field-level errors.
```

Rules:

```txt
- Do not only rely on toast for page-level failure.
- Show retry button for fetch error.
- Keep error copy simple.
```

---

# 21. Loading State Standards

Use skeleton for:

```txt
Product grid
Product detail
Order detail
Dashboard KPI
Table rows
```

Use button loading for:

```txt
Login
Register
Add to cart
Place order
Simulate payment
Save product
Update stock
Update shipment
```

Avoid full-page spinner unless absolutely necessary.

---

# 22. Interaction Rules

## 22.1 Add to Cart

```txt
- User must select size and color first.
- Disabled variants cannot be selected.
- Show toast after success.
- Cart count updates immediately after successful API response.
```

## 22.2 Checkout

```txt
- Validate address before moving forward.
- Show order summary throughout the flow.
- Disable submit while creating order.
- Redirect to payment page after order created.
```

## 22.3 Simulated Payment

```txt
- Show confirmation before marking payment success.
- On success, redirect or update order detail.
- Show order status PROCESSING after successful payment.
```

## 22.4 Admin Product Save

```txt
- Validate required fields.
- Prevent duplicate empty variants.
- Show image upload progress if implemented.
- After save, redirect to product detail/edit or table.
```

## 22.5 Stock Adjustment

```txt
- Show current stock.
- Require reason/note.
- Confirm before decreasing stock.
- Refresh inventory table after success.
```

## 22.6 Warehouse Shipment

```txt
- Require courier and tracking number.
- Marking shipped should be explicit.
- Shipment status update must show success toast and refresh order.
```

---

# 23. Navigation Rules

## 23.1 Storefront Nav

```txt
Logo -> Home
Products -> /products
Cart -> /cart
Account -> Login/Profile/Orders
```

## 23.2 Admin Nav

```txt
Dashboard -> /admin
Products -> /admin/products
Inventory -> /admin/inventory
Orders -> /admin/orders
Payments -> /admin/payments
Reports -> /admin/reports
```

## 23.3 Warehouse Nav

```txt
Dashboard -> /warehouse
Orders -> /warehouse/orders
Shipments -> /warehouse/shipments
Stock Alerts optional -> /warehouse/stock-alerts
```

## 23.4 Role Redirect

```txt
CUSTOMER after login -> /
ADMIN after login -> /admin
WAREHOUSE after login -> /warehouse
SUPER_ADMIN after login -> /admin
```

---

# 24. Data Display Rules

## 24.1 Currency

Use Indonesian Rupiah format:

```txt
Rp799.000
Rp1.250.000
```

## 24.2 Dates

Use readable date format:

```txt
03 Jun 2026
03 Jun 2026, 14:30
```

## 24.3 Product Variant Display

Format:

```txt
Black / Size 42
SKU: RUN-BLK-42
```

## 24.4 Order Number Display

Format:

```txt
ORD-2026-0001
```

## 24.5 Payment Code Display

Format:

```txt
PAY-2026-0001
```

---

# 25. Accessibility Requirements

```txt
- All buttons must have accessible labels.
- Product image must have alt text.
- Form fields must have labels.
- Color must not be the only status indicator.
- Badge text must explain status.
- Keyboard navigation must work for forms and dialogs.
- Focus state must be visible.
- Table actions must be reachable by keyboard.
```

---

# 26. SEO Requirements for Customer Side

SEO matters for storefront pages.

```txt
Homepage:
- Title
- Description
- Open Graph image optional

Product listing:
- Title and description

Product detail:
- Dynamic product title
- Dynamic product description
- Product image alt
- Clean slug
```

Admin and warehouse pages do not need SEO indexing.

---

# 27. Animation Rules

Use subtle animation only.

Allowed:

```txt
- Button hover
- Card hover slight lift/border change
- Drawer open/close
- Modal fade/scale
- Skeleton loading
```

Avoid:

```txt
- Long entrance animation
- Heavy parallax
- Animated background blobs
- Excessive hover transforms on dashboard
```

---

# 28. Page Acceptance Checklist

## Customer

```txt
[ ] Homepage looks like footwear commerce, not company profile.
[ ] Product listing supports search, filter, sort.
[ ] Product cards show image, price, size/color/stock information.
[ ] Product detail has variant selector and stock-aware add to cart.
[ ] Cart clearly shows selected variants and total.
[ ] Checkout has address, shipping, payment, and review steps.
[ ] Simulated payment page is clear and demo-safe.
[ ] Order detail has timeline and payment/shipping info.
```

## Admin

```txt
[ ] Admin dashboard has useful KPI cards.
[ ] Product table supports search/filter/action.
[ ] Product form supports images and variants.
[ ] Inventory table shows SKU, size, color, stock status.
[ ] Order table supports status/payment filters.
[ ] Order detail supports operational status updates.
[ ] Payment page shows simulated payment records.
[ ] Reports page shows basic operational insight.
```

## Warehouse

```txt
[ ] Warehouse dashboard focuses on orders to process.
[ ] Warehouse order detail shows pick list clearly.
[ ] Packing checklist is easy to use.
[ ] Shipment form requires courier and tracking number.
[ ] Shipment status is visible and updateable.
```

## General

```txt
[ ] No excessive card-in-card layout.
[ ] No heavy generic AI template style.
[ ] No overused gradients or shadows.
[ ] All forms have validation and loading state.
[ ] All major fetch states have loading, empty, and error UI.
[ ] UI is responsive for mobile and desktop.
[ ] Lucide Icons are used consistently.
```

---

# 29. MVP Design Boundary

The MVP design must include:

```txt
- Storefront homepage
- Product listing
- Product detail
- Cart
- Checkout
- Simulated payment
- Customer order list/detail
- Login/register
- Admin dashboard
- Admin product management
- Admin inventory management
- Admin order management
- Admin payment monitoring
- Warehouse dashboard
- Warehouse order processing
- Shipment management
```

Not required for MVP:

```txt
- Real payment gateway UI
- Real courier API UI
- Wishlist
- Product reviews
- Coupon system
- Return management
- Custom footwear builder
- Dark mode
- Multi-language
```

Future design phase can include:

```txt
- Return/refund workflow
- Coupon management
- Product review system
- Custom footwear request flow
- Invoice PDF preview
- Advanced analytics
- Customer service dashboard
```

---

# 30. Portfolio Presentation Notes

When presenting this project, describe the design like this:

```txt
The UI was designed as a full e-commerce operations platform for footwear products, not a simple online store. The customer side focuses on product discovery, variant selection, checkout, simulated payment, and order tracking. The admin side focuses on catalog management, size/color inventory, order lifecycle, payment records, and operational reporting. The warehouse side focuses on packing, shipment, and fulfillment tasks.
```

Key design strengths to mention:

```txt
- Footwear-specific product variant UX
- Inventory-aware product detail and cart behavior
- Checkout and simulated payment flow
- Role-based admin and warehouse dashboards
- Operational tables with status badges
- Clean design system without overdecorated UI
- Responsive layout for customer and internal users
```
