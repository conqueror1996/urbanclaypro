# Range/Collection Grouping Feature

## Overview
Products can now be grouped by **Range/Collection** to create a hierarchical organization:

**Category → Range → Series → Variants**

## Hierarchy Structure

### Example:

```
📦 BRICK WALL TILES (Category)
   │
   ├─ 🎨 Handmade Collection (Range)
   │   ├─ 🧱 Handmade Rustic Series
   │   │   ├─ Deep Red [Red Family]
   │   │   └─ Light Red [Red Family]
   │   └─ 🧱 Handmade Textured Series
   │       └─ Charcoal Smoky
   │
   ├─ 🎨 Wirecut Collection (Range)
   │   └─ 🧱 Wirecut Classic Series
   │       └─ Medium Red [Red Family]
   │
   └─ 🎨 Extruded Collection (Range)
       └─ 🧱 Extruded Smooth Series
           └─ Burnt Orange
```

---

## How to Use

### In Sanity Studio:

1. **Open a Product** in Sanity Studio
2. **Find the "Range/Collection" field** (after Category)
3. **Enter a range name** (e.g., "Handmade Collection")
4. **Save** the product

### In Dashboard:

1. **Go to** `/dashboard/products`
2. **Select a product** or create a new one
3. **Fill in the fields**:
   - **Series Name**: Individual product name (e.g., "Handmade Brick")
   - **Category**: Top-level category (e.g., "Brick Wall Tiles")
   - **Range/Collection**: Group name (e.g., "Handmade Collection")
4. **Save Changes**

---

## Dashboard Hierarchy View

The catalog hierarchy now shows:

```
BRICK WALL TILES
  ├─ Handmade Collection
  │   ├─ Handmade Rustic Series
  │   │   └─ Variants...
  │   └─ Handmade Textured Series
  │       └─ Variants...
  │
  └─ Wirecut Collection
      └─ Wirecut Classic Series
          └─ Variants...
```

### Visual Indicators:

- **Category** (Gray) - Top level
- **Range** (Blue) - Mid level grouping
- **Series** (White cards) - Individual products
- **Variants** (Orange nested) - Color/finish options

---

## Benefits

✅ **Better Organization** - Group related products together
✅ **Clearer Structure** - 4-level hierarchy (Category → Range → Series → Variant)
✅ **Flexible Grouping** - Create collections like "Handmade", "Wirecut", "Extruded"
✅ **Easy Navigation** - Find products faster in dashboard
✅ **Scalable** - Works with any number of ranges and products

---

## Use Cases

### 1. Manufacturing Process
- Handmade Collection
- Wirecut Collection
- Extruded Collection

### 2. Style/Aesthetic
- Rustic Collection
- Modern Collection
- Classic Collection

### 3. Performance
- Premium Range
- Standard Range
- Economy Range

### 4. Application
- Interior Collection
- Exterior Collection
- Specialty Range

---

## Technical Implementation

### Files Modified:

1. **`sanity/schemas/product.ts`**
   - Added `range` field (string, optional)
   - Placeholder: "e.g., Handmade Collection"

2. **`lib/products.ts`**
   - Added `range?: string` to Product interface
   - Added `range` to GROQ query

3. **`app/dashboard/products/page.tsx`**
   - Added Range/Collection input field
   - Updated grouping logic: `hierarchicalProducts`
   - Updated rendering to show 4-level hierarchy
   - Added range field to save operation

---

## Data Structure

### Sanity Schema:
```typescript
{
  name: 'range',
  title: 'Range/Collection',
  type: 'string',
  placeholder: 'e.g., Handmade Collection'
}
```

### TypeScript Interface:
```typescript
interface Product {
  // ... other fields
  range?: string;
}
```

### Grouping Logic:
```typescript
const hierarchicalProducts = products.reduce((acc, product) => {
  const category = product.tag || product.category?.title || 'Uncategorized';
  const range = product.range || 'Ungrouped';
  
  if (!acc[category]) acc[category] = {};
  if (!acc[category][range]) acc[category][range] = [];
  acc[category][range].push(product);
  
  return acc;
}, {});
```

---

## Dashboard UI

### Form Fields:

```
┌─────────────────────────────────────┐
│ Series Name                         │
│ [Handmade Brick____________]        │
│                                     │
│ Category         Range/Collection   │
│ [Brick Tiles▼]  [Handmade Coll...] │
│                                     │
│ Price Range Display                 │
│ [₹85 - ₹120 / sq.ft_______]        │
└─────────────────────────────────────┘
```

### Hierarchy View:

```
BRICK WALL TILES
  ├─ Handmade Collection
  │   ├─ [IMG] Handmade Rustic
  │   │        Series • 3 variants
  │   └─ [IMG] Handmade Textured
  │            Series • 2 variants
  │
  └─ Wirecut Collection
      └─ [IMG] Wirecut Classic
               Series • 4 variants
```

---

## Optional Field

The `range` field is **optional**:
- If **set**: Products are grouped by range
- If **empty**: Products go to "Ungrouped" range
- **Backward compatible**: Existing products without range still work

---

## Example Workflow

### Step 1: Create Ranges
Set up your range structure in Sanity or Dashboard:
- Handmade Collection
- Wirecut Collection
- Extruded Collection

### Step 2: Assign Products
For each product, set the range:
- "Handmade Rustic Brick" → "Handmade Collection"
- "Wirecut Smooth Brick" → "Wirecut Collection"
- "Extruded Modern Brick" → "Extruded Collection"

### Step 3: View Hierarchy
Open dashboard to see organized structure:
```
BRICK WALL TILES
  ├─ Handmade Collection (3 products)
  ├─ Wirecut Collection (2 products)
  └─ Extruded Collection (4 products)
```

---

## Notes

- Range names are **free-form text** (not a dropdown)
- Use **consistent naming** across products
- Products in the same range will be **grouped together**
- Empty range = "Ungrouped" (still functional)
- Range is **saved to Sanity** and persists across sessions

---

## Future Enhancements

Potential improvements:
- Make range a **reference field** (like category)
- Add range **descriptions** and **images**
- Create **range landing pages**
- Filter products by range on frontend
- Add range **metadata** (launch date, status, etc.)
