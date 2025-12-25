# Gmail SMTP Setup Guide (Easiest Option)

If you find Microsoft 365 too complex or expensive, you can use your **urbanclay.in@gmail.com** account to send the emails for free.

## Strategy
1.  **Sending**: We use your Gmail servers to send the mail.
2.  **Identity**: The email will come from "Urban Clay <urbanclay.in@gmail.com>".
3.  **Replies**: We have configured the system so when a client hits "Reply", it goes to `urbanclay@claytile.in`.

---

## Step 1: Get Gmail App Password (Required)
You cannot use your normal Gmail password. You need a special code.

1.  Go to your **Google Account Settings**.
2.  Search for **"App Passwords"** (Search bar at the top).
    *   *Note: You must have "2-Step Verification" enabled on your Google account for this option to appear.*
3.  Create a new App Password:
    *   **App name**: `UrbanClay Website`
4.  Copy the **16-character code** it gives you (e.g., `abcd efgh ijkl mnop`). This is your new `SMTP_PASS`.

## Step 2: Configure GoDaddy Forwarding (Optional but Recommended)
To make sure you receive replies sent to `urbanclay@claytile.in`:

1.  Login to **GoDaddy**.
2.  Go to **DNS Management** or **Email Forwarding** section for `claytile.in`.
3.  Add a Forwarding Address:
    *   **Forward**: `urbanclay@claytile.in`
    *   **To**: `urbanclay.in@gmail.com`

## Step 3: Update Vercel Variables
Go to Vercel Project Settings > Environment Variables and update these:

| Variable | Value |
| :--- | :--- |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | `urbanclay.in@gmail.com` |
| `SMTP_PASS` | `(The 16-character code from Step 1)` |

**Note**: For Gmail with Port 465, the system automatically handles the secure connection.

Once updated, **Redeploy** on Vercel.
