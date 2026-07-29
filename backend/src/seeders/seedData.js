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

    const CITIES_DATA = [
      // Ethiopian Cities
      { city: 'Addis Ababa', country: 'Ethiopia', airport: 'ADD', airportName: 'Bole International Airport' },
      { city: 'Lalibela', country: 'Ethiopia', airport: 'LLI', airportName: 'Lalibela Airport' },
      { city: 'Hawassa', country: 'Ethiopia', airport: 'AWA', airportName: 'Hawassa Airport' },
      { city: 'Arbaminch', country: 'Ethiopia', airport: 'AMH', airportName: 'Arba Minch Airport' },
      { city: 'Assosa', country: 'Ethiopia', airport: 'ASO', airportName: 'Assosa Airport' },
      { city: 'Gondar', country: 'Ethiopia', airport: 'GDQ', airportName: 'Atse Fasil Airport' },
      
      // International Cities
      { city: 'Paris', country: 'France', airport: 'CDG', airportName: 'Charles de Gaulle Airport' },
      { city: 'Nice', country: 'France', airport: 'NCE', airportName: 'Nice Côte d\'Azur Airport' },
      { city: 'Lyon', country: 'France', airport: 'LYS', airportName: 'Lyon-Saint Exupéry Airport' },
      { city: 'Marseille', country: 'France', airport: 'MRS', airportName: 'Marseille Provence Airport' },
      { city: 'New York', country: 'USA', airport: 'JFK', airportName: 'John F. Kennedy International Airport' },
      { city: 'Los Angeles', country: 'USA', airport: 'LAX', airportName: 'Los Angeles International Airport' },
      { city: 'Chicago', country: 'USA', airport: 'ORD', airportName: 'O\'Hare International Airport' },
      { city: 'Miami', country: 'USA', airport: 'MIA', airportName: 'Miami International Airport' },
      { city: 'Las Vegas', country: 'USA', airport: 'LAS', airportName: 'Harry Reid International Airport' },
      { city: 'London', country: 'United Kingdom', airport: 'LHR', airportName: 'Heathrow Airport' },
      { city: 'Manchester', country: 'United Kingdom', airport: 'MAN', airportName: 'Manchester Airport' },
      { city: 'Edinburgh', country: 'United Kingdom', airport: 'EDI', airportName: 'Edinburgh Airport' },
      { city: 'Birmingham', country: 'United Kingdom', airport: 'BHX', airportName: 'Birmingham Airport' },
      { city: 'Rome', country: 'Italy', airport: 'FCO', airportName: 'Fiumicino Leonardo da Vinci Airport' },
      { city: 'Milan', country: 'Italy', airport: 'MXP', airportName: 'Milano Malpensa Airport' },
      { city: 'Venice', country: 'Italy', airport: 'VCE', airportName: 'Venice Marco Polo Airport' },
      { city: 'Florence', country: 'Italy', airport: 'FLR', airportName: 'Florence Airport' },
      { city: 'Tokyo', country: 'Japan', airport: 'HND', airportName: 'Haneda Airport' },
      { city: 'Osaka', country: 'Japan', airport: 'KIX', airportName: 'Kansai International Airport' },
      { city: 'Kyoto', country: 'Japan', airport: 'ITM', airportName: 'Itami Airport' },
      { city: 'Sapporo', country: 'Japan', airport: 'CTS', airportName: 'New Chitose Airport' },
      { city: 'Bangkok', country: 'Thailand', airport: 'BKK', airportName: 'Suvarnabhumi Airport' },
      { city: 'Phuket', country: 'Thailand', airport: 'HKT', airportName: 'Phuket International Airport' },
      { city: 'Chiang Mai', country: 'Thailand', airport: 'CNX', airportName: 'Chiang Mai International Airport' },
      { city: 'Pattaya', country: 'Thailand', airport: 'UTP', airportName: 'U-Tapao Airport' },
      { city: 'Dubai', country: 'United Arab Emirates', airport: 'DXB', airportName: 'Dubai International Airport' },
      { city: 'Abu Dhabi', country: 'United Arab Emirates', airport: 'AUH', airportName: 'Abu Dhabi International Airport' },
      { city: 'Sharjah', country: 'United Arab Emirates', airport: 'SHJ', airportName: 'Sharjah International Airport' }
    ];

    // Create Destinations
    const destinationsToCreate = CITIES_DATA.map(item => ({
      name: `${item.city}, ${item.country}`,
      country: item.country,
      city: item.city,
      description: `Beautiful destination of ${item.city} in ${item.country}. Enjoy local sites, attractions, and cultural experiences.`,
      bestTimeToVisit: 'October to May',
      currency: item.country === 'Ethiopia' ? 'ETB' : 'USD',
      language: item.country === 'Ethiopia' ? 'Amharic' : 'English',
      timezone: 'UTC+3',
      attractions: [`Historic Center of ${item.city}`, `Waterfront of ${item.city}`, `Museum of ${item.city}`],
      climate: 'Temperate',
      isPopular: true
    }));

    const destinations = await Destination.bulkCreate(destinationsToCreate);
    console.log(`✅ ${destinations.length} Destinations created`);

    // Create Hotels for all destinations
    const hotelsToCreate = [];
    const hotelChains = ['Kuriftu Resort', 'Haile Resort', 'Hilton', 'Marriott', 'Radisson', 'Sheraton', 'Hyatt'];
    const hotelImages = [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c0d588fa?auto=format&fit=crop&w=800&q=80'
    ];

    CITIES_DATA.forEach((item, index) => {
      // Create 2 hotels per destination
      const chain1 = item.country === 'Ethiopia' ? (index % 2 === 0 ? 'Kuriftu Resort' : 'Haile Resort') : hotelChains[index % hotelChains.length];
      hotelsToCreate.push({
        name: `${chain1} ${item.city}`,
        description: `Experience exceptional service, comfortable rooms, and top-tier amenities at the elegant ${chain1} in ${item.city}. Perfect for leisure and business travelers alike.`,
        chain: chain1,
        starRating: 4 + (index % 2),
        address: `100 Grand Avenue, ${item.city}, ${item.country}`,
        city: item.city,
        country: item.country,
        latitude: 9.0 + (index * 0.05),
        longitude: 38.7 + (index * 0.05),
        phone: `+2519112233${index.toString().padStart(2, '0')}`,
        email: `info@${chain1.toLowerCase().replace(/ /g, '')}${item.city.toLowerCase()}.com`,
        pricePerNight: 120.00 + (index * 5),
        taxRate: 10.0,
        totalRooms: 100,
        availableRooms: 80,
        roomTypes: {
          standard: { price: 120 + (index * 5), available: 50 },
          deluxe: { price: 180 + (index * 5), available: 20 },
          suite: { price: 250 + (index * 5), available: 10 }
        },
        amenities: ['WiFi', 'Pool', 'Restaurant', 'Gym', 'Bar', 'Room Service'],
        images: [hotelImages[index % hotelImages.length]],
        averageRating: 4.5 + (index % 6) * 0.1,
        reviewCount: 45 + index * 3,
        isActive: true
      });

      const chain2 = item.country === 'Ethiopia' ? 'Skylight Hotel' : 'Plaza Hotel';
      hotelsToCreate.push({
        name: `${item.city} ${chain2}`,
        description: `Conveniently located and beautifully furnished, the ${item.city} ${chain2} offers guests modern suites, free high-speed wifi, and gourmet dining.`,
        chain: chain2,
        starRating: 4,
        address: `200 Airport Road, ${item.city}, ${item.country}`,
        city: item.city,
        country: item.country,
        latitude: 9.01 + (index * 0.05),
        longitude: 38.71 + (index * 0.05),
        phone: `+2519112244${index.toString().padStart(2, '0')}`,
        email: `contact@${item.city.toLowerCase()}${chain2.toLowerCase().replace(/ /g, '')}.com`,
        pricePerNight: 85.00 + (index * 3),
        taxRate: 10.0,
        totalRooms: 120,
        availableRooms: 95,
        roomTypes: {
          standard: { price: 85 + (index * 3), available: 70 },
          deluxe: { price: 130 + (index * 3), available: 20 },
          suite: { price: 190 + (index * 3), available: 5 }
        },
        amenities: ['WiFi', 'Breakfast', 'Restaurant', 'Business Center', 'Parking'],
        images: [hotelImages[(index + 1) % hotelImages.length]],
        averageRating: 4.2 + (index % 5) * 0.1,
        reviewCount: 30 + index * 2,
        isActive: true
      });
    });

    const hotels = await Hotel.bulkCreate(hotelsToCreate);
    console.log(`✅ ${hotels.length} Hotels created`);

    // Create Flights dynamically for the next 30 days
    console.log('✈️ Creating flights daily for the next 30 days...');
    const flightsToCreate = [];
    const airlines = ['Ethiopian Airlines', 'Emirates', 'Qatar Airways', 'Lufthansa', 'British Airways', 'Singapore Airlines'];
    
    // Core routes: (from, to, duration, basePrice)
    const routes = [
      // Domestic Ethiopian routes
      { from: 'Addis Ababa', to: 'Gondar', duration: 60, price: 90 },
      { from: 'Gondar', to: 'Addis Ababa', duration: 60, price: 90 },
      { from: 'Addis Ababa', to: 'Lalibela', duration: 55, price: 85 },
      { from: 'Lalibela', to: 'Addis Ababa', duration: 55, price: 85 },
      { from: 'Addis Ababa', to: 'Hawassa', duration: 45, price: 75 },
      { from: 'Hawassa', to: 'Addis Ababa', duration: 45, price: 75 },
      { from: 'Addis Ababa', to: 'Arbaminch', duration: 50, price: 80 },
      { from: 'Arbaminch', to: 'Addis Ababa', duration: 50, price: 80 },
      { from: 'Addis Ababa', to: 'Assosa', duration: 65, price: 95 },
      { from: 'Assosa', to: 'Addis Ababa', duration: 65, price: 95 },

      // Major International routes
      { from: 'Addis Ababa', to: 'Paris', duration: 420, price: 750 },
      { from: 'Paris', to: 'Addis Ababa', duration: 420, price: 750 },
      { from: 'Addis Ababa', to: 'London', duration: 450, price: 800 },
      { from: 'London', to: 'Addis Ababa', duration: 450, price: 800 },
      { from: 'Addis Ababa', to: 'Dubai', duration: 240, price: 450 },
      { from: 'Dubai', to: 'Addis Ababa', duration: 240, price: 450 },
      { from: 'Addis Ababa', to: 'New York', duration: 840, price: 1100 },
      { from: 'New York', to: 'Addis Ababa', duration: 840, price: 1100 },
      { from: 'Addis Ababa', to: 'Tokyo', duration: 780, price: 1200 },
      { from: 'Tokyo', to: 'Addis Ababa', duration: 780, price: 1200 },

      // Key international city pairs
      { from: 'London', to: 'New York', duration: 480, price: 650 },
      { from: 'New York', to: 'London', duration: 480, price: 650 },
      { from: 'Paris', to: 'New York', duration: 500, price: 700 },
      { from: 'New York', to: 'Paris', duration: 500, price: 700 },
      { from: 'Dubai', to: 'London', duration: 430, price: 550 },
      { from: 'London', to: 'Dubai', duration: 430, price: 550 }
    ];

    const today = new Date();

    for (let day = 0; day < 30; day++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + day);

      routes.forEach((route, routeIdx) => {
        const fromCityData = CITIES_DATA.find(c => c.city === route.from);
        const toCityData = CITIES_DATA.find(c => c.city === route.to);

        if (!fromCityData || !toCityData) return;

        const airline = fromCityData.country === 'Ethiopia' ? 'Ethiopian Airlines' : airlines[routeIdx % airlines.length];
        const airlineCode = airline === 'Ethiopian Airlines' ? 'ET' : 'FL';
        const flightNumber = `${airlineCode}${100 + routeIdx + day}`;

        // Flight departure times: morning flight
        const departureTime1 = new Date(currentDate);
        departureTime1.setHours(8 + (routeIdx % 3), 0, 0, 0);

        const arrivalTime1 = new Date(departureTime1);
        arrivalTime1.setMinutes(departureTime1.getMinutes() + route.duration);

        flightsToCreate.push({
          airline,
          airlineCode,
          flightNumber,
          aircraftType: route.duration > 120 ? 'Boeing 777' : 'Bombardier Q400',
          departureAirport: fromCityData.airport,
          departureAirportName: fromCityData.airportName,
          departureCity: fromCityData.city,
          departureCountry: fromCityData.country,
          arrivalAirport: toCityData.airport,
          arrivalAirportName: toCityData.airportName,
          arrivalCity: toCityData.city,
          arrivalCountry: toCityData.country,
          departureTime: departureTime1,
          arrivalTime: arrivalTime1,
          duration: route.duration,
          economyPrice: route.price,
          businessPrice: route.price * 2,
          firstClassPrice: route.price * 4,
          economySeats: 150,
          businessSeats: 24,
          firstClassSeats: 8,
          availableEconomySeats: 120,
          availableBusinessSeats: 18,
          availableFirstClassSeats: 6,
          baggageAllowance: {
            economy: { carryOn: 1, checked: 1, weight: 23 },
            business: { carryOn: 2, checked: 2, weight: 32 },
            firstClass: { carryOn: 2, checked: 3, weight: 32 }
          },
          amenities: ['Meals', 'Entertainment', 'USB Ports'],
          isInternational: fromCityData.country !== toCityData.country,
          isActive: true
        });
      });
    }

    const flights = await Flight.bulkCreate(flightsToCreate);
    console.log(`✅ ${flights.length} Flights seeded successfully`);

    // Create Packages
    const packages = await Package.bulkCreate([
      {
        name: 'Lalibela Spiritual Discovery',
        description: '4-day tour in Lalibela rock-hewn churches with expert local guides, standard hotel lodging, and flights included.',
        destinationId: destinations.find(d => d.city === 'Lalibela')?.id,
        duration: 4,
        inclusions: ['Roundtrip Flights', 'Hotel Lodging', 'Daily Breakfast', 'Guided Church Tours', 'Coffee Ceremonies'],
        exclusions: ['Personal Expenses', 'Dinner', 'Travel Insurance'],
        itinerary: [
          { day: 1, activity: 'Arrival in Lalibela and check-in' },
          { day: 2, activity: 'Tour the Northern Group rock churches' },
          { day: 3, activity: 'Tour the Southern Group and Bete Giyorgis' },
          { day: 4, activity: 'Morning flight back to Addis Ababa' }
        ],
        price: 450.00,
        discountPrice: 399.00,
        maxTravelers: 4,
        availableSlots: 20,
        startDate: new Date('2026-08-01'),
        endDate: new Date('2026-12-31'),
        images: ['https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80'],
        isFeatured: true
      },
      {
        name: 'Hawassa Lakeside Getaway',
        description: 'Relaxing 3-day luxury lakeside retreat in Hawassa, staying at a premium resort with lake boat tours.',
        destinationId: destinations.find(d => d.city === 'Hawassa')?.id,
        duration: 3,
        inclusions: ['Resort Lodging', 'Breakfast', 'Lakeside Sunset Boat Ride', 'Fish Market Tour'],
        exclusions: ['Flights', 'Lunch', 'Gratuities'],
        itinerary: [
          { day: 1, activity: 'Check-in and evening lakeside walk' },
          { day: 2, activity: 'Morning fish market tour and afternoon boat safari' },
          { day: 3, activity: 'Relaxation and checkout' }
        ],
        price: 320.00,
        discountPrice: 280.00,
        maxTravelers: 2,
        availableSlots: 15,
        startDate: new Date('2026-08-01'),
        endDate: new Date('2026-12-31'),
        images: ['https://upload.wikimedia.org/wikipedia/commons/e/ec/Hawassa_lake%2C_Ethiopia.jpg'],
        isFeatured: true
      }
    ]);

    console.log('✅ Packages created');

    // Create Bookings
    const bookings = await Booking.bulkCreate([
      {
        bookingReference: 'TB123456',
        userId: users[1].id, // John Doe
        bookingType: 'hotel',
        hotelId: hotels[0].id,
        bookingDate: new Date('2026-07-10'),
        checkInDate: new Date('2026-08-15'),
        checkOutDate: new Date('2026-08-20'),
        adults: 2,
        rooms: 1,
        totalAmount: hotels[0].pricePerNight * 5,
        taxAmount: hotels[0].pricePerNight * 5 * 0.1,
        discountAmount: 0.00,
        finalAmount: (hotels[0].pricePerNight * 5) + (hotels[0].pricePerNight * 5 * 0.1),
        status: 'confirmed',
        paymentStatus: 'paid',
        specialRequests: 'High floor preferred'
      },
      {
        bookingReference: 'TB123457',
        userId: users[2].id, // Jane Smith
        bookingType: 'flight',
        flightId: flights[0].id,
        bookingDate: new Date('2026-07-12'),
        flightDate: flights[0].departureTime,
        adults: 1,
        totalAmount: flights[0].economyPrice,
        taxAmount: flights[0].economyPrice * 0.1,
        finalAmount: flights[0].economyPrice * 1.1,
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
        comment: 'Amazing resort and perfect service, very friendly staff!',
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