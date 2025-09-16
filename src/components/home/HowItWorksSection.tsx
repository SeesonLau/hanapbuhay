// src/components/home/HowItWorksSection.tsx
import { FaSearch, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import { getNeutral100Color, getBlueDarkColor } from '@/styles/colors';
import { fontClasses } from '@/styles/fonts';

export default function HowItWorksSection() {
  return (
    <section 
      id="how-it-works" 
      className="min-h-screen flex items-center justify-center relative py-24"
    >
      <div className="container mx-auto px-4">
        {/* How It Works Heading - Centered above the content */}
        <div className="text-center mb-20">
          <h2 
            className={`text-6xl md:text-7xl font-bold ${fontClasses.heading}`}
            style={{ color: getBlueDarkColor('default') }}
          >
            How It Works
          </h2>
        </div>
        
        {/* Three Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 max-w-7xl mx-auto">
          {/* Column 1 - Search Icon */}
          <div 
            className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-10 border border-white border-opacity-20 flex flex-col items-center text-center"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="w-24 h-24 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mb-8">
              <FaSearch className="text-4xl" style={{ color: getBlueDarkColor('default') }} />
            </div>
            <h3 
              className={`text-3xl font-bold mb-6 text-white ${fontClasses.heading}`}
            >
              Profiles and Ratings
            </h3>
            <p 
              className={`text-xl ${fontClasses.body}`}
              style={{ color: getNeutral100Color() }}
            >
              Workers build trust with detailed profiles and a community-driven rating and review system.
            </p>
          </div>
          
          {/* Column 2 - User Icon */}
          <div 
            className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-10 border border-white border-opacity-20 flex flex-col items-center text-center"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="w-24 h-24 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mb-8">
              <FaUser className="text-4xl" style={{ color: getBlueDarkColor('default') }} />
            </div>
            <h3 
              className={`text-3xl font-bold mb-6 text-white ${fontClasses.heading}`}
            >
              Verified Users
            </h3>
            <p 
              className={`text-xl ${fontClasses.body}`}
              style={{ color: getNeutral100Color() }}
            >
              Both clients and workers are verified to ensure a safe and trustworthy community for everyone.
            </p>
          </div>
          
          {/* Column 3 - Location Icon */}
          <div 
            className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-10 border border-white border-opacity-20 flex flex-col items-center text-center"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="w-24 h-24 rounded-full bg-blue-500 bg-opacity-20 flex items-center justify-center mb-8">
              <FaMapMarkerAlt className="text-4xl" style={{ color: getBlueDarkColor('default') }} />
            </div>
            <h3 
              className={`text-3xl font-bold mb-6 text-white ${fontClasses.heading}`}
            >
              Hyperlocal Matching
            </h3>
            <p 
              className={`text-xl ${fontClasses.body}`}
              style={{ color: getNeutral100Color() }}
            >
              Our platform connects you with reliable, skilled workers and jobs in your immediate community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
