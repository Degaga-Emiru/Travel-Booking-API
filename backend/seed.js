const { User, VendorProfile, Hotel, Flight, Image, sequelize } = require('./src/models');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // Create a demo vendor user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('vendor123', salt);
    
    let vendorUser = await User.findOne({ where: { email: 'demovendor@example.com' } });
    
    if (!vendorUser) {
      vendorUser = await User.create({
        firstName: 'Demo',
        lastName: 'Vendor',
        email: 'demovendor@example.com',
        password: hashedPassword,
        phone: '+1234567890',
        role: 'vendor',
        isVerified: true
      });
      console.log('Demo vendor user created.');
    } else {
      console.log('Demo vendor user already exists.');
    }

    // Create vendor profile
    let vendorProfile = await VendorProfile.findOne({ where: { userId: vendorUser.id } });
    if (!vendorProfile) {
      vendorProfile = await VendorProfile.create({
        userId: vendorUser.id,
        companyName: 'Demo Travel Vendor',
        businessType: 'Agency',
        taxId: 'TX-123456',
        address: '123 Vendor Street',
        city: 'New York',
        country: 'USA',
        status: 'verified',
        rating: 4.8
      });
      console.log('Vendor profile created.');
    }

    // Create Sample Hotels
    console.log('Creating sample hotels...');
    const hotel1 = await Hotel.create({
      vendorId: vendorProfile.id,
      name: 'Grand Horizon Resort',
      description: 'A luxurious resort with breathtaking ocean views and world-class amenities.',
      starRating: 5,
      address: '45 Beachfront Ave',
      city: 'Miami',
      state: 'FL',
      country: 'USA',
      pricePerNight: 299.00,
      totalRooms: 100,
      availableRooms: 85,
      amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Parking'],
      averageRating: 4.9,
      reviewCount: 150,
      isActive: true
    });

    await Image.bulkCreate([
      { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945', category: 'Exterior', relatedId: hotel1.id, relatedType: 'Hotel' },
      { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', category: 'Room', relatedId: hotel1.id, relatedType: 'Hotel' }
    ]);

    const hotel2 = await Hotel.create({
      vendorId: vendorProfile.id,
      name: 'Urban Oasis Hotel',
      description: 'Modern and chic hotel located in the heart of the city.',
      starRating: 4,
      address: '789 Downtown Blvd',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      pricePerNight: 199.00,
      totalRooms: 200,
      availableRooms: 150,
      amenities: ['WiFi', 'Restaurant', 'Gym', 'Bar'],
      averageRating: 4.5,
      reviewCount: 320,
      isActive: true
    });

    await Image.bulkCreate([
      { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', category: 'Exterior', relatedId: hotel2.id, relatedType: 'Hotel' },
      { url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32', category: 'Room', relatedId: hotel2.id, relatedType: 'Hotel' }
    ]);

    // Create Sample Flights
    console.log('Creating sample flights...');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 2);

    await Flight.create({
      vendorId: vendorProfile.id,
      airline: 'Emirates',
      airlineCode: 'EK',
      flightNumber: 'EK201',
      departureAirport: 'DXB',
      departureAirportName: 'Dubai International Airport',
      departureCity: 'Dubai',
      departureCountry: 'UAE',
      arrivalAirport: 'JFK',
      arrivalAirportName: 'John F. Kennedy International Airport',
      arrivalCity: 'New York',
      arrivalCountry: 'USA',
      departureTime: new Date(tomorrow.setHours(8, 0, 0, 0)),
      arrivalTime: new Date(tomorrow.setHours(14, 0, 0, 0)),
      duration: 840,
      economyPrice: 650.00,
      businessPrice: 2500.00,
      firstClassPrice: 5000.00,
      economySeats: 200,
      businessSeats: 40,
      firstClassSeats: 14,
      availableEconomySeats: 150,
      availableBusinessSeats: 20,
      availableFirstClassSeats: 5,
      isActive: true
    });

    await Flight.create({
      vendorId: vendorProfile.id,
      airline: 'Delta Airlines',
      airlineCode: 'DL',
      flightNumber: 'DL405',
      departureAirport: 'JFK',
      departureAirportName: 'John F. Kennedy International Airport',
      departureCity: 'New York',
      departureCountry: 'USA',
      arrivalAirport: 'LHR',
      arrivalAirportName: 'Heathrow Airport',
      arrivalCity: 'London',
      arrivalCountry: 'UK',
      departureTime: new Date(dayAfter.setHours(20, 0, 0, 0)),
      arrivalTime: new Date(dayAfter.setHours(8, 0, 0, 0)),
      duration: 420,
      economyPrice: 450.00,
      businessPrice: 1800.00,
      firstClassPrice: 3500.00,
      economySeats: 180,
      businessSeats: 30,
      firstClassSeats: 10,
      availableEconomySeats: 120,
      availableBusinessSeats: 15,
      availableFirstClassSeats: 8,
      isActive: true
    });

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
