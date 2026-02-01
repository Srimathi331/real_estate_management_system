import React from 'react';
import { Link } from 'react-router-dom';
import { FiShield, FiHome, FiArrowLeft } from 'react-icons/fi';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center page-unauthorized">
      <div className="text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6">
            <FiShield className="w-12 h-12 text-red-600" />
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            You don't have permission to access this page. Please contact an administrator if you believe this is an error.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiHome />
            <span>Go Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            <FiArrowLeft />
            <span>Go Back</span>
          </button>
        </div>

        <div className="mt-12">
          <p className="text-sm text-gray-500">
            Need different access? <Link to="/contact" className="text-blue-600 hover:text-blue-700">Contact support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;