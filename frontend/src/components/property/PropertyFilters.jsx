import React, { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';

const PropertyFilters = ({ filters, onFiltersChange, onSearch, loading }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  // Sync local filters with prop changes
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const propertyTypes = [
    { value: '', label: 'All Types' },
    { value: 'buy', label: 'For Sale' },
    { value: 'rent', label: 'For Rent' },
  ];

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'office', label: 'Office' },
  ];

  const bedroomOptions = [
    { value: '', label: 'Any' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
    { value: '5', label: '5+' },
  ];

  const bathroomOptions = [
    { value: '', label: 'Any' },
    { value: '1', label: '1+' },
    { value: '2', label: '2+' },
    { value: '3', label: '3+' },
    { value: '4', label: '4+' },
  ];

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: '-views', label: 'Most Viewed' },
    { value: 'title', label: 'Name: A to Z' },
  ];

  const amenities = [
    'Parking', 'Swimming Pool', 'Gym', 'Garden', 'Balcony', 'Elevator',
    'Security', 'Power Backup', 'Water Supply', 'Internet', 'AC', 'Furnished'
  ];

  const handleInputChange = (name, value) => {
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleAmenityToggle = (amenity) => {
    const currentAmenities = localFilters.amenities || [];
    const newAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter(a => a !== amenity)
      : [...currentAmenities, amenity];
    
    const newFilters = { ...localFilters, amenities: newAmenities };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch();
  };

  const clearFilters = () => {
    const clearedFilters = {
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
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = () => {
    return localFilters.search || localFilters.type || localFilters.category || 
           localFilters.priceMin || localFilters.priceMax || localFilters.bedrooms || 
           localFilters.bathrooms || localFilters.location || 
           (localFilters.amenities && localFilters.amenities.length > 0);
  };

  return (
    <div className="card-glass p-6 mb-6 border border-properties-primary/20">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-properties-primary" />
            <input
              type="text"
              placeholder="Search properties by title, location, or description..."
              value={localFilters.search}
              onChange={(e) => handleInputChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-properties-primary/30 rounded-xl focus:ring-2 focus:ring-properties-secondary focus:border-properties-secondary bg-white/90 backdrop-blur-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-properties px-6 py-3 disabled:opacity-50"
          >
            Search
          </button>
        </div>
      </form>

      {/* Quick Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="relative">
          <select
            value={localFilters.type || ''}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full appearance-none border border-properties-primary/30 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-properties-secondary focus:border-properties-secondary bg-white/90 backdrop-blur-sm text-properties-text cursor-pointer"
          >
            {propertyTypes.map(type => (
              <option key={type.value} value={type.value} className="bg-white text-gray-900">
                {type.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-properties-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <select
            value={localFilters.category || ''}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className="w-full appearance-none border border-properties-primary/30 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-properties-secondary focus:border-properties-secondary bg-white/90 backdrop-blur-sm text-properties-text cursor-pointer"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value} className="bg-white text-gray-900">
                {category.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-properties-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <input
          type="text"
          placeholder="Location (city, area)"
          value={localFilters.location || ''}
          onChange={(e) => handleInputChange('location', e.target.value)}
          className="border border-properties-primary/30 rounded-xl px-4 py-3 focus:ring-2 focus:ring-properties-secondary focus:border-properties-secondary bg-white/90 backdrop-blur-sm placeholder:text-gray-500"
        />

        <div className="relative">
          <select
            value={localFilters.sort || '-createdAt'}
            onChange={(e) => handleInputChange('sort', e.target.value)}
            className="w-full appearance-none border border-properties-primary/30 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-properties-secondary focus:border-properties-secondary bg-white/90 backdrop-blur-sm text-properties-text cursor-pointer"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value} className="bg-white text-gray-900">
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-5 h-5 text-properties-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center space-x-2 text-properties-primary hover:text-properties-secondary transition-colors"
        >
          <FiFilter />
          <span>{showAdvanced ? 'Hide' : 'Show'} Advanced Filters</span>
        </button>

        {hasActiveFilters() && (
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <FiX />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Price (₹)
              </label>
              <input
                type="number"
                placeholder="Min Price"
                value={localFilters.priceMin}
                onChange={(e) => handleInputChange('priceMin', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Price (₹)
              </label>
              <input
                type="number"
                placeholder="Max Price"
                value={localFilters.priceMax}
                onChange={(e) => handleInputChange('priceMax', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <select
                value={localFilters.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {bedroomOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Bathrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <select
                value={localFilters.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {bathroomOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {amenities.map(amenity => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(localFilters.amenities || []).includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyFilters;