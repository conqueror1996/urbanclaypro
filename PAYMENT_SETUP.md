# Payment Integration Setup

## Overview
The sample box now has two payment options:
1. **Regular Samples**: ₹999 for 5 user-selected samples
2. **Curated Collection**: ₹2,000 for expert-curated premium samples

## Setup Instructions

### 1. Razorpay Account Setup
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in
3. Navigate to Settings → API Keys
4. Generate Test Keys for development
5. Generate Live Keys for production

### 2. Environment Variables
Create a `.env.local` file in the project root:

```env
# Razorpay Test Keys (Development)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY

# For Production, use Live Keys:
# NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_YOUR_KEY_ID
# RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY
```

### 3. How It Works

#### User Flow:
1. User adds samples to box (up to 5)
2. Opens sample modal
3. Chooses between:
   - **Your Selection** (₹999) - requires 1-5 samples in box
   - **Curated Collection** (₹2,000) - no samples required
4. Fills shipping details
5. Proceeds to payment
6. Completes payment via Razorpay
7. Receives confirmation + WhatsApp notification sent to team

#### Payment Flow:
- Razorpay handles all payment processing
- Supports: UPI, Cards, Net Banking, Wallets
- Secure 3D authentication
- Automatic payment confirmation
- Order details sent to WhatsApp (918080081951)

### 4. Testing

#### Test Cards (Razorpay Test Mode):
- **Success**: 4111 1111 1111 1111
- **Failure**: 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

#### Test UPI:
- UPI ID: success@razorpay
- For failure: failure@razorpay

### 5. Features

✅ Two pricing tiers (Regular & Curated)
✅ Razorpay payment gateway integration
✅ Address collection & validation
✅ Payment confirmation
✅ WhatsApp notification to team
✅ Order tracking via payment ID
✅ Responsive design
✅ Premium UI/UX

### 6. Going Live

When ready for production:
1. Get KYC approved on Razorpay
2. Generate Live API keys
3. Update environment variables
4. Test with small amount
5. Enable live mode

### 7. Customization

To modify pricing, edit:
```tsx
// components/CheckoutModal.tsx
const pricing = {
    regular: { price: 999, label: '5 Samples', description: 'Your selected samples' },
    curated: { price: 2000, label: 'Curated Collection', description: 'Expert curated premium samples' }
};
```

### 8. Support

For Razorpay issues:
- Documentation: https://razorpay.com/docs/
- Support: support@razorpay.com

For implementation questions, check:
- `components/CheckoutModal.tsx` - Main checkout logic
- `components/SampleModal.tsx` - Payment options UI
- `components/GlobalSampleModal.tsx` - Modal orchestration
- `context/SampleContext.tsx` - Sample box state management
