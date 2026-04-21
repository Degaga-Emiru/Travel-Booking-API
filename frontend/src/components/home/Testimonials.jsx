import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

// Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const Testimonials = () => {
  const reviews = [
    {
      name: "Abel Tesfaye",
      role: "Digital Nomad",
      comment: "The best platform for exploring Ethiopia. I found a hidden gem of a resort in Hawassa that wasn't on any other site!",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=abel"
    },
    {
      name: "Marta Bekele",
      role: "Travel Enthusiast",
      comment: "Booking my flight and hotel in one go was so convenient. The local support team is incredibly helpful and responsive.",
      rating: 5,
      avatar: "https://i.pravatar.cc/150?u=marta"
    },
    {
      name: "John Doe",
      role: "International Tourist",
      comment: "Viscerally beautiful website and even better service. Ethiopia is a must-visit, and this is the best way to do it.",
      rating: 4,
      avatar: "https://i.pravatar.cc/150?u=john"
    }
  ];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl font-extrabold text-gray-900"
          >
            What Our Travelers Say
          </motion.h2>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          className="pb-16"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="text-center px-4">
                <div className="flex justify-center text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className={i < review.rating ? "fill-current" : ""} />
                  ))}
                </div>
                <p className="text-2xl text-gray-600 italic leading-relaxed mb-10">
                  "{review.comment}"
                </p>
                <div className="flex flex-col items-center">
                  <img src={review.avatar} alt={review.name} className="w-16 h-16 rounded-full mb-4 border-4 border-primary-50" />
                  <h4 className="font-bold text-gray-900">{review.name}</h4>
                  <span className="text-primary-600 text-sm font-medium">{review.role}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
