# studyify.in Deployment Instructions

This document provides step-by-step instructions for deploying the studyify.in website to production.

## Prerequisites

Before proceeding with deployment, ensure you have:

1. Registered the domain studyify.in
2. Access to domain DNS settings
3. A Vercel account (for frontend deployment)
4. A VPS or cloud hosting account (for backend deployment)
5. A MongoDB Atlas account (for database)

## Frontend Deployment with Vercel

### Step 1: Prepare the Frontend Code

1. Ensure all environment variables are correctly set in `.env.production`
2. Verify all branding is updated to "studyify.in"
3. Test the build locally:
   ```
   cd frontend
   npm run build
   ```

### Step 2: Deploy to Vercel

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy the frontend:
   ```
   cd frontend
   vercel --prod
   ```

4. Configure custom domain in Vercel dashboard:
   - Go to Project Settings > Domains
   - Add domain: studyify.in
   - Add domain: www.studyify.in
   - Follow Vercel's instructions to verify domain ownership

### Step 3: Configure DNS for Frontend

1. Add the following DNS records in your domain registrar:
   - A Record: @ → Point to Vercel's IP address
   - CNAME Record: www → studyify.in.vercel.app

## Backend Deployment on VPS

### Step 1: Prepare the Server

1. SSH into your VPS:
   ```
   ssh username@your-server-ip
   ```

2. Update system packages:
   ```
   sudo apt update && sudo apt upgrade -y
   ```

3. Install required software:
   ```
   sudo apt install -y nodejs npm nginx certbot python3-certbot-nginx
   sudo npm install -g pm2
   ```

### Step 2: Set Up Nginx and SSL

1. Create Nginx configuration:
   ```
   sudo nano /etc/nginx/sites-available/api.studyify.in
   ```

2. Add the following configuration:
   ```
   server {
       listen 80;
       server_name api.studyify.in;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. Enable the site:
   ```
   sudo ln -s /etc/nginx/sites-available/api.studyify.in /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. Set up SSL:
   ```
   sudo certbot --nginx -d api.studyify.in
   ```

### Step 3: Deploy Backend Code

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/studyify.git /var/www/studyify
   ```

2. Install dependencies:
   ```
   cd /var/www/studyify/backend
   npm ci --production
   ```

3. Create environment file:
   ```
   nano .env.production
   ```
   Add the environment variables as configured in your local `.env.production` file.

4. Start the application with PM2:
   ```
   pm2 start src/index.js --name "studyify-backend"
   pm2 save
   pm2 startup
   ```

## Database Setup with MongoDB Atlas

### Step 1: Create MongoDB Atlas Cluster

1. Sign up or log in to MongoDB Atlas
2. Create a new project named "studyify"
3. Build a new cluster (free tier is sufficient to start)
4. Choose your preferred cloud provider and region

### Step 2: Configure Database Access

1. Create a database user:
   - Go to Database Access > Add New Database User
   - Username: studyify_admin
   - Password: [secure password]
   - User Privileges: Read and write to any database

2. Configure network access:
   - Go to Network Access > Add IP Address
   - Add your backend server IP address
   - Temporarily add your current IP for initial data import

### Step 3: Import Sample Data

1. Get your MongoDB connection string from Atlas dashboard
2. Update the connection string in your backend `.env.production` file
3. Import sample data:
   ```
   cd /var/www/studyify
   node scripts/import-data.js
   ```

## DNS Configuration

1. Configure API subdomain:
   - Create an A record: api.studyify.in → [Your VPS IP address]

2. Verify all DNS records are correctly set:
   - studyify.in → Vercel
   - www.studyify.in → Vercel
   - api.studyify.in → Your VPS IP

## Final Verification

1. Test frontend: https://studyify.in
2. Test backend API: https://api.studyify.in/health
3. Verify all functionality works correctly
4. Check mobile responsiveness
5. Test user authentication flow
6. Verify search functionality

## Monitoring Setup

1. Set up Uptime Robot for monitoring:
   - Add monitor for https://studyify.in
   - Add monitor for https://api.studyify.in/health

2. Configure PM2 monitoring:
   ```
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 7
   ```

## Backup Configuration

1. Set up database backups in MongoDB Atlas:
   - Go to Clusters > ... > Back Up
   - Configure scheduled backups

2. Set up server backups:
   ```
   sudo apt install -y duplicity
   ```
   Create a backup script and schedule it with cron.

## Congratulations!

Your studyify.in website is now fully deployed and ready for users!
