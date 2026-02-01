/**
 * Database Seeder
 * Creates initial admin user and sample data for testing
 * 
 * Run: npm run seed
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Import models
const User = require('./models/User');
const Property = require('./models/Property');
const Inquiry = require('./models/Inquiry');

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@realestate.com',
    password: 'Admin@123',
    role: 'admin',
    isVerified: true,
  },
  {
    name: 'John Agent',
    email: 'agent@realestate.com',
    password: 'Agent@123',
    role: 'agent',
    phone: '+91 9876543210',
    bio: 'Experienced real estate agent with 10+ years in the industry.',
    isVerified: true,
  },
  {
    name: 'Jane User',
    email: 'user@realestate.com',
    password: 'User@123',
    role: 'user',
    isVerified: true,
  },
];

// Sample properties (will be assigned to agent)
const properties = [
  // APARTMENTS (3)
  {
    title: 'Modern Apartment in Mumbai',
    description: 'Beautiful 3-bedroom apartment in the heart of Mumbai with sea view. Features include spacious living room, balcony, modern kitchen with appliances, and 24/7 security. Walking distance to metro station and shopping malls.',
    price: 15000000,
    type: 'buy',
    category: 'apartment',
    location: {
      address: '456 Marine Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400001',
      country: 'India',
    },
    features: {
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      areaUnit: 'sqft',
      parking: 1,
      furnished: 'semi-furnished',
      yearBuilt: 2021,
    },
    amenities: ['gym', 'parking', 'security', 'elevator', 'balcony', 'power-backup'],
    images: [
      { url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80', publicId: 'apartment1_1' },
      { url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&auto=format&fit=crop&q=80', publicId: 'apartment1_2' },
    ],
    isApproved: true,
    isFeatured: true,
  },
  {
    title: 'Cozy 2BHK for Rent in Chennai',
    description: 'Affordable 2-bedroom apartment for rent in a gated community. Well-ventilated rooms with attached bathrooms. Close to OMR IT corridor with bus stop nearby. Maintenance included in rent.',
    price: 25000,
    type: 'rent',
    category: 'apartment',
    location: {
      address: '555 Thoraipakkam',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600097',
      country: 'India',
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1100,
      areaUnit: 'sqft',
      parking: 1,
      furnished: 'semi-furnished',
      yearBuilt: 2019,
    },
    amenities: ['parking', 'security', 'elevator', 'play-area', 'power-backup'],
    images: [
      { url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop&q=80', publicId: 'apartment2_1' },
      { url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&auto=format&fit=crop&q=80', publicId: 'apartment2_2' },
    ],
    isApproved: true,
  },
  {
    title: 'Luxury 4BHK Apartment in Gurgaon',
    description: 'Premium 4-bedroom apartment in a high-rise tower with world-class amenities. Features include floor-to-ceiling windows, imported fixtures, and smart home automation. Located in the heart of Cyber City.',
    price: 22000000,
    type: 'buy',
    category: 'apartment',
    location: {
      address: '777 DLF Cyber City',
      city: 'Gurgaon',
      state: 'Haryana',
      zipCode: '122002',
      country: 'India',
    },
    features: {
      bedrooms: 4,
      bathrooms: 4,
      area: 2800,
      areaUnit: 'sqft',
      parking: 2,
      furnished: 'fully-furnished',
      yearBuilt: 2022,
    },
    amenities: ['swimming-pool', 'gym', 'parking', 'security', 'elevator', 'club-house', 'smart-home', 'cctv'],
    images: [
      { url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=80', publicId: 'apartment3_1' },
      { url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop&q=80', publicId: 'apartment3_2' },
    ],
    isApproved: true,
    isFeatured: true,
  },

  // HOUSES (3)
  {
    title: 'Spacious House for Rent in Delhi',
    description: 'A well-maintained 3-bedroom independent house available for rent. Includes servant quarter, lawn area, and covered parking. Located in a peaceful neighborhood with easy access to markets and schools.',
    price: 45000,
    type: 'rent',
    category: 'house',
    location: {
      address: '789 Green Park',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India',
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 2200,
      areaUnit: 'sqft',
      parking: 2,
      furnished: 'unfurnished',
      yearBuilt: 2018,
    },
    amenities: ['garden', 'parking', 'security', 'power-backup'],
    images: [
      { url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', publicId: 'sample5' },
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', publicId: 'sample6' },
    ],
    isApproved: true,
  },
  {
    title: 'Family House for Sale in Kolkata',
    description: 'Traditional Bengali architecture house with modern amenities. Features include courtyard, terrace garden, and spacious rooms. Perfect for joint families with separate entrance for guests.',
    price: 8500000,
    type: 'buy',
    category: 'house',
    location: {
      address: '234 Salt Lake City',
      city: 'Kolkata',
      state: 'West Bengal',
      zipCode: '700064',
      country: 'India',
    },
    features: {
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      areaUnit: 'sqft',
      parking: 2,
      furnished: 'semi-furnished',
      yearBuilt: 2015,
    },
    amenities: ['garden', 'parking', 'security', 'power-backup', 'balcony'],
    images: [
      { url: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800', publicId: 'house2_1' },
      { url: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800', publicId: 'house2_2' },
    ],
    isApproved: true,
  },
  {
    title: 'Modern Duplex House in Ahmedabad',
    description: 'Contemporary duplex house with open-plan living, modular kitchen, and rooftop terrace. Features include solar panels, rainwater harvesting, and eco-friendly design. Located in a premium gated community.',
    price: 12000000,
    type: 'buy',
    category: 'house',
    location: {
      address: '888 Prahlad Nagar',
      city: 'Ahmedabad',
      state: 'Gujarat',
      zipCode: '380015',
      country: 'India',
    },
    features: {
      bedrooms: 3,
      bathrooms: 4,
      area: 2500,
      areaUnit: 'sqft',
      parking: 2,
      furnished: 'semi-furnished',
      yearBuilt: 2021,
    },
    amenities: ['garden', 'parking', 'security', 'solar-panels', 'club-house', 'play-area'],
    images: [
      { url: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800', publicId: 'house3_1' },
      { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', publicId: 'house3_2' },
    ],
    isApproved: true,
  },

  // VILLAS (3)
  {
    title: 'Luxury Villa in Bangalore',
    description: 'A stunning 4-bedroom luxury villa with modern amenities, private garden, and swimming pool. Located in a prime residential area with excellent connectivity to IT hubs and schools. The property features Italian marble flooring, modular kitchen, and smart home automation.',
    price: 25000000,
    type: 'buy',
    category: 'villa',
    location: {
      address: '123 Palm Grove Layout',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
      country: 'India',
    },
    features: {
      bedrooms: 4,
      bathrooms: 4,
      area: 3500,
      areaUnit: 'sqft',
      parking: 2,
      furnished: 'fully-furnished',
      yearBuilt: 2022,
    },
    amenities: ['swimming-pool', 'gym', 'garden', 'parking', 'security', 'smart-home'],
    images: [
      { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', publicId: 'sample1' },
      { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', publicId: 'sample2' },
    ],
    isApproved: true,
    isFeatured: true,
  },
  {
    title: 'Beachfront Villa in Goa',
    description: 'Exclusive beachfront villa with private beach access and panoramic ocean views. Features include infinity pool, outdoor dining area, and tropical landscaping. Perfect for vacation rental or permanent residence.',
    price: 45000000,
    type: 'buy',
    category: 'villa',
    location: {
      address: '456 Candolim Beach Road',
      city: 'Goa',
      state: 'Goa',
      zipCode: '403515',
      country: 'India',
    },
    features: {
      bedrooms: 5,
      bathrooms: 6,
      area: 4500,
      areaUnit: 'sqft',
      parking: 3,
      furnished: 'fully-furnished',
      yearBuilt: 2020,
    },
    amenities: ['swimming-pool', 'garden', 'parking', 'security', 'smart-home', 'cctv'],
    images: [
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', publicId: 'villa2_1' },
      { url: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800', publicId: 'villa2_2' },
    ],
    isApproved: true,
    isFeatured: true,
  },
  {
    title: 'Heritage Villa in Jaipur',
    description: 'Restored heritage villa with traditional Rajasthani architecture and modern comforts. Features include courtyards, jharokhas, and hand-painted frescoes. Located in the historic Pink City with easy access to tourist attractions.',
    price: 18000000,
    type: 'buy',
    category: 'villa',
    location: {
      address: '789 Civil Lines',
      city: 'Jaipur',
      state: 'Rajasthan',
      zipCode: '302006',
      country: 'India',
    },
    features: {
      bedrooms: 6,
      bathrooms: 5,
      area: 4000,
      areaUnit: 'sqft',
      parking: 4,
      furnished: 'semi-furnished',
      yearBuilt: 1950,
    },
    amenities: ['garden', 'parking', 'security', 'club-house', 'power-backup', 'cctv'],
    images: [
      { url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800', publicId: 'villa3_1' },
      { url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800', publicId: 'villa3_2' },
    ],
    isApproved: true,
  },

  // CONDOS (3)
  {
    title: 'Penthouse with Terrace in Pune',
    description: 'Exclusive penthouse with private terrace garden offering panoramic city views. Features include jacuzzi, home theater, designer interiors, and dedicated elevator. Perfect for those seeking luxury living.',
    price: 35000000,
    type: 'buy',
    category: 'condo',
    location: {
      address: '999 Koregaon Park',
      city: 'Pune',
      state: 'Maharashtra',
      zipCode: '411001',
      country: 'India',
    },
    features: {
      bedrooms: 5,
      bathrooms: 5,
      area: 4500,
      areaUnit: 'sqft',
      parking: 3,
      furnished: 'fully-furnished',
      yearBuilt: 2023,
    },
    amenities: ['swimming-pool', 'gym', 'garden', 'parking', 'security', 'elevator', 'smart-home', 'club-house'],
    images: [
      { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', publicId: 'sample11' },
      { url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800', publicId: 'sample12' },
    ],
    isApproved: true,
    isFeatured: true,
  },
  {
    title: 'Luxury Condo in Noida',
    description: 'High-end condominium with resort-style amenities and 24/7 concierge service. Features include marble flooring, premium fixtures, and smart home technology. Located in Sector 62 with metro connectivity.',
    price: 18500000,
    type: 'buy',
    category: 'condo',
    location: {
      address: '321 Sector 62',
      city: 'Noida',
      state: 'Uttar Pradesh',
      zipCode: '201309',
      country: 'India',
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 2200,
      areaUnit: 'sqft',
      parking: 2,
      furnished: 'fully-furnished',
      yearBuilt: 2022,
    },
    amenities: ['swimming-pool', 'gym', 'parking', 'security', 'elevator', 'club-house', 'cctv', 'smart-home'],
    images: [
      { url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800', publicId: 'condo2_1' },
      { url: 'https://images.unsplash.com/photo-1600566753051-6057c2ec5d0d?w=800', publicId: 'condo2_2' },
    ],
    isApproved: true,
  },
  {
    title: 'Waterfront Condo in Kochi',
    description: 'Modern waterfront condominium with backwater views and marina access. Features include floor-to-ceiling windows, private balcony, and premium amenities. Perfect for those who love water sports and scenic views.',
    price: 14000000,
    type: 'buy',
    category: 'condo',
    location: {
      address: '654 Marine Drive',
      city: 'Kochi',
      state: 'Kerala',
      zipCode: '682031',
      country: 'India',
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1800,
      areaUnit: 'sqft',
      parking: 1,
      furnished: 'semi-furnished',
      yearBuilt: 2021,
    },
    amenities: ['swimming-pool', 'gym', 'parking', 'security', 'elevator', 'club-house', 'smart-home', 'cctv'],
    images: [
      { url: 'https://images.unsplash.com/photo-1600566752734-d1d394c71c1d?w=800', publicId: 'condo3_1' },
      { url: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800', publicId: 'condo3_2' },
    ],
    isApproved: true,
  },

  // TOWNHOUSES (3)
  {
    title: 'Modern Townhouse in Chandigarh',
    description: 'Contemporary townhouse in a planned community with shared amenities. Features include private garage, small garden, and modern interiors. Located in Sector 21 with excellent schools and shopping nearby.',
    price: 16000000,
    type: 'buy',
    category: 'townhouse',
    location: {
      address: '147 Sector 21',
      city: 'Chandigarh',
      state: 'Chandigarh',
      zipCode: '160022',
      country: 'India',
    },
    features: {
      bedrooms: 3,
      bathrooms: 3,
      area: 2000,
      areaUnit: 'sqft',
      parking: 2,
      furnished: 'semi-furnished',
      yearBuilt: 2020,
    },
    amenities: ['garden', 'parking', 'security', 'play-area', 'club-house', 'power-backup'],
    images: [
      { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', publicId: 'townhouse1_1' },
      { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', publicId: 'townhouse1_2' },
    ],
    isApproved: true,
  },
  {
    title: 'Eco-Friendly Townhouse in Mysore',
    description: 'Sustainable townhouse with solar panels, rainwater harvesting, and organic garden space. Features include energy-efficient appliances and natural ventilation. Located in a green community near Mysore Palace.',
    price: 9500000,
    type: 'buy',
    category: 'townhouse',
    location: {
      address: '258 Vijayanagar',
      city: 'Mysore',
      state: 'Karnataka',
      zipCode: '570017',
      country: 'India',
    },
    features: {
      bedrooms: 3,
      bathrooms: 2,
      area: 1800,
      areaUnit: 'sqft',
      parking: 1,
      furnished: 'unfurnished',
      yearBuilt: 2019,
    },
    amenities: ['garden', 'parking', 'security', 'solar-panels', 'power-backup', 'smart-home'],
    images: [
      { url: 'https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?w=800', publicId: 'townhouse2_1' },
      { url: 'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800', publicId: 'townhouse2_2' },
    ],
    isApproved: true,
  },
  {
    title: 'Luxury Townhouse for Rent in Indore',
    description: 'Premium townhouse available for rent in a gated community. Features include private courtyard, rooftop terrace, and modern amenities. Perfect for executives and small families seeking upscale living.',
    price: 35000,
    type: 'rent',
    category: 'townhouse',
    location: {
      address: '369 Vijay Nagar',
      city: 'Indore',
      state: 'Madhya Pradesh',
      zipCode: '452010',
      country: 'India',
    },
    features: {
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      areaUnit: 'sqft',
      parking: 2,
      furnished: 'fully-furnished',
      yearBuilt: 2021,
    },
    amenities: ['garden', 'parking', 'security', 'club-house', 'swimming-pool', 'gym'],
    images: [
      { url: 'https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?w=800', publicId: 'townhouse3_1' },
      { url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800', publicId: 'townhouse3_2' },
    ],
    isApproved: true,
  },

  // LAND (3)
  {
    title: 'Agricultural Land in Punjab',
    description: 'Fertile agricultural land suitable for farming with water source and road connectivity. Located in the heart of Punjab with rich soil quality. Perfect for agricultural investment or organic farming ventures.',
    price: 5000000,
    type: 'buy',
    category: 'land',
    location: {
      address: 'Village Khanna',
      city: 'Ludhiana',
      state: 'Punjab',
      zipCode: '141401',
      country: 'India',
    },
    features: {
      bedrooms: 0,
      bathrooms: 0,
      area: 50000,
      areaUnit: 'sqft',
      parking: 0,
      furnished: 'unfurnished',
      yearBuilt: null,
    },
    amenities: ['parking', 'security', 'power-backup'],
    images: [
      { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', publicId: 'land1_1' },
      { url: 'https://images.unsplash.com/photo-1574263867128-a3d5c1b1deac?w=800', publicId: 'land1_2' },
    ],
    isApproved: true,
  },
  {
    title: 'Residential Plot in Bhopal',
    description: 'Prime residential plot in an approved layout with all utilities available. Located in a developing area with good appreciation potential. Suitable for constructing independent house or villa.',
    price: 3500000,
    type: 'buy',
    category: 'land',
    location: {
      address: 'Kolar Road',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      zipCode: '462042',
      country: 'India',
    },
    features: {
      bedrooms: 0,
      bathrooms: 0,
      area: 2400,
      areaUnit: 'sqft',
      parking: 0,
      furnished: 'unfurnished',
      yearBuilt: null,
    },
    amenities: ['parking', 'security', 'power-backup'],
    images: [
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', publicId: 'land2_1' },
      { url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', publicId: 'land2_2' },
    ],
    isApproved: true,
  },
  {
    title: 'Commercial Land in Surat',
    description: 'Strategic commercial land on main highway with high visibility and traffic. Suitable for retail, warehouse, or industrial development. Located in the diamond city with excellent business opportunities.',
    price: 12000000,
    type: 'buy',
    category: 'land',
    location: {
      address: 'NH-48 Highway',
      city: 'Surat',
      state: 'Gujarat',
      zipCode: '395007',
      country: 'India',
    },
    features: {
      bedrooms: 0,
      bathrooms: 0,
      area: 10000,
      areaUnit: 'sqft',
      parking: 0,
      furnished: 'unfurnished',
      yearBuilt: null,
    },
    amenities: ['parking', 'security', 'power-backup'],
    images: [
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', publicId: 'land3_1' },
      { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', publicId: 'land3_2' },
    ],
    isApproved: true,
  },

  // COMMERCIAL (3)
  {
    title: 'Retail Shop in Mumbai',
    description: 'Prime retail space in a busy commercial complex with high foot traffic. Features include glass frontage, air conditioning, and parking facility. Perfect for fashion, electronics, or food business.',
    price: 8500000,
    type: 'buy',
    category: 'commercial',
    location: {
      address: '123 Linking Road',
      city: 'Mumbai',
      state: 'Maharashtra',
      zipCode: '400050',
      country: 'India',
    },
    features: {
      bedrooms: 0,
      bathrooms: 2,
      area: 800,
      areaUnit: 'sqft',
      parking: 1,
      furnished: 'unfurnished',
      yearBuilt: 2018,
    },
    amenities: ['parking', 'security', 'air-conditioning', 'power-backup'],
    images: [
      { url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800', publicId: 'commercial1_1' },
      { url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800', publicId: 'commercial1_2' },
    ],
    isApproved: true,
  },
  {
    title: 'Restaurant Space for Rent in Delhi',
    description: 'Fully equipped restaurant space with commercial kitchen, dining area, and bar setup. Located in a prime location with heavy footfall. Includes furniture, kitchen equipment, and liquor license.',
    price: 80000,
    type: 'rent',
    category: 'commercial',
    location: {
      address: '456 Connaught Place',
      city: 'New Delhi',
      state: 'Delhi',
      zipCode: '110001',
      country: 'India',
    },
    features: {
      bedrooms: 0,
      bathrooms: 4,
      area: 2500,
      areaUnit: 'sqft',
      parking: 0,
      furnished: 'fully-furnished',
      yearBuilt: 2019,
    },
    amenities: ['air-conditioning', 'security', 'power-backup'],
    images: [
      { url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', publicId: 'commercial2_1' },
      { url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', publicId: 'commercial2_2' },
    ],
    isApproved: true,
  },
  {
    title: 'Warehouse in Bangalore',
    description: 'Large warehouse facility with loading docks, office space, and 24/7 security. Located near major highways with easy access for logistics operations. Suitable for e-commerce, manufacturing, or distribution.',
    price: 15000000,
    type: 'buy',
    category: 'commercial',
    location: {
      address: '789 Electronic City',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560100',
      country: 'India',
    },
    features: {
      bedrooms: 0,
      bathrooms: 6,
      area: 15000,
      areaUnit: 'sqft',
      parking: 20,
      furnished: 'unfurnished',
      yearBuilt: 2020,
    },
    amenities: ['parking', 'security', 'power-backup', 'cctv'],
    images: [
      { url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800', publicId: 'commercial3_1' },
      { url: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800', publicId: 'commercial3_2' },
    ],
    isApproved: true,
  },

  // OFFICES (3)
  {
    title: 'Premium Office Space in Hyderabad',
    description: 'Premium commercial office space in HITEC City with all modern facilities. Ideal for IT companies and startups. Features include reception area, conference rooms, cafeteria, and high-speed internet connectivity.',
    price: 5000000,
    type: 'buy',
    category: 'office',
    location: {
      address: '101 Cyber Towers',
      city: 'Hyderabad',
      state: 'Telangana',
      zipCode: '500081',
      country: 'India',
    },
    features: {
      bedrooms: 0,
      bathrooms: 4,
      area: 5000,
      areaUnit: 'sqft',
      parking: 10,
      furnished: 'fully-furnished',
      yearBuilt: 2020,
    },
    amenities: ['parking', 'security', 'elevator', 'air-conditioning', 'cctv', 'power-backup'],
    images: [
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', publicId: 'sample7' },
      { url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800', publicId: 'sample8' },
    ],
    isApproved: true,
  },
  {
    title: 'Co-working Space in Pune',
    description: 'Modern co-working office space with flexible seating arrangements and shared amenities. Features include high-speed internet, meeting rooms, and networking opportunities. Perfect for freelancers and small teams.',
    price: 25000,
    type: 'rent',
    category: 'office',
    location: {
      address: '202 Hinjewadi',
      city: 'Pune',
      state: 'Maharashtra',
      zipCode: '411057',
      country: 'India',
    },
    features: {
      bedrooms: 0,
      bathrooms: 3,
      area: 2000,
      areaUnit: 'sqft',
      parking: 5,
      furnished: 'fully-furnished',
      yearBuilt: 2021,
    },
    amenities: ['parking', 'security', 'elevator', 'air-conditioning', 'power-backup', 'smart-home'],
    images: [
      { url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800', publicId: 'office2_1' },
      { url: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800', publicId: 'office2_2' },
    ],
    isApproved: true,
  },
  {
    title: 'Corporate Office in Chennai',
    description: 'Large corporate office space suitable for multinational companies. Features include executive cabins, open workstations, conference halls, and dedicated parking. Located in the IT corridor with metro connectivity.',
    price: 18000000,
    type: 'buy',
    category: 'office',
    location: {
      address: '303 OMR Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      zipCode: '600096',
      country: 'India',
    },
    features: {
      bedrooms: 0,
      bathrooms: 8,
      area: 12000,
      areaUnit: 'sqft',
      parking: 30,
      furnished: 'semi-furnished',
      yearBuilt: 2019,
    },
    amenities: ['parking', 'security', 'elevator', 'air-conditioning', 'power-backup', 'cctv'],
    images: [
      { url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800', publicId: 'office3_1' },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', publicId: 'office3_2' },
    ],
    isApproved: true,
  },
];

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Property.deleteMany();
    await Inquiry.deleteMany();

    console.log('Data cleared...');

    // Create users
    const createdUsers = await User.create(users);
    console.log('Users created...');

    // Get agent user
    const agent = createdUsers.find((user) => user.role === 'agent');
    const regularUser = createdUsers.find((user) => user.role === 'user');

    // Assign agent to properties and create them
    const propertiesWithAgent = properties.map((property) => ({
      ...property,
      agent: agent._id,
    }));

    const createdProperties = await Property.create(propertiesWithAgent);
    console.log('Properties created...');

    // Create sample inquiries
    const sampleInquiries = [
      {
        user: regularUser._id,
        property: createdProperties[0]._id,
        agent: agent._id,
        name: regularUser.name,
        email: regularUser.email,
        phone: '+91 9876543210',
        message: 'I am interested in this luxury villa. Could you please provide more details about the amenities and schedule a viewing?',
        status: 'pending',
        isRead: false,
      },
      {
        user: regularUser._id,
        property: createdProperties[1]._id,
        agent: agent._id,
        name: regularUser.name,
        email: regularUser.email,
        phone: '+91 9876543210',
        message: 'This apartment looks perfect for my family. What is the availability and can we negotiate on the price?',
        status: 'read',
        isRead: true,
      },
      {
        user: regularUser._id,
        property: createdProperties[2]._id,
        agent: agent._id,
        name: regularUser.name,
        email: regularUser.email,
        phone: '+91 9876543210',
        message: 'I would like to rent this house. Is it still available? Please let me know the terms and conditions.',
        status: 'responded',
        isRead: true,
        response: 'Thank you for your interest. The house is still available. Please call me to discuss the terms.',
        respondedAt: new Date(),
      },
    ];

    await Inquiry.create(sampleInquiries);
    console.log('Sample inquiries created...');

    console.log('');
    console.log('✅ Data imported successfully!');
    console.log('');
    console.log('📧 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin:  admin@realestate.com / Admin@123');
    console.log('Agent:  agent@realestate.com / Agent@123');
    console.log('User:   user@realestate.com / User@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Property.deleteMany();
    await Inquiry.deleteMany();

    console.log('✅ Data deleted successfully!');
    process.exit();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

// Run based on command line argument
if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}
