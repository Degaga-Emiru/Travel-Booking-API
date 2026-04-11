import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiSearch, FiMapPin, FiStar, FiShield, FiGlobe, FiArrowRight, FiCalendar, FiUsers } from 'react-icons/fi';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('hotels');

  const popularDestinations = [
    { name: 'Bahir Dar', image: 'https://images.unsplash.com/photo-1540959733332-47ad22581b52', price: '$120' },
    { name: 'Addis Ababa', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9', price: '$150' },
    { name: 'Gondar', image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52', price: '$110' },
    { name: 'Lalibela', image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1', price: '$200' }
  ];

  return (
    <div className="min-h-screen">
      {/* 🌄 Hero Section */}
      <section className="relative overflow-hidden bg-cover bg-center h-[600px]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-primary-900/60 mix-blend-multiply"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center mt-10">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 text-center animate-fade-in drop-shadow-md">
            Find Hotels, Flights & Cars<br/>Anywhere in the World
          </h1>

          {/* 🔍 Search Bar */}
          <div className="mt-8 bg-white rounded-xl shadow-2xl p-4 md:p-6 w-full max-w-5xl mx-auto animate-slide-up">
            <div className="flex space-x-6 mb-4 px-2">
              <button onClick={() => setActiveTab('hotels')} className={`text-lg font-semibold pb-2 border-b-2 ${activeTab === 'hotels' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>🏨 Hotels</button>
              <button onClick={() => setActiveTab('flights')} className={`text-lg font-semibold pb-2 border-b-2 ${activeTab === 'flights' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>✈️ Flights</button>
              <button onClick={() => setActiveTab('cars')} className={`text-lg font-semibold pb-2 border-b-2 ${activeTab === 'cars' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>🚗 Car Rentals</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-3">
                <FiMapPin className="text-gray-400 mr-2 text-xl" />
                <input type="text" placeholder="Where to?" className="bg-transparent w-full focus:outline-none text-gray-800" />
              </div>
              <div className="flex items-center bg-gray-100 rounded-lg p-3">
                <FiCalendar className="text-gray-400 mr-2 text-xl" />
                <input type="text" placeholder="Check-in - Check-out" className="bg-transparent w-full focus:outline-none text-gray-800" />
              </div>
              <div className="flex items-center bg-gray-100 rounded-lg p-3">
                <FiUsers className="text-gray-400 mr-2 text-xl" />
                <input type="text" placeholder="2 Guests, 1 Room" className="bg-transparent w-full focus:outline-none text-gray-800" />
              </div>
              <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg p-3 transition flex items-center justify-center">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 🌟 Featured Destinations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Featured Destinations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularDestinations.map((dest, i) => (
              <div key={i} className="group rounded-2xl overflow-hidden shadow-lg bg-white hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
                <div className="relative h-60">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 p-4">
                    <h3 className="text-white text-xl font-bold">{dest.name}</h3>
                    <p className="text-primary-300 font-medium">From {dest.price}</p>
                  </div>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <button className="text-primary-600 font-semibold hover:text-primary-800">Explore &rarr;</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✈️ Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">💰</div>
              <h3 className="text-xl font-bold">Best Prices</h3>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🤝</div>
              <h3 className="text-xl font-bold">Trusted Partners</h3>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔐</div>
              <h3 className="text-xl font-bold">Secure Booking</h3>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🎧</div>
              <h3 className="text-xl font-bold">24/7 Support</h3>
            </div>
          </div>
        </div>
      </section>

      {/* 📩 Newsletter Section */}
      <section className="bg-primary-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Subscribe to our Newsletter</h2>
          <p className="text-primary-200 mb-8">Get the latest deals and offers straight to your inbox</p>
          <div className="flex flex-col sm:flex-row justify-center max-w-lg mx-auto">
            <input type="email" placeholder="Your Email Address" className="px-4 py-3 rounded-l-lg w-full focus:outline-none" />
            <button className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-r-lg transition">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;