import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-brand-black text-white border-t-[8px] border-white py-12 px-6 relative z-10 overflow-hidden">
      {/* Footer Doodles */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <path d="M-50 50 Q100 150 200 50" fill="none" stroke="#E8FF00" strokeWidth="8" strokeLinecap="round" />
        <circle cx="90%" cy="40%" r="20" fill="#FF5A5F" />
      </svg>
      
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="bg-brand-red border-[3px] border-white shadow-[4px_4px_0_0_#FFF] px-4 py-1 rounded-full transform rotate-2">
            <span className="font-display font-black text-white text-2xl tracking-wider">GREETLY</span>
          </div>
        </div>
        
        <div className="flex gap-6 font-display font-bold uppercase tracking-wider text-sm z-50">
          <motion.a whileHover={{ y: -4, color: '#E8FF00' }} whileTap={{ scale: 0.9 }} href="#" className="transition-colors block">Privacy</motion.a>
          <motion.a whileHover={{ y: -4, color: '#E8FF00' }} whileTap={{ scale: 0.9 }} href="#" className="transition-colors block">Terms</motion.a>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mt-12 pt-8 border-t-[3px] border-white/20 text-center font-body font-bold text-sm text-white/60">
        &copy; {new Date().getFullYear()} Greetly. All rights reserved. Crafted with 💖 and a lot of ☕.
      </div>
    </footer>
  );
}
