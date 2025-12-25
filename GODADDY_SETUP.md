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

**If you are using Titan Email:** You can skip this section! Titan enables SMTP by default. Just grab your password and jump to **Part 3**.

**If you are using Microsoft 365 (Outlook):** Follow the steps below.

### Step A: Enable SMTP (Critical for Microsoft 365)
GoDaddy/Microsoft blocks "sending via code" by default. You must enable "Authenticated SMTP".

1.  Log in to the **Microsoft 365 Admin Center** (using your `urbanclay@claytile.in` login).
    *   *Link is usually found in your GoDaddy Email Dashboard > "Advanced Admin".*
2.  Go to **Users** -> **Active Users**.
3.  Click on `urbanclay@claytile.in`.
4.  Click the **Mail** tab.
5.  Click **Manage email apps**.
6.  **Check** the box for `Authenticated SMTP`.
7.  Click **Save changes**.

### Step B: Get Your Credentials
You will use your email password. If you have "2-Factor Authentication" (2FA) on, you **cannot** use your normal password. You must generate an **App Password**.
*   *Search "Create App Password Microsoft 365" if you have 2FA enabled.*

---

## Part 3: Update Vercel Environment Variables

Now tell Vercel to use these new details.

1.  Go to **Vercel** -> **Settings** -> **Environment Variables**.
2.  **Edit** (or Add) the following variables:

| Variable | Value (If using **Titan Email**) | Value (If using Microsoft 365) |
| :--- | :--- | :--- |
| `SMTP_HOST` | `smtp.titan.email` | `smtp.office365.com` |
| `SMTP_PORT` | `465` | `587` |
| `SMTP_USER` | `urbanclay@claytile.in` | `urbanclay@claytile.in` |
| `SMTP_PASS` | *(Your Titan Password)* | *(Your Email/App Password)* |

3.  **Redeploy** your app (go to Deployments -> click the three dots -> Redeploy) for changes to take effect.

### Testing
Once redeployed, go to the **Operations Hub** -> **Complete a Site**. The email should now arrive in the client's inbox showing **From: Urban Clay <urbanclay@claytile.in>**.
