# 🏠 Real Estate Management System

A comprehensive, production-ready Real Estate Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (Admin, Agent, User)
- Secure password hashing with bcrypt
- Protected routes and API endpoints

### 🏘️ Property Management
- **For Users**: Browse, search, filter, and save properties
- **For Agents**: Add, edit, delete, and manage properties
- **For Admins**: Approve/reject properties, manage all listings
- Advanced search with filters (price, location, type, amenities)
- Image upload with Cloudinary integration
- Property views tracking and analytics

### 💝 Wishlist System
- Save favorite properties
- Easy wishlist management
- Quick access to saved properties

### 📧 Inquiry System
- Send inquiries to property agents
- Inquiry management for agents
- Status tracking and responses
- Duplicate inquiry prevention

### 📊 Dashboard Analytics
- **User Dashboard**: Wishlist, inquiries, recommendations
- **Agent Dashboard**: Property performance, inquiries, analytics
- **Admin Dashboard**: Platform statistics, user management

### 🔧 Advanced Features
- Responsive design for all devices
- Real-time notifications with toast messages
- Image gallery with modal view
- Property sharing functionality
- Pagination and infinite scroll
- SEO-friendly URLs
- Error handling and loading states

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - Modern UI library
- **Vite** - Fast build tool
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client with interceptors
- **React Hot Toast** - Notifications
- **React Icons** - Icon library
- **Framer Motion** - Animations
- **Context API** - State management

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Cloudinary** - Image storage
- **Multer** - File upload handling
- **express-validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **Rate limiting** - API protection

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd real-estate-management-system
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file with your configuration
cp .env.example .env

# Update .env with your values:
# - MongoDB connection string
# - JWT secrets
# - Cloudinary credentials

# Seed the database with demo data
npm run seed

# Start the backend server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env file
cp .env.example .env

# Update VITE_API_URL if needed

# Start the frontend development server
npm run dev
```

### 4. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## 🔑 Demo Accounts

After running the seeder, you can use these demo accounts:

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@realestate.com | Admin@123 |
| Agent | agent@realestate.com | Agent@123 |
| User  | user@realestate.com | User@123 |

## 📁 Project Structure

```
real-estate-management-system/
├── backend/
│   ├── config/          # Database & Cloudinary config
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── server.js        # Express app setup
│   └── seeder.js        # Database seeding
├── frontend/
│   ├── src/
│   │   ├── api/         # API services
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React Context providers
│   │   ├── pages/       # Page components
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   ├── public/          # Static assets
│   └── index.html       # HTML template
└── README.md
```

## 🔧 Environment Variables

### Backend (.env)
```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/realestate

# JWT
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=RealEstate
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Property Endpoints
- `GET /api/properties` - Get all properties (with filters)
- `GET /api/properties/:id` - Get single property
- `POST /api/properties` - Create property (Agent/Admin)
- `PUT /api/properties/:id` - Update property (Agent/Admin)
- `DELETE /api/properties/:id` - Delete property (Agent/Admin)

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/change-password` - Change password
- `GET /api/users` - Get all users (Admin)

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/:propertyId` - Add to wishlist
- `DELETE /api/wishlist/:propertyId` - Remove from wishlist

### Inquiries
- `POST /api/inquiries` - Create inquiry
- `GET /api/inquiries` - Get inquiries (Agent/Admin)
- `PUT /api/inquiries/:id` - Update inquiry status

## 🔒 Security Features

- **JWT Authentication** with access and refresh tokens
- **Password Hashing** with bcrypt (12 salt rounds)
- **Rate Limiting** (100 requests per 15 minutes)
- **CORS Protection** with specific origin allowlist
- **Security Headers** with Helmet.js
- **Input Validation** with express-validator
- **NoSQL Injection Prevention** with mongo-sanitize
- **Role-Based Access Control** for all endpoints

## 🎨 UI/UX Features

- **Responsive Design** - Works on all devices
- **Modern Interface** - Clean and intuitive design
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - User-friendly error messages
- **Toast Notifications** - Real-time feedback
- **Image Gallery** - Modal view with navigation
- **Advanced Filters** - Comprehensive search options
- **Pagination** - Efficient data loading

## 🚀 Deployment

### Backend Deployment (Render/Railway/Heroku)
1. Create a new web service
2. Connect your GitHub repository
3. Set environment variables
4. Deploy with build command: `npm install`
5. Start command: `npm start`

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Set environment variables
5. Deploy

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Get connection string
3. Update `MONGODB_URI` in backend environment

### Image Storage (Cloudinary)
1. Create Cloudinary account
2. Get cloud name, API key, and secret
3. Update Cloudinary config in backend

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📈 Performance Optimizations

- **Database Indexing** - Optimized queries
- **Image Optimization** - Cloudinary transformations
- **Lazy Loading** - Components and images
- **Caching** - API responses and static assets
- **Code Splitting** - Route-based splitting
- **Compression** - Gzip compression enabled

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed description
3. Contact support at support@realestate.com

## 🙏 Acknowledgments

- React.js team for the amazing framework
- MongoDB team for the flexible database
- Tailwind CSS for the utility-first approach
- Cloudinary for image management
- All open-source contributors

---

**Built with ❤️ by [Your Name]**

*A complete, production-ready real estate management solution.*