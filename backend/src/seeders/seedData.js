const { 
  User, 
  Flight, 
  Hotel, 
  Destination, 
  Package,
  Booking,
  Review 
} = require('../models');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Review.destroy({ where: {} });
    await Booking.destroy({ where: {} });
    await Package.destroy({ where: {} });
    await Destination.destroy({ where: {} });
    await Hotel.destroy({ where: {} });
    await Flight.destroy({ where: {} });
    await User.destroy({ where: {} });

    console.log('✅ Existing data cleared');

    // Create Users
    const users = await User.bulkCreate([
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@travelbooking.com',
        password: await bcrypt.hash('admin123', 12),
        role: 'admin',
        phone: '+1234567890',
        isEmailVerified: true
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'customer',
        phone: '+1234567891',
        isEmailVerified: true
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 12),
        role: 'customer',
        phone: '+1234567892',
        isEmailVerified: true
      },
      {
        firstName: 'Travel',
        lastName: 'Agent',
        email: 'agent@travelbooking.com',
        password: await bcrypt.hash('agent123', 12),
        role: 'agent',
        phone: '+1234567893',
        isEmailVerified: true
      }
    ]);

    console.log('✅ Users created');

    // Create Destinations
    const destinations = await Destination.bulkCreate([
      {
        name: 'Paris, France',
        country: 'France',
        city: 'Paris',
        description: 'The city of love and lights, famous for its art, fashion, and culture.',
        bestTimeToVisit: 'April to June, September to October',
        currency: 'EUR',
        language: 'French',
        timezone: 'CET',
        attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral'],
        climate: 'Temperate',
        isPopular: true
      },
      {
        name: 'Tokyo, Japan',
        country: 'Japan',
        city: 'Tokyo',
        description: 'A bustling metropolis blending ultramodern and traditional.',
        bestTimeToVisit: 'March to May, September to November',
        currency: 'JPY',
        language: 'Japanese',
        timezone: 'JST',
        attractions: ['Tokyo Tower', 'Senso-ji Temple', 'Shibuya Crossing'],
        climate: 'Humid subtropical',
        isPopular: true
      },
      {
        name: 'New York, USA',
        country: 'USA',
        city: 'New York',
        description: 'The city that never sleeps, known for its iconic skyline and culture.',
        bestTimeToVisit: 'April to June, September to November',
        currency: 'USD',
        language: 'English',
        timezone: 'EST',
        attractions: ['Statue of Liberty', 'Central Park', 'Times Square'],
        climate: 'Humid continental',
        isPopular: true
      },
      {
        name: 'Bali, Indonesia',
        country: 'Indonesia',
        city: 'Denpasar',
        description: 'Tropical paradise with beautiful beaches and rich culture.',
        bestTimeToVisit: 'April to October',
        currency: 'IDR',
        language: 'Indonesian',
        timezone: 'WITA',
        attractions: ['Uluwatu Temple', 'Tegallalang Rice Terrace', 'Mount Batur'],
        climate: 'Tropical',
        isPopular: true
      }
    ]);

    console.log('✅ Destinations created');

    // Create Hotels
    const hotels = await Hotel.bulkCreate([
      {
        name: 'Grand Paris Hotel',
        description: 'Luxury hotel in the heart of Paris with Eiffel Tower views.',
        chain: 'Luxury Collection',
        starRating: 5,
        address: '123 Champs-Élysées, Paris, France',
        city: 'Paris',
        country: 'France',
        latitude: 48.8566,
        longitude: 2.3522,
        phone: '+33123456789',
        email: 'info@grandparis.com',
        pricePerNight: 350.00,
        taxRate: 10.0,
        totalRooms: 200,
        availableRooms: 150,
        roomTypes: {
          standard: { price: 350, available: 100 },
          deluxe: { price: 500, available: 40 },
          suite: { price: 800, available: 10 }
        },
        amenities: ['WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym'],
        images: ['hotel1.jpg', 'hotel2.jpg'],
        averageRating: 4.8,
        reviewCount: 1250
      },
      {
        name: 'Tokyo Bay Resort',
        description: 'Modern resort with stunning views of Tokyo Bay.',
        chain: 'Marriott',
        starRating: 4,
        address: '456 Bay Street, Tokyo, Japan',
        city: 'Tokyo',
        country: 'Japan',
        latitude: 35.6762,
        longitude: 139.6503,
        phone: '+81312345678',
        email: 'reservations@tokyobay.com',
        pricePerNight: 280.00,
        taxRate: 8.0,
        totalRooms: 150,
        availableRooms: 120,
        roomTypes: {
          standard: { price: 280, available: 80 },
          deluxe: { price: 400, available: 35 },
          suite: { price: 650, available: 5 }
        },
        amenities: ['WiFi', 'Pool', 'Restaurant', 'Business Center'],
        images: ['hotel3.jpg', 'hotel4.jpg'],
        averageRating: 4.5,
        reviewCount: 890
      }
    ]);

    console.log('✅ Hotels created');

    // Create Flights
    const flights = await Flight.bulkCreate([
      {
        airline: 'Emirates',
        airlineCode: 'EK',
        flightNumber: 'EK203',
        aircraftType: 'Boeing 777',
        departureAirport: 'DXB',
        departureAirportName: 'Dubai International Airport',
        departureCity: 'Dubai',
        departureCountry: 'UAE',
        arrivalAirport: 'JFK',
        arrivalAirportName: 'John F. Kennedy International Airport',
        arrivalCity: 'New York',
        arrivalCountry: 'USA',
        departureTime: new Date('2024-03-15T08:00:00'),
        arrivalTime: new Date('2024-03-15T14:30:00'),
        duration: 750,
        economyPrice: 1200.00,
        businessPrice: 2500.00,
        firstClassPrice: 5000.00,
        economySeats: 300,
        businessSeats: 50,
        firstClassSeats: 10,
        availableEconomySeats: 250,
        availableBusinessSeats: 40,
        availableFirstClassSeats: 8,
        baggageAllowance: {
          economy: { carryOn: 1, checked: 1, weight: 20 },
          business: { carryOn: 2, checked: 2, weight: 32 },
          firstClass: { carryOn: 2, checked: 3, weight: 40 }
        },
        amenities: ['WiFi', 'Entertainment', 'Meals', 'USB Ports'],
        isInternational: true
      },
      {
        airline: 'Singapore Airlines',
        airlineCode: 'SQ',
        flightNumber: 'SQ321',
        aircraftType: 'Airbus A380',
        departureAirport: 'SIN',
        departureAirportName: 'Singapore Changi Airport',
        departureCity: 'Singapore',
        departureCountry: 'Singapore',
        arrivalAirport: 'CDG',
        arrivalAirportName: 'Charles de Gaulle Airport',
        arrivalCity: 'Paris',
        arrivalCountry: 'France',
        departureTime: new Date('2024-03-20T23:30:00'),
        arrivalTime: new Date('2024-03-21T06:45:00'),
        duration: 795,
        economyPrice: 950.00,
        businessPrice: 2200.00,
        firstClassPrice: 4500.00,
        economySeats: 400,
        businessSeats: 80,
        firstClassSeats: 12,
        availableEconomySeats: 350,
        availableBusinessSeats: 65,
        availableFirstClassSeats: 10,
        baggageAllowance: {
          economy: { carryOn: 1, checked: 1, weight: 25 },
          business: { carryOn: 2, checked: 2, weight: 35 },
          firstClass: { carryOn: 2, checked: 3, weight: 50 }
        },
        amenities: ['WiFi', 'Entertainment', 'Meals', 'Lie-flat Seats'],
        isInternational: true
      }
    ]);

    console.log('✅ Flights created');

    // Create Packages
    const packages = await Package.bulkCreate([
      {
        name: 'Paris Romantic Getaway',
        description: '7-day romantic package in Paris including hotel, flights, and tours.',
        destinationId: destinations[0].id,
        duration: 7,
        inclusions: ['Return Flights', '5-star Hotel', 'Daily Breakfast', 'City Tour', 'Eiffel Tower Tickets'],
        exclusions: ['Lunch & Dinner', 'Personal Expenses', 'Travel Insurance'],
        itinerary: [
          { day: 1, activity: 'Arrival and check-in' },
          { day: 2, activity: 'City tour and Seine River cruise' },
          { day: 3, activity: 'Louvre Museum visit' },
          { day: 4, activity: 'Eiffel Tower and Champs-Élysées' },
          { day: 5, activity: 'Versailles Palace day trip' },
          { day: 6, activity: 'Free day for shopping' },
          { day: 7, activity: 'Departure' }
        ],
        price: 2500.00,
        discountPrice: 2200.00,
        maxTravelers: 2,
        availableSlots: 15,
        startDate: new Date('2024-04-01'),
        endDate: new Date('2024-10-31'),
        images: ['paris1.jpg', 'paris2.jpg'],
        isFeatured: true
      },
      {
        name: 'Tokyo Cultural Experience',
        description: '10-day cultural immersion in Tokyo with traditional experiences.',
        destinationId: destinations[1].id,
        duration: 10,
        inclusions: ['Return Flights', '4-star Hotel', 'Breakfast', 'Cultural Workshops', 'Temple Visits'],
        exclusions: ['Lunch & Dinner', 'Personal Expenses', 'Optional Activities'],
        itinerary: [
          { day: 1, activity: 'Arrival and orientation' },
          { day: 2, activity: 'Asakusa and Senso-ji Temple' },
          { day: 3, activity: 'Tsukiji Fish Market and sushi making' },
          { day: 4, activity: 'Mount Fuji day trip' },
          { day: 5, activity: 'Traditional tea ceremony' },
          { day: 6, activity: 'Akihabara and electronics district' },
          { day: 7, activity: 'Free day for exploration' },
          { day: 8, activity: 'Kimono wearing experience' },
          { day: 9, activity: 'Last minute shopping' },
          { day: 10, activity: 'Departure' }
        ],
        price: 3200.00,
        discountPrice: 2900.00,
        maxTravelers: 4,
        availableSlots: 20,
        startDate: new Date('2024-03-15'),
        endDate: new Date('2024-11-30'),
        images: ['tokyo1.jpg', 'tokyo2.jpg'],
        isFeatured: true
      }
    ]);

    console.log('✅ Packages created');

    // Create Bookings
    const bookings = await Booking.bulkCreate([
      {
        bookingReference: 'TB123456',
        userId: users[1].id, // John Doe
        bookingType: 'package',
        packageId: packages[0].id,
        bookingDate: new Date('2024-01-10'),
        checkInDate: new Date('2024-05-15'),
        checkOutDate: new Date('2024-05-22'),
        adults: 2,
        totalAmount: 2200.00,
        taxAmount: 220.00,
        discountAmount: 300.00,
        finalAmount: 2120.00,
        status: 'confirmed',
        paymentStatus: 'paid',
        specialRequests: 'Honeymoon package, please add champagne'
      },
      {
        bookingReference: 'TB123457',
        userId: users[2].id, // Jane Smith
        bookingType: 'flight',
        flightId: flights[0].id,
        bookingDate: new Date('2024-01-12'),
        flightDate: new Date('2024-03-20'),
        adults: 1,
        totalAmount: 1200.00,
        taxAmount: 120.00,
        finalAmount: 1320.00,
        status: 'confirmed',
        paymentStatus: 'paid'
      }
    ]);

    console.log('✅ Bookings created');

    // Create Reviews
    await Review.bulkCreate([
      {
        userId: users[1].id,
        hotelId: hotels[0].id,
        rating: 5,
        comment: 'Amazing hotel with perfect location and excellent service!',
        isVerified: true
      },
      {
        userId: users[2].id,
        packageId: packages[1].id,
        rating: 4,
        comment: 'Great cultural experience, would recommend to anyone visiting Tokyo.',
        isVerified: true
      }
    ]);

    console.log('✅ Reviews created');
    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if called directly
if (require.main === module) {
  seedData()
    .then(() => process.exit(0))
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = seedData;