const axios = require('axios');

class ChapaService {
  constructor() {
    this.secretKey = process.env.CHAPA_SECRET_KEY;
    this.baseUrl = 'https://api.chapa.co/v1';
  }

  /**
   * Initialize a transaction
   * @param {Object} data - Transaction data (amount, currency, email, first_name, last_name, tx_ref, callback_url, etc.)
   */
  async initialize(data) {
    try {
      const response = await axios.post(`${this.baseUrl}/transaction/initialize`, data, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Chapa Initialization Error:', error.response ? error.response.data : error.message);
      throw new Error(error.response ? error.response.data.message : 'Chapa initialization failed');
    }
  }

  /**
   * Verify a transaction
   * @param {string} txRef - Transaction reference
   */
  async verify(txRef) {
    try {
      const response = await axios.get(`${this.baseUrl}/transaction/verify/${txRef}`, {
        headers: {
          Authorization: `Bearer ${this.secretKey}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Chapa Verification Error:', error.response ? error.response.data : error.message);
      throw new Error(error.response ? error.response.data.message : 'Chapa verification failed');
    }
  }
}

module.exports = new ChapaService();
