# Deployment Guide: UrbanClay to Vercel

Yes, you can absolutely deploy this to your personal domain while keeping it connected to Sanity!

We recommend **Vercel** for deployment as it is built by the creators of Next.js and offers the smoothest integration.

## Prerequisites
1.  A [GitHub](https://github.com/) account.
2.  A [Vercel](https://vercel.com/) account.

---

## Step 1: Push Code to GitHub
If you haven't already, you need to push your code to a GitHub repository.

1.  Initialize Git (if not done):
    ```bash
    git init
    ```
2.  Add files and commit:
    ```bash
    git add .
    git commit -m "Ready for deployment"
    ```
3.  Create a new repository on GitHub.
4.  Link and push:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git push -u origin main
    ```

---

## Step 2: Deploy to Vercel
1.  Log in to your Vercel dashboard.
2.  Click **"Add New..."** -> **"Project"**.
3.  Select your GitHub repository (`urbanclaypro` or whatever you named it).
4.  Vercel will automatically detect that it is a **Next.js** project.

---

## Step 3: Configure Environment Variables (CRITICAL)
**Before** clicking "Deploy", you must add your environment variables so Vercel can talk to Sanity.

Expand the **"Environment Variables"** section and add the following (copy values from your local `.env.local` file):

| Key | Value (Copy from your .env.local) |
| :--- | :--- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `22qqjddz` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-11-28` |
| `SANITY_API_TOKEN` | *[Your long secret token starting with sk...]* |
| `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID` | `G-VP8Q5879ZD` |

*Note: Do not paste the secret token in public places. It is safe in Vercel's Environment Variables.*

Click **"Deploy"**. Vercel will build your site.

---

## Step 4: Configure Sanity CORS (CRITICAL)
Once deployed, your site might look broken or fail to load data. This is because Sanity blocks requests from unknown domains for security.

1.  Go to [https://www.sanity.io/manage](https://www.sanity.io/manage).
2.  Select your project (`UrbanClay` or similar).
3.  Go to **API** tab -> **CORS Origins**.
4.  Click **"Add CORS Origin"**.
5.  Add your Vercel deployment URL (e.g., `https://urbanclaypro.vercel.app`).
    *   Check **"Allow credentials"**.
6.  Click **Save**.

---

## Step 5: Connect Your Personal Domain
1.  In your Vercel Project Dashboard, go to **Settings** -> **Domains**.
2.  Enter your personal domain (e.g., `urbanclay.com`).
3.  Vercel will give you DNS records (A Record and CNAME) to add to your domain registrar (GoDaddy, Namecheap, etc.).
4.  Add these records in your registrar's dashboard.
5.  Once verified, Vercel will issue an SSL certificate automatically.

**Important:** Don't forget to add your new personal domain (e.g., `https://urbanclay.com`) to **Sanity CORS Origins** as well (Repeat Step 4)!

---

## Troubleshooting
*   **Images not loading?** Check if you added `NEXT_PUBLIC_SANITY_PROJECT_ID` correctly.
*   **"Network Error" or "Access Denied"?** You likely missed Step 4 (CORS Origins).
*   **Studio not working on production?** The Sanity Studio (`/studio`) runs inside your Next.js app. It should work automatically if env vars are set.
