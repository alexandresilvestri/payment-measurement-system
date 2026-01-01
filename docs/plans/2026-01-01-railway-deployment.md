# Railway Deployment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deploy both frontend (React/Vite) and backend (Express/PostgreSQL) on Railway platform

**Architecture:** Monorepo with two Railway services - one for the Express API server and one for the Vite static site, plus a PostgreSQL database. All services communicate within Railway's private network.

**Tech Stack:** Railway, PostgreSQL (Railway managed), Express.js, React/Vite, Docker (optional)

---

## Task 1: Prepare Backend for Production

**Files:**
- Modify: `backend/package.json`
- Create: `backend/.dockerignore`
- Modify: `backend/src/database/knexfile.ts`

**Step 1: Add production build scripts to backend**

Edit `backend/package.json` to ensure these scripts exist:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "railway:start": "npm run migrate:latest && npm run start"
  }
}
```

**Step 2: Create .dockerignore for backend**

Create `backend/.dockerignore`:

```
node_modules
dist
.env
.env.*
*.log
.git
.gitignore
.husky
.vscode
.prettierrc
.eslintrc.json
tsconfig.json
vitest.config.ts
```

**Step 3: Verify database configuration supports production**

Check `backend/src/database/knexfile.ts` has proper environment variable support. It should read from `process.env.DATABASE_URL` for Railway.

**Step 4: Test backend builds locally**

Run: `cd backend && npm run build`
Expected: `dist/` folder created with compiled JavaScript files

**Step 5: Commit backend preparation**

```bash
git add backend/package.json backend/.dockerignore
git commit -m "feat: prepare backend for railway deployment"
```

---

## Task 2: Prepare Frontend for Production

**Files:**
- Modify: `frontend/package.json`
- Create: `frontend/.dockerignore`
- Create: `frontend/railway.json` (Railway configuration)

**Step 1: Add static server dependency**

Edit `frontend/package.json`:

```json
{
  "dependencies": {
    "serve": "^14.2.1"
  },
  "scripts": {
    "railway:start": "serve -s dist -l 5173"
  }
}
```

**Step 2: Install serve package**

Run: `cd frontend && npm install`
Expected: `serve` added to package.json and installed

**Step 3: Create .dockerignore for frontend**

Create `frontend/.dockerignore`:

```
node_modules
dist
.env
.env.*
*.log
.git
.gitignore
.husky
.vscode
.prettierrc
.eslintrc.json
```

**Step 4: Test frontend builds locally**

Run: `cd frontend && npm run build`
Expected: `dist/` folder created with optimized production files

**Step 5: Test serving the build locally**

Run: `cd frontend && npx serve -s dist -l 5173`
Expected: Server starts on port 5173, app loads in browser

**Step 6: Commit frontend preparation**

```bash
git add frontend/package.json frontend/package-lock.json frontend/.dockerignore
git commit -m "feat: prepare frontend for railway deployment"
```

---

## Task 3: Create Railway Configuration Files

**Files:**
- Create: `backend/railway.json`
- Create: `frontend/railway.json`

**Step 1: Create backend Railway configuration**

Create `backend/railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run railway:start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Step 2: Create frontend Railway configuration**

Create `frontend/railway.json`:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run railway:start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Step 3: Commit Railway configuration**

```bash
git add backend/railway.json frontend/railway.json
git commit -m "feat: add railway configuration files"
```

---

## Task 4: Set Up Railway Account and Project

**Manual Steps - Follow in Railway Dashboard**

**Step 1: Create Railway account**

Action: Visit https://railway.app and sign up with GitHub
Expected: Account created and linked to GitHub

**Step 2: Create new Railway project**

Action: Click "New Project" in Railway dashboard
Expected: New empty project created

**Step 3: Name the project**

Action: Rename project to "conferir" or your preferred name
Expected: Project renamed in dashboard

**Step 4: Note project ID**

Action: Copy the project ID from URL (railway.app/project/{PROJECT_ID})
Expected: Project ID saved for reference

---

## Task 5: Deploy PostgreSQL Database

**Manual Steps - Railway Dashboard**

**Step 1: Add PostgreSQL to project**

Action: Click "+ New" → "Database" → "PostgreSQL"
Expected: PostgreSQL database provisioning starts

**Step 2: Wait for database to be ready**

Action: Watch deployment logs until database shows "Active"
Expected: PostgreSQL database running (takes ~1-2 minutes)

**Step 3: Copy DATABASE_URL**

Action: Go to PostgreSQL service → "Variables" tab → Copy `DATABASE_URL`
Expected: Connection string copied (format: `postgresql://user:pass@host:port/db`)

**Step 4: Verify database is accessible**

Action: Check "Deployments" tab shows "Success"
Expected: Green checkmark on latest deployment

---

## Task 6: Deploy Backend API Service

**Manual Steps - Railway Dashboard**

**Step 1: Add backend service to project**

Action: Click "+ New" → "GitHub Repo" → Select your repository
Expected: Repository connected to Railway

**Step 2: Configure service root directory**

Action: In service settings → "Root Directory" → Enter `backend`
Expected: Railway will build from backend folder only

**Step 3: Add environment variables for backend**

Action: Go to "Variables" tab, add these variables:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<generate-random-32-char-string>
JWT_REFRESH_SECRET=<generate-random-32-char-string>
JWT_ACCESS_EXPIRY=30m
JWT_REFRESH_EXPIRY=90d
FRONTEND_URL=${{frontend.url}}
```

Expected: All variables added (Railway auto-links DATABASE_URL from Postgres service)

**Step 4: Generate JWT secrets**

Run locally: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
Expected: Two different random strings for JWT_SECRET and JWT_REFRESH_SECRET
Action: Copy these to Railway environment variables

**Step 5: Deploy backend**

Action: Railway auto-deploys on variable save, or click "Deploy"
Expected: Build starts, watch logs for successful deployment

**Step 6: Verify backend deployment**

Action: Check deployment logs show "Server running on port 3000"
Expected: Service shows "Active" status

**Step 7: Copy backend URL**

Action: Go to "Settings" → "Networking" → Copy the generated URL
Expected: URL copied (format: `https://your-backend.railway.app`)

**Step 8: Test backend health**

Run: `curl https://your-backend.railway.app/api`
Expected: API responds (might be 404 but shouldn't be connection error)

---

## Task 7: Deploy Frontend Service

**Manual Steps - Railway Dashboard**

**Step 1: Add frontend service**

Action: Click "+ New" → "GitHub Repo" → Select same repository
Expected: Second service created from repository

**Step 2: Configure frontend root directory**

Action: In service settings → "Root Directory" → Enter `frontend`
Expected: Railway will build from frontend folder only

**Step 3: Add environment variables for frontend**

Action: Go to "Variables" tab, add:

```
VITE_API_URL=${{backend.url}}
NODE_ENV=production
```

Expected: Variables added (Railway auto-links backend.url)

**Step 4: Deploy frontend**

Action: Railway auto-deploys, or click "Deploy"
Expected: Build starts with `npm run build` then `npm run railway:start`

**Step 5: Verify frontend deployment**

Action: Check logs show "Serving static files from dist"
Expected: Service shows "Active" status

**Step 6: Copy frontend URL**

Action: Go to "Settings" → "Networking" → Copy generated URL
Expected: URL copied (format: `https://your-frontend.railway.app`)

**Step 7: Update backend FRONTEND_URL**

Action: Go back to backend service → Variables → Update `FRONTEND_URL` with the frontend URL you just copied
Expected: Backend redeploys with correct CORS origin

---

## Task 8: Configure Service Networking

**Manual Steps - Railway Dashboard**

**Step 1: Verify backend has public domain**

Action: Backend service → Settings → Networking → Check "Public Networking" is enabled
Expected: Public URL is accessible

**Step 2: Verify frontend has public domain**

Action: Frontend service → Settings → Networking → Check "Public Networking" is enabled
Expected: Public URL is accessible

**Step 3: Test frontend loads**

Action: Open frontend URL in browser
Expected: React app loads (might show errors if API not connected yet)

**Step 4: Check browser console for API calls**

Action: Open browser DevTools → Network tab → Reload page
Expected: API calls going to correct backend URL

---

## Task 9: Run Database Migrations

**Step 1: Access backend service shell**

Action: Railway dashboard → Backend service → "Deployments" → Latest deployment → Click "View Logs" → Click shell icon (or use Railway CLI)
Expected: Terminal access to backend container

**Alternative: Use Railway CLI**

Run locally:
```bash
npm install -g @railway/cli
railway login
railway link
railway run --service backend npm run migrate:latest
```

Expected: Migrations run successfully

**Step 2: Verify migrations ran**

Action: Check logs for migration success messages
Expected: "Batch 1 run: X migrations" message appears

**Step 3: Test database connection from backend**

Run in backend shell: `node -e "const db = require('./dist/database/db').default; db.raw('SELECT 1').then(() => console.log('DB OK'))"`
Expected: "DB OK" printed

---

## Task 10: Integration Testing

**Step 1: Test user registration endpoint**

Run:
```bash
curl -X POST https://your-backend.railway.app/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"Test","lastName":"User"}'
```

Expected: User created response (201) or validation error (400)

**Step 2: Test frontend-to-backend communication**

Action: Open frontend URL → Try to register/login
Expected: Forms submit successfully, data flows to backend

**Step 3: Check CORS is working**

Action: Open browser DevTools → Network tab → Make API request from frontend
Expected: No CORS errors in console

**Step 4: Verify environment variables loaded**

Action: Check backend logs for "Environment: production"
Expected: Backend running in production mode

**Step 5: Test error handling**

Action: Visit non-existent route on backend (e.g., `/api/nonexistent`)
Expected: Proper 404 JSON error response

---

## Task 11: Set Up Custom Domains (Optional)

**Manual Steps - Railway Dashboard**

**Step 1: Add custom domain to frontend**

Action: Frontend service → Settings → Networking → "Custom Domain" → Enter your domain
Expected: DNS instructions provided

**Step 2: Configure DNS records**

Action: In your domain registrar, add CNAME record pointing to Railway
Expected: DNS record added (can take up to 48 hours to propagate)

**Step 3: Add custom domain to backend**

Action: Backend service → Settings → Networking → "Custom Domain" → Enter api.yourdomain.com
Expected: DNS instructions for backend API subdomain

**Step 4: Update frontend environment variable**

Action: Frontend service → Variables → Update `VITE_API_URL` to `https://api.yourdomain.com`
Expected: Frontend redeploys and uses custom domain

**Step 5: Update backend CORS**

Action: Backend service → Variables → Update `FRONTEND_URL` to `https://yourdomain.com`
Expected: Backend allows requests from custom domain

**Step 6: Wait for SSL certificates**

Action: Railway automatically provisions SSL certificates
Expected: Both domains accessible via HTTPS (may take 5-10 minutes)

---

## Task 12: Set Up Deployment Automation

**Files:**
- Create: `.github/workflows/railway-deploy.yml` (optional, Railway auto-deploys on push)

**Step 1: Verify auto-deployment is enabled**

Action: Railway dashboard → Project Settings → Check "Auto Deploy" is ON
Expected: Changes to main branch auto-deploy

**Step 2: Configure deployment triggers**

Action: Each service → Settings → "Triggers" → Ensure "main" branch is configured
Expected: Push to main triggers deployment

**Step 3: Test auto-deployment**

Make a small change:
```bash
echo "# Deployed on Railway" >> README.md
git add README.md
git commit -m "test: verify railway auto-deployment"
git push origin main
```

Expected: Railway detects push and triggers new deployment

**Step 4: Monitor deployment**

Action: Watch Railway dashboard for new deployment starting
Expected: Both services redeploy automatically

**Step 5: Verify deployment succeeded**

Action: Check both services show "Active" with new deployment
Expected: Green status on both frontend and backend

---

## Task 13: Documentation and Cleanup

**Files:**
- Create: `docs/DEPLOYMENT.md`
- Modify: `README.md`

**Step 1: Create deployment documentation**

Create `docs/DEPLOYMENT.md`:

```markdown
# Deployment Guide

## Railway Deployment

This project is deployed on Railway with the following services:

### Services
- **Frontend**: [Your Frontend URL]
- **Backend API**: [Your Backend URL]
- **Database**: PostgreSQL (Railway managed)

### Environment Variables

#### Backend
- `DATABASE_URL`: Auto-provided by Railway Postgres
- `JWT_SECRET`: 32-char random string
- `JWT_REFRESH_SECRET`: 32-char random string
- `FRONTEND_URL`: Frontend Railway URL
- `NODE_ENV`: production

#### Frontend
- `VITE_API_URL`: Backend Railway URL
- `NODE_ENV`: production

### Deployment Process

Railway auto-deploys on push to `main` branch.

Manual deployment:
1. Push to GitHub
2. Railway detects changes
3. Builds and deploys automatically

### Database Migrations

Migrations run automatically on backend deployment via `railway:start` script.

Manual migration:
```bash
railway run --service backend npm run migrate:latest
```

### Accessing Services

- Frontend: https://your-frontend.railway.app
- Backend: https://your-backend.railway.app
- Database: Accessible via Railway dashboard

### Rollback

Railway dashboard → Service → Deployments → Select previous deployment → "Redeploy"
```

**Step 2: Update main README**

Add to `README.md`:

```markdown
## Deployment

This project is deployed on Railway. See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for details.

- **Live Frontend**: [Your URL]
- **API Endpoint**: [Your URL]
```

**Step 3: Commit documentation**

```bash
git add docs/DEPLOYMENT.md README.md
git commit -m "docs: add railway deployment documentation"
git push origin main
```

**Step 4: Verify final deployment**

Action: Check Railway redeploys with documentation changes
Expected: Services remain active and stable

---

## Task 14: Post-Deployment Verification

**Step 1: Full end-to-end test**

Action: Use the deployed frontend to:
1. Register a new user
2. Login
3. Create a work entry
4. List works
5. Update a work
6. Delete a work

Expected: All operations complete successfully

**Step 2: Check Railway metrics**

Action: Railway dashboard → Each service → "Metrics" tab
Expected: CPU, Memory, Network usage showing normal levels

**Step 3: Review deployment logs**

Action: Check logs for any warnings or errors
Expected: Clean logs with normal operation messages

**Step 4: Set up monitoring (optional)**

Action: Railway dashboard → Project → "Observability"
Expected: Can view request rates, error rates, response times

**Step 5: Document deployed URLs**

Action: Save all URLs in a secure location:
- Frontend URL
- Backend URL
- Database connection (from Railway only)

Expected: Team has access to deployment information

---

## Troubleshooting Guide

### Backend won't start
- Check environment variables are set correctly
- Verify DATABASE_URL is connected
- Check build logs for TypeScript errors
- Ensure migrations ran successfully

### Frontend can't connect to backend
- Verify VITE_API_URL points to correct backend URL
- Check backend CORS allows frontend URL
- Check browser console for CORS errors

### Database connection errors
- Verify DATABASE_URL format is correct
- Check PostgreSQL service is running
- Ensure migrations completed
- Check connection pooling settings in knexfile

### Builds failing
- Check Railway build logs
- Verify package.json scripts are correct
- Ensure all dependencies in package.json
- Check for missing environment variables

### Deployments taking too long
- Railway cold starts can take 30-60 seconds
- Check if services need more resources
- Review build cache settings

---

## Cost Estimation

**Railway Pricing:**
- $5/month in free credits
- After free credits: ~$5-20/month for small app
  - PostgreSQL: ~$5/month
  - Backend: ~$5/month (scales with usage)
  - Frontend: ~$3/month (static serving)

**Tips to reduce costs:**
- Use Railway's free tier efficiently
- Set resource limits on services
- Enable auto-sleep for development services
- Monitor usage in Railway dashboard
