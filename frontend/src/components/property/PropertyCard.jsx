import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { wishlistService } from '../../api/services';
import { 
  FiHeart, 
  FiMapPin, 
  FiHome, 
  FiDroplet, 
  FiMaximize, 
  FiEye,
  FiUser,
  FiCalendar
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const PropertyCard = ({ property, onWishlistChange }) => {
  const { isAuthenticated, user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(property.isInWishlist || false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }

    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        await wishlistService.removeFromWishlist(property._id);
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await wishlistService.addToWishlist(property._id);
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
      onWishlistChange?.(property._id, !isInWishlist);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setWishlistLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)}L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link to={`/properties/${property._id}`} className="block">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={property.images?.[0]?.url || '/placeholder-property.jpg'}
            alt={property.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              property.type === 'buy' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              For {property.type === 'buy' ? 'Sale' : 'Rent'}
            </span>
            {property.isFeatured && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                Featured
              </span>
            )}
            {property.status !== 'available' && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                {property.status}
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          {isAuthenticated && user?.role !== 'admin' && (
            <button
              onClick={handleWishlistToggle}
              disabled={wishlistLoading}
              className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                isInWishlist
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
              } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <FiHeart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
            </button>
          )}

          {/* Views */}
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
            <FiEye className="w-3 h-3" />
            <span>{property.views || 0}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900">
              {formatPrice(property.price)}
              {property.type === 'rent' && <span className="text-sm font-normal text-gray-500">/month</span>}
            </h3>
            <span className="text-sm text-gray-500 capitalize">
              {property.category}
            </span>
          </div>

          {/* Title */}
          <h4 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
            {property.title}
          </h4>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-3">
            <FiMapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="text-sm line-clamp-1">
              {property.location.address}, {property.location.city}
            </span>
          </div>

          {/* Features */}
          <div className="flex items-center space-x-4 text-gray-600 mb-3">
            <div className="flex items-center space-x-1">
              <FiHome className="w-4 h-4" />
              <span className="text-sm">{property.features.bedrooms}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiDroplet className="w-4 h-4" />
              <span className="text-sm">{property.features.bathrooms}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiMaximize className="w-4 h-4" />
              <span className="text-sm">
                {property.features.area} {property.features.areaUnit}
              </span>
            </div>
          </div>

          {/* Agent & Date */}
          <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
            <div className="flex items-center space-x-1">
              <FiUser className="w-3 h-3" />
              <span>{property.agent?.name || 'Agent'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiCalendar className="w-3 h-3" />
              <span>{formatDate(property.createdAt)}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PropertyCard;