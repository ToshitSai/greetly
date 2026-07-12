import React from 'react';
import { motion } from 'framer-motion';
import { TactileButton } from '../ui/TactileButton';

const plans = [
  {
    name: "Casual",
    price: "Free",
    features: ["5 messages per month", "Standard tone options", "Copy to clipboard"],
    cta: "Get Started",
    pop: false,
    color: "bg-white",
    rotate: "-rotate-2"
  },
  {
    name: "Pro Crafter",
    price: "$5/mo",
    features: ["Unlimited messages", "Premium tones (Funny, Snarky, Formal)", "Save Favorites", "Custom contexts"],
    cta: "Upgrade to Pro",
    pop: true,
    color: "bg-brand-cyan",
    rotate: "rotate-0"
  },
  {
    name: "Enterprise",
    price: "$49/mo",
    features: ["API Access", "Custom Brand Voice", "Team Seats", "Bulk Generation"],
    cta: "Contact Sales",
    pop: false,
    color: "bg-white",
    rotate: "rotate-2"
  }
];

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-6 max-w-6xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-black uppercase text-white drop-shadow-[4px_4px_0_#0F0A1A]">
          Pricing
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: plan.pop ? 1.15 : 1.05, y: -10 }}
            whileTap={{ scale: plan.pop ? 1.05 : 0.95 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className={`cursor-pointer comic-panel relative p-8 text-brand-black ${plan.color} ${plan.rotate} flex flex-col h-full ${plan.pop ? 'md:scale-110 md:-translate-y-4 border-[6px] shadow-comic-hover z-20' : 'z-10'}`}
          >
            {plan.pop && (
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-5 -right-2 md:-right-5 bg-brand-yellow border-[3px] border-brand-black px-4 py-1 rounded-full font-black uppercase text-sm transform rotate-12 shadow-comic-sm"
              >
                Recommended
              </motion.div>
            )}
            
            <div className="mb-8 border-b-4 border-brand-black pb-6 text-center">
              <h3 className="text-2xl font-black uppercase tracking-wider mb-2">{plan.name}</h3>
              <p className="text-5xl font-black">{plan.price}</p>
            </div>
            
            <ul className="mb-8 flex-grow space-y-4">
              {plan.features.map((feat, j) => (
                <li key={j} className="font-body font-bold text-lg flex items-start gap-2">
                  <span className="text-brand-purple shrink-0">★</span> {feat}
                </li>
              ))}
            </ul>
            
            <TactileButton variant={plan.pop ? "primary" : "secondary"} className="w-full">
              {plan.cta}
            </TactileButton>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
