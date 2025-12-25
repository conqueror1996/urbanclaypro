# GoDaddy Deployment & Email Setup Guide

## Part 1: Connect `claytile.in` to Vercel (The Website)

1.  **In Vercel Dashboard:**
    *   Go to your `urbanclaypro` project.
    *   Click **Settings** -> **Domains**.
    *   Enter `claytile.in` and click **Add**.
    *   Vercel will give you two values to add to GoDaddy:
        *   **Type**: `A Record` | **Value**: `76.76.21.21`
        *   **Type**: `CNAME` | **Name**: `www` | **Value**: `cname.vercel-dns.com`

2.  **In GoDaddy Dashboard:**
    *   Go to **DNS Management** for `claytile.in`.
    *   Add (or update) these two records.
    *   *Note: If there are existing "Parked" records, delete them.*

---

## Part 2: Connect Email (`urbanclay@claytile.in`)

Since you bought the domain from GoDaddy, you likely have **Microsoft 365** (Outlook) as the email provider included (or purchased separately). We need to get the **SMTP Settings** so your website can send emails *as* you.

### Step A: Enable SMTP (Critical!)
GoDaddy/Microsoft blocks "sending via code" by default. You must enable "Authenticated SMTP".

1.  **Log in to GoDaddy**.
2.  Go to your **My Products** page.
3.  Scroll down to **Email & Office** and click **Manage All** (or "Manage" button next to your new email).
4.  In the Dashboard, look for a section called **"Users"** or **"Account Information"**.
5.  There should be a link that says **"Advanced Admin"** or **"Sign in to Microsoft Exchange"** or **"Microsoft 365 Admin Center"**.
    *   *Tip: It is usually a small link at the bottom or left sidebar.*
    *   *Direct Link Attempt (Try this if you are already logged in):* `https://admin.microsoft.com/` (If it redirects you to GoDaddy, use the link inside GoDaddy dashboard).

6.  Once in the **Microsoft 365 Admin Center**:
    *   Go to **Users** -> **Active Users**.
    *   Click on `urbanclay@claytile.in`.
    *   A side panel will open. Click the **Mail** tab.
    *   Click **Manage email apps**.
    *   **Check** the box for `Authenticated SMTP`.
    *   Click **Save changes**.

### Step B: Get Your Credentials
You will use your email password. If you have "2-Factor Authentication" (2FA) on, you **cannot** use your normal password. You must generate an **App Password**.
*   *Search "Create App Password Microsoft 365" if you have 2FA enabled.*

---

## Part 3: Update Vercel Environment Variables

Now tell Vercel to use these new details.

1.  Go to **Vercel** -> **Settings** -> **Environment Variables**.
2.  **Edit** (or Add) the following variables:

| Variable | Value (If using GoDaddy/Microsoft 365) |
| :--- | :--- |
| `SMTP_HOST` | `smtp.office365.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `urbanclay@claytile.in` |
| `SMTP_PASS` | *(Your Email Password or App Password)* |

3.  **Redeploy** your app (go to Deployments -> click the three dots -> Redeploy) for changes to take effect.

### Testing
Once redeployed, go to the **Operations Hub** -> **Complete a Site**. The email should now arrive in the client's inbox showing **From: Urban Clay <urbanclay@claytile.in>**.
