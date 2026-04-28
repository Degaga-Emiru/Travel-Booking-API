import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiPlus, FiTruck, FiMapPin, FiSettings, FiZap, FiUsers, FiDollarSign, FiArrowLeft, FiImage, FiX } from 'react-icons/fi';
import api from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AddCar = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEdit);

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    type: 'Economy',
    transmission: 'Automatic',
    fuelType: 'Gasoline',
    passengers: 5,
    pricePerDay: '',
    location: '',
    description: '',
    Images: [{ url: '', category: 'Exterior' }]
  });

  const carTypes = ['Economy', 'Compact', 'Intermediate', 'Standard', 'Fullsize', 'Luxury', 'SUV', 'Minivan', 'Van', 'Truck'];
  const imageCategories = ['Exterior', 'Interior', 'Dashboard', 'Trunk', 'General'];

  useEffect(() => {
    if (isEdit) {
      fetchCar();
    }
  }, [id]);

  const fetchCar = async () => {
    try {
      const response = await api.get(`/cars/${id}`);
      const car = response.data.data;
      
      setFormData({
        brand: car.brand || '',
        model: car.model || '',
        type: car.type || 'Economy',
        transmission: car.transmission || 'Automatic',
        fuelType: car.fuelType || 'Gasoline',
        passengers: car.passengers || 5,
        pricePerDay: car.pricePerDay || '',
        location: car.location || '',
        description: car.description || '',
        Images: car.Images && car.Images.length > 0 
                ? car.Images.map(img => ({ url: img.url, category: img.category })) 
                : [{ url: '', category: 'Exterior' }]
      });
    } catch (error) {
      toast.error('Failed to load vehicle details');
      navigate('/vendor/cars');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const carData = {
        ...formData,
        Images: formData.Images.filter(img => img.url.trim() !== '')
      };

      if (isEdit) {
        await api.put(`/cars/${id}`, carData);
        toast.success('Vehicle updated successfully!');
      } else {
        await api.post('/cars', carData);
        toast.success('Vehicle added to fleet!');
      }
      navigate('/vendor/cars');
    } catch (error) {
      const message = error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'add'} vehicle`;
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}</h1>
          <p className="text-gray-500 font-medium">{isEdit ? 'Update vehicle details and pricing.' : 'List a new car in your rental fleet.'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Vehicle Info */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
            <div className="flex items-center space-x-3 mb-2">
               <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center"><FiTruck /></div>
               <h3 className="text-xl font-black text-slate-900">Vehicle Specification</h3>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Brand (e.g. Toyota)</label>
                <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Model (e.g. Corolla)</label>
                <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vehicle Type</label>
                <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  {carTypes.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Transmission</label>
                <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.transmission} onChange={e => setFormData({...formData, transmission: e.target.value})}>
                  <option>Automatic</option>
                  <option>Manual</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description / Features</label>
              <textarea className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm h-32" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="E.g. Full insurance, GPS included, child seat available..." />
            </div>
          </div>

          {/* Pickup Location */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
            <div className="flex items-center space-x-3 mb-2">
               <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center"><FiMapPin /></div>
               <h3 className="text-xl font-black text-slate-900">Pickup Location</h3>
            </div>
            <input type="text" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="City or specific address" required />
          </div>

          {/* Images */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                 <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center"><FiImage /></div>
                 <h3 className="text-xl font-black text-slate-900">Vehicle Images</h3>
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
                      placeholder="https://example.com/car.jpg"
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
          {/* Pricing */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-black text-slate-900 mb-2">Daily Pricing</h3>
            <div className="space-y-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Price Per Day ($)</label>
                 <input type="number" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-black text-xl" value={formData.pricePerDay} onChange={e => setFormData({...formData, pricePerDay: e.target.value})} required />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Passenger Capacity</label>
                 <div className="flex items-center space-x-4">
                    <FiUsers className="text-gray-400" />
                    <input type="number" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none font-bold" value={formData.passengers} onChange={e => setFormData({...formData, passengers: e.target.value})} />
                 </div>
               </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-slate-900/40 hover:scale-[1.02] active:scale-95 transition-all">
            {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Add Vehicle')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCar;
