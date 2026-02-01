import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiMapPin, 
  FiDollarSign, 
  FiImage, 
  FiSave,
  FiArrowLeft,
  FiTrash2,
  FiPlus,
  FiX
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: 'buy',
    category: 'apartment',
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
    amenities: [],
    images: []
  });
  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

  const amenitiesList = [
    'swimming-pool', 'gym', 'garden', 'parking', 'security', 'elevator',
    'balcony', 'air-conditioning', 'heating', 'internet', 'cable-tv',
    'laundry', 'dishwasher', 'microwave', 'refrigerator', 'pets-allowed',
    'smoking-allowed', 'furnished', 'hardwood-floors', 'carpet',
    'tile-floors', 'high-ceilings', 'walk-in-closet', 'fireplace',
    'patio', 'deck', 'yard', 'garage', 'carport', 'storage',
    'basement', 'attic', 'loft', 'office', 'study', 'library',
    'game-room', 'home-theater', 'wine-cellar', 'sauna', 'hot-tub',
    'tennis-court', 'basketball-court', 'playground', 'clubhouse',
    'concierge', 'doorman', 'valet', 'housekeeping', 'maintenance',
    'utilities-included', 'water-included', 'electricity-included',
    'gas-included', 'trash-included', 'recycling', 'composting'
  ];

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/properties/${id}`);
      const propertyData = response.data.data.property;
      
      // Check if user can edit this property
      if (user.role !== 'admin' && propertyData.agent._id !== user._id) {
        toast.error('You are not authorized to edit this property');
        navigate('/my-properties');
        return;
      }

      setProperty(propertyData);
      setFormData({
        title: propertyData.title || '',
        description: propertyData.description || '',
        price: propertyData.price || '',
        type: propertyData.type || 'buy',
        category: propertyData.category || 'apartment',
        location: {
          address: propertyData.location?.address || '',
          city: propertyData.location?.city || '',
          state: propertyData.location?.state || '',
          zipCode: propertyData.location?.zipCode || '',
          country: propertyData.location?.country || 'India'
        },
        features: {
          bedrooms: propertyData.features?.bedrooms || 1,
          bathrooms: propertyData.features?.bathrooms || 1,
          area: propertyData.features?.area || '',
          areaUnit: propertyData.features?.areaUnit || 'sqft',
          parking: propertyData.features?.parking || 0,
          furnished: propertyData.features?.furnished || 'unfurnished',
          yearBuilt: propertyData.features?.yearBuilt || new Date().getFullYear()
        },
        amenities: propertyData.amenities || [],
        images: propertyData.images || []
      });
    } catch (error) {
      console.error('Error fetching property:', error);
      toast.error('Error loading property');
      navigate('/my-properties');
    } finally {
      setLoading(false);
    }
  };

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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (imageId) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img._id !== imageId)
    }));
    setImagesToDelete(prev => [...prev, imageId]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      
      const submitData = new FormData();
      
      // Add form data
      Object.keys(formData).forEach(key => {
        if (key === 'location' || key === 'features') {
          Object.keys(formData[key]).forEach(subKey => {
            submitData.append(`${key}.${subKey}`, formData[key][subKey]);
          });
        } else if (key === 'amenities') {
          formData[key].forEach(amenity => {
            submitData.append('amenities[]', amenity);
          });
        } else if (key !== 'images') {
          submitData.append(key, formData[key]);
        }
      });

      // Add new images
      newImages.forEach(image => {
        submitData.append('images', image);
      });

      // Add images to delete
      imagesToDelete.forEach(imageId => {
        submitData.append('imagesToDelete[]', imageId);
      });

      const response = await api.put(`/properties/${id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Property updated successfully!');
      navigate('/my-properties');
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error(error.response?.data?.message || 'Error updating property');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="page-agent min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="page-agent min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-agent-text mb-4">Property Not Found</h2>
          <button
            onClick={() => navigate('/my-properties')}
            className="btn-agent"
          >
            Back to My Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-agent min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/my-properties')}
            className="flex items-center text-agent-secondary hover:text-agent-primary transition-colors mb-4"
          >
            <FiArrowLeft className="w-4 h-4 mr-2" />
            Back to My Properties
          </button>
          <h1 className="text-3xl font-bold text-gradient-agent mb-2">
            Edit Property
          </h1>
          <p className="text-agent-text">
            Update your property listing information
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-agent-text mb-6 flex items-center">
              <FiHome className="w-5 h-5 mr-2" />
              Basic Information
            </h2>
            
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
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
                  placeholder="Enter property title"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
                  placeholder="Describe your property"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
                  placeholder="Enter price"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
                >
                  <option value="buy">For Sale</option>
                  <option value="rent">For Rent</option>
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
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                  <option value="office">Office</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-agent-text mb-6 flex items-center">
              <FiMapPin className="w-5 h-5 mr-2" />
              Location
            </h2>
            
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
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
                  placeholder="Enter full address"
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
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
                  placeholder="Enter city"
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
                  required
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
                  placeholder="Enter state"
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
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
                  placeholder="Enter ZIP code"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-agent-text mb-6">
              Property Features
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Bedrooms *
                </label>
                <input
                  type="number"
                  name="features.bedrooms"
                  value={formData.features.bedrooms}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Bathrooms *
                </label>
                <input
                  type="number"
                  name="features.bathrooms"
                  value={formData.features.bathrooms}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
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
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
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
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
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
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
                >
                  <option value="sqft">Square Feet</option>
                  <option value="sqm">Square Meters</option>
                  <option value="acres">Acres</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-agent-text mb-2">
                  Furnished
                </label>
                <select
                  name="features.furnished"
                  value={formData.features.furnished}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
                >
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-furnished</option>
                  <option value="fully-furnished">Fully-furnished</option>
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
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-agent-text mb-6">
              Amenities
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {amenitiesList.map((amenity) => (
                <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="rounded border-neutral-300 text-agent-secondary focus:ring-agent-secondary"
                  />
                  <span className="text-sm text-agent-text capitalize">
                    {amenity.replace(/-/g, ' ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-card p-6">
            <h2 className="text-xl font-semibold text-agent-text mb-6 flex items-center">
              <FiImage className="w-5 h-5 mr-2" />
              Property Images
            </h2>

            {/* Existing Images */}
            {formData.images.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-agent-text mb-3">Current Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={image._id || index} className="relative group">
                      <img
                        src={image.url}
                        alt={`Property ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(image._id)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Images */}
            {newImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-agent-text mb-3">New Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {newImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            <div>
              <label className="block text-sm font-medium text-agent-text mb-2">
                Add More Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-agent-secondary focus:border-agent-secondary"
              />
              <p className="text-xs text-agent-text/70 mt-1">
                You can select multiple images. Supported formats: JPG, PNG, WebP
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/my-properties')}
              className="px-6 py-3 border border-neutral-300 rounded-lg text-agent-text hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-agent flex items-center px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <FiSave className="w-4 h-4 mr-2" />
                  Update Property
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPropertyPage;