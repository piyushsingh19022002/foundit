import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      return toast.error("Please fill in all fields.");
    }
    
    setLoading(true);
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const res = await axios.post(`http://localhost:5001${endpoint}`, formData);
      
      // Save token in localStorage
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
      navigate('/');
    } catch (err) {
      console.error("Auth error details:", err);
      const errorMsg = err.response?.data?.msg || (typeof err.response?.data === 'string' ? err.response.data : null) || err.message || "An error occurred";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 mb-20 bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-8 md:p-10 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50 text-center">
        <h2 className="text-3xl font-extrabold mb-2 text-slate-900 dark:text-white">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          {isLogin ? 'Enter your credentials to access your account.' : 'Sign up to start helping the community.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-5">
        {!isLogin && (
          <div>
            <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Name</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                name="name" type="text" value={formData.name} onChange={handleChange} 
                placeholder="John Doe" 
                className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Email</label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              name="email" type="email" value={formData.email} onChange={handleChange} 
              placeholder="you@example.com" 
              className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300">Password</label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              name="password" type="password" value={formData.password} onChange={handleChange} 
              placeholder="••••••••" 
              className="w-full bg-slate-50 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl px-4 py-4 font-bold text-lg shadow-xl shadow-blue-500/30 transition-all disabled:opacity-75 flex justify-center items-center gap-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        <div className="text-center mt-6">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              onClick={() => { setIsLogin(!isLogin); setFormData({name: '', email: '', password: ''}); }}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
