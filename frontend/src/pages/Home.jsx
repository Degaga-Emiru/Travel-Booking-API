import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMapPin, FiCalendar, FiUsers, FiStar } from 'react-icons/fi';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('hotels');
  const navigate = useNavigate();

  const popularDestinations = [
    { name: 'Bahir Dar', image: 'https://images.unsplash.com/photo-1540959733332-47ad22581b52', price: '$120' },
    { name: 'Addis Ababa', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9', price: '$150' },
    { name: 'Gondar', image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52', price: '$110' },
    { name: 'Lalibela', image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1', price: '$200' }
  ];

  const popularHotels = [
    { name: 'Kuriftu Resort', location: 'Bahir Dar', rating: 4.8, price: '$150/night', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945' },
    { name: 'Skylight Hotel', location: 'Addis Ababa', rating: 4.9, price: '$200/night', image: 'https://images.unsplash.com/photo-1551882547-ff40c0d588fa' },
    { name: 'Goha Hotel', location: 'Gondar', rating: 4.5, price: '$90/night', image: 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a' }
  ];

  const reviews = [
    { name: 'Sarah Jenkins', comment: 'Absolutely seamless booking experience! Found top hotels instantly.', rating: 5 },
    { name: 'Mark T.', comment: 'The best prices for cars and flights. Customer support is incredible.', rating: 5 },
    { name: 'Aman Y.', comment: 'Loved exploring local destinations using this fast and secure app.', rating: 4 }
  ];

  const QuickSearchCards = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div onClick={() => navigate('/hotels')} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:-translate-y-2 transition-transform duration-300 border-b-4 border-primary-500">
          <span className="text-4xl mb-4">🏨</span>
          <h3 className="text-xl font-bold text-gray-800">Hotels</h3>
          <p className="text-gray-500 text-sm mt-2 text-center">Find the best places to stay</p>
        </div>
        <div onClick={() => navigate('/flights')} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:-translate-y-2 transition-transform duration-300 border-b-4 border-primary-500">
          <span className="text-4xl mb-4">✈️</span>
          <h3 className="text-xl font-bold text-gray-800">Flights</h3>
          <p className="text-gray-500 text-sm mt-2 text-center">Book domestic & international</p>
        </div>
        <div onClick={() => navigate('/cars')} className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:-translate-y-2 transition-transform duration-300 border-b-4 border-primary-500">
          <span className="text-4xl mb-4">🚗</span>
          <h3 className="text-xl font-bold text-gray-800">Car Rentals</h3>
          <p className="text-gray-500 text-sm mt-2 text-center">Explore at your own pace</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* 🌄 Hero Section */}
      <section className="relative overflow-visible bg-cover bg-center md:pb-24 pb-16 pt-32" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="absolute inset-0 bg-primary-900/60 mix-blend-multiply"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
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

      {/* 🔥 Quick Search Cards */}
      <QuickSearchCards />

      {/* 🌟 Featured Destinations */}
      <section className="pt-24 pb-16 bg-gray-50">
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
                <div className="p-4 flex justify-between items-center bg-white">
                  <button className="text-primary-600 font-semibold hover:text-primary-800">Explore &rarr;</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏨 Popular Hotels */}
      <section className="py-16 bg-white shrink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">Popular Hotels</h2>
            <p className="text-gray-500 text-lg">Stay at the most highly reviewed estates</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularHotels.map((hotel, i) => (
              <div key={i} className="rounded-2xl overflow-hidden shadow-md border hover:shadow-xl transition duration-300">
                <img src={hotel.image} alt={hotel.name} className="w-full h-56 object-cover" />
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
                  <div className="flex items-center mt-1 text-gray-500">
                    <FiMapPin className="mr-1" /> {hotel.location}
                  </div>
                  <div className="mt-4 flex justify-between flex-row items-center">
                    <div className="flex items-center text-yellow-500">
                      <FiStar className="fill-current" />
                      <span className="ml-1 text-gray-700 font-bold">{hotel.rating}</span>
                    </div>
                    <span className="font-bold text-lg text-primary-600">{hotel.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ✈️ Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">💰</div>
              <h3 className="text-xl font-bold">Best Prices</h3>
              <p className="text-gray-500 text-sm mt-2">Unbeatable discounts</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🤝</div>
              <h3 className="text-xl font-bold">Trusted Partners</h3>
              <p className="text-gray-500 text-sm mt-2">Top global brands</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔐</div>
              <h3 className="text-xl font-bold">Secure Booking</h3>
              <p className="text-gray-500 text-sm mt-2">100% Protected Payments</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🎧</div>
              <h3 className="text-xl font-bold">24/7 Support</h3>
              <p className="text-gray-500 text-sm mt-2">We are always here</p>
            </div>
          </div>
        </div>
      </section>

      {/* 💬 Reviews Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">What Our Users Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, i) => (
              <div key={i} className="p-6 border border-gray-100 rounded-2xl shadow-sm hover:shadow-lg transition">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(review.rating)].map((_, idx) => <FiStar key={idx} className="fill-current" />)}
                </div>
                <p className="text-gray-600 italic mb-4">"{review.comment}"</p>
                <div className="font-bold text-gray-900">- {review.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📩 Newsletter Section */}
      <section className="bg-primary-900 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Subscribe to our Newsletter</h2>
          <p className="text-primary-200 mb-8">Get the latest deals and offers straight to your inbox</p>
          <div className="flex flex-col sm:flex-row justify-center max-w-lg mx-auto">
            <input type="email" placeholder="Your Email Address" className="px-4 py-3 rounded-l-lg sm:rounded-r-none w-full focus:outline-none mb-2 sm:mb-0" />
            <button className="bg-primary-500 hover:bg-primary-600 text-white font-bold px-6 py-3 rounded-r-lg sm:rounded-l-none transition w-full sm:w-auto">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;