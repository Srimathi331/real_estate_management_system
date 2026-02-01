import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiShield, FiEye, FiLock, FiMail } from 'react-icons/fi';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen page-privacy py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <FiArrowLeft className="mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: January 30, 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose max-w-none">
            
            {/* Introduction */}
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <FiShield className="text-blue-600 mr-3 text-xl" />
                <h2 className="text-2xl font-semibold text-gray-900">Introduction</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                At Urban Hive, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                real estate platform and services.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <FiEye className="text-blue-600 mr-3 text-xl" />
                <h2 className="text-2xl font-semibold text-gray-900">Information We Collect</h2>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">Personal Information</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Name, email address, and phone number</li>
                <li>Profile information and preferences</li>
                <li>Property search history and saved properties</li>
                <li>Communication records with agents and other users</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Property Information</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Property listings and descriptions</li>
                <li>Photos and virtual tour data</li>
                <li>Location and neighborhood information</li>
                <li>Pricing and transaction history</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Technical Information</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>IP address and device information</li>
                <li>Browser type and operating system</li>
                <li>Usage patterns and site navigation</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            {/* How We Use Information */}
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <FiLock className="text-blue-600 mr-3 text-xl" />
                <h2 className="text-2xl font-semibold text-gray-900">How We Use Your Information</h2>
              </div>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide and improve our real estate services</li>
                <li>Connect buyers, sellers, and real estate agents</li>
                <li>Send property recommendations and market updates</li>
                <li>Process transactions and maintain records</li>
                <li>Ensure platform security and prevent fraud</li>
                <li>Comply with legal obligations and regulations</li>
                <li>Analyze usage patterns to enhance user experience</li>
              </ul>
            </section>

            {/* Information Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
              
              <p className="text-gray-700 mb-4">
                We may share your information in the following circumstances:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>With Real Estate Agents:</strong> When you express interest in a property</li>
                <li><strong>With Service Providers:</strong> Third-party vendors who assist our operations</li>
                <li><strong>For Legal Compliance:</strong> When required by law or legal process</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale</li>
                <li><strong>With Your Consent:</strong> When you explicitly agree to sharing</li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              
              <p className="text-gray-700 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Employee training on data protection</li>
                <li>Incident response and breach notification procedures</li>
              </ul>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              
              <p className="text-gray-700 mb-4">
                You have the following rights regarding your personal information:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Access:</strong> Request copies of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Objection:</strong> Object to processing of your personal data</li>
                <li><strong>Restriction:</strong> Request limitation of processing</li>
              </ul>
            </section>

            {/* Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookies and Tracking</h2>
              
              <p className="text-gray-700 mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand site usage</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements</li>
              </ul>
              
              <p className="text-gray-700 mt-4">
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <FiMail className="text-blue-600 mr-3 text-xl" />
                <h2 className="text-2xl font-semibold text-gray-900">Contact Us</h2>
              </div>
              
              <p className="text-gray-700 mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> privacy@urbanhive.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +91 (555) 123-4567</p>
                <p className="text-gray-700"><strong>Address:</strong> 123 Urban Hive St, Property City, PC 12345</p>
              </div>
            </section>

            {/* Updates */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Policy Updates</h2>
              
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any material changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date. 
                Your continued use of our services after any changes constitutes acceptance of the updated policy.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;