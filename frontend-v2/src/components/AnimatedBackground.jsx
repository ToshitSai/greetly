import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Giant Electric Purple Circle Parallax */}
      <motion.div 
        animate={{ 
          y: [0, -30, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-brand-purple border-[8px] border-brand-black shadow-[16px_16px_0px_0px_#0F0A1A]"
      />

      {/* Tilted Lime Yellow Rectangle Parallax */}
      <motion.div 
        animate={{ 
          y: [0, 40, 0],
          rotate: [-15, -5, -15]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute -bottom-40 -left-20 w-[500px] h-[700px] bg-brand-yellow border-[8px] border-brand-black shadow-[16px_16px_0px_0px_#0F0A1A]"
      />

      {/* SVG Doodles layer */}
      <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg">
        {/* Star Sparkle 1 */}
        <motion.path 
          d="M100 100 Q150 150 200 100 Q150 50 100 100 Z" 
          fill="#00D4FF" 
          stroke="#0F0A1A" strokeWidth="4"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
        {/* Squiggle */}
        <motion.path 
          d="M300 800 Q320 750 350 800 T400 800" 
          fill="none" 
          stroke="#FF5A5F" strokeWidth="6" strokeLinecap="round"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        {/* Star Sparkle 2 */}
        <motion.path 
          d="M800 200 Q830 230 860 200 Q830 170 800 200 Z" 
          fill="#E8FF00" 
          stroke="#0F0A1A" strokeWidth="4"
          animate={{ scale: [1, 1.3, 1], rotate: [0, -15, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Circles */}
        <circle cx="90%" cy="80%" r="15" fill="#6E00FF" stroke="#0F0A1A" strokeWidth="4" />
        <circle cx="85%" cy="85%" r="8" fill="white" stroke="#0F0A1A" strokeWidth="3" />
      </svg>
    </div>
  );
}
