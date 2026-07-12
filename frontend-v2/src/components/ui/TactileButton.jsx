import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export function TactileButton({ children, className, variant = 'primary', ...props }) {
  const baseClasses = "btn-comic flex items-center justify-center font-bold relative";
  
  const variants = {
    primary: "bg-brand-yellow text-brand-black border-brand-black",
    secondary: "bg-white text-brand-black border-brand-black",
    dark: "bg-brand-black text-white border-brand-black shadow-comic-sm hover:shadow-comic"
  };

  return (
    <motion.button 
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ y: 2, boxShadow: '0px 0px 0px 0px #0F0A1A', transition: { duration: 0.1 } }}
      className={cn(baseClasses, variants[variant], className)}
      {...props}
    >
      {children}
    </motion.button>
  );
}
