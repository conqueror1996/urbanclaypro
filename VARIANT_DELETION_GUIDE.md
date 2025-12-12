# Variant Deletion Feature

## Overview
You can now delete individual variants from the dashboard, and they will be permanently removed from Sanity.

## How to Delete a Variant

### Step 1: Open the Dashboard
1. Navigate to `/dashboard/products`
2. Select a product from the left sidebar

### Step 2: Go to Sub-variants Tab
1. Click on the **"Sub-variants"** tab
2. You'll see all variants for the selected product

### Step 3: Edit the Variant
1. Click on any variant card to open the editor
2. The **Variant Editor** modal will appear

### Step 4: Delete the Variant
1. In the top-right corner of the modal, click the **trash icon** (🗑️)
2. A confirmation dialog will appear asking:
   > "Are you sure you want to delete [Variant Name]? This action cannot be undone."
3. Click **"Delete"** to confirm, or **"Cancel"** to abort

### Step 5: Confirmation
- The variant will be immediately removed from Sanity
- The dashboard will refresh automatically
- The variant will no longer appear in the product list or on the frontend

---

## Technical Implementation

### Files Modified:

1. **`app/api/products/manage/route.ts`**
   - Added `delete_variant` API action
   - Uses Sanity's `unset` method to remove variant by `_key`

2. **`components/admin/VariantEditor.tsx`**
   - Added `onDelete` prop to component interface
   - Added delete button in header
   - Added confirmation modal with AnimatePresence
   - Added `handleDelete` function

3. **`app/dashboard/products/page.tsx`**
   - Added `handleDeleteVariant` function
   - Passes `onDelete` prop to VariantEditor
   - Refreshes product list after deletion

---

## API Endpoint

### Delete Variant
**Action:** `delete_variant`

**Request:**
```json
{
  "action": "delete_variant",
  "data": {
    "productId": "product-id-here",
    "variantKey": "variant-key-here"
  }
}
```

**Response:**
```json
{
  "success": true
}
```

---

## Safety Features

✅ **Confirmation Dialog** - Users must confirm before deletion
✅ **Clear Warning** - Shows variant name and warns action is permanent
✅ **Immediate Feedback** - Dashboard refreshes to show updated state
✅ **Error Handling** - Shows alert if deletion fails
✅ **Sanity Sync** - Variant is permanently removed from Sanity database

---

## UI/UX Details

### Delete Button
- **Location**: Top-right corner of Variant Editor modal
- **Icon**: Trash can icon (🗑️)
- **Hover Effect**: Background turns red on hover
- **Color**: Gray by default, red on hover

### Confirmation Modal
- **Title**: "Delete Variant?"
- **Message**: Shows variant name and warning
- **Buttons**:
  - **Cancel** (gray) - Closes modal without deleting
  - **Delete** (red) - Confirms and deletes the variant

### After Deletion
- Modal closes automatically
- Dashboard refreshes
- Deleted variant no longer appears
- Product page updates (no longer shows in Available Finishes)

---

## Example Workflow

1. **Before**: Product has 5 variants
2. **Action**: Delete "Deep Red" variant
3. **Confirmation**: Click "Delete" in confirmation dialog
4. **Result**: Product now has 4 variants
5. **Frontend**: "Deep Red" no longer appears in Available Finishes

---

## Notes

- Deletion is **permanent** and cannot be undone
- The variant is removed from Sanity immediately
- All associated images remain in Sanity assets (not deleted)
- If this was the last variant in a family group, the family group effectively disappears
- The product itself is not affected, only the specific variant is removed

---

## Troubleshooting

**Q: Delete button doesn't appear**
- Make sure you're in the Variant Editor modal (click on a variant to edit it)
- Check that you're logged in to the dashboard

**Q: Deletion fails**
- Check browser console for errors
- Verify you're authenticated (check for `uc_admin_token` cookie)
- Ensure the variant still exists in Sanity

**Q: Variant still appears after deletion**
- Try refreshing the page (Cmd/Ctrl + R)
- Check if the API call succeeded (look for success message)
- Verify in Sanity Studio that the variant was actually removed
