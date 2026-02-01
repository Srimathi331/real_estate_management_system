import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProperty } from '../context/PropertyContext';
import { wishlistService, inquiryService } from '../api/services';
import PropertyCard from '../components/property/PropertyCard';
import LoadingSpinner, { PageLoader } from '../components/common/LoadingSpinner';
import {
  FiHeart,
  FiMapPin,
  FiHome,
  FiDroplet,
  FiMaximize,
  FiCalendar,
  FiUser,
  FiPhone,
  FiMail,
  FiEye,
  FiShare2,
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiCheck
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();
  const { getProperty, property, loading } = useProperty();
  
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryData, setInquiryData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: ''
  });
  const [inquiryLoading, setInquiryLoading] = useState(false);
  const [similarProperties, setSimilarProperties] = useState([]);

  useEffect(() => {
    if (id) {
      getProperty(id);
    }
  }, [id]);

  useEffect(() => {
    if (property && isAuthenticated) {
      checkWishlistStatus();
    }
  }, [property, isAuthenticated]);

  useEffect(() => {
    if (property) {
      // Set similar properties from the API response
      setSimilarProperties(property.similarProperties || []);
    }
  }, [property]);

  const checkWishlistStatus = async () => {
    try {
      const response = await wishlistService.checkWishlist(property._id);
      setIsInWishlist(response.data.isInWishlist);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleWishlistToggle = async () => {
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
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to send inquiry');
      return;
    }

    setInquiryLoading(true);
    try {
      await inquiryService.createInquiry({
        propertyId: property._id,  // Changed from 'property' to 'propertyId'
        ...inquiryData
      });
      toast.success('Inquiry sent successfully!');
      setShowInquiryForm(false);
      setInquiryData({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        message: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send inquiry');
    } finally {
      setInquiryLoading(false);
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
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: property.description,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h2>
          <Link to="/properties" className="text-blue-600 hover:text-blue-700">
            Browse all properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-detail">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link to="/properties" className="text-blue-600 hover:text-blue-700">
            ← Back to Properties
          </Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="relative h-96">
                {property.images && property.images.length > 0 ? (
                  <>
                    <img
                      src={property.images[currentImageIndex]?.url}
                      alt={property.title}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setShowImageModal(true)}
                    />
                    
                    {property.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                        >
                          <FiChevronLeft />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75"
                        >
                          <FiChevronRight />
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {property.images.length}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No images available</span>
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                    property.type === 'buy' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    For {property.type === 'buy' ? 'Sale' : 'Rent'}
                  </span>
                  {property.isFeatured && (
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-yellow-100 text-yellow-800">
                      Featured
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={handleShare}
                    className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                  >
                    <FiShare2 className="text-gray-600" />
                  </button>
                  
                  {isAuthenticated && user?.role !== 'admin' && (
                    <button
                      onClick={handleWishlistToggle}
                      disabled={wishlistLoading}
                      className={`p-2 rounded-full shadow-md transition-colors ${
                        isInWishlist
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-600 hover:bg-red-50 hover:text-red-500'
                      } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <FiHeart className={`${isInWishlist ? 'fill-current' : ''}`} />
                    </button>
                  )}
                </div>
              </div>

              {/* Thumbnail Strip */}
              {property.images && property.images.length > 1 && (
                <div className="p-4 border-t">
                  <div className="flex space-x-2 overflow-x-auto">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                          index === currentImageIndex ? 'border-blue-500' : 'border-gray-200'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`${property.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <FiMapPin className="mr-2" />
                    <span>
                      {property.location.address}, {property.location.city}, {property.location.state}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {formatPrice(property.price)}
                    {property.type === 'rent' && <span className="text-lg font-normal text-gray-500">/month</span>}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <FiEye className="mr-1" />
                    <span>{property.views || 0} views</span>
                  </div>
                </div>
              </div>

              {/* Property Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <FiHome className="mx-auto mb-2 text-blue-600" size={24} />
                  <div className="font-semibold">{property.features.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center">
                  <FiDroplet className="mx-auto mb-2 text-blue-600" size={24} />
                  <div className="font-semibold">{property.features.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center">
                  <FiMaximize className="mx-auto mb-2 text-blue-600" size={24} />
                  <div className="font-semibold">
                    {property.features.area} {property.features.areaUnit}
                  </div>
                  <div className="text-sm text-gray-600">Area</div>
                </div>
                <div className="text-center">
                  <FiCalendar className="mx-auto mb-2 text-blue-600" size={24} />
                  <div className="font-semibold">{property.features.yearBuilt || 'N/A'}</div>
                  <div className="text-sm text-gray-600">Year Built</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <FiCheck className="text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
                <div>
                  <h4 className="font-semibold mb-2">Property Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="capitalize">{property.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="capitalize">{property.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="capitalize">{property.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Parking:</span>
                      <span>{property.features.parking || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Furnished:</span>
                      <span>{property.features.furnished ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Location Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">City:</span>
                      <span>{property.location.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">State:</span>
                      <span>{property.location.state}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ZIP Code:</span>
                      <span>{property.location.zipCode || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Country:</span>
                      <span>{property.location.country}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Listed:</span>
                      <span>{formatDate(property.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Agent Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Contact Agent</h3>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <FiUser className="text-white" />
                </div>
                <div>
                  <div className="font-semibold">{property.agent?.name || 'Agent'}</div>
                  <div className="text-sm text-gray-600">Real Estate Agent</div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {property.agent?.email && (
                  <div className="flex items-center space-x-2 text-sm">
                    <FiMail className="text-gray-400" />
                    <span>{property.agent.email}</span>
                  </div>
                )}
                {property.agent?.phone && (
                  <div className="flex items-center space-x-2 text-sm">
                    <FiPhone className="text-gray-400" />
                    <span>{property.agent.phone}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowInquiryForm(true)}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Send Inquiry
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Property Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Views:</span>
                  <span className="font-semibold">{property.views || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Inquiries:</span>
                  <span className="font-semibold">{property.inquiryCount || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listed:</span>
                  <span className="font-semibold">{formatDate(property.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        {similarProperties.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Properties</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((similarProperty) => (
                <PropertyCard key={similarProperty._id} property={similarProperty} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && property.images && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <FiX size={24} />
            </button>
            
            <img
              src={property.images[currentImageIndex]?.url}
              alt={property.title}
              className="max-w-full max-h-full object-contain"
            />
            
            {property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <FiChevronLeft size={32} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <FiChevronRight size={32} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Inquiry Modal */}
      {showInquiryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Send Inquiry</h3>
              <button
                onClick={() => setShowInquiryForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={inquiryData.name}
                  onChange={(e) => setInquiryData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={inquiryData.email}
                  onChange={(e) => setInquiryData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={inquiryData.phone}
                  onChange={(e) => setInquiryData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={inquiryData.message}
                  onChange={(e) => setInquiryData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="I'm interested in this property..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowInquiryForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inquiryLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {inquiryLoading ? <LoadingSpinner size="sm" /> : 'Send Inquiry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailPage;