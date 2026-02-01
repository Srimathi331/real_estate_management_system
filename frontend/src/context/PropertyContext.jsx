import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { propertyService } from '../api/services';
import toast from 'react-hot-toast';

const PropertyContext = createContext();

const initialState = {
  properties: [],
  property: null,
  myProperties: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
    limit: 12,
  },
  filters: {
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
  },
};

const propertyReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_PROPERTIES':
      return {
        ...state,
        properties: action.payload.properties,
        pagination: action.payload.pagination,
        loading: false,
        error: null,
      };
    case 'SET_PROPERTY':
      return { ...state, property: action.payload, loading: false, error: null };
    case 'SET_MY_PROPERTIES':
      return { ...state, myProperties: action.payload, loading: false, error: null };
    case 'ADD_PROPERTY':
      return {
        ...state,
        properties: [action.payload, ...state.properties],
        myProperties: [action.payload, ...state.myProperties],
      };
    case 'UPDATE_PROPERTY':
      return {
        ...state,
        properties: state.properties.map(p => 
          p._id === action.payload._id ? action.payload : p
        ),
        myProperties: state.myProperties.map(p => 
          p._id === action.payload._id ? action.payload : p
        ),
        property: state.property?._id === action.payload._id ? action.payload : state.property,
      };
    case 'DELETE_PROPERTY':
      return {
        ...state,
        properties: state.properties.filter(p => p._id !== action.payload),
        myProperties: state.myProperties.filter(p => p._id !== action.payload),
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'RESET_FILTERS':
      return { ...state, filters: initialState.filters };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const PropertyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(propertyReducer, initialState);

  const getProperties = useCallback(async (params = {}) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const queryParams = { ...state.filters, ...params };
      const response = await propertyService.getProperties(queryParams);
      dispatch({ type: 'SET_PROPERTIES', payload: response.data });
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch properties';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  }, [state.filters]);

  const getProperty = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await propertyService.getProperty(id);
      dispatch({ type: 'SET_PROPERTY', payload: response.data.property });
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch property';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  };

  const getMyProperties = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await propertyService.getMyProperties();
      dispatch({ type: 'SET_MY_PROPERTIES', payload: response.data.properties });
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch your properties';
      dispatch({ type: 'SET_ERROR', payload: message });
      throw error;
    }
  };

  const createProperty = async (propertyData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await propertyService.createProperty(propertyData);
      dispatch({ type: 'ADD_PROPERTY', payload: response.data.property });
      toast.success('Property created successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create property';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const updateProperty = async (id, propertyData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await propertyService.updateProperty(id, propertyData);
      dispatch({ type: 'UPDATE_PROPERTY', payload: response.data.property });
      toast.success('Property updated successfully!');
      return response;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update property';
      dispatch({ type: 'SET_ERROR', payload: message });
      toast.error(message);
      throw error;
    }
  };

  const deleteProperty = async (id) => {
    try {
      await propertyService.deleteProperty(id);
      dispatch({ type: 'DELETE_PROPERTY', payload: id });
      toast.success('Property deleted successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete property';
      toast.error(message);
      throw error;
    }
  };

  const setFilters = useCallback((filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);

  const value = {
    ...state,
    getProperties,
    getProperty,
    getMyProperties,
    createProperty,
    updateProperty,
    deleteProperty,
    setFilters,
    resetFilters,
  };

  return <PropertyContext.Provider value={value}>{children}</PropertyContext.Provider>;
};

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperty must be used within a PropertyProvider');
  }
  return context;
};