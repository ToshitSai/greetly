import React from 'react';
import { motion } from 'framer-motion';

const samples = [
  {
    tag: "BIRTHDAY",
    text: "Happy Birthday! I hope your day is as amazing as your ability to remember obscure pop culture trivia. 🎂",
    rotation: "-rotate-3",
    color: "bg-white"
  },
  {
    tag: "ANNIVERSARY",
    text: "Cheers to another year of stealing my covers and making me laugh until I cry. I love you! ❤️",
    rotation: "rotate-2",
    color: "bg-brand-yellow"
  },
  {
    tag: "THANK YOU",
    text: "Thanks a million for your help with the move. I promise the pizza and beer were just a down payment on my gratitude! 🍕",
    rotation: "-rotate-1",
    color: "bg-brand-cyan"
  }
];

export default function SamplesSection() {
  return (
    <section id="samples" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-black uppercase text-brand-black drop-shadow-[4px_4px_0_#FFF]">
          Samples
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {samples.map((sample, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
            whileInView={{ opacity: 1, scale: 1, rotate: sample.rotation.includes('-') ? - (parseInt(sample.rotation.slice(-1))) : parseInt(sample.rotation.slice(-1)) }}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
            className={`cursor-pointer comic-panel p-8 text-brand-black ${sample.color} flex flex-col justify-between h-full origin-bottom`}
          >
            <div className="mb-6">
              <span className="text-6xl font-display font-black opacity-20 absolute top-4 left-4">"</span>
              <p className="font-body font-bold text-xl leading-relaxed relative z-10 mt-4">
                {sample.text}
              </p>
            </div>
            <div className="border-t-[3px] border-brand-black pt-4">
              <p className="font-display font-black text-lg uppercase tracking-wider">{sample.tag}</p>
              <p className="font-body font-bold text-sm opacity-80">AI Generated</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
