import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUsers, 
  FiHome, 
  FiMessageSquare, 
  FiTrendingUp, 
  FiDollarSign,
  FiEye,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiX,
  FiSettings
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../api/axios';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalInquiries: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
    activeAgents: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard statistics
      try {
        const statsResponse = await api.get('/admin/stats');
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Set default stats if API fails
        setStats({
          totalUsers: 0,
          totalProperties: 0,
          totalInquiries: 0,
          totalRevenue: 0,
          pendingApprovals: 0,
          activeAgents: 0
        });
      }

      // Fetch recent users
      try {
        const usersResponse = await api.get('/admin/users?limit=5');
        setRecentUsers(usersResponse.data.users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        setRecentUsers([]);
      }

      // Fetch recent properties
      try {
        const propertiesResponse = await api.get('/admin/properties?limit=5');
        setRecentProperties(propertiesResponse.data.properties || []);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setRecentProperties([]);
      }

      // Fetch recent inquiries
      try {
        const inquiriesResponse = await api.get('/admin/inquiries?limit=5');
        setRecentInquiries(inquiriesResponse.data.inquiries || []);
      } catch (error) {
        console.error('Error fetching inquiries:', error);
        setRecentInquiries([]);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-admin-light flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="page-admin min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient-admin mb-2">
            Admin Dashboard
          </h1>
          <p className="text-admin-text">
            Welcome back, {user?.name}! Here's what's happening with your platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-admin-primary/10">
                <FiUsers className="h-6 w-6 text-admin-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-admin-text/70">Total Users</p>
                <p className="text-2xl font-bold text-admin-text">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          {/* Total Properties */}
          <div className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-admin-secondary/10">
                <FiHome className="h-6 w-6 text-admin-secondary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-admin-text/70">Total Properties</p>
                <p className="text-2xl font-bold text-admin-text">{stats.totalProperties}</p>
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
                <p className="text-sm font-medium text-admin-text/70">Total Inquiries</p>
                <p className="text-2xl font-bold text-admin-text">{stats.totalInquiries}</p>
              </div>
            </div>
          </div>

          {/* Active Agents */}
          <div className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-warning-500/10">
                <FiTrendingUp className="h-6 w-6 text-warning-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-admin-text/70">Active Agents</p>
                <p className="text-2xl font-bold text-admin-text">{stats.activeAgents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/admin/users"
            className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-all hover:scale-105 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-admin-text group-hover:text-admin-primary transition-colors">
                  Manage Users
                </h3>
                <p className="text-admin-text/70 mt-1">View and manage all users</p>
              </div>
              <FiUsers className="h-8 w-8 text-admin-primary" />
            </div>
          </Link>

          <Link
            to="/admin/properties"
            className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-all hover:scale-105 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-admin-text group-hover:text-admin-secondary transition-colors">
                  Manage Properties
                </h3>
                <p className="text-admin-text/70 mt-1">Approve and manage listings</p>
              </div>
              <FiHome className="h-8 w-8 text-admin-secondary" />
            </div>
          </Link>

          <Link
            to="/inquiries"
            className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-all hover:scale-105 group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-admin-text group-hover:text-success-500 transition-colors">
                  Monitor Inquiries
                </h3>
                <p className="text-admin-text/70 mt-1">View customer inquiries (agents handle responses)</p>
              </div>
              <FiMessageSquare className="h-8 w-8 text-success-500" />
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-admin-text">Recent Users</h3>
              <Link
                to="/admin/users"
                className="text-admin-secondary hover:text-admin-primary transition-colors text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentUsers.length > 0 ? (
                recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between p-3 bg-admin-light/50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-admin-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-admin-primary font-semibold">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-admin-text">{user.name}</p>
                        <p className="text-xs text-admin-text/70">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-danger-50 text-danger-700'
                          : user.role === 'agent'
                          ? 'bg-warning-50 text-warning-700'
                          : 'bg-success-50 text-success-700'
                      }`}>
                        {user.role}
                      </span>
                      <p className="text-xs text-admin-text/70 mt-1">
                        {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-admin-text/70 text-center py-4">No recent users</p>
              )}
            </div>
          </div>

          {/* Recent Properties */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-admin-text">Recent Properties</h3>
              <Link
                to="/admin/properties"
                className="text-admin-secondary hover:text-admin-primary transition-colors text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {recentProperties.length > 0 ? (
                recentProperties.map((property) => (
                  <div key={property._id} className="flex items-center justify-between p-3 bg-admin-light/50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-admin-secondary/10 rounded-lg flex items-center justify-center">
                        <FiHome className="h-6 w-6 text-admin-secondary" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-admin-text line-clamp-1">
                          {property.title}
                        </p>
                        <p className="text-xs text-admin-text/70">
                          {property.location?.city}, {property.location?.state}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-admin-text">
                        {formatCurrency(property.price)}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        property.isApproved 
                          ? 'bg-success-50 text-success-700'
                          : 'bg-warning-50 text-warning-700'
                      }`}>
                        {property.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-admin-text/70 text-center py-4">No recent properties</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;