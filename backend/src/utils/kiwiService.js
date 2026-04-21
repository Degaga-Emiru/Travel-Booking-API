const axios = require('axios');

/**
 * Kiwi (Tequila) API Service
 * Used for flight searches and booking information
 */
class KiwiService {
  constructor() {
    this.apiKey = process.env.KIWI_API_KEY;
    this.baseUrl = 'https://api.tequila.kiwi.com/v2';
  }

  /**
   * Search for flights
   * @param {Object} params Search parameters
   */
  async searchFlights(params) {
    if (!this.apiKey) {
      console.warn('KIWI_API_KEY not found in environment variables. Flight search will be limited to internal data.');
      return [];
    }

    try {
      const { 
        departure, 
        arrival, 
        date, 
        passengers = 1, 
        flightClass = 'M' // M=Economy, W=Premium Economy, C=Business, F=First
      } = params;

      // Format date from YYYY-MM-DD to DD/MM/YYYY
      const dateObj = new Date(date);
      const formattedDate = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth() + 1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;

      const response = await axios.get(`${this.baseUrl}/search`, {
        headers: {
          apikey: this.apiKey
        },
        params: {
          fly_from: departure,
          fly_to: arrival,
          date_from: formattedDate,
          date_to: formattedDate,
          adults: passengers,
          selected_cabins: flightClass,
          curr: 'USD',
          limit: 20
        }
      });

      // Map Kiwi response to our application format
      return response.data.data.map(flight => ({
        id: flight.id,
        flightNumber: `${flight.airlines[0]}${flight.route[0].flight_no}`,
        airline: flight.airlines[0],
        departureAirport: flight.flyFrom,
        arrivalAirport: flight.flyTo,
        departureTime: flight.local_departure,
        arrivalTime: flight.local_arrival,
        duration: flight.duration.total,
        price: flight.price,
        currency: 'USD',
        availableSeats: flight.availability.seats || 0,
        isExternal: true, // Mark as external API result
        deepLink: flight.deep_link
      }));
    } catch (error) {
      console.error('Kiwi API Search Error:', error.response?.data || error.message);
      return [];
    }
  }
}

module.exports = new KiwiService();
