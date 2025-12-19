# 💳 Sample Payment Collection Guide

## Overview
You have **two payment collection methods** implemented:

### 1. **Paid Samples** (₹999 & ₹2,000) - Razorpay Integration
### 2. **Free Quote Request** - WhatsApp Lead Generation

---

## 🎯 How Payment Collection Works

### Option A: Paid Samples (Razorpay)

#### **Regular Samples - ₹999**
- User selects up to 5 samples
- Clicks "Your Selection" button
- Fills shipping details
- Pays ₹999 via Razorpay
- Payment confirmation sent to WhatsApp

#### **Curated Collection - ₹2,000**
- User clicks "Curated Collection" button
- Fills shipping details
- Pays ₹2,000 via Razorpay
- Payment confirmation sent to WhatsApp

#### **Payment Flow:**
```
User Clicks Payment Option
    ↓
CheckoutModal Opens
    ↓
User Fills Details (Name, Phone, Email, Address, City, Pincode)
    ↓
Clicks "Proceed to Payment"
    ↓
Razorpay Payment Gateway Opens
    ↓
User Completes Payment (UPI/Card/Net Banking/Wallet)
    ↓
Payment Success
    ↓
WhatsApp Message Sent to 918080081951 with:
  - Payment ID
  - Customer Details
  - Shipping Address
  - Sample Type
    ↓
Success Screen Shown to User
```

---

## 🔧 Setup Instructions

### Step 1: Create Razorpay Account
1. Go to https://razorpay.com
2. Sign up for business account
3. Complete KYC verification
4. Get approved (usually 24-48 hours)

### Step 2: Get API Keys

#### For Testing (Development):
1. Login to Razorpay Dashboard
2. Go to **Settings → API Keys**
3. Click **Generate Test Key**
4. Copy:
   - Key ID (starts with `rzp_test_`)
   - Key Secret

#### For Production (Live):
1. Complete KYC and get approved
2. Go to **Settings → API Keys**
3. Switch to **Live Mode**
4. Click **Generate Live Key**
5. Copy:
   - Key ID (starts with `rzp_live_`)
   - Key Secret

### Step 3: Add Keys to Environment

Create `.env.local` file in project root:

```env
# For Development/Testing
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_HERE

# For Production (uncomment when ready)
# NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_HERE
# RAZORPAY_KEY_SECRET=YOUR_SECRET_HERE
```

### Step 4: Test the Integration

#### Test Cards (Use in Test Mode):
- **Success**: `4111 1111 1111 1111`
- **Failure**: `4000 0000 0000 0002`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

#### Test UPI:
- **Success**: `success@razorpay`
- **Failure**: `failure@razorpay`

### Step 5: Go Live

1. ✅ Complete Razorpay KYC
2. ✅ Get approval
3. ✅ Generate Live API keys
4. ✅ Update `.env.local` with live keys
5. ✅ Test with small amount (₹1)
6. ✅ Deploy to production

---

## 💰 Payment Breakdown

### What Razorpay Charges:
- **Transaction Fee**: ~2% + GST
- **Settlement**: T+2 days (2 days after transaction)
- **No Setup Fee**: Free to start
- **No Annual Fee**: Pay only per transaction

### Example:
- Customer pays: ₹999
- Razorpay fee (2%): ₹19.98
- GST on fee (18%): ₹3.60
- **You receive**: ₹975.42

---

## 📱 WhatsApp Notifications

### What Gets Sent:
When payment succeeds, automatic WhatsApp message to **918080081951**:

```
*New Sample Order - PAID*

*Payment ID:* pay_xxxxxxxxxxxxx
*Type:* 5 Samples / Curated Collection
*Amount:* ₹999 / ₹2,000

*Customer Details:*
Name: John Doe
Phone: 9876543210
Email: john@example.com

*Shipping Address:*
123 Main Street
Mumbai, 400001

*Samples:*
1. Product Name 1
2. Product Name 2
...
```

---

## 🎨 User Experience

### Desktop Flow:
1. User browses products
2. Adds samples to box (max 5)
3. Opens sample modal
4. Sees two payment options:
   - **Your Selection** (₹999) - Shows selected samples
   - **Curated Collection** (₹2,000) - Premium badge
5. Clicks preferred option
6. Checkout modal opens
7. Fills shipping details
8. Clicks "Proceed to Payment"
9. Razorpay opens (overlay)
10. Completes payment
11. Success screen shown

### Mobile Flow:
- Same as desktop
- Optimized for mobile screens
- Touch-friendly buttons
- Responsive forms

---

## 🔒 Security Features

✅ **PCI DSS Compliant** (Razorpay handles card data)
✅ **3D Secure Authentication**
✅ **SSL Encrypted**
✅ **Fraud Detection** (Razorpay's AI)
✅ **No card data stored** on your server

---

## 📊 Order Management

### Current Setup:
- Payment confirmation → WhatsApp
- Manual order processing
- Track via Payment ID

### Recommended Additions:
1. **Order Dashboard** (Future enhancement)
   - View all paid orders
   - Filter by date/status
   - Export to Excel

2. **Email Confirmations** (Future enhancement)
   - Auto-send to customer
   - Include order details
   - Tracking information

3. **Inventory Tracking** (Future enhancement)
   - Track sample stock
   - Auto-alerts for low stock

---

## 🚀 Going Live Checklist

- [ ] Razorpay account created
- [ ] KYC completed and approved
- [ ] Test mode working perfectly
- [ ] Live API keys generated
- [ ] Environment variables updated
- [ ] Test transaction (₹1) successful
- [ ] WhatsApp notifications working
- [ ] Customer journey tested end-to-end
- [ ] Refund policy defined
- [ ] Terms & conditions updated
- [ ] Privacy policy updated
- [ ] Deploy to production

---

## 🆘 Troubleshooting

### Payment Not Working?
1. Check API keys are correct
2. Verify `.env.local` file exists
3. Restart dev server after adding keys
4. Check browser console for errors

### WhatsApp Not Sending?
1. Verify phone number format (918080081951)
2. Check if popup blocker is blocking
3. Test WhatsApp link manually

### Razorpay Modal Not Opening?
1. Check if script is loaded (Network tab)
2. Verify `window.Razorpay` exists
3. Check for JavaScript errors

---

## 📞 Support

### Razorpay Support:
- Email: support@razorpay.com
- Phone: 1800-120-020-020
- Docs: https://razorpay.com/docs/

### Implementation Support:
- Check `PAYMENT_SETUP.md`
- Review `components/CheckoutModal.tsx`
- Review `components/SampleModal.tsx`

---

## 💡 Pro Tips

1. **Start with Test Mode** - Perfect the flow before going live
2. **Monitor Transactions** - Check Razorpay dashboard daily
3. **Customer Communication** - Send manual confirmation initially
4. **Pricing Strategy** - ₹999 for 5 samples is competitive
5. **Upsell Curated** - Highlight premium value (₹2,000)
6. **Track Conversions** - Monitor which option performs better
7. **Seasonal Offers** - Consider discounts during festivals

---

## 🎯 Next Steps

1. **Immediate**: Set up Razorpay test account
2. **This Week**: Test payment flow thoroughly
3. **Next Week**: Complete KYC and go live
4. **Month 1**: Monitor and optimize
5. **Month 2**: Add order dashboard (optional)
6. **Month 3**: Implement email confirmations (optional)

---

**Ready to collect payments! 🚀**

For any questions, refer to:
- `PAYMENT_SETUP.md` - Technical setup
- `components/CheckoutModal.tsx` - Payment code
- `components/SampleModal.tsx` - UI code
