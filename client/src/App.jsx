import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import LoginSignup from './pages/LoginSignup';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] transition-colors duration-300 font-sans text-slate-900 dark:text-slate-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post" element={<CreatePost />} />
            <Route path="/login" element={<LoginSignup />} />
          </Routes>
        </main>
        <Toaster position="bottom-right" toastOptions={{
          className: 'dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700'
        }} />
      </div>
    </Router>
  );
}

export default App;
