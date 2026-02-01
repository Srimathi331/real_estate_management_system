import React, { useEffect, useState } from 'react';
import { wishlistService } from '../api/services';
import PropertyCard from '../components/property/PropertyCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiHeart, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await wishlistService.getWishlist();
      setWishlist(response.data.wishlist);
    } catch (error) {
      toast.error('Failed to fetch wishlist');
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWishlistChange = (propertyId, isAdded) => {
    if (!isAdded) {
      // Remove from wishlist
      setWishlist(prev => prev.filter(item => item._id !== propertyId));
    }
  };

  const clearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        await wishlistService.clearWishlist();
        setWishlist([]);
        toast.success('Wishlist cleared successfully');
      } catch (error) {
        toast.error('Failed to clear wishlist');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen page-wishlist flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen page-wishlist">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gradient-wishlist mb-4">My Wishlist</h1>
            <p className="text-wishlist-text text-lg">
              {wishlist.length > 0 
                ? `${wishlist.length} ${wishlist.length === 1 ? 'property' : 'properties'} saved`
                : 'No properties in your wishlist yet'
              }
            </p>
          </div>

          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
            >
              <FiTrash2 />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Wishlist Content */}
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((property) => (
              <PropertyCard
                key={property._id}
                property={{ ...property, isInWishlist: true }}
                onWishlistChange={handleWishlistChange}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-wishlist-primary mb-6">
              <FiHeart size={80} className="mx-auto" />
            </div>
            <h3 className="text-2xl font-semibold text-wishlist-text mb-4">
              Your wishlist is empty
            </h3>
            <p className="text-wishlist-text/70 mb-8 max-w-md mx-auto">
              Start exploring properties and save your favorites to see them here.
            </p>
            <a
              href="/properties"
              className="btn-wishlist inline-flex items-center space-x-2 px-6 py-3"
            >
              <span>Browse Properties</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;