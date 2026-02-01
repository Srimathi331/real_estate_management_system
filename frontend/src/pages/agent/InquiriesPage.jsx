import React, { useState, useEffect, useRef } from 'react';
import { 
  FiMessageSquare, 
  FiSearch, 
  FiFilter,
  FiMoreVertical,
  FiEye,
  FiCornerUpLeft,
  FiTrash2,
  FiMail,
  FiPhone,
  FiCalendar,
  FiUser,
  FiHome,
  FiMapPin,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiSend
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const InquiriesPage = () => {
  const { user } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDropdown, setShowDropdown] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchInquiries();
  }, [currentPage, filterStatus]);

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

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        ...(filterStatus !== 'all' && { status: filterStatus })
      };
      
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/inquiries?${queryString}`);
      
      setInquiries(response.data.data.inquiries || []);
      setUnreadCount(response.data.data.unreadCount || 0);
      setTotalPages(response.data.data.pagination.pages || 1);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast.error('Error fetching inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (inquiryId) => {
    try {
      console.log('Marking inquiry as read:', inquiryId);
      await api.put(`/inquiries/${inquiryId}`, { status: 'read' });
      toast.success('Inquiry marked as read');
      fetchInquiries();
    } catch (error) {
      console.error('Error marking inquiry as read:', error);
      toast.error(error.response?.data?.message || 'Error updating inquiry');
    }
    setShowDropdown(null);
  };

  const handleDeleteInquiry = async (inquiryId) => {
    if (!window.confirm('Are you sure you want to delete this inquiry? This action cannot be undone.')) {
      return;
    }

    try {
      console.log('Deleting inquiry:', inquiryId, 'User role:', user?.role);
      await api.delete(`/inquiries/${inquiryId}`);
      toast.success('Inquiry deleted successfully');
      fetchInquiries();
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      toast.error(error.response?.data?.message || 'Error deleting inquiry');
    }
    setShowDropdown(null);
  };

  const handleSendResponse = async () => {
    if (!responseText.trim()) {
      toast.error('Please enter a response message');
      return;
    }

    try {
      console.log('Sending response for inquiry:', selectedInquiry._id);
      await api.put(`/inquiries/${selectedInquiry._id}`, {
        response: responseText,
        status: 'responded'
      });
      toast.success('Response sent successfully');
      setShowResponseModal(false);
      setResponseText('');
      setSelectedInquiry(null);
      fetchInquiries();
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error(error.response?.data?.message || 'Error sending response');
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.property?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.message?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-50 text-warning-700 border-warning-200';
      case 'read':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'responded':
        return 'bg-success-50 text-success-700 border-success-200';
      case 'closed':
        return 'bg-neutral-50 text-neutral-700 border-neutral-200';
      default:
        return 'bg-neutral-50 text-neutral-700 border-neutral-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FiClock className="w-4 h-4" />;
      case 'read':
        return <FiEye className="w-4 h-4" />;
      case 'responded':
        return <FiCheckCircle className="w-4 h-4" />;
      case 'closed':
        return <FiXCircle className="w-4 h-4" />;
      default:
        return <FiMessageSquare className="w-4 h-4" />;
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
                Property Inquiries
              </h1>
              <p className="text-agent-text">
                Manage and respond to inquiries for YOUR properties. You handle inquiries directly - no admin approval needed.
              </p>
              {/* Debug info - remove in production */}
              <p className="text-xs text-agent-text/50 mt-1">
                Logged in as: {user?.name} ({user?.role})
              </p>
            </div>
            {unreadCount > 0 && (
              <div className="bg-agent-primary text-white px-4 py-2 rounded-full">
                <span className="text-sm font-medium">
                  {unreadCount} unread inquir{unreadCount === 1 ? 'y' : 'ies'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-card p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-agent-text/50" />
              <input
                type="text"
                placeholder="Search inquiries by name, email, property, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-agent-text/50" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="read">Read</option>
                <option value="responded">Responded</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inquiries List */}
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
            <div key={inquiry._id} className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-card-hover transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between">
                  {/* Inquiry Header */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-agent-primary/10 rounded-full flex items-center justify-center">
                        <FiUser className="w-6 h-6 text-agent-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-agent-text">{inquiry.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-agent-text/70">
                          <div className="flex items-center gap-1">
                            <FiMail className="w-4 h-4" />
                            <span>{inquiry.email}</span>
                          </div>
                          {inquiry.phone && (
                            <div className="flex items-center gap-1">
                              <FiPhone className="w-4 h-4" />
                              <span>{inquiry.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Property Info */}
                    {inquiry.property && (
                      <div className="bg-agent-light/30 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <FiHome className="w-4 h-4 text-agent-secondary" />
                          <span className="font-medium text-agent-text">{inquiry.property.title}</span>
                        </div>
                        {inquiry.property.location && (
                          <div className="flex items-center gap-1 text-sm text-agent-text/70">
                            <FiMapPin className="w-3 h-3" />
                            <span>{inquiry.property.location.city}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Message */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-agent-text mb-2">Message:</h4>
                      <p className="text-agent-text/80 bg-neutral-50 p-3 rounded-lg">
                        {inquiry.message}
                      </p>
                    </div>

                    {/* Response */}
                    {inquiry.response && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-agent-text mb-2">Your Response:</h4>
                        <p className="text-agent-text/80 bg-agent-light/20 p-3 rounded-lg border-l-4 border-agent-secondary">
                          {inquiry.response}
                        </p>
                        <p className="text-xs text-agent-text/60 mt-1">
                          Responded on {formatDate(inquiry.respondedAt)}
                        </p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full border ${getStatusBadgeColor(inquiry.status)}`}>
                          {getStatusIcon(inquiry.status)}
                          {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-agent-text/60">
                          <FiCalendar className="w-3 h-3" />
                          <span>{formatDate(inquiry.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="relative ml-4 dropdown-container">
                    <button
                      onClick={() => setShowDropdown(showDropdown === inquiry._id ? null : inquiry._id)}
                      className="text-agent-text/70 hover:text-agent-text p-2 rounded-full hover:bg-neutral-100 transition-colors"
                    >
                      <FiMoreVertical className="w-5 h-5" />
                    </button>
                    
                    {showDropdown === inquiry._id && (
                      <div 
                        className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg z-20 border border-neutral-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="py-1">
                          {inquiry.status === 'pending' && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Mark as read clicked for:', inquiry._id);
                                handleMarkAsRead(inquiry._id);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-agent-text hover:bg-neutral-50 transition-colors cursor-pointer"
                            >
                              <FiEye className="w-4 h-4 mr-2" />
                              Mark as Read
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              console.log('Send response clicked for:', inquiry._id);
                              setSelectedInquiry(inquiry);
                              setResponseText(inquiry.response || '');
                              setShowResponseModal(true);
                              setShowDropdown(null);
                            }}
                            className="flex items-center w-full px-4 py-2 text-sm text-agent-text hover:bg-neutral-50 transition-colors cursor-pointer"
                          >
                            <FiCornerUpLeft className="w-4 h-4 mr-2" />
                            {inquiry.response ? 'Update Response' : 'Send Response'}
                          </button>
                          {(user?.role === 'admin' || user?.role === 'agent') && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log('Delete clicked for:', inquiry._id, 'User role:', user?.role);
                                handleDeleteInquiry(inquiry._id);
                              }}
                              className="flex items-center w-full px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 transition-colors cursor-pointer"
                            >
                              <FiTrash2 className="w-4 h-4 mr-2" />
                              Delete Inquiry
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredInquiries.length === 0 && (
          <div className="bg-white rounded-lg shadow-card p-12 text-center">
            <FiMessageSquare className="mx-auto h-12 w-12 text-agent-text/30 mb-4" />
            <h3 className="text-lg font-medium text-agent-text mb-2">No inquiries found</h3>
            <p className="text-agent-text/70">
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your search or filter criteria.'
                : 'No inquiries have been received yet. When customers inquire about your properties, they will appear here.'
              }
            </p>
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

      {/* Response Modal */}
      {showResponseModal && selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-agent-text">
                  {selectedInquiry.response ? 'Update Response' : 'Send Response'}
                </h3>
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setSelectedInquiry(null);
                    setResponseText('');
                  }}
                  className="text-agent-text/70 hover:text-agent-text"
                >
                  <FiXCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Inquiry Details */}
              <div className="bg-neutral-50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <FiUser className="w-4 h-4 text-agent-primary" />
                  <span className="font-medium">{selectedInquiry.name}</span>
                  <span className="text-agent-text/70">({selectedInquiry.email})</span>
                </div>
                <p className="text-sm text-agent-text/80 mb-2">
                  <strong>Property:</strong> {selectedInquiry.property?.title}
                </p>
                <p className="text-sm text-agent-text/80">
                  <strong>Message:</strong> {selectedInquiry.message}
                </p>
              </div>

              {/* Response Form */}
              <div className="mb-6">
                <label htmlFor="response" className="block text-sm font-medium text-agent-text mb-2">
                  Your Response
                </label>
                <textarea
                  id="response"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
                  placeholder="Type your response to the customer..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowResponseModal(false);
                    setSelectedInquiry(null);
                    setResponseText('');
                  }}
                  className="px-4 py-2 text-sm border border-neutral-300 rounded-md hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendResponse}
                  disabled={!responseText.trim()}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-agent-primary text-white rounded-md hover:bg-agent-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend className="w-4 h-4" />
                  {selectedInquiry.response ? 'Update Response' : 'Send Response'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesPage;