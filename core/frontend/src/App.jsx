import React, { useState, useEffect } from 'react';
import DotGrid from './components/DotGrid';
import RocketNav from './components/RocketNav';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import BayoraSection from './components/BayoraSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

function App() {
    const [activeSection, setActiveSection] = useState('Home');

    // Handle scroll to section
    const scrollToSection = (sectionName) => {
        const element = document.getElementById(sectionName);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    // Update active section based on scroll position
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['Home', 'About', 'Bayora', 'Contact'];
            const scrollPosition = window.scrollY + window.innerHeight / 2;

            for (const sectionName of sections) {
                const element = document.getElementById(sectionName);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveSection(sectionName);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle section change from rocket nav
    const handleSectionChange = (sectionName) => {
        setActiveSection(sectionName);
        scrollToSection(sectionName);
    };

    return (
        <div className="relative">
            {/* Layer 1: Gradient Background (in body CSS - z-index: auto/0) */}

            {/* Layer 2: DotGrid Background */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[1]">
                <DotGrid
                    dotSize={5}
                    gap={15}
                    baseColor="#271E37"
                    activeColor="#5227FF"
                    proximity={120}
                    shockRadius={250}
                    shockStrength={5}
                    resistance={750}
                    returnDuration={1.5}
                />
            </div>

            {/* Layer 3: Global Brightness Reduction Overlay */}
            <div className="fixed inset-0 bg-black/40 pointer-events-none z-[2]"></div>

            {/* Layer 4+: Content (Navigation, Sections, Footer) */}
            {/* Rocket Navigation */}
            <RocketNav
                activeSection={activeSection}
                onSectionChange={handleSectionChange}
            />

            {/* Sections */}
            <HeroSection />
            <AboutSection />
            <BayoraSection />
            <ContactSection />

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default App;
