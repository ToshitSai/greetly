import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TactileButton } from '../ui/TactileButton';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function HeroSection() {
  const [typedText, setTypedText] = useState("");
  const [greetingIndex, setGreetingIndex] = useState(0);
  const { currentUser } = useAuth();
  
  const sampleGreetings = [
    "Happy Anniversary to my favorite person in the whole world! 🥂",
    "Happy Birthday to the most amazing friend anyone could ask for! 🎉",
    "Wishing you a birthday as bright and wonderful as you are! 🎂",
    "Cheers to another year of laughter, love, and unforgettable memories! 🥳",
    "Happy Anniversary here's to many more beautiful years together! 💍",
    "Thank you for always being there, rain or shine. You mean the world! ☀️",
    "Congratulations on this incredible milestone you truly earned it! 🏆",
    "Sending warm wishes on this special day, filled with joy and love! 💛",
    "Happy Festival! May your days be filled with light and happiness! ✨",
    "Wishing you continued success and happiness in this new chapter! 🚀",
    "Happy Birthday! May this year bring you closer to all your dreams! 🌟",
    "Grateful to have you as a colleague and friend happy work anniversary! 🎊"
  ];
  
  useEffect(() => {
    let index = 0;
    const currentText = sampleGreetings[greetingIndex];
    let isTyping = true;

    const interval = setInterval(() => {
      if (isTyping) {
        setTypedText(currentText.substring(0, index));
        index++;
        
        if (index > currentText.length) {
          isTyping = false;
          clearInterval(interval);
          
          // Pause for 3 seconds, then move to the next greeting
          setTimeout(() => {
            setTypedText("");
            setGreetingIndex((prevIndex) => (prevIndex + 1) % sampleGreetings.length);
          }, 3000);
        }
      }
    }, 50); // Snappy typing speed

    return () => clearInterval(interval);
  }, [greetingIndex]);

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-4xl mx-auto flex flex-col items-center"
      >
        <h1 className="text-5xl md:text-8xl font-black uppercase mb-6 leading-none tracking-tight text-white drop-shadow-[4px_4px_0_#0F0A1A]">
          Words that <span className="text-brand-yellow">POP!</span>
        </h1>
        
        <p className="text-xl md:text-2xl font-bold font-body max-w-2xl mx-auto mb-12 text-brand-black">
          Turn any occasion into a hyper-personalized, delightful message in seconds. No more writer's block, just genuine joy.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
          <Link to={currentUser ? "/dashboard" : "/signup"} className="w-full sm:w-64">
            <TactileButton variant="primary" className="w-full text-lg px-8 py-4">
              START CRAFTING
            </TactileButton>
          </Link>
          <a 
            href="#samples" 
            className="w-full sm:w-64"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('samples')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <TactileButton variant="secondary" className="w-full text-lg px-8 py-4">
              SAMPLES
            </TactileButton>
          </a>
        </div>
      </motion.div>

      {/* Floating Magic Typewriter Demo */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-20 w-full max-w-lg bg-white comic-panel p-6 text-left relative transform rotate-2"
      >
        <div className="absolute -top-4 right-2 md:-right-4 bg-brand-purple text-white border-[3px] border-brand-black rounded-full px-3 py-1 font-bold shadow-comic-sm transform rotate-12 text-sm">
          Generating...
        </div>
        <p className="font-body font-bold text-lg text-brand-black min-h-[60px]">
          {typedText}
          <motion.span 
            animate={{ opacity: [1, 0] }} 
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-5 bg-brand-red ml-1 align-middle"
          />
        </p>
      </motion.div>
    </section>
  );
}
