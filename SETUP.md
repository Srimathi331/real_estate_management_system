# Real Estate Management System - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation OR MongoDB Atlas account)
- Git

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd Real_Estate_Management_System

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup

#### Option A: Local MongoDB (Recommended for Development)
1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   - Windows: MongoDB should start automatically
   - macOS: `brew services start mongodb/brew/mongodb-community`
   - Linux: `sudo systemctl start mongod`

#### Option B: MongoDB Atlas (Cloud Database)
1. Create account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Get your connection string
4. Update `backend/.env` with your Atlas connection string

### 3. Environment Configuration

Copy the example environment files and update them:

```bash
# Backend environment
cd backend
cp .env.example .env
# Edit .env with your database URL and other settings

# Frontend environment  
cd ../frontend
cp .env.example .env
# Edit .env with your API URL
```

### 4. Start the Application

```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory - in a new terminal)
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## 🎨 Features Implemented

### ✅ Completed Features
- **Beautiful Homepage** with animated sections
- **Unique Color Schemes** for each page
- **Background Images** for all sections
- **Responsive Design** with Tailwind CSS
- **Modern Animations** and hover effects
- **Professional Footer** with contact info
- **User Authentication** system
- **Property Management** CRUD operations
- **Role-based Access** (User, Agent, Admin)
- **Image Upload** with Cloudinary
- **Search and Filtering**
- **Wishlist Functionality**
- **Inquiry System**

### 🎯 Current Status
- Frontend: 95% Complete with beautiful UI/UX
- Backend: 90% Complete with full API
- Database: Ready for connection
- Authentication: Fully implemented
- File Upload: Configured for Cloudinary

## 🛠️ Troubleshooting

### MongoDB Connection Issues
If you see "MongoDB Connection Error":
1. Make sure MongoDB is installed and running locally
2. Or update `.env` with a valid MongoDB Atlas connection string
3. The app will still run without database for UI testing

### Port Conflicts
- Backend runs on port 5000
- Frontend runs on port 5173
- Make sure these ports are available

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📱 Demo Data

To populate the database with sample data:
```bash
cd backend
npm run seed
```

## 🎨 Design System

### Color Palettes (Unique per Page)
- **Home**: Warm Cream (#F9F8F6) with Sage Green (#B0DB9C)
- **Properties**: Forest Green & Emerald
- **Auth**: Midnight Blue & Cyan
- **Agent**: Crimson & Rose
- **Admin**: Charcoal & Electric Blue
- **Profile**: Amber & Copper
- **Wishlist**: Magenta & Fuchsia

### Animations
- Fade-in animations for all sections
- Hover effects on cards and buttons
- Smooth transitions throughout
- Parallax background effects
- Staggered animations for lists

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
cd frontend
npm run build
# Deploy the dist folder
```

### Backend (Render/Railway)
```bash
cd backend
# Set environment variables in your hosting platform
# Deploy with Node.js runtime
```

## 📞 Support

If you encounter any issues:
1. Check this setup guide
2. Ensure all dependencies are installed
3. Verify environment variables are set correctly
4. Check that MongoDB is running (if using local)

The application is designed to work even without database connection for UI testing and development.