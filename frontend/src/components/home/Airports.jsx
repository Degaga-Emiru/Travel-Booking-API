import React from 'react';
import { motion } from 'framer-motion';
import { FiAirplay, FiMapPin, FiInfo } from 'react-icons/fi';
import data from '../../data/ethiopiaData.json';

const Airports = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-primary-600 font-bold uppercase tracking-widest text-sm mb-2">Connected to the World</h2>
            <h3 className="text-4xl font-extrabold text-gray-900 mb-4">Major Travel Hubs</h3>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Ethiopia is the gateway to Africa. Discover our world-class international and regional airports connecting you to every corner of the country.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.airports.map((airport, index) => (
            <motion.div
              key={airport.code}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all group border border-transparent hover:border-primary-100"
            >
              <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300">
                <FiAirplay className="text-2xl" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{airport.name}</h4>
              <div className="flex items-center text-primary-500 text-sm font-semibold mb-4">
                <FiMapPin className="mr-1" /> {airport.location} ({airport.code})
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                {airport.description}
              </p>
              
              <div className="mt-6 pt-6 border-t border-gray-50 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-primary-600 text-xs font-bold flex items-center hover:underline">
                  <FiInfo className="mr-1" /> FLIGHT SCHEDULES
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Airports;
