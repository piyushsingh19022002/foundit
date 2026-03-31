import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PlusCircle, UserCircle, LogOut } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Basic Auth state reading (in a larger app this would be in Context/Redux)
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  
  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link 
        to={to} 
        className={`relative px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'}`}
      >
        {children}
        {isActive && (
          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
        )}
      </Link>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-[#0B0F19]/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/50 shadow-sm">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
            FI
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Found-IT
          </span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/post">
            <span className="flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4" />
              Post an Item
            </span>
          </NavLink>
        </div>

        <div className="flex items-center gap-4">
          {token && user ? (
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 py-1.5 px-2.5 rounded-full border border-slate-200 dark:border-slate-800">
              <span className="text-sm font-semibold text-slate-700 dark:text-white pl-2">Hi, {user.name}</span>
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-100 hover:bg-red-200 text-red-600 dark:bg-red-500/20 dark:hover:bg-red-500/30 dark:text-red-400 text-sm font-bold transition-all shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-sm font-bold transition-all shadow-md active:scale-95">
              <UserCircle className="w-4 h-4" />
              <span>Login / Signup</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
