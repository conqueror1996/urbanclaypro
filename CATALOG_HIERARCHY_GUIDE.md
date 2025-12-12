# Catalog Hierarchy Update

## Overview
The dashboard now follows a clear hierarchical structure: **Category → Series → Variant**

## New Structure

### Before:
```
Category
  └─ Product (flat list)
```

### After:
```
Category
  └─ Series (Product/Range)
      └─ Variants (shown when series is selected)
```

---

## Visual Hierarchy

### Example:

```
📦 BRICK WALL TILES (Category)
   │
   ├─ 🧱 Handmade Brick Series
   │   ├─ Deep Rustic Red [Red Series]
   │   ├─ Light Rustic Red [Red Series]
   │   └─ Charcoal Smoky [Smoky Collection]
   │
   └─ 🧱 Wirecut Brick Series
       ├─ Medium Rustic Red [Red Series]
       └─ Dark Smoky [Smoky Collection]

📦 EXPOSED BRICKS (Category)
   │
   └─ 🧱 Classic Exposed Series
       ├─ Natural Clay
       └─ Burnt Orange
```

---

## Features

### 1. **Category Level**
- Top-level grouping
- Shows all series within the category
- Displayed with uppercase text and bullet point

### 2. **Series Level** (Product/Range)
- Shows product title
- Displays variant count: "Series • X variants"
- Clickable to select and edit
- Shows main product image
- Highlighted when selected (orange border)

### 3. **Variant Level**
- Only shown when parent series is selected
- Nested under the selected series
- Shows variant thumbnail (6x6)
- Displays variant name
- Shows family group badge (if set)
- Hover effect for better UX

---

## UI Details

### Series Card:
```
┌─────────────────────────────────────┐
│ [IMG] Handmade Brick Series      → │
│       Series • 5 variants           │
└─────────────────────────────────────┘
```

### Variants (when series selected):
```
┌─────────────────────────────────────┐
│ [IMG] Handmade Brick Series      → │ ← Selected (orange)
│       Series • 3 variants           │
│   ├─────────────────────────────┐   │
│   │ [🖼] Deep Rustic Red  [Red Series] │
│   │ [🖼] Light Rustic Red [Red Series] │
│   │ [🖼] Charcoal Smoky   [Smoky]      │
│   └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## Family Group Badges

Variants with family groups show a purple badge:

```
[🖼] Deep Rustic Red  [Red Series]
                      ↑ Purple badge
```

**Badge Styling:**
- Background: Purple (bg-purple-100)
- Text: Dark purple (text-purple-600)
- Size: Extra small (text-[9px])
- Shape: Rounded pill
- Font: Bold

---

## Interaction Flow

1. **View Categories**: See all categories in the hierarchy
2. **Click Series**: Select a product/series to edit
3. **View Variants**: Variants automatically expand below the selected series
4. **Edit Series**: Click series card to open editor on the right
5. **Manage Variants**: Use "Sub-variants" tab to add/edit/delete variants

---

## Technical Implementation

### Grouping Logic:
```typescript
const groupedProducts = products.reduce((acc, product) => {
  const cat = product.tag || product.category || 'Uncategorized';
  if (!acc[cat]) acc[cat] = [];
  acc[cat].push(product);
  return acc;
}, {});
```

### Hierarchy Rendering:
1. **Category**: Map over grouped products
2. **Series**: Map over items in each category
3. **Variants**: Conditionally render when series is selected

---

## Benefits

✅ **Clear Structure** - Easy to understand hierarchy
✅ **Visual Grouping** - See how products are organized
✅ **Variant Preview** - Quick view of all variants in a series
✅ **Family Visibility** - Family groups are clearly labeled
✅ **Better Navigation** - Easier to find and manage products
✅ **Scalable** - Works well with many products and variants

---

## File Modified

📄 **`app/dashboard/products/page.tsx`**
- Updated catalog hierarchy display
- Added variant expansion when series is selected
- Added family group badges
- Updated subtitle: "Category → Series → Variant"

---

## Usage Tips

- **Select a series** to see all its variants
- **Family badges** help identify which variants belong together
- **Variant count** shows how many variants each series has
- **Hover effects** provide visual feedback
- Click on a series to edit it in the right panel
