import React from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiUsers, FiStar } from 'react-icons/fi';
import { formatCurrency, formatDate } from '../../utils/helpers';

const PackageCard = ({ package: pkg, searchParams }) => {
  const totalPrice = pkg.discountPrice || pkg.price;
  const hasDiscount = pkg.discountPrice && pkg.discountPrice < pkg.price;

  return (
    <div className="card overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Package Image */}
      <div className="relative">
        <img
          src={pkg.images?.[0] || '/api/placeholder/400/300'}
          alt={pkg.name}
          className="w-full h-48 object-cover"
        />
        {pkg.isFeatured && (
          <div className="absolute top-3 left-3">
            <span className="bg-primary-500 text-white px-2 py-1 rounded text-sm font-medium">
              Featured
            </span>
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-3 right-3">
            <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
              Save {formatCurrency(pkg.price - pkg.discountPrice)}
            </span>
          </div>
        )}
      </div>

      {/* Package Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg flex-1">
            {pkg.name}
          </h3>
          {pkg.Destination && (
            <div className="flex items-center text-gray-600 ml-2">
              <FiMapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{pkg.Destination.city}</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {pkg.description}
        </p>

        {/* Package Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-600">
              <FiCalendar className="w-4 h-4 mr-2" />
              <span>{pkg.duration} days</span>
            </div>
            <div className="flex items-center text-gray-600">
              <FiUsers className="w-4 h-4 mr-2" />
              <span>Up to {pkg.maxTravelers} travelers</span>
            </div>
          </div>

          {pkg.averageRating > 0 && (
            <div className="flex items-center text-sm">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(pkg.averageRating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600">
                {pkg.averageRating} ({pkg.reviewCount} reviews)
              </span>
            </div>
          )}
        </div>

        {/* Inclusions */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Includes:</h4>
          <div className="flex flex-wrap gap-1">
            {pkg.inclusions?.slice(0, 3).map((inclusion, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
              >
                {inclusion}
              </span>
            ))}
            {pkg.inclusions?.length > 3 && (
              <span className="text-gray-500 text-xs">
                +{pkg.inclusions.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div>
            {hasDiscount && (
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">
                  {formatCurrency(pkg.discountPrice)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(pkg.price)}
                </span>
              </div>
            )}
            {!hasDiscount && (
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(pkg.price)}
              </span>
            )}
            <div className="text-sm text-gray-600">per package</div>
          </div>

          <Link
            to={`/packages/${pkg.id}`}
            state={{ searchParams }}
            className="btn-primary"
          >
            View Details
          </Link>
        </div>

        {/* Availability */}
        <div className="mt-3 text-center">
          <div className="text-sm text-gray-600">
            {pkg.availableSlots > 0 ? (
              <span className="text-green-600">{pkg.availableSlots} slots available</span>
            ) : (
              <span className="text-red-600">Sold out</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;