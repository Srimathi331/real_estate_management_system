import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProperty } from '../context/PropertyContext';
import PropertyCard from '../components/property/PropertyCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  FiSearch, 
  FiHome, 
  FiTrendingUp, 
  FiUsers, 
  FiStar,
  FiArrowRight,
  FiMapPin,
  FiDollarSign,
  FiAward,
  FiShield,
  FiClock,
  FiPhone,
  FiMail
} from 'react-icons/fi';

const HomePage = () => {
  const { getProperties, properties, loading } = useProperty();
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch featured properties
    const fetchFeaturedProperties = async () => {
      try {
        await getProperties({ isFeatured: true, limit: 6 });
      } catch (error) {
        console.error('Error fetching featured properties:', error);
      }
    };

    fetchFeaturedProperties();
  }, []);

  useEffect(() => {
    setFeaturedProperties(properties.slice(0, 6));
  }, [properties]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/properties');
    }
  };

  const stats = [
    { icon: FiHome, label: 'Properties Listed', value: '10,000+', color: 'text-home-primary' },
    { icon: FiUsers, label: 'Happy Customers', value: '5,000+', color: 'text-home-secondary' },
    { icon: FiTrendingUp, label: 'Properties Sold', value: '2,500+', color: 'text-home-primary' },
    { icon: FiStar, label: 'Years Experience', value: '15+', color: 'text-home-secondary' },
  ];

  const propertyTypes = [
    {
      title: 'Luxury Apartments',
      description: 'Modern apartments in prime locations with world-class amenities',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=300&fit=crop',
      link: '/properties?category=apartment',
      gradient: 'from-[#B0DB9C] to-[#9BC53D]',
    },
    {
      title: 'Family Houses',
      description: 'Beautiful houses perfect for families seeking comfort and space',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=300&fit=crop',
      link: '/properties?category=house',
      gradient: 'from-[#B0DB9C] to-[#8FBC8F]',
    },
    {
      title: 'Premium Villas',
      description: 'Exclusive villas with luxury amenities and stunning architecture',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500&h=300&fit=crop',
      link: '/properties?category=villa',
      gradient: 'from-[#B0DB9C] to-[#A4D65E]',
    },
    {
      title: 'Commercial Spaces',
      description: 'Prime office spaces and commercial properties for businesses',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&h=300&fit=crop',
      link: '/properties?category=commercial',
      gradient: 'from-[#B0DB9C] to-[#7CB342]',
    },
  ];

  const features = [
    {
      icon: FiShield,
      title: 'Verified Properties',
      description: 'All properties are thoroughly verified and authenticated',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: FiAward,
      title: 'Expert Agents',
      description: 'Work with certified and experienced real estate professionals',
      color: 'text-[#97A87A]',
      bg: 'bg-[#97A87A]/10',
    },
    {
      icon: FiClock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your queries',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Property Buyer',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      content: 'Found my dream home within weeks! The platform is incredibly user-friendly and the agents are very professional.',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Real Estate Investor',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      content: 'Excellent service and great property selection. The detailed filters helped me find exactly what I was looking for.',
      rating: 5,
    },
    {
      name: 'Emily Davis',
      role: 'First-time Buyer',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      content: 'The team guided me through every step of the buying process. Highly recommend for first-time buyers!',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen page-home">
      {/* Hero Section */}
      <section className="hero-section relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 pattern-dots opacity-30"></div>
        
        {/* Hero Content */}
        <div className="relative container-custom section-padding text-white">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-hero font-black mb-6 text-shadow-lg tracking-tight">
              Find Your
              <span className="block text-home-secondary font-hero">Dream Property</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 font-clean font-light leading-relaxed">
              Discover luxury homes, modern apartments, and prime commercial spaces 
              <br className="hidden md:block" />
              in the most desirable locations
            </p>

            {/* Enhanced Search Form */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-12">
              <div className="card-glass p-3 border border-white/20">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 relative">
                    <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-xl" />
                    <input
                      type="text"
                      placeholder="Search by location, property type, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="input-glass w-full pl-12 pr-4 py-4"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-home px-8 py-4"
                  >
                    <span className="hidden md:inline">Search Properties</span>
                    <FiSearch className="md:hidden text-xl" />
                  </button>
                </div>
              </div>
            </form>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up animate-delay-200">
              <Link
                to="/properties?type=buy"
                className="group px-6 py-3 card-glass hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 rounded-full"
              >
                <FiHome className="group-hover:scale-110 transition-transform" />
                <span>Buy Properties</span>
              </Link>
              <Link
                to="/properties?type=rent"
                className="group px-6 py-3 card-glass hover:bg-white/20 transition-all duration-300 flex items-center space-x-2 rounded-full"
              >
                <FiMapPin className="group-hover:scale-110 transition-transform" />
                <span>Rent Properties</span>
              </Link>
              <Link
                to="/register?role=agent"
                className="group px-6 py-3 bg-home-secondary/20 backdrop-blur-sm border border-home-secondary/30 rounded-full hover:bg-home-secondary/30 transition-all duration-300 flex items-center space-x-2"
              >
                <FiUsers className="group-hover:scale-110 transition-transform" />
                <span>Become an Agent</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-home-secondary/20 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/10 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-home-secondary/30 rounded-full animate-bounce-gentle"></div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-20 relative overflow-hidden">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group animate-fade-in-up hover:scale-105 transition-all duration-500"
                style={{animationDelay: `${index * 150}ms`}}
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-home-primary/10 to-home-secondary/10 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                  <stat.icon className={`text-3xl ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                </div>
                <h3 className="text-4xl font-bold text-home-primary mb-2 font-tech group-hover:text-home-secondary transition-colors duration-300">{stat.value}</h3>
                <p className="text-gray-600 font-medium group-hover:text-gray-800 transition-colors duration-300 font-clean">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="types-section py-20">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-modern font-bold text-white mb-6">
              Explore Property Types
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              From luxury apartments to commercial spaces, find the perfect property 
              that matches your lifestyle and investment goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {propertyTypes.map((type, index) => (
              <Link
                key={index}
                to={type.link}
                className="group card-hover animate-fade-in-up hover:scale-105 hover:-rotate-1 transition-all duration-500"
                style={{animationDelay: `${index * 150}ms`}}
              >
                <div className="relative h-64 overflow-hidden rounded-t-xl">
                  <img
                    src={type.image}
                    alt={type.title}
                    className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${type.gradient} opacity-80 group-hover:opacity-70 transition-opacity duration-300`}></div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white transform group-hover:translate-y-[-4px] transition-transform duration-300">
                    <h3 className="text-xl font-bold mb-2 font-heading">{type.title}</h3>
                    <p className="text-sm opacity-90 line-clamp-2">{type.description}</p>
                  </div>
                </div>
                
                <div className="p-6 bg-white rounded-b-xl group-hover:bg-gray-50 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <span className="text-home-primary font-semibold group-hover:text-home-secondary transition-colors duration-300">Explore Collection</span>
                    <FiArrowRight className="text-home-primary group-hover:translate-x-3 group-hover:text-home-secondary transition-all duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="featured-section py-20">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-16">
            <div className="animate-fade-in-left">
              <h2 className="text-4xl md:text-5xl font-luxury font-bold text-home-primary mb-4">
                Featured Properties
              </h2>
              <p className="text-xl text-gray-600">
                Handpicked premium properties just for you
              </p>
            </div>
            <Link
              to="/properties"
              className="hidden md:flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-home-primary to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-right"
            >
              <span>View All Properties</span>
              <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property, index) => (
                <div 
                  key={property._id} 
                  className="animate-fade-in-up"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12 md:hidden">
            <Link
              to="/properties"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-home-primary to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>View All Properties</span>
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section py-20">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-modern font-bold text-home-primary mb-6">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide exceptional service and expertise to make your real estate journey smooth and successful
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`${feature.bg} p-8 rounded-2xl text-center group hover:shadow-xl hover:-translate-y-2 transition-all duration-500 animate-fade-in-up border border-transparent hover:border-white/20`}
                style={{animationDelay: `${index * 200}ms`}}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} bg-white rounded-2xl mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                  <feature.icon className="text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-heading group-hover:text-gray-800 transition-colors duration-300">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works-section py-20">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-hero font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Simple steps to find and secure your perfect property
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: '01',
                icon: FiSearch,
                title: 'Search Properties',
                description: 'Browse through thousands of verified properties using our advanced search filters and find exactly what you need.',
              },
              {
                step: '02',
                icon: FiMapPin,
                title: 'Visit & Inspect',
                description: 'Schedule visits with our expert agents and explore properties that match your requirements and budget.',
              },
              {
                step: '03',
                icon: FiDollarSign,
                title: 'Secure Your Deal',
                description: 'Complete the paperwork with our legal support and move into your dream property with confidence.',
              },
            ].map((step, index) => (
              <div 
                key={index}
                className="text-center group animate-fade-in-up hover:scale-105 transition-all duration-500"
                style={{animationDelay: `${index * 250}ms`}}
              >
                <div className="relative mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-home-primary to-[#97A87A] text-white rounded-2xl mb-4 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-2xl">
                    <step.icon className="text-2xl" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-home-secondary text-white rounded-full flex items-center justify-center text-sm font-bold animate-pulse group-hover:animate-bounce">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 font-modern group-hover:text-gray-200 transition-colors duration-300">{step.title}</h3>
                <p className="text-gray-200 leading-relaxed group-hover:text-gray-100 transition-colors duration-300 font-clean">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section py-20">
        <div className="container-custom">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-elegant font-bold text-home-primary mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 animate-fade-in-up group border border-transparent hover:border-[#97A87A]/30"
                style={{animationDelay: `${index * 200}ms`}}
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4 group-hover:scale-110 transition-transform duration-300"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-[#97A87A] transition-colors duration-300 font-elegant">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 font-clean">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="text-home-secondary fill-current group-hover:scale-110 transition-transform duration-300" style={{animationDelay: `${i * 100}ms`}} />
                  ))}
                </div>
                
                <p className="text-gray-700 leading-relaxed italic group-hover:text-gray-800 transition-colors duration-300">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 text-white relative overflow-hidden"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
        <div className="relative container-custom text-center z-20">
          <div className="max-w-4xl mx-auto animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-hero font-bold mb-6">
              Ready to Find Your Dream Property?
            </h2>
            <p className="text-xl mb-12 text-blue-100 leading-relaxed">
              Join thousands of satisfied customers who found their perfect home with us. 
              Start your journey today and discover amazing properties in prime locations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/properties"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2 hover:from-blue-700 hover:to-blue-800"
              >
                <FiSearch />
                <span>Browse Properties</span>
              </Link>
              <Link
                to="/register?role=agent"
                className="px-8 py-4 bg-gradient-to-r from-home-secondary to-orange-600 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2 hover:from-orange-600 hover:to-orange-700"
              >
                <FiUsers />
                <span>Become an Agent</span>
              </Link>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-blue-100">
              <div className="flex items-center space-x-2">
                <FiPhone />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiMail />
                <span>info@urbanhive.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;