# 🚀 Deployment Guide

## Pre-Deployment Checklist

### ✅ Code Quality
- [x] No console.log statements (except error logging)
- [x] No TODO comments in code
- [x] All linter errors resolved
- [x] Code is well-documented
- [x] .gitignore files configured

### ✅ Environment Configuration

#### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=3000
NODE_ENV=production

# JWT Secret (IMPORTANT: Change this!)
JWT_SECRET=generate-secure-random-string-here

# CORS
CORS_ORIGIN=https://your-frontend-domain.com
```

**Generate Secure JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Frontend Configuration

Update API URL in `frontend/src/services/api.js`:
```javascript
const API_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';
```

Create `.env.production` in `frontend/`:
```env
VITE_API_URL=https://your-backend-domain.com/api
```

---

## 📦 Build Process

### Backend Build
```bash
cd backend
npm install --production
npm start
```

### Frontend Build
```bash
cd frontend
npm install
npm run build
# Output will be in frontend/dist/
```

---

## 🌐 Deployment Options

### Option 1: Traditional Hosting (VPS/EC2)

**Backend:**
1. Clone repository to server
2. Install Node.js (v14+)
3. Set environment variables
4. Install dependencies: `npm install --production`
5. Start with PM2: `pm2 start src/server.js --name marketplace-api`

**Frontend:**
1. Build locally: `npm run build`
2. Upload `dist/` folder to web server
3. Configure nginx/Apache to serve static files
4. Set up SSL certificate

**Nginx Configuration Example:**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/marketplace/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Vercel (Frontend) + Railway/Render (Backend)

**Frontend (Vercel):**
1. Push code to GitHub
2. Import project in Vercel
3. Set build command: `cd frontend && npm run build`
4. Set output directory: `frontend/dist`
5. Add environment variable: `VITE_API_URL`

**Backend (Railway/Render):**
1. Connect GitHub repository
2. Set root directory: `backend`
3. Set start command: `npm start`
4. Add environment variables (PORT, JWT_SECRET)

### Option 3: Docker Deployment

**Create `docker-compose.yml` in root:**
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
    restart: always
  
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: always
```

**Deploy:**
```bash
docker-compose up -d
```

---

## 🔒 Security Checklist

### Before Going Live:

- [ ] Change default JWT_SECRET to secure random string
- [ ] Enable HTTPS/SSL certificate
- [ ] Configure CORS to specific origins (not *)
- [ ] Set secure cookie flags
- [ ] Enable rate limiting
- [ ] Add helmet.js middleware
- [ ] Review and remove any hardcoded credentials
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Configure environment-specific settings
- [ ] Enable security headers

### Backend Security Hardening:

```javascript
// Add to backend/src/server.js
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 📊 Monitoring & Logging

### Recommended Tools:
- **Error Tracking:** Sentry
- **Analytics:** Google Analytics, Mixpanel
- **Uptime Monitoring:** UptimeRobot, Pingdom
- **Logging:** Winston, Loggly

### Basic Winston Setup (Backend):
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

---

## 🧪 Testing Before Production

### Pre-Launch Testing Checklist:

- [ ] Test authentication flow
- [ ] Verify all API endpoints work
- [ ] Test on multiple devices (mobile, tablet, desktop)
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Verify error handling works correctly
- [ ] Test cart functionality (add/update/remove)
- [ ] Check responsive design on real devices
- [ ] Verify all images load correctly
- [ ] Test with slow 3G connection
- [ ] Run Lighthouse audit (score > 90)

### Load Testing:
```bash
# Using Apache Bench
ab -n 1000 -c 10 http://your-api-url/api/products

# Using Artillery
artillery quick --count 100 --num 10 http://your-api-url/api/products
```

---

## 🔄 CI/CD Setup (Optional)

### GitHub Actions Example:

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
    
    - name: Install & Build Frontend
      run: |
        cd frontend
        npm install
        npm run build
    
    - name: Deploy to Server
      run: |
        # Add your deployment commands here
```

---

## 📱 Performance Optimization

### Frontend:
- [ ] Enable code splitting
- [ ] Optimize images (WebP format)
- [ ] Enable gzip compression
- [ ] Add service worker for PWA
- [ ] Implement lazy loading for routes
- [ ] Minimize bundle size
- [ ] Enable browser caching

### Backend:
- [ ] Enable response compression
- [ ] Add caching headers
- [ ] Implement Redis caching
- [ ] Optimize database queries
- [ ] Add CDN for static assets

---

## 🐛 Troubleshooting

### Common Issues:

**CORS Errors:**
```javascript
// Backend: Ensure CORS is configured
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
```

**Build Fails:**
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and reinstall
- Check Node version matches requirements

**API Not Connecting:**
- Verify API URL in frontend
- Check firewall/security group settings
- Ensure backend is running on correct port
- Verify CORS configuration

---

## 📞 Support

### Quick Links:
- [Main README](./README.md)
- [Quick Start Guide](./QUICKSTART.md)
- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)

---

## ✅ Final Pre-Launch Checklist

Before going live, verify:

1. **Configuration**
   - [ ] Environment variables set
   - [ ] JWT secret changed from default
   - [ ] CORS configured for production domain
   - [ ] SSL certificate installed

2. **Testing**
   - [ ] All features tested in production environment
   - [ ] Mobile responsiveness verified
   - [ ] Cross-browser compatibility checked
   - [ ] Performance metrics acceptable

3. **Security**
   - [ ] No hardcoded secrets in code
   - [ ] Security headers configured
   - [ ] Rate limiting enabled
   - [ ] Error messages don't expose sensitive data

4. **Monitoring**
   - [ ] Error tracking configured
   - [ ] Analytics set up
   - [ ] Uptime monitoring active
   - [ ] Logging configured

5. **Documentation**
   - [ ] README updated with production URLs
   - [ ] API documentation current
   - [ ] Team trained on deployment process

---

**Status:** ✅ Ready for Production Deployment  
**Estimated Setup Time:** 30-60 minutes  
**Difficulty:** Intermediate

