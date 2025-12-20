# 🤖 AI Email Automation Setup Guide

## Overview
Automated, AI-personalized email sequences for Urban Clay customers using Resend + OpenAI.

---

## 📧 Email Sequence

### **Automated Flow:**
```
Payment Success
    ↓
Day 0: Order Confirmation (AI-generated, personalized)
    ↓
Day 3: Thank You + Feedback Request
    ↓
Day 7: Follow-up + Design Consultation Offer
    ↓
Day 10: 10% Discount Offer (Limited Time)
```

---

## 🔧 Setup Instructions

### **Step 1: Get Resend API Key**

1. Go to https://resend.com
2. Sign up (free tier: 100 emails/day)
3. Verify your domain OR use `onboarding@resend.dev` for testing
4. Go to **API Keys** → **Create API Key**
5. Copy the key (starts with `re_`)

### **Step 2: Get OpenAI API Key**

1. Go to https://platform.openai.com
2. Sign up / Log in
3. Go to **API Keys** → **Create new secret key**
4. Copy the key (starts with `sk-`)
5. Add credits (minimum $5 for testing)

### **Step 3: Add to Environment Variables**

Add to your `.env.local`:

```env
# Email Automation
RESEND_API_KEY=re_your_key_here
OPENAI_API_KEY=sk-your_key_here

# Email sender (verify this domain in Resend)
EMAIL_FROM=orders@urbanclay.in
```

### **Step 4: Verify Domain (Production)**

For production emails:
1. Go to Resend Dashboard → **Domains**
2. Click **Add Domain**
3. Enter: `urbanclay.in`
4. Add DNS records (TXT, MX, CNAME)
5. Wait for verification (usually 5-10 minutes)

For testing, use: `onboarding@resend.dev`

---

## 💻 Integration with Payment Flow

### **Update CheckoutModal.tsx**

Add email automation after successful payment:

```typescript
import { scheduleEmailSequence } from '@/lib/email-automation';

// In handlePayment success handler:
handler: async function (response: any) {
    console.log('Payment successful:', response);
    setStep('success');
    
    // Send order confirmation to backend/WhatsApp
    sendOrderConfirmation(response.razorpay_payment_id);
    
    // NEW: Trigger AI email automation
    await scheduleEmailSequence({
        customerName: formData.name,
        customerEmail: formData.email,
        samples: sampleType === 'regular' ? box.map(s => s.name) : ['Curated Premium Collection'],
        orderAmount: currentPricing.price,
        paymentId: response.razorpay_payment_id
    });
}
```

---

## 🎨 What the AI Does

### **AI-Generated Emails Include:**

1. **Personalization**
   - Uses customer name
   - References specific samples ordered
   - Adapts tone based on email type

2. **Smart Content**
   - Warm, professional tone
   - Clear call-to-action
   - Premium brand voice
   - Helpful information

3. **Context-Aware**
   - Confirmation: Order details + what's next
   - Thank you: Gratitude + feedback request
   - Follow-up: Gentle nudge + consultation offer
   - Discount: Urgency + exclusive offer

---

## 📅 Scheduling Follow-up Emails

### **Option A: Vercel Cron Jobs (Recommended)**

Create `app/api/cron/send-emails/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { sendThankYouEmail, sendFollowUpEmail, sendDiscountEmail } from '@/lib/email-automation';

export async function GET(request: Request) {
    // Verify cron secret
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    // Get orders from database that need emails
    // This is pseudo-code - implement based on your database
    const ordersForThankYou = await getOrdersDelivered3DaysAgo();
    const ordersForFollowUp = await getOrdersDelivered7DaysAgo();
    const ordersForDiscount = await getOrdersDelivered10DaysAgo();

    // Send emails
    for (const order of ordersForThankYou) {
        await sendThankYouEmail({
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            samples: order.samples
        });
    }

    // ... similar for follow-up and discount

    return NextResponse.json({ success: true });
}
```

Add to `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/send-emails",
    "schedule": "0 9 * * *"
  }]
}
```

### **Option B: Inngest (Event-Driven)**

```bash
npm install inngest
```

More flexible, better for complex workflows.

---

## 💰 Cost Breakdown

### **Resend:**
- Free: 100 emails/day
- Pro: $20/month for 50,000 emails
- **Your need:** Free tier is enough initially

### **OpenAI:**
- GPT-4: ~$0.03 per email
- 100 emails = $3
- **Your need:** $10-20/month initially

### **Total:** ~$0-40/month depending on volume

---

## 🧪 Testing

### **Test Email Flow:**

```typescript
// In your terminal or test file
import { sendOrderConfirmation } from '@/lib/email-automation';

await sendOrderConfirmation({
    customerName: 'Test Customer',
    customerEmail: 'your-email@gmail.com',
    samples: ['Terracotta Classic', 'Rustic Red', 'Earthy Brown'],
    orderAmount: 999,
    paymentId: 'test_payment_123'
});
```

Check your inbox!

---

## 📊 Email Templates Generated by AI

### **Example: Order Confirmation**

```
Subject: Your Urban Clay Sample Order is Confirmed! 🎉

Hi [Customer Name],

Thank you for choosing Urban Clay! We're thrilled to send you our premium terracotta samples.

Your Order Details:
✓ 5 Premium Samples
✓ Order ID: #UC12345
✓ Delivery: 3-5 business days

What happens next?
1. We're carefully packaging your samples
2. You'll receive tracking details within 24 hours
3. Samples will arrive at your doorstep in 3-5 days

Have questions? Simply reply to this email or call us at +91 80800 81951.

We can't wait for you to experience the quality of Urban Clay!

Warm regards,
The Urban Clay Team
```

*Note: AI generates fresh, personalized content each time!*

---

## 🎯 Advanced Features (Optional)

### **1. A/B Testing**
Test different subject lines and content:

```typescript
const variant = Math.random() > 0.5 ? 'A' : 'B';
// Generate different prompts based on variant
```

### **2. Sentiment Analysis**
Analyze customer responses and adjust tone:

```typescript
const sentiment = await analyzeSentiment(customerReply);
if (sentiment === 'negative') {
    // Send apologetic, solution-focused email
}
```

### **3. Dynamic Product Recommendations**
AI suggests products based on samples ordered:

```typescript
const recommendations = await generateRecommendations(samples);
// Include in follow-up email
```

---

## 🚀 Going Live Checklist

- [ ] Resend account created
- [ ] Domain verified in Resend
- [ ] OpenAI API key added
- [ ] Environment variables set
- [ ] Test email sent successfully
- [ ] Integration with payment flow
- [ ] Cron jobs set up (for follow-ups)
- [ ] Monitor email deliverability
- [ ] Track open rates
- [ ] Optimize based on data

---

## 📈 Expected Results

### **Industry Benchmarks:**
- Open Rate: 20-30% (personalized emails)
- Click Rate: 3-5%
- Conversion Rate: 1-3%

### **With AI Personalization:**
- Open Rate: 30-40% ⬆️
- Click Rate: 5-8% ⬆️
- Conversion Rate: 3-5% ⬆️

### **ROI:**
- Cost: ~$20/month
- Revenue from 1 order: ₹50,000+
- Need just 1 conversion/month to break even!

---

## 🆘 Troubleshooting

### **Emails not sending?**
- Check API keys are correct
- Verify domain in Resend
- Check spam folder
- Review Resend logs

### **AI responses not good?**
- Adjust temperature (0.7 is balanced)
- Refine prompts
- Try GPT-3.5 for cost savings

### **High costs?**
- Use GPT-3.5 instead of GPT-4
- Cache common responses
- Reduce email frequency

---

## 💡 Pro Tips

1. **Personalize Beyond Name**
   - Reference specific samples
   - Mention project type if known
   - Adapt tone to customer segment

2. **Test Everything**
   - Send test emails to yourself
   - Check on mobile devices
   - Verify all links work

3. **Monitor Metrics**
   - Track open rates
   - Monitor unsubscribes
   - A/B test subject lines

4. **Stay Compliant**
   - Add unsubscribe link
   - Include physical address
   - Follow CAN-SPAM Act

---

**Ready to automate your customer communication with AI!** 🚀

For questions or issues, check:
- Resend Docs: https://resend.com/docs
- OpenAI Docs: https://platform.openai.com/docs
