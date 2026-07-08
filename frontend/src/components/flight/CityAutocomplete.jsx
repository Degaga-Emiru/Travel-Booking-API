import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { CITIES } from '../../utils/constants';

const allCities = Object.values(CITIES).flat();

const CityAutocomplete = ({ value, onChange, placeholder, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const wrapperRef = useRef(null);

  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [wrapperRef]);

  const filteredCities = allCities.filter(city => 
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="form-input pl-10 w-full"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setIsOpen(true);
          if (e.target.value === '') {
             onChange('');
          }
        }}
        onFocus={() => setIsOpen(true)}
        required={required}
      />
      {isOpen && filteredCities.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredCities.map((city) => (
            <li
              key={city}
              className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center text-gray-700"
              onClick={() => {
                setSearchTerm(city);
                onChange(city);
                setIsOpen(false);
              }}
            >
              <FiMapPin className="mr-2 text-gray-400" />
              {city}
            </li>
          ))}
        </ul>
      )}
      {isOpen && searchTerm !== '' && filteredCities.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-gray-500">
          No cities found matching "{searchTerm}"
        </div>
      )}
    </div>
  );
};

export default CityAutocomplete;
