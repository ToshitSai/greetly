import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { TactileButton } from '../ui/TactileButton';
import { Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b-4 border-brand-black px-6 py-4 flex items-center justify-between">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2 z-50">
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 0 }}
          whileTap={{ scale: 0.95 }}
          className="bg-brand-red border-[3px] border-brand-black shadow-comic-sm px-4 py-1 rounded-full transform -rotate-2"
        >
          <span className="font-display font-black text-white text-xl tracking-wider">GREETLY</span>
        </motion.div>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-8 font-body font-bold text-brand-black">
        <motion.button whileHover={{ y: -4 }} whileTap={{ scale: 0.9 }} onClick={(e) => scrollToSection(e, 'how-it-works')} className="hover:text-brand-purple transition-colors">How It Works</motion.button>
        <motion.button whileHover={{ y: -4 }} whileTap={{ scale: 0.9 }} onClick={(e) => scrollToSection(e, 'samples')} className="hover:text-brand-purple transition-colors">Samples</motion.button>
        
        {currentUser ? (
          <>
            <Link to="/dashboard">
              <TactileButton variant="primary" className="px-6 py-2 text-sm">Dashboard</TactileButton>
            </Link>
            <button onClick={handleLogout} className="font-bold hover:text-brand-red transition-colors">Log Out</button>
          </>
        ) : (
          <>
            <Link to="/login">
              <TactileButton variant="secondary" className="px-6 py-2">Log In</TactileButton>
            </Link>
            <Link to="/signup">
              <TactileButton variant="primary" className="px-6 py-2">Sign Up</TactileButton>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Toggle */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9, rotate: -10 }}
        className="md:hidden z-50 p-2 border-[3px] border-brand-black rounded bg-brand-yellow shadow-comic-sm"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-brand-cyan border-l-[8px] border-brand-black flex flex-col items-center justify-center gap-8 font-display text-3xl font-black"
          >
            <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => scrollToSection(e, 'how-it-works')} className="hover:text-white transition-colors">How It Works</motion.button>
            <motion.button whileTap={{ scale: 0.9 }} onClick={(e) => scrollToSection(e, 'samples')} className="hover:text-white transition-colors">Samples</motion.button>
            {currentUser ? (
              <div className="flex flex-col items-center gap-4 mt-8">
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                  <TactileButton variant="primary" className="text-xl px-10 py-4">Dashboard</TactileButton>
                </Link>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-lg hover:text-white transition-colors">Log Out</button>
              </div>
            ) : (
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="mt-8">
                <TactileButton variant="secondary" className="text-xl px-10 py-4">Log In</TactileButton>
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
