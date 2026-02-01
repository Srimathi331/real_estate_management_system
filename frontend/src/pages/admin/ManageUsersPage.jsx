import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiSearch, 
  FiFilter,
  FiMoreVertical,
  FiEdit,
  FiTrash2,
  FiShield,
  FiShieldOff,
  FiMail,
  FiCalendar
} from 'react-icons/fi';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDropdown, setShowDropdown] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filterRole]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/users?page=${currentPage}&limit=10`);
      setUsers(response.data.users || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId, isBlocked) => {
    try {
      const response = await api.put(`/admin/users/${userId}/toggle-block`);
      toast.success(response.data.message);
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error toggling user block:', error);
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
    setShowDropdown(null);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully');
      fetchUsers(); // Refresh the list
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
    setShowDropdown(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-danger-50 text-danger-700 border-danger-200';
      case 'agent':
        return 'bg-warning-50 text-warning-700 border-warning-200';
      default:
        return 'bg-success-50 text-success-700 border-success-200';
    }
  };

  if (loading) {
    return (
      <div className="page-admin min-h-screen flex items-center justify-center">
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
            Manage Users
          </h1>
          <p className="text-admin-text">
            View and manage all registered users on the platform.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-card p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-text/50" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-admin-secondary focus:border-admin-secondary"
              />
            </div>

            {/* Role Filter */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-text/50" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="pl-10 pr-8 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-admin-secondary focus:border-admin-secondary"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="agent">Agents</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-admin-text uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-admin-text uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-admin-text uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-admin-text uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-admin-text uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-neutral-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-admin-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-admin-primary font-semibold">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-admin-text">{user.name}</div>
                          <div className="text-sm text-admin-text/70 flex items-center">
                            <FiMail className="w-3 h-3 mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.isBlocked 
                          ? 'bg-danger-50 text-danger-700'
                          : user.isVerified
                          ? 'bg-success-50 text-success-700'
                          : 'bg-warning-50 text-warning-700'
                      }`}>
                        {user.isBlocked ? 'Blocked' : user.isVerified ? 'Active' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-admin-text/70">
                      <div className="flex items-center">
                        <FiCalendar className="w-3 h-3 mr-1" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => setShowDropdown(showDropdown === user._id ? null : user._id)}
                          className="text-admin-text/70 hover:text-admin-text p-1 rounded-full hover:bg-neutral-100"
                        >
                          <FiMoreVertical className="w-4 h-4" />
                        </button>
                        
                        {showDropdown === user._id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-neutral-200">
                            <div className="py-1">
                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => handleToggleBlock(user._id, user.isBlocked)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-admin-text hover:bg-neutral-50"
                                >
                                  {user.isBlocked ? (
                                    <>
                                      <FiShield className="w-4 h-4 mr-2" />
                                      Unblock User
                                    </>
                                  ) : (
                                    <>
                                      <FiShieldOff className="w-4 h-4 mr-2" />
                                      Block User
                                    </>
                                  )}
                                </button>
                              )}
                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-danger-600 hover:bg-danger-50"
                                >
                                  <FiTrash2 className="w-4 h-4 mr-2" />
                                  Delete User
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <FiUsers className="mx-auto h-12 w-12 text-admin-text/30" />
              <h3 className="mt-2 text-sm font-medium text-admin-text">No users found</h3>
              <p className="mt-1 text-sm text-admin-text/70">
                {searchTerm || filterRole !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No users have been registered yet.'
                }
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-admin-text/70">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default ManageUsersPage;