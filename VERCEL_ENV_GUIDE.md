# How to Configure Zoho Email in Vercel

Since `.env.local` files are not uploaded to the cloud for security, you must manually add your Zoho credentials to Vercel's secure vault for the live website to work.

## Step 1: Open Vercel Dashboard
1.  Go to [vercel.com/dashboard](https://vercel.com/dashboard).
2.  Select your project: **urbanclaypro**.
3.  Click on the **Settings** tab in the top navigation bar.
4.  Click on **Environment Variables** in the left sidebar.

## Step 2: Add/Update Variables
You need to ensure the following 4 variables are present and set to your Zoho details.

### If variables exist:
Click the **Edit** (pencil icon) next to each one and paste the new value.

### If variables do not exist:
Scroll down to "Add New" and add them one by one.

| Key | Value (for Zoho India) | Value (for Zoho Global) |
| :--- | :--- | :--- |
| `SMTP_HOST` | `smtp.zoho.in` | `smtp.zoho.com` |
| `SMTP_PORT` | `465` | `465` |
| `SMTP_USER` | `urbanclay@claytile.in` | `urbanclay@claytile.in` |
| `SMTP_PASS` | *(Your Zoho Password / App Password)* | *(Same)* |

*Tip: Make sure to uncheck "Automatically expose system environment variables" if you see it, just stick to adding these 4 explicitly.*

## Step 3: Redeploy (Vital!)
Changing variables does **NOT** update the live site immediately. You must trigger a redeploy.

1.  Go to the **Deployments** tab (top bar).
2.  Find your latest deployment (the top one).
3.  Click the **three dots** (⋮) on the right side.
4.  Select **Redeploy**.
5.  Click **Redeploy** again in the confirmation modal.

Wait for the build to finish (about 2 minutes). Once the status is "Ready", your live site will be sending emails via Zoho!
