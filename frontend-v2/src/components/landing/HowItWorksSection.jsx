import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    title: "Pick the Occasion",
    description: "Birthday? Anniversary? Random Tuesday? Select the perfect starting point.",
    color: "bg-brand-yellow",
    rotate: "-rotate-2"
  },
  {
    title: "Add the Details",
    description: "Tell us about the recipient, your relationship, and any inside jokes.",
    color: "bg-brand-cyan",
    rotate: "rotate-3"
  },
  {
    title: "Get Your Message",
    description: "Watch the magic happen as our AI crafts a personalized message in seconds.",
    color: "bg-brand-purple text-white",
    rotate: "-rotate-1"
  }
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-black uppercase text-white drop-shadow-[4px_4px_0_#0F0A1A]">
          How It Works
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.95 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3 }}
            className={`comic-panel p-8 ${step.color} ${step.rotate} flex flex-col justify-between cursor-pointer`}
          >
            <div>
              <div className="text-6xl font-black opacity-20 mb-4">{`0${i + 1}`}</div>
              <h3 className="text-2xl font-black uppercase mb-4 leading-tight">{step.title}</h3>
              <p className="font-body font-bold text-lg">{step.description}</p>
            </div>
            <div className="mt-8 border-t-4 border-brand-black/20 pt-4">
              <span className="inline-block px-3 py-1 bg-white text-brand-black border-2 border-brand-black rounded-full text-xs font-bold font-display uppercase tracking-wider">
                Step {i + 1}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
