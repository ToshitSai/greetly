import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignUpPage from '../pages/SignUpPage';
import Dashboard from '../pages/Dashboard';
import { useAuth } from '../contexts/AuthContext';

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, scale: 0.98, transition: { duration: 0.3, ease: "easeIn" } }
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    className="w-full h-full flex flex-col min-h-screen"
  >
    {children}
  </motion.div>
);

export default function AnimatedRoutes() {
  const location = useLocation();
  const { currentUser } = useAuth();

  const dashboardElement = currentUser
    ? <PageWrapper><Dashboard /></PageWrapper>
    : <PageWrapper><LoginPage /></PageWrapper>;

  return (
    <AnimatePresence mode="wait">
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><SignUpPage /></PageWrapper>} />
        <Route path="/dashboard" element={dashboardElement} />
      </Routes>
    </AnimatePresence>
  );
}
