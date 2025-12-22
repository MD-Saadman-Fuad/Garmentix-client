# 🧵 Garmentix - Garment Production Management Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://garmentix.netlify.app/)
[![Backend API](https://img.shields.io/badge/Backend-API-blue)](https://garmentix-server.onrender.com)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-12.6.0-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.17-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 📋 Overview

Garmentix is a comprehensive **garment production management platform** designed to streamline the workflow between manufacturers, managers, buyers, and administrators. The platform provides real-time order tracking, production management, user role-based access control, and transparent communication across the entire garment supply chain.

**Live Application:** [https://garmentix.netlify.app/](https://garmentix.netlify.app/)  
**Backend API:** [https://garmentix-server.onrender.com](https://garmentix-server.onrender.com)

---

## 🔗 Live Project & Repositories

- 🌐 **Live Website:** [https://garmentix.netlify.app/](https://garmentix.netlify.app/)
- 💻 **Client Repository:** [https://github.com/MD-Saadman-Fuad/Garmentix-client](https://github.com/MD-Saadman-Fuad/Garmentix-client)
- 🖥 **Backend API:** [https://garmentix-server.onrender.com](https://garmentix-server.onrender.com)

---

## 🧠 Project Objective

This project was developed as a **real-world production management system for garment factories** to help:

- Track buyer orders from placement to delivery
- Manage factory production stages with real-time timeline updates
- Control inventory and product visibility
- Handle users through **Admin & Manager authority** with suspension capabilities
- Ensure **secure authentication & role-based access** with Firebase and JWT
- Provide transparent communication between buyers, managers, and administrators

It closely simulates how actual **ERP-style systems** work in the garment industry.

---

## ✨ Key Features

### 🔐 Authentication & Authorization

- **Firebase Authentication** with email/password and Google Sign-In
- **JWT-based session management** with httpOnly cookies (7-day expiry)
- **Role-based access control** (Admin, Manager, Buyer)
- **Protected routes** with automatic login redirect
- **Account suspension system** with admin feedback

### 👥 User Roles & Permissions

#### **Admin**

- Manage all users (suspend/activate accounts with detailed feedback)
- View and manage all products across the platform
- View and manage all orders with status updates
- Update order statuses
- Collect suspension reasons and provide feedback
- Toggle product visibility on homepage

#### **Manager**

- Add new products with multiple payment options
- Manage own products (edit/delete)
- View and approve/reject pending orders
- Add tracking information to approved orders with production stages
- Restricted when suspended (cannot add products or approve orders)

#### **Buyer**

- Browse and search products with filters
- Place orders with customizable details
- Track order status in real-time with visual timeline
- View order timeline with production updates
- Access complete order history
- Cancel pending orders
- Restricted when suspended (cannot place new orders)

### 📦 Product Management

- **Product creation** with images, descriptions, categories
- **Payment options:** Cash on Delivery, bKash, Nagad, PayFast
- **Image upload** with validation (5MB limit)
- **Search and filter** products by name, category, description
- **Minimum order quantity** enforcement
- **Show on home page** feature for featured products
- **Product analytics** with order count tracking

### 🛒 Order Management

- **Complete order workflow:** Pending → Approved → In Production → Shipped → Delivered
- **Order details:** Customer info, delivery address, payment method, contact number
- **Order cancellation** for pending orders
- **Payment status tracking** (Pending, Paid)
- **Order search and filtering** by status, product, customer, order ID
- **Order summary statistics** (Total, Pending, In Production, Delivered)

### 📍 Order Tracking System

- **Real-time tracking timeline** with visual indicators and step icons
- **Production updates:** Cutting Completed, Sewing Started, Sewing Completed, Finished, Packed, Shipped, Delivered
- **Location and timestamp** for each tracking update
- **Latest update highlighting** with current status badge
- **Image attachments** for tracking steps
- **Track all orders** overview with summary statistics
- **Authorization checks** to ensure users only see their own orders

### 🎨 User Experience

- **AOS animations** throughout the application (fade-up transitions, 800ms duration)
- **Responsive design** optimized for mobile, tablet, and desktop
- **DaisyUI components** for consistent, modern UI
- **Interactive hover effects** with smooth transitions (200ms)
- **SweetAlert2** for beautiful notifications and confirmations
- **Loading states** with styled spinners
- **Error handling** with user-friendly messages
- **Form validation** with React Hook Form

### 🚫 Account Suspension

- **Admin suspension** with detailed reason and feedback collection
- **Suspension alerts** prominently displayed on user profile
- **Role-specific restrictions:**
  - Buyers: Cannot place new orders or bookings
  - Managers: Cannot add products or approve/reject orders
- **Support contact information** displayed for suspended users
- **Reactivation** clears suspension fields automatically

---

## 🔐 Security & Authentication

✅ Firebase Authentication
✅ JWT-based route protection
✅ Token stored in **HTTP-only cookies**
✅ Secured Firebase & MongoDB credentials using `.env`
✅ Fully protected **Private Routes**
✅ Reload-safe authentication

---

## ⚙️ Advanced System Features

- Search & filter system
- Pagination
- Toast & SweetAlert notifications
- Fully reusable modals & components
- Loading spinners on all async actions
- Role-based UI rendering
- Production tracking timeline
- Real-time order status updates

---

## 🛠️ Technologies Used

### Frontend

- **React 19.2.0** - Modern React with hooks and latest features
- **React Router 7.10.1** - Client-side routing with protected routes
- **Vite 7.2.4** - Fast build tool and dev server
- **Tailwind CSS 4.1.17** - Utility-first CSS framework
- **DaisyUI 5.5.8** - Tailwind CSS component library
- **Firebase 12.6.0** - Authentication with Admin SDK support

### State Management & Data Fetching

- **TanStack React Query 5.90.12** - Server state management with caching
- **Axios 1.13.2** - HTTP client with interceptors and withCredentials

### UI/UX Libraries

- **AOS 2.3.4** - Scroll animations (fade-up, 800ms, ease-in-out)
- **Framer Motion 12.23.26** - Advanced animations for interactive elements
- **React Icons 5.5.0** - Comprehensive icon library
- **SweetAlert2 11.26.4** - Beautiful alerts and modals
- **React Fast Marquee 1.6.5** - Smooth marquee effects for partners section
- **Swiper 12.0.3** - Touch slider for carousels
- **React Responsive Carousel 3.2.23** - Image carousels

### Form Handling

- **React Hook Form 7.68.0** - Performant form validation with minimal re-renders

### Backend Stack

- **Node.js** - JavaScript runtime
- **Express.js** - RESTful API server framework
- **MongoDB** - NoSQL database (garmentixDB)
- **Firebase Admin SDK** - Server-side token verification
- **Cookie-Parser** - Cookie-based authentication middleware
- **JWT** - JSON Web Tokens for session management
- **CORS** - Cross-Origin Resource Sharing configuration
- **Dotenv** - Environment variable management

### Development Tools

- **ESLint 9.39.1** - Code linting
- **Vite Plugin React 5.1.1** - Fast refresh and JSX support
- **TypeScript types** - Type definitions for React

---

## 📦 NPM Packages

### Client Dependencies:

```json
{
  "@tailwindcss/vite": "^4.1.17",
  "@tanstack/react-query": "^5.90.12",
  "aos": "^2.3.4",
  "axios": "^1.13.2",
  "firebase": "^12.6.0",
  "framer-motion": "^12.23.26",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-fast-marquee": "^1.6.5",
  "react-hook-form": "^7.68.0",
  "react-icons": "^5.5.0",
  "react-responsive-carousel": "^3.2.23",
  "react-router": "^7.10.1",
  "react-router-dom": "^7.10.1",
  "sweetalert2": "^11.26.4",
  "swiper": "^12.0.3",
  "tailwindcss": "^4.1.17"
}
```

### Dev Dependencies:

```json
{
  "@eslint/js": "^9.39.1",
  "@types/react": "^19.2.5",
  "@types/react-dom": "^19.2.3",
  "@vitejs/plugin-react": "^5.1.1",
  "daisyui": "^5.5.8",
  "eslint": "^9.39.1",
  "eslint-plugin-react-hooks": "^7.0.1",
  "eslint-plugin-react-refresh": "^0.4.24",
  "globals": "^16.5.0",
  "vite": "^7.2.4"
}
```

---

## 📁 Project Structure

```
garmentix-client/
├── public/
│   └── _redirects              # Netlify routing configuration
├── src/
│   ├── assets/                 # Images and static files
│   ├── Components/             # Reusable components
│   ├── Context/
│   │   ├── AuthContext.jsx     # Auth context definition
│   │   └── AuthProvider.jsx    # Auth state management
│   ├── Firebase/
│   │   └── Firebase.config.js  # Firebase initialization
│   ├── Hooks/
│   │   ├── useAuth.jsx         # Auth hook
│   │   └── useAxiosSecure.jsx  # Axios instance with auth
│   ├── Layouts/
│   │   ├── HomeLayout.jsx      # Main layout
│   │   └── Dashboardlayout.jsx # Dashboard layout
│   ├── Pages/
│   │   ├── Homepage/           # Landing page sections
│   │   │   ├── Banner/
│   │   │   ├── BeUs/
│   │   │   ├── Partners/
│   │   │   ├── Reviews/
│   │   │   └── Faq/
│   │   ├── Products/           # Product pages
│   │   │   ├── AllProducts.jsx
│   │   │   ├── ProductsCard.jsx
│   │   │   └── ProductsDetail/
│   │   ├── Dashboard/          # Dashboard pages
│   │   │   ├── MyParcels/      # Buyer orders
│   │   │   ├── MyProfile/      # User profile
│   │   │   ├── TrackOrder/     # Individual tracking
│   │   │   ├── OrderTracking/  # All orders tracking
│   │   │   ├── Admin/          # Admin pages
│   │   │   │   ├── ManageUsers.jsx
│   │   │   │   ├── AllProductsAdmin.jsx
│   │   │   │   └── AllOrders.jsx
│   │   │   └── Manger/         # Manager pages
│   │   │       ├── AddProduct.jsx
│   │   │       ├── ManageProducts.jsx
│   │   │       ├── PendingOrders.jsx
│   │   │       └── ApprovedOrders.jsx
│   │   ├── Auth/               # Login/Register
│   │   ├── AboutUs/
│   │   └── Contact/
│   ├── Routes/
│   │   ├── Router.jsx          # Route definitions
│   │   ├── PrivateRoute.jsx    # Auth guard
│   │   ├── BuyerRoute.jsx      # Buyer-only routes
│   │   ├── ManagerRoute.jsx    # Manager-only routes
│   │   └── AdminRoute.jsx      # Admin-only routes
│   ├── Shared/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── Logo.jsx
│   ├── App.jsx                 # Root component
│   ├── main.jsx                # Entry point with AOS init
│   └── index.css               # Global styles
├── .env                        # Environment variables
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## 🔌 API Endpoints

### Authentication

- `POST /auth/login` - Login with Firebase token, returns httpOnly cookie
- `GET /auth/verify` - Verify authentication status
- `POST /auth/logout` - Clear authentication cookie

### Users

- `GET /users` - Get all users (Admin only)
- `GET /users/:email` - Get user by email
- `PUT /users/:email` - Update user (role, status, suspension details)
- `DELETE /users/:email` - Delete user (Admin only)

### Products

- `GET /products` - Get all products (with optional email filter)
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product (Manager only)
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Orders

- `GET /orders` - Get orders (with filters: email, status, managerEmail)
- `GET /orders/:id` - Get order by ID
- `POST /orders` - Create new order (Buyer only)
- `PATCH /orders/:id` - Update order status/payment
- `DELETE /orders/:id` - Cancel order
- `GET /orders/:id/tracking` - Get order tracking timeline
- `POST /orders/:id/tracking` - Add tracking update (Manager only)

---

## 🔑 Environment Variable Setup

### Client `.env`

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_image_hosting_key=your_imgbb_api_key
VITE_backend_url=https://garmentix-server.onrender.com
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- MongoDB database

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/MD-Saadman-Fuad/Garmentix-client.git
cd Garmentix-client
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory with the variables shown above.

4. **Start development server**

```bash
npm run dev
```

The application will open at `http://localhost:5173`

5. **Build for production**

```bash
npm run build
```

---

## 🌐 Deployment

### Frontend (Netlify)

1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`
4. The `_redirects` file in `public/` handles client-side routing

### Backend (Render)

- Deployed at: https://garmentix-server.onrender.com
- Environment variables configured in Render dashboard
- MongoDB connection string
- Firebase Admin SDK credentials

---

## 🔒 Security Features

- **httpOnly cookies** - Prevents XSS attacks on authentication tokens
- **JWT token verification** - Server-side authentication validation
- **Firebase Admin SDK** - Secure token validation on backend
- **Role-based access control** - Granular permissions for different user types
- **Input validation** - Client and server-side validation
- **CORS configuration** - Restricted origins for API access
- **Secure password handling** - Firebase authentication with bcrypt
- **withCredentials** - Proper cookie transmission in cross-origin requests
- **Environment variables** - Sensitive data protection

---

## 📱 Responsive Design

- **Mobile-first approach** with Tailwind CSS
- **Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly interfaces** with proper button sizing
- **Collapsible navigation** with hamburger menu
- **Drawer sidebar** for dashboard on mobile
- **Optimized images** with proper aspect ratios
- **Flexible grid layouts** that adapt to screen sizes

---

## 🎯 Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Email notifications for order updates
- [ ] PDF invoice generation
- [ ] Advanced analytics dashboard with charts
- [ ] Multi-language support (i18n)
- [ ] Dark mode theme toggle
- [ ] Export order data to CSV/Excel
- [ ] Product inventory management with low stock alerts
- [ ] Supplier management module
- [ ] Quality control tracking with defect reporting
- [ ] Shipment integration with courier services
- [ ] SMS notifications for critical updates
- [ ] Bulk order upload via CSV
- [ ] Advanced reporting and data visualization

---

## 👨‍💻 Developer

**MD Saadman Fuad**

- Portfolio: [saadmanfuad.netlify.app](https://saadmanfuad.netlify.app/)
- LinkedIn: [linkedin.com/in/saadmanfuad](https://www.linkedin.com/in/saadmanfuad/)
- GitHub: [github.com/MD-Saadman-Fuad](https://github.com/MD-Saadman-Fuad)
- Email: md.saadman.fuad@gmail.com
- Phone: +880 1914 995953

---

## 📄 License

This project is created for educational and portfolio purposes.

---

## 🙏 Acknowledgments

- Firebase for authentication services
- MongoDB for database solutions
- Netlify for frontend hosting
- Render for backend hosting
- DaisyUI for beautiful UI components
- TanStack Query for excellent data synchronization
- All open-source libraries and contributors

---

## 📞 Support

For any queries or issues, please contact:

- **Email:** md.saadman.fuad@gmail.com
- **Create an issue:** [GitHub Issues](https://github.com/MD-Saadman-Fuad/Garmentix-client/issues)

---

**⭐ If you find this project helpful, please consider giving it a star on GitHub!**

---

_Built with ❤️ by MD Saadman Fuad_

### Server `.env`

```bash
DB_USER=your_mongodb_user
DB_PASS=your_mongodb_password
ACCESS_TOKEN_SECRET=your_jwt_secret
```

---

## 🧪 Demo Credentials

```
Admin Email: admin@email.com
Admin Password: ********

Manager Email: manager@email.com
Manager Password: ********
```

---

## ✅ Assignment Fulfillment Checklist

✔ 20+ meaningful frontend commits
✔ 12+ meaningful backend commits
✔ Firebase secured with environment variables
✔ MongoDB secured with environment variables
✔ JWT authentication with cookies
✔ Role-based protected dashboard
✔ Search, filter & pagination implemented
✔ Production tracking system
✔ Admin suspension with feedback
✔ Fully responsive UI
✔ Dark/Light theme
✔ Zero reload route errors
✔ Production-ready deployment

---

## 🖥 How to Run Locally

### 1️⃣ Clone Repositories

```bash
git clone https://github.com/your-username/client
git clone https://github.com/your-username/server
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup `.env`

Add Firebase & MongoDB credentials.

### 4️⃣ Run Project

```bash
npm run dev
```

---

## 👨‍💻 Developer Profile

**Name:** MD. Saadman Fuad
**Role:** MERN Stack Frontend Developer
**Specialization:**

- React UI Engineering
- Authentication Systems
- Dashboard Development
- API Integration
- UX-Focused Responsive Design

> 🔥 Passionate about building **real-world scalable applications** with clean architecture and production-ready features.

---

## 📄 License

This project is developed for **educational, portfolio, and evaluation purposes only**.

---

⭐ If you find this project valuable, don’t forget to **star** the repository!
