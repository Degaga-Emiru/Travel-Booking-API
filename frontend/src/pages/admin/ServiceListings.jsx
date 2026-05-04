import React, { useState, useEffect } from 'react';
import { FiNavigation, FiHome, FiTruck, FiToggleLeft, FiToggleRight, FiSearch, FiPackage } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ServiceListings = () => {
  const [data, setData] = useState({ flights: [], hotels: [], cars: [] });
  const [counts, setCounts] = useState({ flights: 0, hotels: 0, cars: 0, total: 0 });
  const [activeTab, setActiveTab] = useState('flights');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/services');
      setData(response.data.data);
      setCounts(response.data.counts);
    } catch (error) {
      console.error('Failed to fetch services', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  const toggleService = async (type, id, currentStatus) => {
    try {
      await api.patch(`/admin/services/${type}/${id}`, { isActive: !currentStatus });
      toast.success(`Service ${!currentStatus ? 'enabled' : 'disabled'}`);
      fetchServices();
    } catch (error) {
      toast.error('Failed to update service');
    }
  };

  const tabs = [
    { key: 'flights', label: 'Flights', icon: <FiNavigation />, count: counts.flights },
    { key: 'hotels', label: 'Hotels', icon: <FiHome />, count: counts.hotels },
    { key: 'cars', label: 'Car Rentals', icon: <FiTruck />, count: counts.cars },
  ];

  const getFilteredData = () => {
    const items = data[activeTab] || [];
    if (!search) return items;
    const s = search.toLowerCase();
    return items.filter(item => {
      if (activeTab === 'flights') return item.airline?.toLowerCase().includes(s) || item.flightNumber?.toLowerCase().includes(s);
      if (activeTab === 'hotels') return item.name?.toLowerCase().includes(s) || item.city?.toLowerCase().includes(s);
      if (activeTab === 'cars') return item.brand?.toLowerCase().includes(s) || item.model?.toLowerCase().includes(s);
      return true;
    });
  };

  const [selectedItem, setSelectedItem] = useState(null);

  const filtered = getFilteredData();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Listings</h1>
          <p className="text-sm text-gray-500">Manage all flights, hotels, and car rentals across vendors. Total: <span className="font-bold text-blue-600">{counts.total}</span></p>
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search services..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 w-64" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all
              ${activeTab === tab.key ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {tab.icon}
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                {activeTab === 'flights' && (<>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Flight</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Route</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Economy Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </>)}
                {activeTab === 'hotels' && (<>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Hotel</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price/Night</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </>)}
                {activeTab === 'cars' && (<>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Vehicle</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price/Day</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="px-6 py-16 text-center text-gray-500">Loading services...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-16 text-center text-gray-400">
                  <FiPackage size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="font-medium">No {activeTab} found</p>
                </td></tr>
              ) : (
                <>
                  {activeTab === 'flights' && filtered.map(f => (
                    <tr key={f.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                      <td className="px-6 py-4" onClick={() => setSelectedItem(f)} className="cursor-pointer">
                        <p className="font-bold">{f.airline}</p>
                        <p className="text-xs text-gray-400">{f.flightNumber}</p>
                      </td>
                      <td className="px-6 py-4">{f.departureCity} → {f.arrivalCity}</td>
                      <td className="px-6 py-4 text-gray-500">{f.VendorProfile?.companyName || '—'}</td>
                      <td className="px-6 py-4 font-bold">${f.economyPrice}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${f.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                          {f.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end space-x-2">
                        <button onClick={() => setSelectedItem(f)} className="p-2 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
                          <FiSearch size={16} />
                        </button>
                        <button onClick={() => toggleService('flight', f.id, f.isActive)} className={`text-2xl ${f.isActive ? 'text-blue-600' : 'text-gray-300'}`}>
                          {f.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'hotels' && filtered.map(h => (
                    <tr key={h.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                      <td className="px-6 py-4" onClick={() => setSelectedItem(h)} className="cursor-pointer">
                        <p className="font-bold">{h.name}</p>
                        <p className="text-xs text-gray-400">{'⭐'.repeat(h.starRating || 0)}</p>
                      </td>
                      <td className="px-6 py-4">{h.city}, {h.country}</td>
                      <td className="px-6 py-4 text-gray-500">{h.VendorProfile?.companyName || '—'}</td>
                      <td className="px-6 py-4 font-bold">${h.pricePerNight}</td>
                      <td className="px-6 py-4 font-bold text-amber-500">{h.averageRating > 0 ? h.averageRating : '—'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${h.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                          {h.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end space-x-2">
                        <button onClick={() => setSelectedItem(h)} className="p-2 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
                          <FiSearch size={16} />
                        </button>
                        <button onClick={() => toggleService('hotel', h.id, h.isActive)} className={`text-2xl ${h.isActive ? 'text-blue-600' : 'text-gray-300'}`}>
                          {h.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {activeTab === 'cars' && filtered.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                      <td className="px-6 py-4" onClick={() => setSelectedItem(c)} className="cursor-pointer">
                        <p className="font-bold">{c.brand} {c.model}</p>
                        <p className="text-xs text-gray-400">{c.type} · {c.transmission}</p>
                      </td>
                      <td className="px-6 py-4">{c.location}</td>
                      <td className="px-6 py-4 text-gray-500">{c.VendorProfile?.companyName || '—'}</td>
                      <td className="px-6 py-4 font-bold">${c.pricePerDay}/day</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${c.isAvailable ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                          {c.isAvailable ? 'Available' : 'Disabled'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end space-x-2">
                        <button onClick={() => setSelectedItem(c)} className="p-2 bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-lg transition-colors">
                          <FiSearch size={16} />
                        </button>
                        <button onClick={() => toggleService('car', c.id, c.isAvailable)} className={`text-2xl ${c.isAvailable ? 'text-blue-600' : 'text-gray-300'}`}>
                          {c.isAvailable ? <FiToggleRight /> : <FiToggleLeft />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-100">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <div>
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Service Details</h2>
                <p className="text-sm text-blue-600 font-bold uppercase tracking-widest mt-1">{activeTab.slice(0, -1)}</p>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-3 bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-2xl transition-all shadow-sm">
                <FiPackage size={24} />
              </button>
            </div>
            
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                {/* Dynamic fields based on type */}
                {activeTab === 'flights' && (
                  <>
                    <div className="bg-gray-50 p-6 rounded-[2rem]">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">Airline & Flight</p>
                      <p className="text-lg font-bold text-gray-900">{selectedItem.airline}</p>
                      <p className="text-sm text-gray-500">{selectedItem.flightNumber}</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-[2rem]">
                      <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mb-2">Route</p>
                      <p className="text-lg font-bold text-blue-900">{selectedItem.departureCity} → {selectedItem.arrivalCity}</p>
                      <p className="text-sm text-blue-500">{selectedItem.departureAirport} to {selectedItem.arrivalAirport}</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-[2rem]">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">Pricing</p>
                      <p className="text-sm font-medium text-gray-700">Economy: <span className="font-bold text-gray-900">${selectedItem.economyPrice}</span></p>
                      <p className="text-sm font-medium text-gray-700">Business: <span className="font-bold text-gray-900">${selectedItem.businessPrice}</span></p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-[2rem]">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">Schedule</p>
                      <p className="text-sm font-medium text-gray-700">Departure: <span className="font-bold text-gray-900">{new Date(selectedItem.departureTime).toLocaleString()}</span></p>
                      <p className="text-sm font-medium text-gray-700">Arrival: <span className="font-bold text-gray-900">{new Date(selectedItem.arrivalTime).toLocaleString()}</span></p>
                    </div>
                  </>
                )}

                {activeTab === 'hotels' && (
                  <>
                    <div className="bg-gray-50 p-6 rounded-[2rem] col-span-2">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">Hotel Name</p>
                      <p className="text-xl font-bold text-gray-900">{selectedItem.name}</p>
                      <p className="text-sm text-gray-500">{'⭐'.repeat(selectedItem.starRating)} · {selectedItem.city}, {selectedItem.country}</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-[2rem]">
                      <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mb-2">Price Per Night</p>
                      <p className="text-2xl font-black text-blue-700">${selectedItem.pricePerNight}</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-[2rem]">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">Rating</p>
                      <p className="text-2xl font-black text-amber-500">{selectedItem.averageRating || 'No rating'}</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-[2rem] col-span-2">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {selectedItem.amenities?.map((a, i) => (
                          <span key={i} className="px-3 py-1 bg-white border border-gray-100 rounded-full text-xs font-bold text-gray-600">{a}</span>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'cars' && (
                  <>
                    <div className="bg-gray-50 p-6 rounded-[2rem] col-span-2">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">Vehicle</p>
                      <p className="text-xl font-bold text-gray-900">{selectedItem.brand} {selectedItem.model}</p>
                      <p className="text-sm text-gray-500">{selectedItem.type} · {selectedItem.transmission} · {selectedItem.seats} Seats</p>
                    </div>
                    <div className="bg-blue-50 p-6 rounded-[2rem]">
                      <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mb-2">Price Per Day</p>
                      <p className="text-2xl font-black text-blue-700">${selectedItem.pricePerDay}</p>
                    </div>
                    <div className="bg-gray-50 p-6 rounded-[2rem]">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">Location</p>
                      <p className="text-lg font-bold text-gray-900">{selectedItem.location}</p>
                    </div>
                  </>
                )}

                <div className="bg-gray-50 p-6 rounded-[2rem] col-span-2">
                  <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">Vendor Information</p>
                  <p className="text-lg font-bold text-gray-900">{selectedItem.VendorProfile?.companyName}</p>
                  <p className="text-sm text-gray-500">Business ID: {selectedItem.vendorId}</p>
                </div>
              </div>
            </div>
            
            <div className="p-8 bg-gray-50/50 border-t border-gray-100">
              <button onClick={() => setSelectedItem(null)} className="w-full py-4 bg-slate-900 text-white rounded-[1.5rem] font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95">
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceListings;
