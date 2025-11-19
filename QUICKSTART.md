# Quick Start Guide

Complete guide to run the full Marketplace application (Backend + Frontend)

## Prerequisites

- Node.js 18+ and npm
- Two terminal windows

## Step 1: Start the Backend

Open **Terminal 1**:

```bash
# Navigate to backend directory
cd backend

# Install dependencies (first time only)
npm install

# Start the backend server
npm start
```

**Note:** The backend now includes development fallback values for JWT, so you don't need to configure a `.env` file for testing.

The backend API will be available at `http://localhost:3000`

You should see:
```
✓ Server running on port 3000
✓ MongoDB: Using in-memory storage
```

## Step 2: Start the Frontend

Open **Terminal 2**:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (first time only)
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

You should see:
```
  VITE v6.0.1  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

## Step 3: Use the Application

1. Open your browser to `http://localhost:5173`
2. You'll be redirected to the login page
3. Use the test credentials:
   - **Email:** `john.doe@example.com`
   - **Password:** `password123`
4. Click "Sign In"
5. Browse products, view details, and add items to your cart!

## Available Test Accounts

The backend comes with pre-seeded test data:

**Test User:**
- Email: `john.doe@example.com`
- Password: `password123`

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`

## Features to Try

### Authentication
- ✅ Login with test credentials
- ✅ Logout from the navbar
- ✅ Protected routes (try accessing `/products` while logged out)

### Products
- ✅ Browse all products in grid view
- ✅ Search for products using the search bar
- ✅ Click on a product to view details
- ✅ Check stock availability

### Shopping Cart
- ✅ Add items to cart from product cards (quick add)
- ✅ Add items from product detail page
- ✅ Click cart icon in navbar to view cart
- ✅ Update quantities with +/- buttons
- ✅ Remove items from cart
- ✅ View cart total

## Troubleshooting

### Backend Issues

**Problem:** Port 3000 already in use
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9
```

**Problem:** Dependencies missing
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend Issues

**Problem:** Port 5173 already in use
```bash
# Find and kill the process using port 5173
lsof -ti:5173 | xargs kill -9
```

**Problem:** Dependencies missing
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Problem:** Cannot connect to backend
- Ensure backend is running on port 3000
- Check browser console for errors
- Verify `http://localhost:3000/api/products` returns data

### CORS Issues

If you see CORS errors:
- The backend already has CORS configured for `http://localhost:5173`
- Make sure both servers are running
- Clear browser cache and reload

## Project Structure

```
react-technical-assessment-main/
├── backend/              # Node.js/Express API
│   ├── src/
│   ├── package.json
│   └── README.md
├── frontend/            # React application
│   ├── src/
│   ├── package.json
│   └── README.md
├── QUICKSTART.md        # This file
├── DEPLOYMENT.md        # Production deployment guide
└── README.md            # Project overview
```

## API Endpoints

The backend provides these endpoints:

**Authentication:**
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register (if implemented)

**Products:**
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID

**Cart:** (requires authentication)
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update cart item
- `DELETE /api/cart/:productId` - Remove from cart

**Categories:**
- `GET /api/categories` - List all categories

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Edit frontend files → Vite reloads automatically
- Edit backend files → Nodemon restarts server

### Debugging
- Frontend: Open browser DevTools (F12)
- Backend: Check terminal output
- Network requests: DevTools → Network tab

### Making Changes

**Frontend:**
- Components: `frontend/src/components/`
- Pages: `frontend/src/pages/`
- Styles: `frontend/src/App.css` or `frontend/src/index.css`

**Backend:**
- Controllers: `backend/src/controllers/`
- Routes: `backend/src/routes/`
- Data: `backend/src/data/mockData.js`

## Building for Production

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

### Backend
```bash
cd backend
# Set NODE_ENV=production
# Configure production database
npm start
```

## Tech Stack

**Frontend:**
- React 18
- React Router DOM v6
- Axios
- Vite

**Backend:**
- Node.js
- Express
- MongoDB (in-memory)
- JWT authentication

## Next Steps

After getting comfortable with the app:

1. **Try the API directly** - Use Postman or curl
2. **Modify the UI** - Change colors, layouts
3. **Add features** - Explore the codebase and add your own
4. **Deploy** - See `DEPLOYMENT.md` for production deployment guide

## Getting Help

- Project overview: `README.md`
- Frontend docs: `frontend/README.md`
- Backend docs: `backend/README.md`
- Deployment guide: `DEPLOYMENT.md`

## Success Indicators

You'll know everything is working when:
- ✅ Backend shows "Server running on port 3000"
- ✅ Frontend opens at localhost:5173
- ✅ You can login successfully
- ✅ Products display in a grid
- ✅ Cart icon shows item count
- ✅ No errors in browser console

---

**Happy Coding! 🚀**

Need help? Check the README files in both directories for detailed documentation.

