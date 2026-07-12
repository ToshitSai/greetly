import React from 'react';
import NavBar from '../components/landing/NavBar';
import HeroSection from '../components/landing/HeroSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import SamplesSection from '../components/landing/SamplesSection';
import Footer from '../components/landing/Footer';

export default function LandingPage() {
  return (
    <>
      <NavBar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <SamplesSection />
      </main>
      <Footer />
    </>
  );
}
