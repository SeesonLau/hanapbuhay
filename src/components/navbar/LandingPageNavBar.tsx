import React, { useState, useEffect, useRef } from 'react';
import { HiMenu, HiX } from 'react-icons/hi';

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 px-4 py-2 mx-4 mt-4 bg-gray-200/80 backdrop-blur-sm shadow-lg rounded-xl">
        <div className="container mx-auto">
          <div className="relative flex items-center justify-between md:justify-start">
            <div className="flex items-center">
              <img 
                src="/logo.svg" 
                alt="HanapBuhay Logo" 
                className="h-8 w-auto md:h-12"
              />
            </div>

            <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 space-x-6">
              <a href="#benefits" className="text-gray-700 hover:text-blue-500 transition-colors whitespace-nowrap text-sm lg:text-base">Benefits</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-500 transition-colors whitespace-nowrap text-sm lg:text-base">How It Works</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-500 transition-colors whitespace-nowrap text-sm lg:text-base">Testimonials</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-500 transition-colors whitespace-nowrap text-sm lg:text-base">Contact Us</a>
            </div>

            {/* Mobile Menu Button*/}
            <button 
              ref={buttonRef}
              className="md:hidden p-2 z-50 ml-auto"
              onClick={toggleMenu}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? (
                <HiX className="w-6 h-6" />
              ) : (
                <HiMenu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Popup */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="fixed top-20 right-4 z-50 md:hidden"
        >
          <div className="bg-white w-56 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="flex flex-col p-2">
              <a
                href="#benefits"
                className="text-gray-700 hover:text-blue-500 hover:bg-gray-100 transition-colors text-base text-left py-2 px-4 rounded-md"
                onClick={toggleMenu}
              >
                Benefits
              </a>
              <a
                href="#how-it-works"
                className="text-gray-700 hover:text-blue-500 hover:bg-gray-100 transition-colors text-base text-left py-2 px-4 rounded-md"
                onClick={toggleMenu}
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                className="text-gray-700 hover:text-blue-500 hover:bg-gray-100 transition-colors text-base text-left py-2 px-4 rounded-md"
                onClick={toggleMenu}
              >
                Testimonials
              </a>
              <a
                href="#contact"
                className="text-gray-700 hover:text-blue-500 hover:bg-gray-100 transition-colors text-base text-left py-2 px-4 rounded-md"
                onClick={toggleMenu}
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavigationBar;