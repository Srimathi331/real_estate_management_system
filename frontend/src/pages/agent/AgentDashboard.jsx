import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiHome, 
  FiMessageSquare, 
  FiTrendingUp, 
  FiDollarSign,
  FiEye,
  FiPlus,
  FiUsers,
  FiCalendar,
  FiMapPin,
  FiStar,
  FiCheck,
  FiClock,
  FiBarChart,
  FiActivity
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../api/axios';

const AgentDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProperties: 0,
    approvedProperties: 0,
    pendingProperties: 0,
    featuredProperties: 0,
    totalViews: 0,
    totalInquiries: 0,
    unreadInquiries: 0,
    totalRevenue: 0
  });
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [performanceData, setPerformanceData] = useState({
    thisMonth: { properties: 0, inquiries: 0, views: 0 },
    lastMonth: { properties: 0, inquiries: 0, views: 0 }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch agent properties
      try {
        const propertiesResponse = await api.get('/properties/agent/my-properties?limit=5');
        if (propertiesResponse.data.success) {
          const properties = propertiesResponse.data.data.properties || [];
          setRecentProperties(properties);
          
          // Calculate stats from properties
          const totalViews = properties.reduce((sum, prop) => sum + (prop.views || 0), 0);
          const totalInquiries = properties.reduce((sum, prop) => sum + (prop.inquiryCount || 0), 0);
          const totalRevenue = properties.reduce((sum, prop) => sum + (prop.price || 0), 0);
          
          setStats(prev => ({
            ...prev,
            totalProperties: properties.length,
            approvedProperties: properties.filter(p => p.isApproved).length,
            pendingProperties: properties.filter(p => !p.isApproved).length,
            featuredProperties: properties.filter(p => p.isFeatured).length,
            totalViews,
            totalInquiries,
            totalRevenue
          }));
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }

      // Fetch agent inquiries
      try {
        const inquiriesResponse = await api.get('/inquiries?limit=5');
        if (inquiriesResponse.data.success) {
          const inquiries = inquiriesResponse.data.data.inquiries || [];
          setRecentInquiries(inquiries);
          
          const unreadCount = inquiries.filter(inq => !inq.isRead).length;
          setStats(prev => ({
            ...prev,
            unreadInquiries: unreadCount
          }));
        }
      } catch (error) {
        console.error('Error fetching inquiries:', error);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getInquiryStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-50 text-warning-700';
      case 'read':
        return 'bg-blue-50 text-blue-700';
      case 'responded':
        return 'bg-success-50 text-success-700';
      default:
        return 'bg-neutral-50 text-neutral-700';
    }
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
                Agent Dashboard
              </h1>
              <p className="text-agent-text">
                Welcome back, {user?.name}! Here's your property business overview.
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Properties */}
          <div className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-agent-primary/10">
                <FiHome className="h-6 w-6 text-agent-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-agent-text/70">Total Properties</p>
                <p className="text-2xl font-bold text-agent-text">{stats.totalProperties}</p>
              </div>
            </div>
          </div>

          {/* Total Views */}
          <div className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-500/10">
                <FiEye className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-agent-text/70">Total Views</p>
                <p className="text-2xl font-bold text-agent-text">{stats.totalViews}</p>
              </div>
            </div>
          </div>

          {/* Total Inquiries */}
          <div className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-success-500/10">
                <FiMessageSquare className="h-6 w-6 text-success-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-agent-text/70">Total Inquiries</p>
                <p className="text-2xl font-bold text-agent-text">{stats.totalInquiries}</p>
              </div>
            </div>
          </div>

          {/* Unread Inquiries */}
          <div className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-warning-500/10">
                <FiClock className="h-6 w-6 text-warning-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-agent-text/70">Unread Inquiries</p>
                <p className="text-2xl font-bold text-agent-text">{stats.unreadInquiries}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Property Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FiCheck className="h-5 w-5 text-success-500 mr-2" />
                <span className="font-medium text-agent-text">Approved</span>
              </div>
              <span className="text-2xl font-bold text-success-500">{stats.approvedProperties}</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-success-500 h-2 rounded-full" 
                style={{ width: `${stats.totalProperties > 0 ? (stats.approvedProperties / stats.totalProperties) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FiClock className="h-5 w-5 text-warning-500 mr-2" />
                <span className="font-medium text-agent-text">Pending</span>
              </div>
              <span className="text-2xl font-bold text-warning-500">{stats.pendingProperties}</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-warning-500 h-2 rounded-full" 
                style={{ width: `${stats.totalProperties > 0 ? (stats.pendingProperties / stats.totalProperties) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FiStar className="h-5 w-5 text-purple-500 mr-2" />
                <span className="font-medium text-agent-text">Featured</span>
              </div>
              <span className="text-2xl font-bold text-purple-500">{stats.featuredProperties}</span>
            </div>
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full" 
                style={{ width: `${stats.totalProperties > 0 ? (stats.featuredProperties / stats.totalProperties) * 100 : 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/my-properties"
            className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-all hover:scale-105 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-agent-text group-hover:text-agent-primary transition-colors">
                  My Properties
                </h3>
                <p className="text-agent-text/70 mt-1">Manage your listings</p>
              </div>
              <FiHome className="h-8 w-8 text-agent-primary" />
            </div>
          </Link>

          <Link
            to="/inquiries"
            className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-all hover:scale-105 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-agent-text group-hover:text-agent-secondary transition-colors">
                  Inquiries
                </h3>
                <p className="text-agent-text/70 mt-1">Respond to customers</p>
              </div>
              <FiMessageSquare className="h-8 w-8 text-agent-secondary" />
            </div>
          </Link>

          <Link
            to="/properties/add"
            className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-all hover:scale-105 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-agent-text group-hover:text-success-500 transition-colors">
                  Add Property
                </h3>
                <p className="text-agent-text/70 mt-1">List new property</p>
              </div>
              <FiPlus className="h-8 w-8 text-success-500" />
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Properties */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-agent-text">Recent Properties</h3>
              <Link
                to="/my-properties"
                className="text-agent-secondary hover:text-agent-primary transition-colors text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentProperties.length > 0 ? (
                recentProperties.slice(0, 5).map((property) => (
                  <div key={property._id} className="flex items-center justify-between p-3 bg-agent-light/30 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-agent-primary/10 rounded-lg flex items-center justify-center">
                        <FiHome className="h-6 w-6 text-agent-primary" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-agent-text line-clamp-1">
                          {property.title}
                        </p>
                        <p className="text-xs text-agent-text/70">
                          {property.location?.city}, {property.location?.state}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-agent-text">
                        {formatCurrency(property.price)}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(property.isApproved, property.isFeatured)}`}>
                        {property.isFeatured && property.isApproved ? 'Featured' : property.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FiHome className="mx-auto h-12 w-12 text-agent-text/30 mb-4" />
                  <p className="text-agent-text/70 mb-4">No properties listed yet</p>
                  <Link
                    to="/properties/add"
                    className="btn-agent inline-flex items-center gap-2 px-4 py-2 text-sm"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Your First Property
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Inquiries */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-agent-text">Recent Inquiries</h3>
              <Link
                to="/inquiries"
                className="text-agent-secondary hover:text-agent-primary transition-colors text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentInquiries.length > 0 ? (
                recentInquiries.slice(0, 5).map((inquiry) => (
                  <div key={inquiry._id} className="flex items-center justify-between p-3 bg-agent-light/30 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-agent-secondary/10 rounded-full flex items-center justify-center">
                        <FiUsers className="h-5 w-5 text-agent-secondary" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-agent-text">{inquiry.name}</p>
                        <p className="text-xs text-agent-text/70 line-clamp-1">
                          {inquiry.property?.title || 'Property inquiry'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getInquiryStatusColor(inquiry.status)}`}>
                        {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                      </span>
                      <p className="text-xs text-agent-text/60 mt-1">
                        {formatDate(inquiry.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FiMessageSquare className="mx-auto h-12 w-12 text-agent-text/30 mb-4" />
                  <p className="text-agent-text/70">No inquiries received yet</p>
                  <p className="text-xs text-agent-text/60 mt-2">
                    Inquiries will appear here when customers contact you about your properties
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;