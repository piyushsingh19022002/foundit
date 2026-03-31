import { MapPin } from 'lucide-react';

export default function ItemCard({ item }) {
  const isLost = item.type === 'Lost';
  const tagColor = isLost 
    ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' 
    : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';

  return (
    <div className="group bg-white dark:bg-[#121826] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-300">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img 
          src={item.imageUrl || 'https://placehold.co/600x400/1e293b/ffffff?text=No+Photo'} 
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 flex items-center">
          <span className={`px-3 py-1 shadow-sm rounded-full text-xs font-bold border backdrop-blur-md ${tagColor}`}>
            {item.type}
          </span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col gap-3">
        <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-500 transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center gap-1.5 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <MapPin className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate">
            {item.location}
          </span>
        </div>
      </div>
    </div>
  );
}
