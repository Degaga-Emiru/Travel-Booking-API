export const APP_NAME = 'TravelBooking';
export const APP_DESCRIPTION = 'Your perfect travel companion';

export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  AGENT: 'agent',
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  REFUNDED: 'refunded',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded',
};

export const BOOKING_TYPES = {
  FLIGHT: 'flight',
  HOTEL: 'hotel',
  PACKAGE: 'package',
  CAR_RENTAL: 'car_rental',
};

export const FLIGHT_CLASS = {
  ECONOMY: 'economy',
  BUSINESS: 'business',
  FIRST: 'first',
};

export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  JPY: 'JPY',
  CAD: 'CAD',
  AUD: 'AUD',
};

export const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain',
  'Japan', 'China', 'Australia', 'India', 'Brazil', 'Mexico', 'Thailand', 'Singapore',
  'United Arab Emirates', 'South Korea', 'Turkey', 'Netherlands', 'Switzerland'
];

export const CITIES = {
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Las Vegas'],
  'United Kingdom': ['London', 'Manchester', 'Edinburgh', 'Birmingham'],
  'France': ['Paris', 'Nice', 'Lyon', 'Marseille'],
  'Italy': ['Rome', 'Milan', 'Venice', 'Florence'],
  'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Sapporo'],
  'Thailand': ['Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya'],
  'United Arab Emirates': ['Dubai', 'Abu Dhabi', 'Sharjah'],
};

export const AIRLINES = [
  'Emirates', 'Singapore Airlines', 'Qatar Airways', 'ANA All Nippon Airways',
  'Cathay Pacific', 'EVA Air', 'Qantas', 'Lufthansa', 'Air France', 'Turkish Airlines',
  'British Airways', 'Swiss International Air Lines', 'Korean Air', 'Japan Airlines',
  'Delta Air Lines', 'American Airlines', 'United Airlines'
];

export const HOTEL_CHAINS = [
  'Marriott', 'Hilton', 'Hyatt', 'InterContinental', 'Accor',
  'Wyndham', 'Choice Hotels', 'Best Western', 'Radisson'
];

export const AMENITIES = [
  'WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Air Conditioning',
  'Room Service', 'Business Center', 'Parking', 'Pet Friendly', 'Beach Access',
  'Mountain View', 'City View', 'Balcony', 'Kitchen', 'Washing Machine'
];