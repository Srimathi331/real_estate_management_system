import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiFileText, FiUsers, FiAlertTriangle, FiShield } from 'react-icons/fi';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen page-terms py-8">
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Last updated: January 30, 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose max-w-none">
            
            {/* Introduction */}
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <FiFileText className="text-blue-600 mr-3 text-xl" />
                <h2 className="text-2xl font-semibold text-gray-900">Agreement to Terms</h2>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Welcome to Urban Hive! These Terms of Service ("Terms") govern your use of our real estate platform 
                and services. By accessing or using our platform, you agree to be bound by these Terms. 
                If you do not agree to these Terms, please do not use our services.
              </p>
            </section>

            {/* Definitions */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Definitions</h2>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>"Platform"</strong> refers to the Urban Hive website and mobile applications</li>
                <li><strong>"Services"</strong> refers to all features and functionality provided by Urban Hive</li>
                <li><strong>"User"</strong> refers to any person who accesses or uses our Platform</li>
                <li><strong>"Agent"</strong> refers to licensed real estate professionals using our Platform</li>
                <li><strong>"Content"</strong> refers to all information, data, and materials on our Platform</li>
              </ul>
            </section>

            {/* User Accounts */}
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <FiUsers className="text-blue-600 mr-3 text-xl" />
                <h2 className="text-2xl font-semibold text-gray-900">User Accounts</h2>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">Account Creation</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li>You must be at least 18 years old to create an account</li>
                <li>One person may not maintain multiple accounts</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Account Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Keep your account information current and accurate</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
                <li>You are liable for all activities that occur under your account</li>
                <li>We reserve the right to suspend or terminate accounts that violate these Terms</li>
              </ul>
            </section>

            {/* Platform Use */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptable Use</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">Permitted Uses</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Search for and view property listings</li>
                <li>Contact real estate agents and property owners</li>
                <li>Save properties to your wishlist</li>
                <li>Post legitimate property listings (for agents)</li>
                <li>Communicate with other users for real estate purposes</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Prohibited Uses</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Post false, misleading, or fraudulent property information</li>
                <li>Use the Platform for any illegal or unauthorized purpose</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Scrape or collect data from the Platform without permission</li>
                <li>Spam or send unsolicited communications</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            {/* Property Listings */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Property Listings</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">Listing Requirements</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>All property information must be accurate and current</li>
                <li>Photos must be genuine and represent the actual property</li>
                <li>Pricing must be legitimate and not misleading</li>
                <li>You must have proper authorization to list the property</li>
              </ul>

              <h3 className="text-lg font-medium text-gray-900 mb-3">Our Rights</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>We may review and approve listings before publication</li>
                <li>We reserve the right to remove listings that violate our policies</li>
                <li>We may modify or enhance listing information for clarity</li>
                <li>We do not guarantee the accuracy of third-party listings</li>
              </ul>
            </section>

            {/* Payments and Fees */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payments and Fees</h2>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Basic platform access is free for users and buyers</li>
                <li>Premium features may require subscription fees</li>
                <li>Real estate agents may be subject to listing fees</li>
                <li>All fees are clearly disclosed before payment</li>
                <li>Refunds are subject to our refund policy</li>
                <li>You are responsible for all applicable taxes</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Intellectual Property</h2>
              
              <h3 className="text-lg font-medium text-gray-900 mb-3">Our Content</h3>
              <p className="text-gray-700 mb-4">
                The Platform and its content, including but not limited to text, graphics, logos, images, 
                and software, are owned by Urban Hive and protected by intellectual property laws.
              </p>

              <h3 className="text-lg font-medium text-gray-900 mb-3">User Content</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>You retain ownership of content you submit to the Platform</li>
                <li>You grant us a license to use, display, and distribute your content</li>
                <li>You represent that you have the right to submit the content</li>
                <li>You are responsible for ensuring your content doesn't infringe others' rights</li>
              </ul>
            </section>

            {/* Disclaimers */}
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <FiAlertTriangle className="text-yellow-600 mr-3 text-xl" />
                <h2 className="text-2xl font-semibold text-gray-900">Disclaimers</h2>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 font-medium mb-2">Important Notice:</p>
                <p className="text-yellow-700">
                  Urban Hive is a platform that connects buyers, sellers, and real estate professionals. 
                  We do not directly engage in real estate transactions.
                </p>
              </div>

              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>We do not guarantee the accuracy of property information</li>
                <li>We are not responsible for the conduct of users or agents</li>
                <li>Property availability and pricing may change without notice</li>
                <li>We do not provide legal, financial, or real estate advice</li>
                <li>Users should conduct their own due diligence</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <FiShield className="text-red-600 mr-3 text-xl" />
                <h2 className="text-2xl font-semibold text-gray-900">Limitation of Liability</h2>
              </div>
              
              <p className="text-gray-700 mb-4">
                To the maximum extent permitted by law, Urban Hive shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Loss of profits, data, or business opportunities</li>
                <li>Damages resulting from property transactions</li>
                <li>Errors or omissions in property information</li>
                <li>Unauthorized access to your account</li>
                <li>Service interruptions or technical issues</li>
              </ul>
            </section>

            {/* Termination */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Termination</h2>
              
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>You may terminate your account at any time</li>
                <li>We may suspend or terminate accounts for Terms violations</li>
                <li>Termination does not affect existing obligations</li>
                <li>We may retain certain information as required by law</li>
                <li>Provisions that should survive termination will remain in effect</li>
              </ul>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Governing Law</h2>
              
              <p className="text-gray-700">
                These Terms are governed by the laws of India. Any disputes arising from these Terms 
                or your use of the Platform will be subject to the exclusive jurisdiction of the courts 
                in [Your City], India.
              </p>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              
              <p className="text-gray-700 mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> legal@urbanhive.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +91 (555) 123-4567</p>
                <p className="text-gray-700"><strong>Address:</strong> 123 Urban Hive St, Property City, PC 12345</p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. We will notify users of material 
                changes by posting the updated Terms on our Platform and updating the "Last updated" date. 
                Your continued use of the Platform after changes constitutes acceptance of the new Terms.
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;