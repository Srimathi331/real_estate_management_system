import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProperty } from '../context/PropertyContext';
import PropertyCard from '../components/property/PropertyCard';
import PropertyFilters from '../components/property/PropertyFilters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { FiGrid, FiList, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const PropertiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    properties, 
    loading, 
    pagination, 
    filters, 
    getProperties, 
    setFilters 
  } = useProperty();
  
  const [viewMode, setViewMode] = useState('grid');

  // Initialize filters from URL params
  useEffect(() => {
    const urlFilters = {
      search: searchParams.get('search') || '',
      type: searchParams.get('type') || '',
      category: searchParams.get('category') || '',
      priceMin: searchParams.get('priceMin') || '',
      priceMax: searchParams.get('priceMax') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      bathrooms: searchParams.get('bathrooms') || '',
      location: searchParams.get('location') || '',
      amenities: searchParams.getAll('amenities') || [],
      sort: searchParams.get('sort') || '-createdAt',
    };

    setFilters(urlFilters);
  }, [searchParams]); // Removed setFilters from dependencies

  // Fetch properties when filters change
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const page = searchParams.get('page') || 1;
        await getProperties({ 
          ...filters, 
          page: page,
          limit: 12 
        });
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    // Only fetch if we have filters set
    if (Object.keys(filters).length > 0) {
      fetchProperties();
    }
  }, [filters, searchParams, getProperties]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '' && !(Array.isArray(value) && value.length === 0)) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v));
        } else {
          params.set(key, value);
        }
      }
    });
    
    // Reset to page 1 when filters change
    params.delete('page');
    setSearchParams(params);
  };

  const handleSearch = () => {
    // Trigger search with current filters
    getProperties({ ...filters, page: 1, limit: 12 });
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    setSearchParams(params);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWishlistChange = (propertyId, isAdded) => {
    // Update the property in the list to reflect wishlist status
    // This is handled by the PropertyCard component
  };

  const renderPagination = () => {
    if (pagination.pages <= 1) return null;

    const pages = [];
    const currentPage = pagination.page;
    const totalPages = pagination.pages;

    // Always show first page
    pages.push(1);

    // Add ellipsis if needed
    if (currentPage > 3) {
      pages.push('...');
    }

    // Add pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Add ellipsis if needed
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Always show last page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-md border border-properties-primary hover:bg-properties-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiChevronLeft />
        </button>

        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && handlePageChange(page)}
            disabled={page === '...'}
            className={`px-3 py-2 rounded-md transition-colors ${
              page === currentPage
                ? 'bg-properties-primary text-white'
                : page === '...'
                ? 'cursor-default text-properties-text'
                : 'border border-properties-primary text-properties-primary hover:bg-properties-light'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-md border border-properties-primary hover:bg-properties-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FiChevronRight />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen page-properties">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gradient-properties mb-4">
            Discover Properties
          </h1>
          <p className="text-properties-text text-lg mb-6">
            {pagination.total > 0 
              ? `Showing ${((pagination.page - 1) * 12) + 1}-${Math.min(pagination.page * 12, pagination.total)} of ${pagination.total} premium properties`
              : 'No properties found matching your criteria'
            }
          </p>
        </div>

        {/* Filters */}
        <PropertyFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          loading={loading}
        />

        {/* View Mode Toggle & Results */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-properties-text">View:</span>
            <div className="flex border border-properties-primary rounded-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-properties-primary text-white'
                    : 'bg-white text-properties-text hover:bg-properties-light'
                }`}
              >
                <FiGrid />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-properties-primary text-white'
                    : 'bg-white text-properties-text hover:bg-properties-light'
                }`}
              >
                <FiList />
              </button>
            </div>
          </div>

          {pagination.total > 0 && (
            <p className="text-sm text-properties-text">
              Page {pagination.page} of {pagination.pages}
            </p>
          )}
        </div>

        {/* Properties Grid/List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : properties.length > 0 ? (
          <>
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {properties.map((property) => (
                <PropertyCard
                  key={property._id}
                  property={property}
                  onWishlistChange={handleWishlistChange}
                />
              ))}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FiGrid size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No properties found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={() => handleFiltersChange({
                search: '',
                type: '',
                category: '',
                priceMin: '',
                priceMax: '',
                bedrooms: '',
                bathrooms: '',
                location: '',
                amenities: [],
                sort: '-createdAt',
              })}
              className="btn-properties px-6 py-3"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;