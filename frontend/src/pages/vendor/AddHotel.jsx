import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiPlus, FiImage, FiMapPin, FiStar, FiCoffee, FiWifi, FiWind, FiTv, FiInfo, FiArrowLeft, FiX } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AddHotel = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    starRating: 3,
    address: '',
    city: '',
    country: '',
    pricePerNight: '',
    totalRooms: '',
    availableRooms: '',
    amenities: [],
    Images: [{ url: '', category: 'Exterior' }]
  });

  const amenitiesList = [
    { name: 'WiFi', icon: <FiWifi /> },
    { name: 'Breakfast', icon: <FiCoffee /> },
    { name: 'Air Conditioning', icon: <FiWind /> },
    { name: 'Smart TV', icon: <FiTv /> },
    { name: 'Parking', icon: <FiInfo /> },
    { name: 'Swimming Pool', icon: <FiInfo /> }
  ];

  const imageCategories = ['Exterior', 'Room', 'Lobby', 'Pool', 'Restaurant', 'Bathroom', 'General'];

  useEffect(() => {
    if (isEdit) {
      fetchHotel();
    }
  }, [id]);

  const fetchHotel = async () => {
    try {
      const response = await api.get(`/hotels/${id}`);
      const hotel = response.data.data;
      setFormData({
        name: hotel.name || '',
        description: hotel.description || '',
        starRating: hotel.starRating || 3,
        address: hotel.address || '',
        city: hotel.city || '',
        country: hotel.country || '',
        pricePerNight: hotel.pricePerNight || '',
        totalRooms: hotel.totalRooms || '',
        availableRooms: hotel.availableRooms || '',
        amenities: hotel.amenities || [],
        Images: hotel.Images && hotel.Images.length > 0 
                ? hotel.Images.map(img => ({ url: img.url, category: img.category })) 
                : [{ url: '', category: 'Exterior' }]
      });
    } catch (error) {
      toast.error('Failed to load hotel details');
      navigate('/vendor/hotels');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const hotelData = {
        ...formData,
        availableRooms: formData.totalRooms,
        Images: formData.Images.filter(img => img.url.trim() !== '')
      };

      if (isEdit) {
        await api.put(`/hotels/${id}`, hotelData);
        toast.success('Hotel updated successfully!');
      } else {
        await api.post('/hotels', hotelData);
        toast.success('Hotel listing created successfully!');
      }
      navigate('/vendor/hotels');
    } catch (error) {
      const message = error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} hotel listing`;
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (index, field, value) => {
    const newImages = [...formData.Images];
    newImages[index][field] = value;
    setFormData({ ...formData, Images: newImages });
  };

  const addImageField = () => {
    setFormData({ ...formData, Images: [...formData.Images, { url: '', category: 'General' }] });
  };

  const removeImageField = (index) => {
    if (formData.Images.length > 1) {
      const newImages = formData.Images.filter((_, i) => i !== index);
      setFormData({ ...formData, Images: newImages });
    }
  };

  if (initialLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <div className="flex items-center space-x-4">
        <button onClick={() => navigate(-1)} className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-slate-900 transition-all"><FiArrowLeft size={20} /></button>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{isEdit ? 'Edit Hotel' : 'Add New Hotel'}</h1>
          <p className="text-gray-500 font-medium">{isEdit ? 'Update your property details.' : 'Register your property on our platform.'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* General Info */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
            <div className="flex items-center space-x-3 mb-2">
               <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center"><FiInfo /></div>
               <h3 className="text-xl font-black text-slate-900">General Information</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Hotel Name</label>
                <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description</label>
                <textarea className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm h-32" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
            <div className="flex items-center space-x-3 mb-2">
               <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><FiMapPin /></div>
               <h3 className="text-xl font-black text-slate-900">Location Details</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Address</label>
                <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                  <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Country</label>
                  <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} required />
                </div>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><FiImage /></div>
                 <h3 className="text-xl font-black text-slate-900">Hotel Images</h3>
              </div>
              <button type="button" onClick={addImageField} className="flex items-center space-x-2 text-primary-600 font-bold text-sm hover:underline">
                <FiPlus /> <span>Add More</span>
              </button>
            </div>
            <div className="space-y-6">
              {formData.Images.map((img, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-end gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="flex-1 w-full space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Image URL {index + 1}</label>
                    <input 
                      type="url" 
                      className="w-full p-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" 
                      placeholder="https://example.com/image.jpg"
                      value={img.url} 
                      onChange={e => handleImageChange(index, 'url', e.target.value)} 
                      required={index === 0}
                    />
                  </div>
                  <div className="w-full sm:w-1/3 space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      className="w-full p-3 bg-white border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm text-gray-700"
                      value={img.category}
                      onChange={e => handleImageChange(index, 'category', e.target.value)}
                    >
                      {imageCategories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  {formData.Images.length > 1 && (
                    <button type="button" onClick={() => removeImageField(index)} className="p-3 bg-white text-rose-500 hover:bg-rose-50 rounded-xl border border-gray-100 transition-all">
                      <FiX />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-10">
          {/* Pricing & Capacity */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-black text-slate-900 mb-2">Price & Rooms</h3>
            <div className="space-y-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price Per Night ($)</label>
                 <input type="number" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-black text-lg" value={formData.pricePerNight} onChange={e => setFormData({...formData, pricePerNight: e.target.value})} required />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Total Room Count</label>
                 <input type="number" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.totalRooms} onChange={e => setFormData({...formData, totalRooms: e.target.value})} required />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Star Rating</label>
                  <div className="flex justify-between">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} type="button" onClick={() => setFormData({...formData, starRating: star})} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${formData.starRating >= star ? 'bg-amber-100 text-amber-600' : 'bg-gray-50 text-gray-300'}`}>
                        <FiStar className={formData.starRating >= star ? 'fill-amber-600' : ''} />
                      </button>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-black text-slate-900 mb-2">Amenities</h3>
            <div className="grid grid-cols-1 gap-2">
              {amenitiesList.map(a => (
                <button
                  key={a.name}
                  type="button"
                  onClick={() => handleAmenityToggle(a.name)}
                  className={`flex items-center space-x-3 p-4 rounded-2xl transition-all font-bold text-xs ${formData.amenities.includes(a.name) ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' : 'bg-gray-50 text-gray-500'}`}
                >
                  {a.icon} <span>{a.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-slate-900/40 hover:scale-[1.02] active:scale-95 transition-all">
            {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Publish Listing')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddHotel;
