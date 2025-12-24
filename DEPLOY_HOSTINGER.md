# Deploying to Hostinger (No Domain Setup)

Since you don't have a live domain name yet, you can set up a "staging" environment on Hostinger using a temporary domain configuration.

## 1. Create the Website in Hostinger
1.  Log in to your **Hostinger hPanel**.
2.  Go to **Websites** -> **Create or migrate a website**.
3.  Choose **"I don't have a domain"** (if available) OR select **"I will buy a domain later"** and enter a temporary name like `urbanclay-staging.com`.
    *   *Note: This domain won't work in a browser, but it allows Hostinger to create the container.*
4.  Select **"Empty Website"** (don't install WordPress).

## 2. Enable Node.js (For Shared/Cloud Hosting)
*If you are on a VPS, skip to the VPS section below.*
1.  In the dashboard for your new site, search for **Node.js**.
2.  Select **Node.js Version** (Recommended: 18 or 20).
3.  **Application Mode**: Production.
4.  **Application Root**: `/` (or leave default).
5.  Click **Save**.

## 3. Connect GitHub (Continuous Deployment)
1.  In the Dashboard, search for **Git**.
2.  **Repository**: Enter `conqueror1996/urbanclaypro`.
3.  **Branch**: `main`.
4.  **Deployment Method**: Leave as default (Webhook).
5.  Click **Create**.
    *   *Hostinger might ask you to add a Deploy Key to your GitHub repo. Follow the on-screen instructions to copy the key to GitHub > Settings > Deploy Keys.*

## 4. Install & Build
1.  Once connected, you might need to run the build commands manually the first time or configure the "Build Command" in Hostinger settings if available.
2.  If Hostinger doesn't auto-build Next.js:
    *   Go to **Files** -> **Web Terminal** (or SSH).
    *   Run: `npm install`
    *   Run: `npm run build`
    *   *Note: On cheaper plans, `npm run build` might fail due to memory. If so, build locally and upload the `.next` folder via FTP.*

## 5. View Your Site (Preview URL)
Since the domain `urbanclay-staging.com` isn't real:
1.  In the Dashboard sidebar, look for **Preview Website** or **Temporary URL**.
2.  It will look like: `http://domain-com.preview-domain.com`.
3.  Use this link to test your live application.

## Alternative: Build Locally & Upload (Most Reliable)
If the server fails to build:
1.  Run `npm run build` on your Mac.
2.  Use FileZilla (FTP) to upload the contents of your project (including `.next`, `public`, `node_modules` is not needed if you run `npm install` on server, but `.next` is critical).
3.  Or simpler: **GitHub Actions**.

### Using GitHub Actions (Automated)
If you prefer pushing to GitHub to auto-deploy:
1.  Get **FTP Details** from Hostinger (Dashboard > Files > FTP Accounts).
2.  Go to **GitHub Repo > Settings > Secrets**.
3.  Add `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`.
4.  The `.github/workflows/deploy.yml` file (if created) will handle the rest.
