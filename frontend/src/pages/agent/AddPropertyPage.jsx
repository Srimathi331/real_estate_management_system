import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiMapPin, 
  FiDollarSign, 
  FiImage, 
  FiPlus, 
  FiX,
  FiSave,
  FiArrowLeft,
  FiInfo,
  FiSettings
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../api/axios';

const AddPropertyPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'buy',
    category: 'apartment',
    status: 'available',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    features: {
      bedrooms: 1,
      bathrooms: 1,
      area: '',
      areaUnit: 'sqft',
      parking: 0,
      furnished: 'unfurnished',
      yearBuilt: new Date().getFullYear()
    },
    amenities: []
  });

  const propertyTypes = [
    { value: 'buy', label: 'For Sale' },
    { value: 'rent', label: 'For Rent' }
  ];

  const propertyCategories = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'house', label: 'House' },
    { value: 'villa', label: 'Villa' },
    { value: 'condo', label: 'Condo' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'office', label: 'Office' }
  ];

  const propertyStatus = [
    { value: 'available', label: 'Available' },
    { value: 'sold', label: 'Sold' },
    { value: 'rented', label: 'Rented' }
  ];

  const furnishedOptions = [
    { value: 'unfurnished', label: 'Unfurnished' },
    { value: 'semi-furnished', label: 'Semi Furnished' },
    { value: 'fully-furnished', label: 'Fully Furnished' }
  ];

  const areaUnits = [
    { value: 'sqft', label: 'Square Feet' },
    { value: 'sqm', label: 'Square Meters' }
  ];

  const availableAmenities = [
    'swimming-pool', 'gym', 'garden', 'parking', 'security', 'elevator',
    'air-conditioning', 'balcony', 'fireplace', 'laundry', 'storage', 
    'pet-friendly', 'wheelchair-accessible', 'smart-home', 'solar-panels',
    'cctv', 'intercom', 'club-house', 'play-area', 'power-backup'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 10) {
      alert('Maximum 10 images allowed');
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.title.trim()) {
      alert('Property title is required');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Property description is required');
      return;
    }
    
    if (!formData.price || parseFloat(formData.price) <= 0) {
      alert('Valid price is required');
      return;
    }
    
    if (!formData.location.address.trim()) {
      alert('Address is required');
      return;
    }
    
    if (!formData.location.city.trim()) {
      alert('City is required');
      return;
    }
    
    if (!formData.location.state.trim()) {
      alert('State is required');
      return;
    }
    
    if (!formData.features.area || parseFloat(formData.features.area) < 1) {
      alert('Area must be at least 1 square foot');
      return;
    }
    
    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Append basic form data
      submitData.append('title', formData.title.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('price', formData.price);
      submitData.append('type', formData.type);
      submitData.append('category', formData.category);
      submitData.append('status', formData.status);
      
      // Append location fields individually
      submitData.append('location.address', formData.location.address.trim());
      submitData.append('location.city', formData.location.city.trim());
      submitData.append('location.state', formData.location.state.trim());
      submitData.append('location.zipCode', formData.location.zipCode.trim());
      submitData.append('location.country', formData.location.country.trim());
      
      // Append features fields individually
      submitData.append('features.bedrooms', formData.features.bedrooms.toString());
      submitData.append('features.bathrooms', formData.features.bathrooms.toString());
      submitData.append('features.area', formData.features.area.toString());
      submitData.append('features.areaUnit', formData.features.areaUnit);
      submitData.append('features.parking', formData.features.parking.toString());
      submitData.append('features.furnished', formData.features.furnished);
      submitData.append('features.yearBuilt', formData.features.yearBuilt.toString());
      
      // Append amenities as individual items
      formData.amenities.forEach((amenity, index) => {
        submitData.append(`amenities[${index}]`, amenity);
      });

      // Append images
      images.forEach((image) => {
        submitData.append('images', image);
      });

      console.log('Submitting form data:');
      for (let [key, value] of submitData.entries()) {
        console.log(key, value);
      }

      const response = await api.post('/properties', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert('Property added successfully! Pending admin approval.');
        navigate('/my-properties');
      }
    } catch (error) {
      console.error('Error adding property:', error);
      alert(error.response?.data?.message || 'Failed to add property');
    } finally {
      setLoading(false);
    }
  };

  const formatAmenityLabel = (amenity) => {
    return amenity.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="page-agent min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate('/agent-dashboard')}
              className="p-2 rounded-lg bg-white shadow-card hover:shadow-card-hover transition-shadow"
            >
              <FiArrowLeft className="w-5 h-5 text-agent-text" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gradient-agent">Add New Property</h1>
              <p className="text-agent-text/70 mt-1">Create a new property listing</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-agent-primary/10">
                <FiInfo className="w-5 h-5 text-agent-primary" />
              </div>
              <h2 className="text-xl font-semibold text-agent-text">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Property Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-primary focus:border-transparent"
                  placeholder="Enter property title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Property Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-primary focus:border-transparent"
                  required
                >
                  {propertyTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-primary focus:border-transparent"
                  required
                >
                  {propertyCategories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Price ({formData.type === 'rent' ? 'per month' : 'total'}) *
                </label>
                <div className="relative">
                  <FiDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-agent-text/50" />
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-primary focus:border-transparent"
                    placeholder="Enter price in INR"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-primary focus:border-transparent"
                >
                  {propertyStatus.map(status => (
                    <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-primary focus:border-transparent"
                  placeholder="Describe your property..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-agent-secondary/10">
                <FiMapPin className="w-5 h-5 text-agent-secondary" />
              </div>
              <h2 className="text-xl font-semibold text-agent-text">Location Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-primary focus:border-transparent"
                  placeholder="Enter full address"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-agent-text mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-primary focus:border-transparent"
                  placeholder="Enter city"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-agent-text mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-primary focus:border-transparent"
                  placeholder="Enter state"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-agent-text mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  name="location.zipCode"
                  value={formData.location.zipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-primary focus:border-transparent"
                  placeholder="Enter ZIP code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-primary focus:border-transparent"
                  placeholder="Enter country"
                />
              </div>
            </div>
          </div>

          {/* Property Features */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-success-500/10">
                <FiSettings className="w-5 h-5 text-success-500" />
              </div>
              <h2 className="text-xl font-semibold text-agent-text">Property Features</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="features.bedrooms"
                  value={formData.features.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="features.bathrooms"
                  value={formData.features.bathrooms}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Parking Spaces
                </label>
                <input
                  type="number"
                  name="features.parking"
                  value={formData.features.parking}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Area *
                </label>
                <input
                  type="number"
                  name="features.area"
                  value={formData.features.area}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-primary focus:border-transparent"
                  placeholder="Enter area"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Area Unit
                </label>
                <select
                  name="features.areaUnit"
                  value={formData.features.areaUnit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-primary focus:border-transparent"
                >
                  {areaUnits.map(unit => (
                    <option key={unit.value} value={unit.value}>{unit.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Year Built
                </label>
                <input
                  type="number"
                  name="features.yearBuilt"
                  value={formData.features.yearBuilt}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-primary focus:border-transparent"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Furnished Status
                </label>
                <select
                  name="features.furnished"
                  value={formData.features.furnished}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-primary focus:border-transparent"
                >
                  {furnishedOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <FiPlus className="w-5 h-5 text-purple-500" />
              </div>
              <h2 className="text-xl font-semibold text-agent-text">Amenities</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {availableAmenities.map(amenity => (
                <label key={amenity} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-4 h-4 text-agent-primary border-neutral-300 rounded focus:ring-agent-primary"
                  />
                  <span className="text-sm text-agent-text">{formatAmenityLabel(amenity)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-warning-500/10">
                <FiImage className="w-5 h-5 text-warning-500" />
              </div>
              <h2 className="text-xl font-semibold text-agent-text">Property Images</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Upload Images (Max 10)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-primary focus:border-transparent"
                />
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/agent-dashboard')}
              className="px-6 py-3 border border-neutral-300 text-agent-text rounded-lg hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-agent flex items-center gap-2 px-8 py-3"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <FiSave className="w-5 h-5" />
              )}
              {loading ? 'Adding Property...' : 'Add Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyPage;