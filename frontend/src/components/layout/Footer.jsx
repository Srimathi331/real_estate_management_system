import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="text-white relative overflow-hidden"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1684864706908-4ed39012b5b1?w=1920&auto=format&fit=crop&q=80&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTg5fHxncmV5JTIwcmVhbCUyMGVzdGF0ZSUyMGltYWdlc3xlbnwwfHwwfHx8MA%3D%3D')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-800 to-transparent opacity-90"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <FiHome className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Urban Hive</span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted partner in finding the perfect property. We connect buyers, sellers, and renters with their ideal real estate solutions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110">
                <FiFacebook size={22} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110">
                <FiTwitter size={22} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110">
                <FiInstagram size={22} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-all duration-300 hover:scale-110">
                <FiLinkedin size={22} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white border-b-2 border-blue-500 pb-2 inline-block">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?type=buy" className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Buy
                </Link>
              </li>
              <li>
                <Link to="/properties?type=rent" className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Rent
                </Link>
              </li>
              <li>
                <Link to="/register?role=agent" className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Become an Agent
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white border-b-2 border-blue-500 pb-2 inline-block">Property Types</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/properties?category=apartment" className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Apartments
                </Link>
              </li>
              <li>
                <Link to="/properties?category=house" className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Houses
                </Link>
              </li>
              <li>
                <Link to="/properties?category=villa" className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Villas
                </Link>
              </li>
              <li>
                <Link to="/properties?category=condo" className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Condos
                </Link>
              </li>
              <li>
                <Link to="/properties?category=commercial" className="text-gray-300 hover:text-blue-400 transition-all duration-300 hover:translate-x-1 inline-block">
                  Commercial
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white border-b-2 border-blue-500 pb-2 inline-block">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 group">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors">
                  <FiMapPin className="text-white text-sm" />
                </div>
                <span className="text-gray-300 text-sm leading-relaxed">
                  123 Real Estate St, Property City, PC 12345
                </span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors">
                  <FiPhone className="text-white text-sm" />
                </div>
                <span className="text-gray-300 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 transition-colors">
                  <FiMail className="text-white text-sm" />
                </div>
                <span className="text-gray-300 text-sm">info@urbanhive.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} Urban Hive. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;