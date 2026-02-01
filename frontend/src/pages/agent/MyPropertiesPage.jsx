import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiHome, 
  FiSearch, 
  FiFilter,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiEye,
  FiPlus,
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiUsers,
  FiMessageSquare,
  FiStar,
  FiCheck,
  FiX,
  FiTrendingUp,
  FiCamera
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const MyPropertiesPage = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDropdown, setShowDropdown] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    featured: 0
  });

  useEffect(() => {
    fetchMyProperties();
  }, [currentPage]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.dropdown-container')) {
        setShowDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const fetchMyProperties = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/properties/agent/my-properties?page=${currentPage}&limit=12`);
      
      if (response.data.success) {
        setProperties(response.data.data.properties || []);
        setTotalPages(response.data.data.pagination.pages || 1);
        
        // Calculate stats
        const props = response.data.data.properties || [];
        setStats({
          total: props.length,
          approved: props.filter(p => p.isApproved).length,
          pending: props.filter(p => !p.isApproved).length,
          featured: props.filter(p => p.isFeatured).length
        });
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Error fetching your properties');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/properties/${propertyId}`);
      toast.success('Property deleted successfully');
      fetchMyProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Error deleting property');
    }
    setShowDropdown(null);
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location?.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'approved' && property.isApproved) ||
                         (filterStatus === 'pending' && !property.isApproved) ||
                         (filterStatus === 'featured' && property.isFeatured);
    
    const matchesType = filterType === 'all' || property.type === filterType;
    const matchesCategory = filterCategory === 'all' || property.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesType && matchesCategory;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadgeColor = (isApproved, isFeatured) => {
    if (isFeatured && isApproved) {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    return isApproved 
      ? 'bg-success-50 text-success-700 border-success-200'
      : 'bg-warning-50 text-warning-700 border-warning-200';
  };

  const getTypeBadgeColor = (type) => {
    return type === 'buy' 
      ? 'bg-blue-50 text-blue-700'
      : 'bg-green-50 text-green-700';
  };

  if (loading) {
    return (
      <div className="page-agent min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="page-agent min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient-agent mb-2">
                My Properties
              </h1>
              <p className="text-agent-text">
                Manage your property listings and track their performance.
              </p>
            </div>
            <Link
              to="/properties/add"
              className="btn-agent flex items-center gap-2 px-6 py-3"
            >
              <FiPlus className="w-5 h-5" />
              Add New Property
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-agent-primary/10">
                <FiHome className="h-6 w-6 text-agent-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-agent-text/70">Total Properties</p>
                <p className="text-2xl font-bold text-agent-text">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-success-500/10">
                <FiCheck className="h-6 w-6 text-success-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-agent-text/70">Approved</p>
                <p className="text-2xl font-bold text-agent-text">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-warning-500/10">
                <FiX className="h-6 w-6 text-warning-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-agent-text/70">Pending</p>
                <p className="text-2xl font-bold text-agent-text">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-500/10">
                <FiStar className="h-6 w-6 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-agent-text/70">Featured</p>
                <p className="text-2xl font-bold text-agent-text">{stats.featured}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-card p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-agent-text/50" />
              <input
                type="text"
                placeholder="Search properties by title, city, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
              >
                <option value="all">All Status</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="featured">Featured</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
              >
                <option value="all">All Types</option>
                <option value="buy">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
              >
                <option value="all">All Categories</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="condo">Condo</option>
                <option value="townhouse">Townhouse</option>
                <option value="office">Office</option>
                <option value="land">Land</option>
              </select>
            </div>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map((property) => (
            <div key={property._id} className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-card-hover transition-shadow">
              {/* Property Image */}
              <div className="relative h-48 bg-neutral-200">
                {property.images && property.images.length > 0 ? (
                  <img
                    src={property.images[0].url}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FiCamera className="h-12 w-12 text-neutral-400" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(property.isApproved, property.isFeatured)}`}>
                    {property.isFeatured && property.isApproved ? 'Featured' : property.isApproved ? 'Approved' : 'Pending'}
                  </span>
                </div>

                {/* Type Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeColor(property.type)}`}>
                    {property.type === 'buy' ? 'For Sale' : 'For Rent'}
                  </span>
                </div>

                {/* Actions Dropdown */}
                <div className="absolute bottom-3 right-3">
                  <div className="relative dropdown-container">
                    <button
                      onClick={() => setShowDropdown(showDropdown === property._id ? null : property._id)}
                      className="bg-white/90 backdrop-blur-sm text-agent-text p-2 rounded-full hover:bg-white shadow-md transition-colors"
                    >
                      <FiMoreVertical className="w-4 h-4" />
                    </button>
                    
                    {showDropdown === property._id && (
                      <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-md shadow-lg z-20 border border-neutral-200">
                        <div className="py-1">
                          <Link
                            to={`/properties/${property._id}`}
                            className="flex items-center w-full px-4 py-2 text-sm text-agent-text hover:bg-neutral-50 transition-colors"
                            onClick={() => setShowDropdown(null)}
                          >
                            <FiEye className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                          <Link
                            to={`/properties/${property._id}/edit`}
                            className="flex items-center w-full px-4 py-2 text-sm text-agent-text hover:bg-neutral-50 transition-colors"
                            onClick={() => setShowDropdown(null)}
                          >
                            <FiEdit className="w-4 h-4 mr-2" />
                            Edit Property
                          </Link>
                          <button
                            onClick={() => handleDeleteProperty(property._id)}
                            className="flex items-center w-full px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
                          >
                            <FiTrash2 className="w-4 h-4 mr-2" />
                            Delete Property
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-agent-text mb-2 line-clamp-2">
                  {property.title}
                </h3>
                
                <div className="flex items-center text-sm text-agent-text/70 mb-2">
                  <FiMapPin className="w-4 h-4 mr-1" />
                  <span className="line-clamp-1">
                    {property.location?.city}, {property.location?.state}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center text-sm text-agent-text/70">
                    <FiDollarSign className="w-4 h-4 mr-1" />
                    <span className="font-semibold text-agent-text">
                      {formatCurrency(property.price)}
                    </span>
                  </div>
                  <div className="text-xs text-agent-text/70">
                    {property.features?.bedrooms || 0} bed • {property.features?.bathrooms || 0} bath
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-agent-text/70 mb-3">
                  <div className="flex items-center">
                    <FiCalendar className="w-3 h-3 mr-1" />
                    <span>{formatDate(property.createdAt)}</span>
                  </div>
                  <div className="text-xs text-agent-text/70">
                    {property.features?.area || 0} {property.features?.areaUnit || 'sqft'}
                  </div>
                </div>

                {/* Property Stats */}
                <div className="pt-3 border-t border-neutral-200">
                  <div className="flex justify-between text-xs text-agent-text/70">
                    <div className="flex items-center">
                      <FiEye className="w-3 h-3 mr-1" />
                      <span>{property.views || 0} views</span>
                    </div>
                    <div className="flex items-center">
                      <FiMessageSquare className="w-3 h-3 mr-1" />
                      <span>{property.inquiryCount || 0} inquiries</span>
                    </div>
                    <div className="flex items-center">
                      <FiTrendingUp className="w-3 h-3 mr-1" />
                      <span className="capitalize">{property.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="bg-white rounded-lg shadow-card p-12 text-center">
            <FiHome className="mx-auto h-12 w-12 text-agent-text/30 mb-4" />
            <h3 className="text-lg font-medium text-agent-text mb-2">No properties found</h3>
            <p className="text-agent-text/70 mb-6">
              {searchTerm || filterStatus !== 'all' || filterType !== 'all' || filterCategory !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'You haven\'t listed any properties yet. Start by adding your first property listing.'
              }
            </p>
            {properties.length === 0 && (
              <Link
                to="/properties/add"
                className="btn-agent inline-flex items-center gap-2 px-6 py-3"
              >
                <FiPlus className="w-5 h-5" />
                Add Your First Property
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-agent-text/70">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPropertiesPage;