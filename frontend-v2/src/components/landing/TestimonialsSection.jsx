import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    quote: "I forgot my mom's birthday until 8 AM. By 8:05 AM, I had a message that made her cry happy tears. Greetly is a lifesaver.",
    author: "Sarah J.",
    role: "Forgetful Daughter",
    color: "bg-[#FFD166]",
    rotate: "rotate-2"
  },
  {
    quote: "Finally, an AI tool that doesn't sound like a corporate robot wrote it. It actually sounds like *me*, just wittier.",
    author: "Marcus T.",
    role: "Not a writer",
    color: "bg-[#EF476F]",
    rotate: "-rotate-3"
  },
  {
    quote: "Used it for 50 holiday cards this year. Each one was unique, personal, and took me 30 seconds. Unbelievable.",
    author: "Elena R.",
    role: "Holiday Hero",
    color: "bg-[#06D6A0]",
    rotate: "rotate-1"
  }
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-black uppercase text-brand-black drop-shadow-[4px_4px_0_#FFF]">
          Wall of Love
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {testimonials.map((test, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
            whileInView={{ opacity: 1, scale: 1, rotate: test.rotate.includes('-') ? - (parseInt(test.rotate.slice(-1))) : parseInt(test.rotate.slice(-1)) }}
            whileHover={{ scale: 1.05, y: -10 }}
            whileTap={{ scale: 0.95 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
            className={`cursor-pointer comic-panel p-8 text-brand-black ${test.color} flex flex-col justify-between h-full origin-bottom`}
          >
            <div className="mb-6">
              <span className="text-6xl font-display font-black opacity-20 absolute top-4 left-4">"</span>
              <p className="font-body font-bold text-xl leading-relaxed relative z-10 mt-4">
                {test.quote}
              </p>
            </div>
            <div className="border-t-[3px] border-brand-black pt-4">
              <p className="font-display font-black text-lg uppercase tracking-wider">{test.author}</p>
              <p className="font-body font-bold text-sm opacity-80">{test.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
