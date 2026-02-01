import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, 
  FiUser, 
  FiHeart, 
  FiPlus, 
  FiSettings, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiSearch,
  FiGrid
} from 'react-icons/fi';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: FiHome },
    { path: '/properties', label: 'Properties', icon: FiSearch },
  ];

  const userMenuItems = {
    user: [
      { path: '/wishlist', label: 'Wishlist', icon: FiHeart },
      { path: '/profile', label: 'Profile', icon: FiUser },
    ],
    agent: [
      { path: '/dashboard', label: 'Dashboard', icon: FiGrid },
      { path: '/properties/add', label: 'Add Property', icon: FiPlus },
      { path: '/my-properties', label: 'My Properties', icon: FiHome },
      { path: '/wishlist', label: 'Wishlist', icon: FiHeart },
      { path: '/profile', label: 'Profile', icon: FiUser },
    ],
    admin: [
      { path: '/admin/dashboard', label: 'Admin Dashboard', icon: FiGrid },
      { path: '/admin/users', label: 'Manage Users', icon: FiUser },
      { path: '/admin/properties', label: 'Manage Properties', icon: FiHome },
      { path: '/profile', label: 'Profile', icon: FiUser },
    ],
  };

  return (
    <nav className="bg-[#FFEE91]/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-[#FFEE91]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#97A87A] rounded-lg flex items-center justify-center shadow-md">
                <FiHome className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-gray-800">Urban Hive</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-[#97A87A] bg-white/60 shadow-sm'
                    : 'text-gray-700 hover:text-[#97A87A] hover:bg-white/40'
                }`}
              >
                <link.icon className="text-lg" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-[#97A87A] hover:bg-white/40 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#97A87A] rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span>{user?.name}</span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b">
                      {user?.email}
                    </div>
                    {userMenuItems[user?.role]?.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-[#97A87A] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-[#97A87A] hover:bg-[#8A9B6D] text-white px-4 py-2 rounded-md text-sm font-medium shadow-md transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-[#97A87A] p-2 transition-colors"
            >
              {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'text-[#97A87A] bg-white/60 shadow-sm'
                    : 'text-gray-700 hover:text-[#97A87A] hover:bg-white/40'
                }`}
              >
                <link.icon />
                <span>{link.label}</span>
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <div className="border-t pt-4 mt-4">
                  <div className="px-3 py-2 text-sm text-gray-500">
                    {user?.name} ({user?.email})
                  </div>
                  {userMenuItems[user?.role]?.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#97A87A] hover:bg-white/40 transition-colors"
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t pt-4 mt-4 space-y-1">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-[#97A87A] hover:bg-white/40 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-[#97A87A] text-white hover:bg-[#8A9B6D] shadow-md transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;