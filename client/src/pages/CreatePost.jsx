import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UploadCloud, X } from 'lucide-react';

export default function CreatePost() {
  const [searchParams] = useSearchParams();
  const defaultType = searchParams.get('type') || 'Lost';
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: defaultType,
    location: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Field Validation
    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      return toast.error('Please fill in all the required fields.');
    }

    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      // API expects the file to be uploaded via field 'image'
      if (imageFile) {
        data.append('image', imageFile);
      }

      // Read JWT token from auth storage
      const token = localStorage.getItem('token');
      if (!token) {
        setIsSubmitting(false);
        return toast.error('You must be logged in to post an item.');
      }

      await axios.post('http://localhost:5001/api/items', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      toast.success('Your object statement has been registered!');
      navigate('/');
    } catch (err) {
      console.error("Upload error details:", err);
      const errorMsg = err.response?.data?.msg || err.response?.data?.message || err.message || "An error occurred during upload.";
      toast.error(`Upload Failed: ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden mt-6 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 md:p-10 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
        <h2 className="text-3xl font-extrabold mb-2 dark:text-white">Report an Item</h2>
        <p className="text-slate-500 dark:text-slate-400">Please provide as much specific information to help the community.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
        {/* Toggle Type */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            type="button" 
            onClick={() => setFormData({...formData, type: 'Lost'})}
            className={`p-4 rounded-2xl border-2 font-bold text-lg transition-all flex items-center justify-center ${formData.type === 'Lost' ? 'border-red-500 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-500'}`}
          >
            I Lost Something
          </button>
          <button 
            type="button" 
            onClick={() => setFormData({...formData, type: 'Found'})}
            className={`p-4 rounded-2xl border-2 font-bold text-lg transition-all flex items-center justify-center ${formData.type === 'Found' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-500'}`}
          >
            I Found Something
          </button>
        </div>

        <div className="space-y-5 pt-3">
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Title <span className="text-red-500">*</span></label>
            <input 
              name="title" value={formData.title} onChange={handleChange} 
              placeholder="e.g. Blue Nike Backpack" 
              className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow text-slate-900 dark:text-white placeholder-slate-400"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Category <span className="text-red-500">*</span></label>
              <select 
                name="category" value={formData.category} onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-slate-900 dark:text-white"
              >
                <option value="" disabled>Select category</option>
                <option value="Electronics">Electronics (Phones, Laptops)</option>
                <option value="Documents">Documents & Wallets</option>
                <option value="Keys">Keys</option>
                <option value="Accessories">Accessories (Bags, Watches)</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Location <span className="text-red-500">*</span></label>
              <input 
                name="location" value={formData.location} onChange={handleChange} 
                placeholder="Where did it happen?" 
                className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Description <span className="text-red-500">*</span></label>
            <textarea 
              name="description" value={formData.description} onChange={handleChange} 
              placeholder="Provide more context like colors, identifiable marks..." rows="4"
              className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow text-slate-900 dark:text-white placeholder-slate-400 resize-none"
            />
          </div>
          
          {/* Image Upload Area */}
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Photo</label>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            
            {!preview ? (
              <div 
                onClick={() => fileInputRef.current.click()}
                className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer bg-slate-50 dark:bg-[#0B0F19] transition-colors group"
              >
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1 leading-none">Click to upload photo</p>
                <p className="text-sm text-slate-500 mt-2">JPG, PNG up to 5MB</p>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video bg-black/10 dark:bg-black/40 flex items-center justify-center group">
                <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                <button 
                  type="button" 
                  onClick={removeImage}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-4 py-4 font-bold text-lg shadow-xl shadow-blue-500/30 transition-all disabled:opacity-75 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              <span>Uploading to S3...</span>
            </>
          ) : (
            <span>Publish Report</span>
          )}
        </button>
      </form>
    </div>
  );
}
