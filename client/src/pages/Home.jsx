import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';
import ItemCard from '../components/ItemCard';

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get('http://localhost:5001/api/items');
        setItems(res.data);
      } catch (err) {
        console.error('Error fetching items', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  return (
    <div className="flex flex-col gap-16 pb-20">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 flex flex-col items-center text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-slate-900 dark:text-white">
          Did you <span className="text-red-500">lose</span> something or <span className="text-emerald-500">find</span> something?
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-2xl leading-relaxed">
          Join our community to help reunite lost belongings with their owners. It takes just a minute to report.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center w-full max-w-lg">
          <Link to="/post?type=Lost" className="flex-1 group relative flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-red-500/20 transition-all hover:-translate-y-1">
            <AlertCircle className="w-5 h-5" />
            <span>I Lost Something</span>
          </Link>
          <Link to="/post?type=Found" className="flex-1 group relative flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-1">
            <CheckCircle className="w-5 h-5" />
            <span>I Found Something</span>
          </Link>
        </div>
      </section>

      {/* Items Grid */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Reports</h2>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search items..." 
              className="bg-white dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700/50 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-900 dark:text-white w-full max-w-xs"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-slate-200 dark:border-slate-800 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-slate-500 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl">
            No items reported yet. Be the first to post!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
