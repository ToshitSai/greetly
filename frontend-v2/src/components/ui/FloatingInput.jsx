import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export function FloatingInput({ label, id, type = 'text', className, error, ...props }) {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const isControlled = props.value !== undefined;
  const currentlyHasValue = isControlled ? String(props.value).length > 0 : hasValue;

  const handleBlur = (e) => {
    setIsFocused(false);
    if (!isControlled) {
      setHasValue(e.target.value.length > 0);
    }
  };

  const handleChange = (e) => {
    if (!isControlled) {
      setHasValue(e.target.value.length > 0);
    }
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className={cn("relative flex flex-col gap-2 w-full", className)}>
      <motion.label
        htmlFor={id}
        initial={{ y: 0, scale: 1 }}
        animate={{ 
          y: (isFocused || currentlyHasValue) ? -28 : 14,
          scale: (isFocused || currentlyHasValue) ? 0.85 : 1,
          color: isFocused ? '#6E00FF' : '#0F0A1A'
        }}
        className="absolute left-3 px-2 font-display font-bold origin-left pointer-events-none z-10 transition-colors duration-200 bg-white rounded-full border-2 border-transparent"
        style={{
          border: (isFocused || currentlyHasValue) ? '2px solid #0F0A1A' : '2px solid transparent',
        }}
      >
        {label}
      </motion.label>

      <motion.input
        id={id}
        type={type}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        whileFocus={{ y: -4, boxShadow: '4px 4px 0px 0px #0F0A1A' }}
        className={cn(
          "input-comic z-0",
          error ? "border-red-500" : "border-brand-black"
        )}
        {...props}
        onChange={handleChange}
      />
      <AnimatePresence>
        {error && (
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs font-bold text-white bg-brand-black px-2 py-1 rounded w-fit"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
