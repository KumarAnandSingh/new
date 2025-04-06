# studyify.in Deployment Guide

This document provides instructions for deploying the studyify.in platform to production.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Frontend Deployment](#frontend-deployment)
3. [Backend Deployment](#backend-deployment)
4. [Database Setup](#database-setup)
5. [Environment Variables](#environment-variables)
6. [CI/CD Pipeline](#cicd-pipeline)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)
8. [Troubleshooting](#troubleshooting)

## System Requirements

### Frontend
- Node.js 16.x or higher
- npm 8.x or higher
- 1GB RAM minimum (2GB recommended)
- 10GB storage minimum

### Backend
- Node.js 16.x or higher
- npm 8.x or higher
- 2GB RAM minimum (4GB recommended)
- 20GB storage minimum

### Database
- MongoDB 5.0 or higher
- 4GB RAM minimum
- 50GB storage minimum (scalable based on content growth)

## Frontend Deployment

The frontend is built with Next.js and can be deployed using Vercel, Netlify, or a custom server.

### Option 1: Vercel Deployment (Recommended)

1. Create an account on [Vercel](https://vercel.com)
2. Install Vercel CLI:
   ```
   npm install -g vercel
   ```
3. Navigate to the frontend directory:
   ```
   cd /path/to/studify/frontend
   ```
4. Run the deployment command:
   ```
   vercel
   ```
5. Follow the prompts to link your project to your Vercel account
6. For production deployment:
   ```
   vercel --prod
   ```

### Option 2: Custom Server Deployment

1. Build the Next.js application:
   ```
   cd /path/to/studify/frontend
   npm run build
   ```
2. Start the production server:
   ```
   npm start
   ```
3. For production deployment, use a process manager like PM2:
   ```
   npm install -g pm2
   pm2 start npm --name "studify-frontend" -- start
   ```

## Backend Deployment

The backend is built with Node.js/Express and can be deployed to various cloud providers or a custom server.

### Option 1: Custom Server Deployment

1. Navigate to the backend directory:
   ```
   cd /path/to/studify/backend
   ```
2. Install dependencies:
   ```
   npm install --production
   ```
3. Start the server with PM2:
   ```
   pm2 start src/index.js --name "studify-backend"
   ```
4. Save the PM2 process list:
   ```
   pm2 save
   ```
5. Set up PM2 to start on system boot:
   ```
   pm2 startup
   ```

### Option 2: Docker Deployment

1. Build the Docker image:
   ```
   docker build -t studify-backend .
   ```
2. Run the container:
   ```
   docker run -d -p 5000:5000 --name studify-backend-container studify-backend
   ```

## Database Setup

studyify.in uses MongoDB as its database. You can use MongoDB Atlas (cloud) or set up a self-hosted MongoDB instance.

### Option 1: MongoDB Atlas (Recommended)

1. Create an account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Set up database access (username and password)
4. Configure network access (IP whitelist)
5. Get your connection string from the Atlas dashboard
6. Add the connection string to your backend environment variables

### Option 2: Self-hosted MongoDB

1. Install MongoDB on your server
2. Create a new database for studyify:
   ```
   use studify
   ```
3. Create a database user:
   ```
   db.createUser({
     user: "studify_user",
     pwd: "secure_password",
     roles: [{ role: "readWrite", db: "studify" }]
   })
   ```
4. Enable authentication in MongoDB configuration
5. Configure your backend to connect to this database

## Environment Variables

### Frontend Environment Variables

Create a `.env.production` file in the frontend directory with the following variables:

```
NEXT_PUBLIC_API_URL=https://api.studify.in
NEXT_PUBLIC_SITE_URL=https://studify.in
NEXT_PUBLIC_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

### Backend Environment Variables

Create a `.env.production` file in the backend directory with the following variables:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studify
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=90d
CORS_ORIGIN=https://studify.in
```

## CI/CD Pipeline

### GitHub Actions CI/CD Setup

1. Create a `.github/workflows` directory in your repository
2. Create a `frontend.yml` file for frontend deployment:

```yaml
name: Frontend CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'frontend/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
          
      - name: Run tests
        run: |
          cd frontend
          npm test
          
      - name: Build
        run: |
          cd frontend
          npm run build
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./frontend
```

3. Create a `backend.yml` file for backend deployment:

```yaml
name: Backend CI/CD

on:
  push:
    branches: [ main ]
    paths:
      - 'backend/**'

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: |
          cd backend
          npm ci
          
      - name: Run tests
        run: |
          cd backend
          npm test
          
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /path/to/studify/backend
            git pull
            npm ci --production
            pm2 restart studify-backend
```

## Monitoring and Maintenance

### Setting Up Monitoring

1. Install and configure monitoring tools:
   - [PM2 Monitoring](https://pm2.keymetrics.io/) for Node.js applications
   - [MongoDB Atlas Monitoring](https://www.mongodb.com/cloud/atlas/monitoring) for database
   - [Sentry](https://sentry.io/) for error tracking

2. Set up health check endpoints in your backend:
   ```javascript
   app.get('/health', (req, res) => {
     res.status(200).json({ status: 'ok' });
   });
   ```

3. Configure uptime monitoring with services like:
   - [UptimeRobot](https://uptimerobot.com/)
   - [Pingdom](https://www.pingdom.com/)

### Backup Strategy

1. Database Backups:
   - If using MongoDB Atlas, configure automated backups
   - For self-hosted MongoDB, set up a cron job to run `mongodump`

2. Application Backups:
   - Regularly backup environment variables and configuration files
   - Use version control for code backups

### Update Strategy

1. Frontend Updates:
   - Test changes in a staging environment
   - Deploy during low-traffic periods
   - Use feature flags for gradual rollouts

2. Backend Updates:
   - Implement zero-downtime deployments
   - Use database migrations for schema changes
   - Maintain API versioning for backward compatibility

## Troubleshooting

### Common Issues and Solutions

1. **Frontend not connecting to backend**
   - Check CORS configuration
   - Verify API URL in frontend environment variables
   - Check network security groups and firewall settings

2. **Database connection issues**
   - Verify MongoDB connection string
   - Check network access settings in MongoDB Atlas
   - Ensure database user has correct permissions

3. **Performance issues**
   - Check server resources (CPU, memory, disk)
   - Review database indexes
   - Implement caching for frequently accessed data
   - Optimize frontend bundle size

4. **Deployment failures**
   - Check CI/CD logs for errors
   - Verify environment variables are correctly set
   - Ensure build scripts are properly configured

### Support Resources

- GitHub repository: [github.com/studify/studify.in](https://github.com/studify/studify.in)
- Documentation: [docs.studify.in](https://docs.studify.in)
- Contact: support@studify.in