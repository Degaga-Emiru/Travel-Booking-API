import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMapPin, FiCalendar, FiStar, FiArrowLeft, FiInfo, FiHeart, FiShare2 } from 'react-icons/fi';
import data from '../data/ethiopiaData.json';

const CityDetail = () => {
  const { cityName } = useParams();
  const [city, setCity] = useState(null);

  useEffect(() => {
    // Find city by slug or name
    const foundCity = data.destinations.find(
      d => d.slug === cityName || d.name.toLowerCase() === cityName.toLowerCase()
    );
    setCity(foundCity);
    window.scrollTo(0, 0);
  }, [cityName]);

  if (!city) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Destination not found</h2>
        <Link to="/" className="text-primary-600 font-bold hover:underline flex items-center">
          <FiArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  // Filter hotels by city name
  const cityHotels = data.hotels.filter(h => h.city === city.name);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* 🌄 Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img src={city.image} alt={city.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
        </motion.div>

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-12">
          <Link to="/" className="w-fit flex items-center text-white/80 hover:text-white transition-colors">
            <FiArrowLeft className="mr-2" /> Back
          </Link>

          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="bg-primary-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-1 rounded-full">
                  Destination
                </span>
                <div className="flex space-x-2">
                  <button className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full text-white transition-all">
                    <FiHeart />
                  </button>
                  <button className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full text-white transition-all">
                    <FiShare2 />
                  </button>
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl">
                {city.name}
              </h1>
              <p className="text-xl text-primary-100 max-w-2xl drop-shadow-lg">
                {city.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3 space-y-12">
            
            {/* 🧱 Attractions Section */}
            <section className="bg-white rounded-[2rem] shadow-xl p-8 md:p-12">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center">
                <FiMapPin className="mr-3 text-primary-600" /> Must-Visit Attractions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {city.attractions.map((attraction, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    className="group"
                  >
                    <div className="relative h-56 rounded-2xl overflow-hidden mb-4 shadow-md">
                      <img src={attraction.image} alt={attraction.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{attraction.name}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{attraction.description}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* 🖼 Gallery Section */}
            <section>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-8 px-4">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...city.previewImages, city.image, ...city.attractions.map(a => a.image)].slice(0, 6).map((img, i) => (
                  <div key={i} className={`rounded-3xl overflow-hidden shadow-md h-48 ${i === 0 ? 'md:col-span-2 md:h-96' : ''}`}>
                    <img src={img} alt="Gallery" className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" />
                  </div>
                ))}
              </div>
            </section>

            {/* 🏨 Hotels Section */}
            <section>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-8 px-4">Available Hotels</h2>
              {cityHotels.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                  {cityHotels.map((hotel) => (
                    <div key={hotel.id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col sm:flex-row">
                      <div className="sm:w-1/3">
                        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-6 sm:w-2/3 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-lg mb-1">{hotel.name}</h4>
                          <div className="flex text-yellow-500 text-sm mb-2">
                             <FiStar className="fill-current mr-1" /> {hotel.rating}
                          </div>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-xl font-black text-primary-600">${hotel.price}</span>
                          <button className="bg-primary-600 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all hover:bg-primary-700">
                             Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 px-4">No hotels listed for this city yet.</p>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3 space-y-8">
            {/* Travel Info Card */}
            <div className="bg-primary-900 text-white rounded-[2rem] shadow-xl p-8 sticky top-24">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <FiInfo className="mr-3 text-primary-400" /> Travel Info
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-primary-400 font-bold text-sm uppercase mb-2">Best Time to Visit</h4>
                  <p className="text-primary-100">{city.travelInfo.bestTime}</p>
                </div>
                
                <div>
                  <h4 className="text-primary-400 font-bold text-sm uppercase mb-2">Popular Activities</h4>
                  <ul className="grid grid-cols-1 gap-2">
                    {city.travelInfo.activities.map((act, i) => (
                      <li key={i} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-1.5 mr-2" /> {act}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <h4 className="text-primary-400 font-bold text-xs uppercase mb-1">Local Tip</h4>
                  <p className="text-sm text-primary-100 italic">"{city.travelInfo.tips}"</p>
                </div>

                <button className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl active:scale-95">
                  Book a Trip to {city.name}
                </button>
              </div>
            </div>

            {/* CTA Sidebar */}
            <div className="bg-white rounded-[2rem] shadow-lg p-8 border border-gray-100">
              <h3 className="font-bold mb-4">Need help planning?</h3>
              <p className="text-gray-500 text-sm mb-6">Our travel experts are ready to help you create your perfect itinerary.</p>
              <button className="w-full text-primary-600 font-bold py-3 border-2 border-primary-600 rounded-2xl hover:bg-primary-50 transition-all">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityDetail;
