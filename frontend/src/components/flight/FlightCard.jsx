import React from 'react';
import { Link } from 'react-router-dom';
import { FiClock, FiWifi, FiCoffee, FiFilm } from 'react-icons/fi';
import { formatCurrency, formatDateTime } from '../../utils/helpers';

const FlightCard = ({ flight, searchParams }) => {
  const getPriceForClass = () => {
    switch (searchParams.class) {
      case 'business':
        return flight.businessPrice;
      case 'first':
        return flight.firstClassPrice;
      default:
        return flight.economyPrice;
    }
  };

  const getAvailableSeats = () => {
    switch (searchParams.class) {
      case 'business':
        return flight.availableBusinessSeats;
      case 'first':
        return flight.availableFirstClassSeats;
      default:
        return flight.availableEconomySeats;
    }
  };

  const totalPrice = getPriceForClass() * searchParams.passengers;
  const availableSeats = getAvailableSeats();

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        {/* Flight Info */}
        <div className="flex-1">
          <div className="flex items-center space-x-6">
            {/* Airline & Times */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold text-sm">
                  {flight.airlineCode}
                </span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">{flight.airline}</div>
                <div className="text-sm text-gray-600">{flight.flightNumber}</div>
              </div>
            </div>

            {/* Route */}
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatTime(flight.departureTime)}
                </div>
                <div className="text-sm text-gray-600">{flight.departureAirport}</div>
                <div className="text-xs text-gray-500">{flight.departureCity}</div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-sm text-gray-500">
                  {formatDuration(flight.duration)}
                </div>
                <div className="w-20 h-px bg-gray-300 my-1"></div>
                <div className="text-xs text-gray-500">Direct</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {formatTime(flight.arrivalTime)}
                </div>
                <div className="text-sm text-gray-600">{flight.arrivalAirport}</div>
                <div className="text-xs text-gray-500">{flight.arrivalCity}</div>
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex items-center space-x-4 mt-4">
            {flight.amenities?.includes('WiFi') && (
              <div className="flex items-center space-x-1 text-gray-600">
                <FiWifi className="w-4 h-4" />
                <span className="text-sm">WiFi</span>
              </div>
            )}
            {flight.amenities?.includes('Entertainment') && (
              <div className="flex items-center space-x-1 text-gray-600">
                <FiFilm className="w-4 h-4" />
                <span className="text-sm">Entertainment</span>
              </div>
            )}
            {flight.amenities?.includes('Meals') && (
              <div className="flex items-center space-x-1 text-gray-600">
                <FiCoffee className="w-4 h-4" />
                <span className="text-sm">Meals</span>
              </div>
            )}
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center space-x-6 mt-4 lg:mt-0">
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(getPriceForClass())}
            </div>
            <div className="text-sm text-gray-600">per passenger</div>
            <div className="text-lg font-semibold text-primary-600">
              {formatCurrency(totalPrice)} total
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {availableSeats} seats left
            </div>
          </div>

          <Link
            to={`/flights/${flight.id}`}
            state={{ searchParams }}
            className="btn-primary whitespace-nowrap"
          >
            Select
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;