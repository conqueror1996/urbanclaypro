# Family Group Variants Feature

## Overview
Products can now have variants grouped by "family" which will automatically appear in the "Available Finishes" section on product pages.

## How It Works

### 1. **Setting Up Family Groups in Sanity CMS**

When creating or editing a product:

1. Go to the **Product Range** in Sanity Studio
2. Add or edit **Variants (Colors/Finishes)**
3. For each variant, you can optionally set a **Family Group** name
   - Example: "Rustic Red Series", "Smoky Collection", "Natural Tones"
4. All variants with the same family name will be grouped together

### 2. **What Happens on the Product Page**

**Scenario A: Product HAS Family Groups**
- The "Available Finishes" section will show ALL variants from the same family group(s)
- This includes variants from other products in the same category
- Section title: **"Available Finishes"**
- Example: If "Handmade Brick A" has variants in "Rustic Red Series", it will show all "Rustic Red Series" variants from all products

**Scenario B: Product has NO Family Groups**
- Falls back to showing related products from the same category
- Section title: **"More from [Category Name]"**
- This is the default behavior

### 3. **Example Use Case**

**Product: Handmade Brick Collection**
Variants:
- Deep Rustic Red (Family: "Rustic Red Series")
- Light Rustic Red (Family: "Rustic Red Series")
- Charcoal Smoky (Family: "Smoky Collection")

**Product: Wirecut Brick Collection**
Variants:
- Medium Rustic Red (Family: "Rustic Red Series")
- Dark Smoky (Family: "Smoky Collection")

**Result:**
When viewing "Handmade Brick Collection", the "Available Finishes" section will show:
- Deep Rustic Red (current product)
- Light Rustic Red (current product)
- Medium Rustic Red (from Wirecut Brick)
- Charcoal Smoky (current product)
- Dark Smoky (from Wirecut Brick)

All grouped by their family membership!

## Technical Implementation

### Files Modified:

1. **`lib/products.ts`**
   - Added `family` field to variant interface
   - Updated GROQ queries to fetch family data

2. **`app/products/[...slug]/page.tsx`**
   - Added logic to detect family groups
   - Filter and display variants from the same family
   - Dynamic section title based on content type

3. **`app/api/products/manage/route.ts`**
   - Added `family` field support in `add_variant` action
   - Added `family` field support in `update_variant` action

4. **`components/admin/VariantCreator.tsx`**
   - Already includes family field input
   - Passes family to API on save

5. **`components/admin/VariantEditor.tsx`**
   - Already includes family field input
   - Passes family to API on update

6. **`sanity/schemas/product.ts`**
   - Already had `family` field in variant schema

## Benefits

✅ **Better Product Discovery** - Customers can see all available finishes in a family
✅ **Cross-Product Variants** - Show variants from different products if they're in the same family
✅ **Flexible Organization** - Group variants however makes sense for your catalog
✅ **Automatic Fallback** - Still works for products without family groups
✅ **Dashboard Integration** - Full CRUD support in the frontend dashboard

## Usage Tips

- Use family groups for color series, texture collections, or finish types
- Keep family names consistent across products
- Leave family blank for standalone variants
- Family grouping works across all products in the same category
- Set family groups in both Sanity Studio and the frontend dashboard
