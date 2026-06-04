
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import TrackOrder from "@/components/TrackOrder";
import ServicesCards from "@/components/ServicesCards";
import AboutSection from "@/components/AboutSection";
import VisionMissionSection from "@/components/VisionMissionSection";
import WhatMakesUsUniqueSection from "@/components/WhatMakesUsUniqueSection";
import GlobalPresence from "@/components/GlobalPresence";
import ServicesSection from "@/components/ServicesSection";
import WorkflowSection from "@/components/WorkflowSection";
import StatsSection from "@/components/StatsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import UpdatesSection from "@/components/UpdatesSection";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import { useLocation, Link } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [pathname]);
  return null;
};

const Index = () => {
  useEffect(() => {
    // Initialize scroll animations
    const handleScroll = () => {
      const scrollAnimElements = document.querySelectorAll('.scroll-animate');
      scrollAnimElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight * 0.9) {
          element.classList.add('appear');
        }
      });
    };

    // Initial check on load
    setTimeout(handleScroll, 100);

    // Add event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="bg-white">
      <Navigation />
      <ScrollToTop />
      <HeroSection />
      <TrackOrder />
      <ServicesCards />
      <AboutSection />
      <VisionMissionSection />
      <ServicesSection />
      <GlobalPresence />
      <ContactForm />
      <Footer />
    </div>
  );
};

export default Index;
