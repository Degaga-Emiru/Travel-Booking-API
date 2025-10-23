import React from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiMapPin, FiWifi, FiCoffee, FiCar } from 'react-icons/fi';
import { formatCurrency, calculateDuration } from '../../utils/helpers';

const HotelCard = ({ hotel, viewMode, searchParams }) => {
  const nights = searchParams.checkIn && searchParams.checkOut 
    ? calculateDuration(new Date(searchParams.checkIn), new Date(searchParams.checkOut))
    : 1;

  const totalPrice = hotel.pricePerNight * nights * (searchParams.rooms || 1);

  const amenitiesToShow = hotel.amenities?.slice(0, 3) || [];

  const getAmenityIcon = (amenity) => {
    const icons = {
      'WiFi': <FiWifi className="w-4 h-4" />,
      'Restaurant': <FiCoffee className="w-4 h-4" />,
      'Parking': <FiCar className="w-4 h-4" />,
    };
    return icons[amenity] || <FiWifi className="w-4 h-4" />;
  };

  if (viewMode === 'list') {
    return (
      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Hotel Image */}
          <div className="md:w-64">
            <img
              src={hotel.images?.[0] || '/api/placeholder/400/300'}
              alt={hotel.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          {/* Hotel Details */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {hotel.name}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <FiMapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{hotel.city}, {hotel.country}</span>
                </div>
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${
                        i < hotel.starRating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {hotel.averageRating} ({hotel.reviewCount} reviews)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(hotel.pricePerNight)}
                </div>
                <div className="text-sm text-gray-600">per night</div>
                <div className="text-lg font-semibold text-primary-600 mt-1">
                  {formatCurrency(totalPrice)} total
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex items-center space-x-4 mb-4">
              {amenitiesToShow.map((amenity, index) => (
                <div key={index} className="flex items-center space-x-1 text-gray-600">
                  {getAmenityIcon(amenity)}
                  <span className="text-sm">{amenity}</span>
                </div>
              ))}
              {hotel.amenities?.length > 3 && (
                <span className="text-sm text-gray-500">
                  +{hotel.amenities.length - 3} more
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-4 line-clamp-2">
              {hotel.description}
            </p>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {hotel.availableRooms} rooms available
              </div>
              <Link
                to={`/hotels/${hotel.id}`}
                state={{ searchParams }}
                className="btn-primary"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Hotel Image */}
      <div className="relative">
        <img
          src={hotel.images?.[0] || '/api/placeholder/400/300'}
          alt={hotel.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 flex items-center space-x-1">
          <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-sm font-semibold">{hotel.averageRating}</span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-primary-500 text-white px-2 py-1 rounded text-sm font-medium">
            {hotel.starRating}★
          </span>
        </div>
      </div>

      {/* Hotel Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">
          {hotel.name}
        </h3>
        <div className="flex items-center text-gray-600 mb-2">
          <FiMapPin className="w-4 h-4 mr-1" />
          <span className="text-sm truncate">{hotel.city}, {hotel.country}</span>
        </div>

        {/* Amenities */}
        <div className="flex items-center space-x-2 mb-3">
          {amenitiesToShow.map((amenity, index) => (
            <div key={index} className="text-gray-400">
              {getAmenityIcon(amenity)}
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(hotel.pricePerNight)}
            </div>
            <div className="text-sm text-gray-600">per night</div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-primary-600">
              {formatCurrency(totalPrice)} total
            </div>
            <div className="text-xs text-gray-600">for {nights} nights</div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/hotels/${hotel.id}`}
          state={{ searchParams }}
          className="w-full btn-primary text-center block"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
};

export default HotelCard;