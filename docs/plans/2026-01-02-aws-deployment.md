# AWS Deployment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Deploy fullstack app (React/Vite frontend + Express/PostgreSQL backend) on AWS using managed services

**Architecture:**
- Frontend: AWS Amplify (automated S3 + CloudFront)
- Backend: Elastic Beanstalk (managed EC2 + Load Balancer + Auto Scaling)
- Database: RDS PostgreSQL (managed database)
- Deployment: GitHub Actions CI/CD (automated deployments, no manual ZIP files)
- All services in same VPC for security

**Tech Stack:** AWS (Amplify, Elastic Beanstalk, RDS), PostgreSQL, Express.js, React/Vite, GitHub Actions

---

## Prerequisites Checklist

Before starting, ensure you have:
- [ ] AWS account created (free tier eligible)
- [ ] Credit card added to AWS account (required even for free tier)
- [ ] AWS CLI installed locally
- [ ] GitHub repository access

---

## Task 1: Set Up AWS Account and CLI

**Manual Steps**

**Step 1: Create AWS account**

Action: Visit https://aws.amazon.com and click "Create an AWS Account"
Expected: Account creation page loads

**Step 2: Complete account setup**

Action: Fill in email, password, account name, contact info, credit card
Expected: Account created, verification email received

**Step 3: Verify email and phone**

Action: Click verification link in email, enter phone verification code
Expected: Account fully verified

**Step 4: Sign in to AWS Console**

Action: Visit https://console.aws.amazon.com and sign in
Expected: AWS Management Console dashboard loads

**Step 5: Install AWS CLI**

Run locally:
```bash
# For Linux/WSL
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify installation
aws --version
```

Expected: AWS CLI version 2.x.x displayed

**Step 6: Create IAM user for CLI access**

Action: AWS Console → IAM → Users → "Create user"
- Username: `deployer-cli`
- Access type: [x] "Access key - Programmatic access"
- Permissions: "Attach existing policies directly" → Select `AdministratorAccess`

Expected: User created with Access Key ID and Secret Access Key displayed

**Step 7: Save AWS credentials securely**

Action: Copy Access Key ID and Secret Access Key to password manager
Expected: Credentials saved (you won't see the secret again!)

**Step 8: Configure AWS CLI**

Run locally:
```bash
aws configure
```

Enter:
- AWS Access Key ID: [your key]
- AWS Secret Access Key: [your secret]
- Default region: `us-east-1` (or your preferred region)
- Default output format: `json`

Expected: Credentials saved to `~/.aws/credentials`

**Step 9: Verify AWS CLI works**

Run: `aws sts get-caller-identity`

Expected: JSON output with your account ID and user ARN

---

## Task 2: Prepare Backend for AWS Elastic Beanstalk

**Files:**
- Create: `backend/.ebignore`
- Create: `backend/.npmrc`
- Modify: `backend/package.json`
- Create: `backend/.platform/hooks/prebuild/01_install_deps.sh`

**Step 1: Create .ebignore file**

Create `backend/.ebignore`:

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
vitest.config.ts
src/**/*.test.ts
tsconfig.json
```

**Step 2: Update package.json scripts**

Edit `backend/package.json`, ensure these scripts exist:

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "postinstall": "npm run build"
  }
}
```

**Step 3: Create .npmrc for production builds**

Create `backend/.npmrc`:

```
# Force production mode
production=false
# Include dev dependencies for build
only=production
```

**Step 4: Create Elastic Beanstalk platform hooks directory**

Run:
```bash
mkdir -p backend/.platform/hooks/prebuild
```

Expected: Directory created

**Step 5: Create prebuild hook for TypeScript compilation**

Create `backend/.platform/hooks/prebuild/01_install_deps.sh`:

```bash
#!/bin/bash
cd /var/app/staging
npm install --include=dev
npm run build
```

**Step 6: Make hook executable**

Run:
```bash
chmod +x backend/.platform/hooks/prebuild/01_install_deps.sh
```

Expected: File is executable

**Step 7: Test backend builds locally**

Run:
```bash
cd backend
npm install
npm run build
npm start
```

Expected: Server starts on port 3000 (ctrl+c to stop)

**Step 8: Commit backend AWS preparation**

```bash
git add backend/.ebignore backend/.npmrc backend/.platform backend/package.json
git commit -m "feat: prepare backend for aws elastic beanstalk"
```

---

## Task 3: Create RDS PostgreSQL Database

**Manual Steps - AWS Console**

**Step 1: Navigate to RDS**

Action: AWS Console → Search "RDS" → Click "RDS"
Expected: RDS Dashboard loads

**Step 2: Create database**

Action: Click "Create database"
Expected: Database creation wizard loads

**Step 3: Choose database creation method**

Action: Select "Standard create"
Expected: More options appear

**Step 4: Select engine**

Action:
- Engine type: PostgreSQL
- Engine version: PostgreSQL 16.x (latest)
Expected: PostgreSQL selected

**Step 5: Choose template**

Action: Select "Free tier" (if eligible) or "Dev/Test"
Expected: Template selected, some options auto-configured

**Step 6: Configure database settings**

Action: Enter:
- DB instance identifier: `conferir-db`
- Master username: `postgres`
- Master password: [create strong password, save it!]
- Confirm password: [same password]

Expected: Database identity configured

**Step 7: Configure instance size**

Action:
- DB instance class: `db.t3.micro` (free tier) or `db.t4g.micro`
- Storage type: General Purpose SSD (gp3)
- Allocated storage: 20 GB

Expected: Instance size configured

**Step 8: Configure connectivity**

Action:
- Virtual private cloud (VPC): [default VPC]
- Public access: **Yes** (for now, to allow connections)
- VPC security group: Create new → Name: `conferir-db-sg`
- Availability Zone: No preference

Expected: Network settings configured

**Step 9: Configure database authentication**

Action:
- Database authentication: Password authentication

Expected: Auth method selected

**Step 10: Configure additional settings**

Action:
- Initial database name: `conferir`
- Enable automated backups: Yes (default)
- Backup retention: 7 days
- Enable encryption: Yes (default)

Expected: Additional settings configured

**Step 11: Review and create**

Action: Scroll down → Click "Create database"
Expected: Database creation starts (takes 5-10 minutes)

**Step 12: Wait for database to be available**

Action: RDS Dashboard → Databases → Wait for `conferir-db` status to show "Available"
Expected: Status changes from "Creating" → "Available" (check every 2 minutes)

**Step 13: Get database endpoint**

Action: Click on `conferir-db` → Copy "Endpoint" value
Expected: Endpoint like `conferir-db.xxxxx.us-east-1.rds.amazonaws.com`

**Step 14: Construct DATABASE_URL**

Format:
```
postgresql://postgres:[YOUR_PASSWORD]@[ENDPOINT]:5432/conferir
```

Example:
```
postgresql://postgres:MySecurePass123@conferir-db.abc123.us-east-1.rds.amazonaws.com:5432/conferir
```

**Step 15: Save DATABASE_URL securely**

Action: Save this URL in password manager or secure notes
Expected: URL saved for next steps

**Step 16: Test database connection (optional)**

If you have `psql` installed locally:
```bash
psql "postgresql://postgres:[PASSWORD]@[ENDPOINT]:5432/conferir"
```

Expected: Connection succeeds, psql prompt appears
(Type `\q` to exit)

---

## Task 4: Create Elastic Beanstalk Application (Empty)

**Manual Steps - AWS Console**

**Step 1: Navigate to Elastic Beanstalk**

Action: AWS Console → Search "Elastic Beanstalk" → Click
Expected: Elastic Beanstalk dashboard loads

**Step 2: Create application**

Action: Click "Create application"
Expected: Application creation wizard loads

**Step 3: Configure environment**

Action: Enter:
- Application name: `conferir-backend`
- Environment name: `conferir-backend-prod`
- Domain: [leave default or customize]

Expected: Environment details entered

**Step 4: Select platform**

Action:
- Platform: Node.js
- Platform branch: Node.js 20 running on 64bit Amazon Linux 2023 (or latest)
- Platform version: (recommended)

Expected: Node.js platform selected

**Step 5: Choose application code**

Action: Select "Sample application"
Expected: Sample application selected (we'll replace this with GitHub Actions deployment)

**Step 6: Configure service access**

Action:
- Service role: Create and use new service role
- EC2 instance profile: [if exists, select; if not, create new]

Expected: IAM roles configured (AWS creates them automatically)

**Step 7: Skip to review**

Action: Click "Skip to review"
Expected: Review page loads

**Step 8: Create environment**

Action: Click "Submit"
Expected: Environment creation starts (takes 5-10 minutes)

**Step 9: Wait for environment to be ready**

Action: Watch deployment progress in dashboard
Expected: Status changes to "Ok" with green checkmark (running sample app)

**Step 10: Copy environment URL**

Action: Copy the URL shown (like `conferir-backend-prod.us-east-1.elasticbeanstalk.com`)
Expected: URL copied (don't test yet - sample app is running)

---

## Task 5: Configure Backend Environment Variables

**Manual Steps - Elastic Beanstalk Console**

**Step 1: Navigate to environment configuration**

Action: Elastic Beanstalk → `conferir-backend-prod` → Configuration
Expected: Configuration page loads

**Step 2: Edit software configuration**

Action: Software category → Click "Edit"
Expected: Software settings page loads

**Step 3: Add environment properties**

Action: Scroll to "Environment properties" → Add these:

```
NODE_ENV = production
PORT = 8080
DATABASE_URL = [paste your RDS DATABASE_URL from Task 3]
JWT_SECRET = [generate 32-char random string]
JWT_REFRESH_SECRET = [generate different 32-char random string]
JWT_ACCESS_EXPIRY = 30m
JWT_REFRESH_EXPIRY = 90d
FRONTEND_URL = https://[will-add-later-after-frontend-deploy]
```

**Step 4: Generate JWT secrets**

Run locally:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Expected: Two different random hex strings
Action: Use first for JWT_SECRET, second for JWT_REFRESH_SECRET

**Step 5: Save configuration**

Action: Click "Apply"
Expected: Environment updates (takes 2-3 minutes)

**Step 6: Wait for update to complete**

Action: Watch environment status → Wait for "Ok"
Expected: Green checkmark returns

**Step 7: Check logs for errors**

Action: Elastic Beanstalk → Logs → Request Logs → "Last 100 Lines"
Expected: Logs download, check for errors

**Step 8: Test database connection**

The backend should try to connect on startup. Check logs for:
- [x] "Server running on port 8080"
- [x] "Database: conferir"
- [ ] Connection errors

Expected: Server running successfully

---

## Task 6: Set Up GitHub Actions for Automated Deployment

**Files:**
- Create: `.github/workflows/deploy-backend.yml`

**Step 1: Create GitHub Actions workflow**

Create `.github/workflows/deploy-backend.yml`:

```yaml
name: Deploy Backend to AWS EB

on:
  push:
    branches:
      - main
    paths:
      - 'backend/**'
  workflow_dispatch: # Allows manual trigger from GitHub UI

jobs:
  deploy:
    runs-on: ubuntu-latest

    defaults:
      run:
        working-directory: backend

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Generate deployment timestamp
        id: timestamp
        run: echo "time=$(date +%Y%m%d_%H%M%S)" >> $GITHUB_OUTPUT

      - name: Deploy to Elastic Beanstalk
        uses: einaregilsson/beanstalk-deploy@v22
        with:
          aws_access_key: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws_secret_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          application_name: conferir-backend
          environment_name: conferir-backend-prod
          version_label: ${{ github.sha }}-${{ steps.timestamp.outputs.time }}
          region: us-east-1
          deployment_package: backend
          use_existing_version_if_available: false
          wait_for_environment_recovery: 300
```

**Step 2: Add AWS credentials to GitHub Secrets**

Action:
- Go to GitHub repository → Settings → Secrets and variables → Actions
- Click "New repository secret"
- Add two secrets:
  - Name: `AWS_ACCESS_KEY_ID`, Value: [from Task 1]
  - Name: `AWS_SECRET_ACCESS_KEY`, Value: [from Task 1]

Expected: Secrets added securely

**Step 3: Commit and push GitHub Actions workflow**

Run:
```bash
git add .github/workflows/deploy-backend.yml
git commit -m "feat: add github actions workflow for aws deployment"
git push origin main
```

Expected: Workflow file pushed to GitHub

**Step 4: Trigger first deployment manually**

Action:
- Go to GitHub → Your repository → Actions tab
- Click on "Deploy Backend to AWS EB" workflow
- Click "Run workflow" button → Select branch "main" → Click "Run workflow"

Expected: Workflow starts running

**Step 5: Monitor deployment progress**

Action: Watch the workflow execution in GitHub Actions tab
Expected: All steps complete successfully (may take 5-10 minutes)

**Step 6: Verify deployment in AWS Console**

Action:
- Go to Elastic Beanstalk → `conferir-backend-prod`
- Check that application version matches GitHub commit SHA

Expected: New version deployed, environment status "Ok"

**Step 7: Test backend endpoint**

Run: `curl https://[YOUR-EB-URL]/api`

Expected: API responds (may show error if routes not set up yet, but should not be connection refused)

---

## Task 7: Update RDS Security Group for Backend Access

**Manual Steps - EC2 Console**

**Step 1: Find Elastic Beanstalk security group**

Action:
- AWS Console → EC2 → Security Groups
- Find security group with description "Security Group for ElasticBeanstalk environment"

Expected: EB security group found (note its ID like `sg-xxxxx`)

**Step 2: Edit RDS security group**

Action:
- EC2 → Security Groups → Find `conferir-db-sg`
- Click on it → "Inbound rules" tab → "Edit inbound rules"

Expected: Inbound rules editor opens

**Step 3: Add rule for Elastic Beanstalk access**

Action: Click "Add rule"
- Type: PostgreSQL
- Protocol: TCP
- Port: 5432
- Source: Custom → Select the EB security group from Step 1
- Description: "Allow EB backend access"

Expected: Rule added

**Step 4: Remove public access rule (optional security improvement)**

Action: If there's a rule with Source "0.0.0.0/0", delete it
Expected: Only EB security group has access

**Step 5: Save rules**

Action: Click "Save rules"
Expected: Rules saved, database now accessible from backend only

**Step 6: Test backend API again**

Run: `curl https://[YOUR-EB-URL]/api`

Expected: Should return 404 JSON (means API is working) or proper API response

---

## Task 8: Run Database Migrations on Elastic Beanstalk

**Step 1: Install EB CLI**

Run locally:
```bash
pip install awsebcli --upgrade --user
# Or with brew on Mac
# brew install awsebcli

eb --version
```

Expected: EB CLI version displayed

**Step 2: Initialize EB CLI in backend directory**

Run:
```bash
cd backend
eb init
```

Select:
- Region: [your region, e.g., us-east-1]
- Application: `conferir-backend`
- Setup SSH: No (for now)

Expected: `.elasticbeanstalk/config.yml` created

**Step 3: Set EB environment**

Run:
```bash
eb use conferir-backend-prod
```

Expected: Environment set

**Step 4: SSH into EB instance**

First, set up SSH:
```bash
eb ssh --setup
```

Select existing key pair or create new one

Then connect:
```bash
eb ssh
```

Expected: Connected to EC2 instance running your app

**Step 5: Navigate to application directory**

Run on EB instance:
```bash
cd /var/app/current
ls -la
```

Expected: See your application files

**Step 6: Run migrations**

Run on EB instance:
```bash
npm run migrate:latest
```

Expected: Migrations execute successfully

**Step 7: Verify migrations**

Run on EB instance:
```bash
npm run migrate:status
```

Expected: Shows all migrations as "up"

**Step 8: Exit SSH**

Run: `exit`

Expected: Back to local terminal

**Alternative: Create migration script for automated deployment**

Create `backend/.platform/hooks/postdeploy/01_migrate.sh`:

```bash
#!/bin/bash
cd /var/app/current
npm run migrate:latest
```

Make executable:
```bash
chmod +x backend/.platform/hooks/postdeploy/01_migrate.sh
```

Commit and redeploy:
```bash
git add backend/.platform/hooks/postdeploy/01_migrate.sh
git commit -m "feat: auto-run migrations on deployment"
eb deploy
```

---

## Task 9: Prepare and Deploy Frontend to AWS Amplify

**Files:**
- Create: `frontend/amplify.yml`
- Modify: `frontend/vite.config.ts`

**Step 1: Create Amplify build configuration**

Create `frontend/amplify.yml`:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

**Step 2: Update Vite config for production**

Edit `frontend/vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  server: {
    port: 5173,
  },
})
```

**Step 3: Test frontend build locally**

Run:
```bash
cd frontend
npm run build
```

Expected: `dist/` directory created with optimized files

**Step 4: Commit frontend AWS preparation**

```bash
git add frontend/amplify.yml frontend/vite.config.ts
git commit -m "feat: prepare frontend for aws amplify"
git push origin main
```

**Step 5: Navigate to AWS Amplify**

Action: AWS Console → Search "Amplify" → Click "AWS Amplify"
Expected: Amplify dashboard loads

**Step 6: Create new app**

Action: Click "New app" → "Host web app"
Expected: Source code provider selection appears

**Step 7: Connect GitHub repository**

Action:
- Select "GitHub"
- Click "Connect branch"
- Authorize AWS Amplify if prompted

Expected: GitHub authorization complete

**Step 8: Select repository and branch**

Action:
- Repository: Select `conferir` (or your repo name)
- Branch: `main`
- Monorepo: Check "Connecting a monorepo?"

Expected: Repository connected

**Step 9: Configure monorepo path**

Action:
- Root directory: Enter `frontend`

Expected: Amplify will build from frontend folder only

**Step 10: Configure build settings**

Action: Amplify auto-detects `amplify.yml`, verify it shows correct build commands
Expected: Build configuration detected

**Step 11: Configure app name**

Action:
- App name: `conferir-frontend`

Expected: App name set

**Step 12: Add environment variable**

Action: Advanced settings → Add environment variable:
- Key: `VITE_API_URL`
- Value: `https://[YOUR-EB-URL]` (backend URL from Task 4)

Expected: Environment variable added

**Step 13: Save and deploy**

Action: Click "Save and deploy"
Expected: Deployment starts (takes 5-10 minutes)

**Step 14: Monitor build progress**

Action: Watch "Provision" → "Build" → "Deploy" → "Verify" stages
Expected: All stages complete with green checkmarks

**Step 15: Copy Amplify app URL**

Action: Copy the generated URL (like `https://main.xxxxx.amplifyapp.com`)
Expected: URL copied

**Step 16: Test frontend**

Action: Open the Amplify URL in browser
Expected: React app loads

---

## Task 10: Update Backend CORS with Frontend URL

**Step 1: Update backend environment variables**

Action: Elastic Beanstalk → `conferir-backend-prod` → Configuration → Software → Edit

Update:
```
FRONTEND_URL = https://main.xxxxx.amplifyapp.com
```

Expected: Variable updated

**Step 2: Save and wait for deployment**

Action: Click "Apply"
Expected: Backend redeploys with updated CORS (2-3 minutes)

**Step 3: Test CORS from frontend**

Action: Open frontend → Open browser DevTools → Network tab → Try login/register
Expected: API calls succeed, no CORS errors

---

## Task 11: Set Up Custom Domain (Optional)

**For Frontend (Amplify)**

**Step 1: Add custom domain in Amplify**

Action: Amplify → App settings → Domain management → "Add domain"
Expected: Domain configuration wizard opens

**Step 2: Enter your domain**

Action: Enter domain name (e.g., `conferir.com`)
Expected: Amplify shows DNS configuration needed

**Step 3: Configure DNS records**

Action: In your domain registrar (Namecheap, GoDaddy, etc.):
- Add CNAME record provided by Amplify
- Or update nameservers if using Route 53

Expected: DNS records added

**Step 4: Wait for SSL certificate**

Action: Amplify automatically provisions SSL via ACM
Expected: Certificate issued (can take 5-30 minutes)

**Step 5: Verify domain is active**

Action: Visit `https://conferir.com`
Expected: Frontend loads with valid SSL

**For Backend (Elastic Beanstalk)**

**Step 1: Create domain in Route 53 or use existing**

Action: Route 53 → Hosted zones → Create hosted zone (or use existing)
Expected: Hosted zone created

**Step 2: Create CNAME record for API**

Action: Route 53 → Your hosted zone → Create record
- Record name: `api`
- Record type: CNAME
- Value: `[YOUR-EB-URL]`

Expected: DNS record created

**Step 3: Update backend FRONTEND_URL**

Action: Update EB environment variable to use custom domain
Expected: CORS updated

**Step 4: Update frontend VITE_API_URL**

Action: Amplify → Environment variables → Update `VITE_API_URL` to `https://api.conferir.com`
Expected: Frontend redeploys and uses custom API domain

---

## Task 12: Set Up CloudWatch Logging and Monitoring

**Step 1: Enable enhanced health reporting for backend**

Action: Elastic Beanstalk → Configuration → Monitoring → Edit
- Health reporting: Enhanced
- Health check path: `/api/health` (you'll need to add this endpoint)

Expected: Enhanced monitoring enabled

**Step 2: Create health check endpoint in backend**

Create `backend/src/routes/health.ts`:

```typescript
import { Router } from 'express'
import db from '../database/db'

const router = Router()

router.get('/health', async (_req, res) => {
  try {
    await db.raw('SELECT 1')
    res.status(200).json({ status: 'healthy', database: 'connected' })
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', database: 'disconnected' })
  }
})

export default router
```

Update `backend/src/routes/index.ts`:

```typescript
import { Router } from 'express'
import usersRoutes from './users'
import worksRoutes from './works'
import healthRoutes from './health'

const router = Router()

router.use('/', healthRoutes)
router.use('/users', usersRoutes)
router.use('/works', worksRoutes)

export default router
```

**Step 3: Deploy health check**

```bash
cd backend
git add .
git commit -m "feat: add health check endpoint"
eb deploy
```

Expected: Backend deploys with health check

**Step 4: Verify health check works**

Run: `curl https://[YOUR-EB-URL]/api/health`

Expected: `{"status":"healthy","database":"connected"}`

**Step 5: Set up CloudWatch alarms**

Action: AWS Console → CloudWatch → Alarms → Create alarm
- Metric: EB Environment Health
- Condition: Status is not OK for 2 datapoints
- Notification: Create SNS topic → Enter your email

Expected: Alarm created, confirmation email sent

**Step 6: View logs in CloudWatch**

Action:
- Elastic Beanstalk → Logs → "Request Logs" → "Last 100 Lines"
- Or: CloudWatch → Log groups → Find `/aws/elasticbeanstalk/conferir-backend-prod/`

Expected: Application logs visible

---

## Task 13: Production Optimization and Security

**Step 1: Enable EB auto-scaling**

Action: Elastic Beanstalk → Configuration → Capacity → Edit
- Environment type: Load balanced
- Min instances: 1
- Max instances: 4
- Scaling triggers: NetworkOut > 6000000 bytes

Expected: Auto-scaling configured

**Step 2: Enable RDS automated backups**

Action: RDS → `conferir-db` → Modify
- Backup retention: 7 days
- Backup window: Preferred time

Expected: Automated backups enabled

**Step 3: Enable RDS deletion protection**

Action: RDS → `conferir-db` → Modify
- Deletion protection: [x] Enable

Expected: Database protected from accidental deletion

**Step 4: Set up AWS Budget alerts**

Action: AWS Console → Billing → Budgets → Create budget
- Budget type: Cost budget
- Amount: $20/month (or your limit)
- Alert threshold: 80%
- Email notification: Your email

Expected: Budget created, will alert before overspending

**Step 5: Review IAM least privilege**

Action: IAM → Users → `deployer-cli` → Consider creating more restricted policy later
Expected: Note taken for future security hardening

**Step 6: Enable CloudFront compression (Amplify does this automatically)**

Action: Amplify → App settings → Verify "Gzip compression" is enabled
Expected: Compression enabled for faster load times

---

## Task 14: Documentation and Testing

**Files:**
- Create: `docs/AWS-DEPLOYMENT.md`
- Modify: `README.md`

**Step 1: Create AWS deployment documentation**

Create `docs/AWS-DEPLOYMENT.md`:

```markdown
# AWS Deployment Documentation

## Architecture

- **Frontend**: AWS Amplify (S3 + CloudFront)
- **Backend**: Elastic Beanstalk (EC2 + Load Balancer)
- **Database**: RDS PostgreSQL
- **Region**: us-east-1

## Live URLs

- **Frontend**: https://main.xxxxx.amplifyapp.com
- **Backend API**: https://conferir-backend-prod.us-east-1.elasticbeanstalk.com
- **Database**: conferir-db.xxxxx.us-east-1.rds.amazonaws.com (private)

## Environment Variables

### Backend (Elastic Beanstalk)
- `NODE_ENV`: production
- `PORT`: 8080
- `DATABASE_URL`: [from RDS]
- `JWT_SECRET`: [32-char random]
- `JWT_REFRESH_SECRET`: [32-char random]
- `FRONTEND_URL`: [Amplify URL]

### Frontend (Amplify)
- `VITE_API_URL`: [EB URL]

## Deployment Process

### Backend (Automated via GitHub Actions)
1. Push to `main` branch (changes in `backend/` directory)
2. GitHub Actions workflow triggers automatically
3. Runs linter and tests
4. Creates deployment package
5. Deploys to Elastic Beanstalk
6. EB runs post-deploy migration hook

**Manual trigger:**
- GitHub → Actions → "Deploy Backend to AWS EB" → "Run workflow"

### Frontend (Automated via Amplify)
1. Push to `main` branch (changes in `frontend/` directory)
2. Amplify detects changes automatically
3. Builds and deploys automatically

## Alternative: Manual Deployment via EB CLI

### Backend
```bash
cd backend
eb deploy
```

### Frontend
Push to GitHub, Amplify auto-deploys (no manual deployment needed)

## Database Migrations

Auto-run on deployment via `.platform/hooks/postdeploy/01_migrate.sh`

Manual:
```bash
eb ssh
cd /var/app/current
npm run migrate:latest
exit
```

## Monitoring

- **Backend Logs**: EB → Logs → Request Logs
- **Frontend Logs**: Amplify → Monitoring → Logs
- **Database**: RDS → Monitoring → CloudWatch metrics
- **Alarms**: CloudWatch → Alarms

## Rollback

### Backend
```bash
eb deploy --version [previous-version-label]
```

### Frontend
Amplify → App → Deployments → Previous deployment → "Redeploy"

## Costs

Estimated monthly cost: $15-30

- RDS db.t3.micro: ~$15/month
- Elastic Beanstalk (1 t3.micro): ~$8/month
- Amplify hosting: ~$0-5/month
- Data transfer: ~$1-2/month

## Security Notes

- Database is in private subnet (accessible only from EB)
- HTTPS enforced on all endpoints
- Secrets stored in environment variables
- IAM roles follow least privilege
- Deletion protection enabled on RDS

## Troubleshooting

### Backend won't start
1. Check EB logs: EB → Logs → Last 100 Lines
2. Verify environment variables are set
3. Check database connectivity
4. SSH into instance: `eb ssh` and debug

### Frontend can't reach backend
1. Check CORS settings in backend
2. Verify `VITE_API_URL` in Amplify env vars
3. Check browser console for errors
4. Verify EB environment is healthy

### Database connection fails
1. Verify DATABASE_URL is correct
2. Check RDS security group allows EB access
3. Verify RDS is in "Available" status
4. Test connection from EB: `eb ssh` → `psql $DATABASE_URL`
```

**Step 2: Update main README**

Edit `README.md`:

```markdown
## Deployment

This project is deployed on AWS.

- **Live App**: https://main.xxxxx.amplifyapp.com
- **API**: https://conferir-backend-prod.us-east-1.elasticbeanstalk.com

See [AWS-DEPLOYMENT.md](docs/AWS-DEPLOYMENT.md) for deployment details.
```

**Step 3: Commit documentation**

```bash
git add docs/AWS-DEPLOYMENT.md README.md
git commit -m "docs: add aws deployment documentation"
git push origin main
```

**Step 4: Full end-to-end production test**

Action: Using deployed frontend:
1. Register new user
2. Login
3. Create work entry
4. List works
5. Update work
6. Delete work
7. Logout

Expected: All operations succeed

**Step 5: Load test (optional)**

Run:
```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test backend
ab -n 100 -c 10 https://[YOUR-EB-URL]/api/health
```

Expected: All requests succeed, check response times

**Step 6: Security scan (optional)**

Run:
```bash
# Check frontend security headers
curl -I https://[YOUR-AMPLIFY-URL]

# Check backend security headers
curl -I https://[YOUR-EB-URL]/api
```

Expected: Security headers present (X-Frame-Options, etc.)

---

## Troubleshooting Guide

### Elastic Beanstalk Build Fails

**Symptom**: Deployment fails during build phase

**Solutions**:
1. Check EB logs: EB → Logs → Request full logs
2. Verify `package.json` has correct scripts
3. Ensure TypeScript compiles: `npm run build` locally
4. Check Node version matches EB platform
5. Verify all dependencies in `package.json`

### RDS Connection Timeout

**Symptom**: Backend can't connect to database

**Solutions**:
1. Verify DATABASE_URL is correct format
2. Check RDS security group allows EB security group
3. Verify RDS is in "Available" status
4. Test from EB: `eb ssh` then `nc -zv [RDS-ENDPOINT] 5432`

### Amplify Build Fails

**Symptom**: Frontend build fails in Amplify

**Solutions**:
1. Check Amplify build logs
2. Verify `amplify.yml` is correct
3. Test build locally: `npm run build`
4. Check environment variable `VITE_API_URL` is set
5. Verify Node version compatibility

### CORS Errors

**Symptom**: Frontend gets CORS errors when calling API

**Solutions**:
1. Verify `FRONTEND_URL` in EB environment variables
2. Check backend CORS configuration allows frontend domain
3. Ensure HTTPS is used (not HTTP)
4. Clear browser cache and retry

### High AWS Costs

**Symptom**: Bill higher than expected

**Solutions**:
1. Check Cost Explorer: Billing → Cost Explorer
2. Stop/delete unused resources
3. Use smaller instance sizes (db.t3.micro, t3.micro)
4. Enable auto-scaling to scale down when not in use
5. Delete old EB application versions
6. Review data transfer costs

---

## Post-Deployment Checklist

- [ ] Frontend loads without errors
- [ ] Backend health check returns 200
- [ ] Database migrations completed
- [ ] User registration works
- [ ] User login works
- [ ] CRUD operations work
- [ ] CORS configured correctly
- [ ] HTTPS enforced on all endpoints
- [ ] Environment variables set correctly
- [ ] CloudWatch alarms configured
- [ ] Automated backups enabled
- [ ] CI/CD pipeline working
- [ ] Documentation complete
- [ ] Budget alerts configured
- [ ] Team has access to AWS Console
- [ ] Monitoring dashboard set up

---

## Cost Optimization Tips

1. **Use Reserved Instances**: If running 24/7, reserve EB and RDS instances for 40% savings
2. **Schedule downtime**: For dev environments, schedule auto-shutdown nights/weekends
3. **Right-size instances**: Monitor usage, downgrade if underutilized
4. **Enable auto-scaling**: Scale down to 0 instances during low traffic (if acceptable)
5. **Use Spot Instances**: For non-critical workloads (not recommended for production DB)
6. **CloudFront caching**: Amplify uses this automatically, reduces data transfer costs
7. **Delete old resources**: Remove old EB versions, unused snapshots, etc.
8. **Use AWS Free Tier**: First 12 months get significant free tier benefits

---

## Next Steps After Deployment

1. **Set up monitoring alerts**: CloudWatch alarms for errors, high CPU, etc.
2. **Implement logging aggregation**: Consider AWS CloudWatch Insights
3. **Set up staging environment**: Create separate EB and RDS for testing
4. **Implement CI/CD testing**: Add integration tests to GitHub Actions
5. **Security hardening**: Regular security audits, update dependencies
6. **Performance optimization**: Monitor and optimize slow queries, add caching
7. **Backup testing**: Regularly test RDS restore procedures
8. **Documentation**: Keep deployment docs updated as architecture evolves
