# Marketplace Frontend

A clean, modern React application for the Marketplace backend API.

## Features

✅ **Authentication**
- Login with JWT token storage
- Protected routes
- Auto-redirect on authentication

✅ **Products**
- Browse all products
- Search/filter products
- View detailed product information
- Stock status indicators

✅ **Shopping Cart**
- Add items to cart
- Update quantities
- Remove items
- Persistent cart (localStorage)
- Real-time cart count in navbar
- Sliding cart drawer

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Context API** - State management
- **CSS3** - Modern styling with CSS variables

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation with cart
│   ├── ProductCard.jsx     # Product grid item
│   └── ProtectedRoute.jsx  # Auth guard
├── pages/
│   ├── Login.jsx           # Authentication page
│   ├── Products.jsx        # Products listing
│   └── ProductDetail.jsx   # Single product view
├── context/
│   ├── AuthContext.jsx     # Auth state management
│   └── CartContext.jsx     # Cart state management
├── services/
│   └── api.js             # API calls & interceptors
├── App.jsx                # Main app component
├── App.css               # Component styles
├── main.jsx              # App entry point
└── index.css             # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:3000`

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Test Credentials

```
Email: john.doe@example.com
Password: password123
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Key Features Implemented

### Clean Component Architecture
- Reusable, single-responsibility components
- Custom hooks for state management (`useAuth`, `useCart`)
- Separation of concerns (API layer, contexts, components, pages)

### Robust State Management
- Authentication state with Context API
- Cart state with localStorage persistence
- Protected routes with automatic redirects

### User Experience
- Loading states for async operations
- Error handling with user-friendly messages
- Success notifications
- Responsive design (mobile-first)
- Smooth animations and transitions

### API Integration
- Axios interceptors for auth tokens
- Centralized error handling
- Clean API service layer

## Environment Variables

The app uses a hardcoded API URL (`http://localhost:3000/api`). For production, update the `API_URL` in `src/services/api.js`.

## Design Decisions

1. **Context API over Redux** - Simpler state management for this scope
2. **localStorage for cart** - Persist cart between sessions
3. **Protected Routes** - Secure approach to route guards
4. **CSS Variables** - Easy theming and consistent design
5. **Functional Components & Hooks** - Modern React patterns

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

- User profile page
- Order history
- Product categories filtering
- Advanced search
- Wishlist functionality
- Dark mode support

---

Built with ❤️ using React and Vite

