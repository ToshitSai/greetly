import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasDismissed, setHasDismissed] = useState(true);
  const [viewState, setViewState] = useState('PRIMARY'); // PRIMARY, CUSTOMIZE, PRIVACY_POLICY
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const [preferences, setPreferences] = useState({
    essential: true, // locked
    analytics: false,
    personalization: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('greetly-cookie-consent');
    if (!saved) {
      setIsVisible(true);
      setHasDismissed(false);
    }
  }, []);

  const handleAcceptAll = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setPreferences({ essential: true, analytics: true, personalization: true });
    finishConsent();
  };

  const handleSavePreferences = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    finishConsent();
  };

  const finishConsent = () => {
    localStorage.setItem('greetly-cookie-consent', 'true');
    setIsVisible(false);
    setTimeout(() => setHasDismissed(true), 500); // Wait for exit animation
  };

  // Hide on auth pages
  const hiddenRoutes = ['/login', '/signup'];
  if ((hasDismissed && !isVisible) || hiddenRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-x-0 bottom-0 md:inset-auto md:bottom-6 md:right-6 z-50 p-2 md:p-0 flex justify-center md:justify-end items-end md:items-center pointer-events-none">
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="pointer-events-auto relative w-full max-w-[320px] scale-[0.95] sm:scale-100 origin-bottom"
          >
            {/* Giant color-block background shapes - scaled down */}
            <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#6E00FF] rounded-full border-[4px] border-[#0F0A1A] shadow-[4px_4px_0_0_#0F0A1A] -z-10" />
            <div className="absolute -bottom-6 -right-6 w-32 h-16 bg-[#E8FF00] border-[4px] border-[#0F0A1A] shadow-[4px_4px_0_0_#0F0A1A] transform -rotate-12 -z-10" />
            
            {/* Four hand-drawn SVGs - scaled down */}
            <motion.svg className="absolute -top-4 right-8 w-6 h-6 text-[#E8FF00] drop-shadow-[2px_2px_0_#0F0A1A] z-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <polyline points="2 12 6 2 10 22 14 6 18 18 22 12" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
            <motion.svg className="absolute top-1/3 -left-6 w-8 h-8 text-[#00E5FF] drop-shadow-[2px_2px_0_#0F0A1A] z-20" viewBox="0 0 24 24" fill="currentColor" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 8, ease: "linear" }}>
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            </motion.svg>
            <div className="absolute bottom-12 -left-3 w-5 h-5 bg-[#FF5A5F] rounded-full border-[3px] border-[#0F0A1A] shadow-[2px_2px_0_0_#0F0A1A] z-20" />
            <div className="absolute top-12 -right-4 w-3 h-12 bg-[#6E00FF] border-[3px] border-[#0F0A1A] shadow-[2px_2px_0_0_#0F0A1A] transform rotate-[35deg] z-20" />
            
            {/* Main Card */}
            <motion.div 
              whileHover={{ y: -2, boxShadow: "8px 8px 0 0 #0F0A1A" }}
              className="relative bg-white rounded-[20px] border-[4px] border-[#0F0A1A] shadow-[6px_6px_0_0_#0F0A1A] overflow-hidden transition-all duration-300"
            >
              {/* Dot Grid Texture Overlay */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #0F0A1A 1px, transparent 0)', backgroundSize: '12px 12px' }}
              />
              
              <div className="relative z-10 p-4">
                {/* Header */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl drop-shadow-[2px_2px_0_#0F0A1A]">🍪</span>
                </div>

                <AnimatePresence mode="wait">
                  {viewState === 'PRIMARY' && (
                    <PrimaryView 
                      key="primary"
                      onAccept={handleAcceptAll} 
                      onCustomize={() => setViewState('CUSTOMIZE')}
                      onPrivacy={() => setViewState('PRIVACY_POLICY')}
                      currentUser={currentUser}
                    />
                  )}
                  {viewState === 'CUSTOMIZE' && (
                    <CustomizeView 
                      key="customize"
                      preferences={preferences}
                      setPreferences={setPreferences}
                      onSave={handleSavePreferences}
                      onBack={() => setViewState('PRIMARY')}
                    />
                  )}
                  {viewState === 'PRIVACY_POLICY' && (
                    <PrivacyView 
                      key="privacy"
                      onBack={() => setViewState('PRIMARY')}
                    />
                  )}
                </AnimatePresence>
                
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// --- Sub Views ---

function PrimaryView({ onAccept, onCustomize, onPrivacy, currentUser }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
    >
      <h2 className="font-display font-black uppercase text-2xl leading-[0.9] text-[#0F0A1A] mb-1 tracking-tight">
        We use <br />
        <span className="text-[#FF5A5F] drop-shadow-[2px_2px_0_#0F0A1A]">COOKIES!</span>
      </h2>
      
      <p className="font-body font-bold text-[11px] text-[#0F0A1A] mt-2 mb-4 leading-relaxed">
        We use a few digital crumbs to keep you logged in, save your drafts, and learn which styles pop best. Essential stuff for a magical experience!
      </p>

      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <motion.button
          whileHover={{ y: -2, boxShadow: "3px 3px 0 0 #0F0A1A" }}
          whileTap={{ y: 0, boxShadow: "0px 0px 0 0 #0F0A1A" }}
          onClick={onAccept}
          className="group bg-[#FF5A5F] border-[2px] border-[#0F0A1A] py-1.5 px-3 rounded-lg font-display font-black uppercase tracking-wider text-[#0F0A1A] shadow-[2px_2px_0_0_#0F0A1A] transition-all flex-1 flex items-center justify-center gap-1 text-[10px]"
        >
          {currentUser ? "Accept All" : "Log in to Accept"}
          <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" strokeWidth={3} />
        </motion.button>
        
        <motion.button
          whileHover={{ y: -1, boxShadow: "3px 3px 0 0 #0F0A1A" }}
          whileTap={{ y: 0, boxShadow: "0px 0px 0 0 #0F0A1A" }}
          onClick={onCustomize}
          className="bg-white border-[2px] border-[#0F0A1A] py-1.5 px-3 rounded-lg font-display font-black uppercase tracking-wider text-[#0F0A1A] shadow-[2px_2px_0_0_#0F0A1A] transition-all flex-1 text-[10px]"
        >
          Customize
        </motion.button>
      </div>

      <button 
        onClick={onPrivacy}
        className="text-[10px] font-body font-bold text-[#0F0A1A] underline decoration-2 underline-offset-2 hover:text-[#6E00FF] hover:decoration-[#6E00FF] transition-all flex w-full justify-center"
      >
        Read our Cookie Policy
      </button>
    </motion.div>
  );
}

function CustomizeView({ preferences, setPreferences, onSave, onBack }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <h2 className="font-display font-black uppercase text-2xl text-[#0F0A1A] mb-6">
        Your Preferences
      </h2>

      <div className="space-y-4 mb-8">
        <PreferenceRow 
          title="Essential"
          description="Required for login & security."
          checked={preferences.essential}
          locked={true}
          accent="#FFD166"
        />
        <PreferenceRow 
          title="Analytics"
          description="Helps us understand what's working."
          checked={preferences.analytics}
          onChange={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
          accent="#00E5FF"
        />
        <PreferenceRow 
          title="Personalization"
          description="Remembers your favorite tones."
          checked={preferences.personalization}
          onChange={() => setPreferences(prev => ({ ...prev, personalization: !prev.personalization }))}
          accent="#FF5A5F"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button
          whileHover={{ y: -2, boxShadow: "4px 4px 0 0 #0F0A1A" }}
          whileTap={{ y: 0, boxShadow: "0px 0px 0 0 #0F0A1A" }}
          onClick={onBack}
          className="bg-white border-[3px] border-[#0F0A1A] py-3 px-6 rounded-xl font-display font-black uppercase tracking-wider text-[#0F0A1A] shadow-[2px_2px_0_0_#0F0A1A] transition-all w-full sm:w-1/3"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ y: -4, boxShadow: "4px 4px 0 0 #0F0A1A" }}
          whileTap={{ y: 0, boxShadow: "0px 0px 0 0 #0F0A1A" }}
          onClick={onSave}
          className="bg-[#FF5A5F] border-[3px] border-[#0F0A1A] py-3 px-6 rounded-xl font-display font-black uppercase tracking-wider text-[#0F0A1A] shadow-[2px_2px_0_0_#0F0A1A] transition-all w-full sm:w-2/3"
        >
          Save
        </motion.button>
      </div>
    </motion.div>
  );
}

function PreferenceRow({ title, description, checked, onChange, locked, accent }) {
  return (
    <motion.div 
      whileHover={!locked ? { y: -2, boxShadow: "4px 4px 0 0 #0F0A1A" } : {}}
      className={`border-[3px] border-[#0F0A1A] rounded-xl p-3 flex items-center justify-between transition-all ${locked ? 'bg-gray-100 opacity-80' : 'bg-white shadow-[2px_2px_0_0_#0F0A1A]'}`}
    >
      <div className="pr-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-display font-black uppercase">{title}</span>
          {locked && (
            <span className="bg-[#E8FF00] text-[#0F0A1A] text-[10px] px-2 py-0.5 rounded-full font-black border-2 border-[#0F0A1A]">
              REQUIRED
            </span>
          )}
        </div>
        <p className="font-body font-bold text-xs leading-tight text-[#0F0A1A]/80">{description}</p>
      </div>
      
      <button 
        disabled={locked}
        onClick={onChange}
        className={`w-8 h-8 rounded border-[3px] border-[#0F0A1A] flex items-center justify-center shrink-0 transition-colors ${checked ? 'bg-current-accent' : 'bg-white'}`}
        style={{ backgroundColor: checked ? accent : 'white' }}
      >
        {checked && <Check size={18} strokeWidth={4} color="#0F0A1A" />}
      </button>
    </motion.div>
  );
}

function PrivacyView({ onBack }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <h2 className="font-display font-black uppercase text-2xl text-[#0F0A1A] mb-4">
        Cookie Details
      </h2>
      
      <div className="font-body font-bold text-sm text-[#0F0A1A] space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
        <p>
          We believe in transparency, not jargon! Here is exactly why we use cookies on Greetly:
        </p>
        <div className="bg-[#E8FF00]/30 p-3 rounded-lg border-2 border-[#0F0A1A] border-dashed">
          <strong className="block text-[#6E00FF] uppercase font-display mb-1">Authentication</strong>
          To keep you logged into your account securely so you don't have to type your password every 5 minutes.
        </div>
        <div className="bg-[#00E5FF]/20 p-3 rounded-lg border-2 border-[#0F0A1A] border-dashed">
          <strong className="block text-[#FF5A5F] uppercase font-display mb-1">Drafts & Favorites</strong>
          To save your work-in-progress messages and remember the AI tones you love using most.
        </div>
        <div className="bg-gray-100 p-3 rounded-lg border-2 border-[#0F0A1A] border-dashed">
          <strong className="block text-[#0F0A1A] uppercase font-display mb-1">Analytics (Optional)</strong>
          To help us understand if the website is fast, if buttons are easy to find, and how to improve Greetly. We never sell this data.
        </div>
        <div className="bg-[#FFD166]/30 p-3 rounded-lg border-2 border-[#0F0A1A] border-dashed">
          <strong className="block text-[#0F0A1A] uppercase font-display mb-1">Data Access</strong>
          Please note that the website owner has access to the data you provide to ensure the magic keeps flowing and the service runs smoothly!
        </div>
      </div>

      <motion.button
        whileHover={{ y: -4, boxShadow: "4px 4px 0 0 #0F0A1A" }}
        whileTap={{ y: 0, boxShadow: "0px 0px 0 0 #0F0A1A" }}
        onClick={onBack}
        className="w-full bg-[#6E00FF] text-white border-[3px] border-[#0F0A1A] py-3 px-6 rounded-xl font-display font-black uppercase tracking-wider shadow-[2px_2px_0_0_#0F0A1A] transition-all"
      >
        Got it, take me back
      </motion.button>
    </motion.div>
  );
}
