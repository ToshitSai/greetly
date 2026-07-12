import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FloatingInput } from '../components/ui/FloatingInput';
import { TactileButton } from '../components/ui/TactileButton';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/api';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.login(email, password);
      login(response.data.user, response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <Link to="/" className="absolute top-6 left-6 z-20">
        <TactileButton variant="secondary" className="px-4 py-2 flex items-center gap-2">
          <ArrowLeft size={20} /> Back
        </TactileButton>
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
        animate={{ opacity: 1, scale: 1, rotate: 2 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="comic-panel p-8 bg-brand-cyan relative">
          
          {/* Badge */}
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="absolute -top-6 -right-6 bg-brand-yellow text-brand-black border-[3px] border-brand-black px-4 py-2 rounded-full font-black uppercase text-sm shadow-comic-sm z-10 transform rotate-12"
          >
            Welcome Back!
          </motion.div>

          <div className="mb-8 text-center bg-white border-[3px] border-brand-black rounded-lg py-4 shadow-comic-sm transform -rotate-1">
            <h2 className="text-3xl font-black uppercase tracking-widest text-brand-black">Login</h2>
          </div>

          {error && <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 rounded-lg text-red-600 font-bold font-body">{error}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <FloatingInput 
              id="email" 
              type="email" 
              label="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            
            <div className="flex flex-col gap-2">
              <FloatingInput 
                id="password" 
                type="password" 
                label="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
              <div className="flex justify-end">
                <a href="#" className="text-sm font-bold font-body underline hover:text-brand-purple">
                  Forgot Password?
                </a>
              </div>
            </div>

            <TactileButton type="submit" variant="primary" className="w-full py-4 text-lg mt-4" disabled={loading}>
              {loading ? "CRAFTING..." : "LET'S CRAFT"}
            </TactileButton>
            
            <TactileButton type="button" variant="secondary" className="w-full py-4 text-lg">
              CONTINUE WITH GOOGLE
            </TactileButton>
          </form>

          <div className="mt-8 text-center font-body font-bold text-brand-black">
            Don't have an account?{' '}
            <Link to="/signup" className="text-white hover:underline underline-offset-4 decoration-2 decoration-brand-black">
              Sign up here
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
