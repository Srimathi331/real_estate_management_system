/**
 * Add More Properties Script
 * Adds diverse properties across all categories and prime locations
 * 
 * Run: node add-more-properties.js
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Import models
const User = require('./models/User');
const Property = require('./models/Property');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

const newProperties = [
  // CONDOS
  {
    title: 'Luxury Condo in Bandra West',
    description: 'Stunning 3BHK condo with sea view, modern amenities, and premium finishes. Located in the heart of Bandra with easy access to shopping and dining.',
    price: 45000000,
    type: 'buy',
    category: 'condo',
    status: 'available',
    location: {
      address: '15th Floor, Seaview Towers, Linking Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400050',
      country: 'India'
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 1800,
      areaUnit: 'sqft',
      parking: 2,
      furnished: 'fully-furnished',
      yearBuilt: 2022
    },
    amenities: ['swimming-pool', 'gym', 'security', 'elevator', 'air-conditioning', 'parking', 'cctv', 'club-house'],
    images: [
      { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', publicId: 'condo1' },
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80', publicId: 'condo2' },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', publicId: 'condo3' }
    ],
    isApproved: true,
    isFeatured: true
  },
  {
    title: 'Modern Condo in Whitefield',
    description: 'Contemporary 2BHK condo in Bangalore\'s IT hub with smart home features and excellent connectivity.',
    price: 12000000,
    type: 'buy',
    category: 'condo',
    status: 'available',
    location: {
      address: 'Tower B, Tech Park Residency, ITPL Main Road',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560066',
      country: 'India'
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      areaUnit: 'sqft',
      parking: 1,
      furnished: 'semi-furnished',
      yearBuilt: 2023
    },
    amenities: ['gym', 'security', 'elevator', 'air-conditioning', 'parking', 'smart-home', 'power-backup'],
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', publicId: 'condo4' },
      { url: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&q=80', publicId: 'condo5' }
    ],
    isApproved: true
  },

  // TOWNHOUSES
  {
    title: 'Elegant Townhouse in Gurgaon',
    description: 'Spacious 4BHK townhouse with private garden, modern kitchen, and premium location in DLF Phase 5.',
    price: 55000000,
    type: 'buy',
    category: 'townhouse',
    status: 'available',
    location: {
      address: 'Plot 45, DLF Phase 5',
      city: 'Gurgaon',
      state: 'Haryana',
      zipCode: '122009',
      country: 'India'
    },
    features: {
      bedrooms: 4,
      bathrooms: 4,
      area: 3000,
      areaUnit: 'sqft',
      parking: 3,
      furnished: 'semi-furnished',
      yearBuilt: 2021
    },
    amenities: ['garden', 'parking', 'security', 'air-conditioning', 'club-house', 'cctv', 'power-backup'],
    images: [
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80', publicId: 'townhouse1' },
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80', publicId: 'townhouse2' },
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80', publicId: 'townhouse3' }
    ],
    isApproved: true,
    isFeatured: true
  },
  {
    title: 'Premium Townhouse in Pune',
    description: 'Beautiful 3BHK townhouse in gated community with excellent amenities and green surroundings.',
    price: 28000000,
    type: 'buy',
    category: 'townhouse',
    status: 'available',
    location: {
      address: 'Row House 12, Amanora Park Town',
      city: 'Pune',
      state: 'Maharashtra',
      zipCode: '411028',
      country: 'India'
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 2200,
      areaUnit: 'sqft',
      parking: 2,
      furnished: 'unfurnished',
      yearBuilt: 2022
    },
    amenities: ['swimming-pool', 'gym', 'garden', 'parking', 'security', 'club-house', 'play-area'],
    images: [
      { url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80', publicId: 'townhouse4' },
      { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80', publicId: 'townhouse5' }
    ],
    isApproved: true
  },

  // COMMERCIAL PROPERTIES
  {
    title: 'Prime Commercial Space in Connaught Place',
    description: 'Premium commercial office space in Delhi\'s business hub with excellent visibility and foot traffic.',
    price: 85000000,
    type: 'buy',
    category: 'commercial',
    status: 'available',
    location: {
      address: 'Block A, Inner Circle, Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India'
    },
    features: {
      bedrooms: 0,
      bathrooms: 4,
      area: 4500,
      areaUnit: 'sqft',
      parking: 10,
      furnished: 'unfurnished',
      yearBuilt: 2020
    },
    amenities: ['elevator', 'parking', 'security', 'air-conditioning', 'cctv', 'power-backup'],
    images: [
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80', publicId: 'commercial1' },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', publicId: 'commercial2' },
      { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80', publicId: 'commercial3' }
    ],
    isApproved: true,
    isFeatured: true
  },
  {
    title: 'Retail Shop in Phoenix Mall',
    description: 'High-traffic retail space in premium mall location, perfect for fashion or electronics store.',
    price: 35000000,
    type: 'buy',
    category: 'commercial',
    status: 'available',
    location: {
      address: 'Shop 234, Phoenix Marketcity, LBS Marg',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400070',
      country: 'India'
    },
    features: {
      bedrooms: 0,
      bathrooms: 2,
      area: 1500,
      areaUnit: 'sqft',
      parking: 5,
      furnished: 'unfurnished',
      yearBuilt: 2019
    },
    amenities: ['elevator', 'parking', 'security', 'air-conditioning', 'cctv'],
    images: [
      { url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80', publicId: 'commercial4' },
      { url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80', publicId: 'commercial5' }
    ],
    isApproved: true
  },

  // OFFICE SPACES
  {
    title: 'Modern Office Space in BKC',
    description: 'State-of-the-art office space in Mumbai\'s premier business district with stunning views.',
    price: 120000000,
    type: 'buy',
    category: 'office',
    status: 'available',
    location: {
      address: '25th Floor, One BKC, Bandra Kurla Complex',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400051',
      country: 'India'
    },
    features: {
      bedrooms: 0,
      bathrooms: 6,
      area: 6000,
      areaUnit: 'sqft',
      parking: 20,
      furnished: 'semi-furnished',
      yearBuilt: 2023
    },
    amenities: ['elevator', 'parking', 'security', 'air-conditioning', 'cctv', 'power-backup', 'smart-home'],
    images: [
      { url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80', publicId: 'office1' },
      { url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800&q=80', publicId: 'office2' },
      { url: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800&q=80', publicId: 'office3' }
    ],
    isApproved: true,
    isFeatured: true
  },
  {
    title: 'Tech Office in Cyber City',
    description: 'Modern tech office space with open floor plan, perfect for startups and IT companies.',
    price: 45000000,
    type: 'buy',
    category: 'office',
    status: 'available',
    location: {
      address: 'Building 10, DLF Cyber City',
      city: 'Gurgaon',
      state: 'Haryana',
      zipCode: '122002',
      country: 'India'
    },
    features: {
      bedrooms: 0,
      bathrooms: 4,
      area: 3500,
      areaUnit: 'sqft',
      parking: 15,
      furnished: 'fully-furnished',
      yearBuilt: 2022
    },
    amenities: ['elevator', 'parking', 'security', 'air-conditioning', 'cctv', 'power-backup', 'smart-home'],
    images: [
      { url: 'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?w=800&q=80', publicId: 'office4' },
      { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80', publicId: 'office5' }
    ],
    isApproved: true
  },

  // LAND
  {
    title: 'Prime Residential Plot in Noida',
    description: 'Excellent residential plot in approved layout with all amenities and clear title.',
    price: 25000000,
    type: 'buy',
    category: 'land',
    status: 'available',
    location: {
      address: 'Sector 150, Noida Expressway',
      city: 'Noida',
      state: 'Uttar Pradesh',
      zipCode: '201310',
      country: 'India'
    },
    features: {
      bedrooms: 0,
      bathrooms: 0,
      area: 3000,
      areaUnit: 'sqft',
      parking: 0,
      furnished: 'unfurnished',
      yearBuilt: 2024
    },
    amenities: ['security'],
    images: [
      { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', publicId: 'land1' },
      { url: 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800&q=80', publicId: 'land2' }
    ],
    isApproved: true
  },
  {
    title: 'Commercial Land in Hyderabad',
    description: 'Large commercial plot on main road, ideal for mall or office complex development.',
    price: 150000000,
    type: 'buy',
    category: 'land',
    status: 'available',
    location: {
      address: 'Survey No. 45, Gachibowli Main Road',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500032',
      country: 'India'
    },
    features: {
      bedrooms: 0,
      bathrooms: 0,
      area: 20000,
      areaUnit: 'sqft',
      parking: 0,
      furnished: 'unfurnished',
      yearBuilt: 2024
    },
    amenities: [],
    images: [
      { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', publicId: 'land3' },
      { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80', publicId: 'land4' }
    ],
    isApproved: true
  },

  // RENTAL PROPERTIES
  {
    title: 'Furnished Apartment for Rent in Koramangala',
    description: 'Fully furnished 2BHK apartment in Bangalore\'s prime location, ready to move in.',
    price: 45000,
    type: 'rent',
    category: 'apartment',
    status: 'available',
    location: {
      address: 'Flat 302, Green Valley Apartments, 5th Block',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560095',
      country: 'India'
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1100,
      areaUnit: 'sqft',
      parking: 1,
      furnished: 'fully-furnished',
      yearBuilt: 2021
    },
    amenities: ['gym', 'security', 'elevator', 'air-conditioning', 'parking', 'power-backup'],
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80', publicId: 'rent1' },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80', publicId: 'rent2' }
    ],
    isApproved: true
  },
  {
    title: 'Luxury Villa for Rent in Juhu',
    description: 'Stunning beachside villa with private pool, perfect for families seeking luxury living.',
    price: 350000,
    type: 'rent',
    category: 'villa',
    status: 'available',
    location: {
      address: 'Villa 7, Juhu Beach Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400049',
      country: 'India'
    },
    features: {
      bedrooms: 5,
      bathrooms: 5,
      area: 5000,
      areaUnit: 'sqft',
      parking: 4,
      furnished: 'fully-furnished',
      yearBuilt: 2020
    },
    amenities: ['swimming-pool', 'gym', 'garden', 'parking', 'security', 'air-conditioning', 'cctv'],
    images: [
      { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', publicId: 'rent3' },
      { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&q=80', publicId: 'rent4' },
      { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80', publicId: 'rent5' }
    ],
    isApproved: true,
    isFeatured: true
  }
];

// Seed function
const seedProperties = async () => {
  try {
    console.log('🌱 Starting to add new properties...');

    // Find an agent user to assign properties to
    const agent = await User.findOne({ role: 'agent' });
    
    if (!agent) {
      console.error('❌ No agent found. Please run the main seeder first.');
      process.exit(1);
    }

    console.log(`✅ Found agent: ${agent.name}`);

    // Add agent reference to all properties
    const propertiesWithAgent = newProperties.map(prop => ({
      ...prop,
      agent: agent._id
    }));

    // Insert properties
    const insertedProperties = await Property.insertMany(propertiesWithAgent);
    
    console.log(`✅ Successfully added ${insertedProperties.length} new properties!`);
    console.log('\n📊 Properties by category:');
    
    const categoryCounts = {};
    insertedProperties.forEach(prop => {
      categoryCounts[prop.category] = (categoryCounts[prop.category] || 0) + 1;
    });
    
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} properties`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedProperties();
