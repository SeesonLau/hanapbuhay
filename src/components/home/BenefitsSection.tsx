// src/components/home/BenefitsSection.tsx
import Image from 'next/image';
import { FaHandshake, FaBriefcase, FaCheck } from 'react-icons/fa';
import { getNeutral100Color, getNeutral600Color } from '@/styles/colors';
import { fontClasses } from '@/styles/fonts';

export default function BenefitsSection() {
  return (
    <section 
      id="benefits" 
      className="min-h-screen flex items-center justify-center relative py-20"
    >
      <div className="container mx-auto px-4">
        {/* Our Benefits Heading - Centered above the content */}
        <div className="text-center mb-16">
          <h2 
            className={`text-5xl md:text-6xl font-bold ${fontClasses.heading}`}
            style={{ color: getNeutral100Color() }}
          >
            Our Benefits
          </h2>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left side - 40% - Image - Made larger */}
          <div className="w-full lg:w-2/5 flex justify-center">
            <div className="relative w-full h-96 lg:h-[32rem] rounded-lg overflow-hidden">
              <Image
                src="/image/home-image2.png"
                alt="Benefits of HanapBuhay"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>
          
          {/* Right side - 60% - Content - Made larger */}
          <div className="w-full lg:w-3/5">
            <div 
              className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-10 lg:p-14 border border-white border-opacity-20"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
                {/* Column 1 - For Clients */}
                <div className="space-y-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-neutral-50 bg-opacity-20 flex items-center justify-center mb-5">
                      <FaHandshake className="text-3xl text-neutral-100" />
                    </div>
                    <h3 
                      className={`text-3xl font-bold mb-5 ${fontClasses.heading}`}
                      style={{ color: getNeutral100Color() }}
                    >
                      For Clients
                    </h3>
                  </div>
                  
                  <div className="space-y-5">
                    {[
                      // the word "trusted, reliable workers" should be bold
                      <>Find <span className="font-bold">trusted, reliable workers</span> in your local area, without the hassle of board platforms.</>,
                      // the word "transparent ratings and reviews" should be bold
                      <>Gain confidence in your choice with <span className="font-bold">transparent ratings and reviews</span> from the community.</>,
                      // the word "Post a job in minutes" should be bold
                      <><span className="font-bold">Post a job in minutes</span> and receive responses from nearby skilled individuals.</>
                    ].map((text, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <FaCheck className="text-green-400 mt-1.5 text-xl flex-shrink-0" />
                        <p 
                          className={`text-lg ${fontClasses.body}`}
                          style={{ color: getNeutral100Color() }}
                        >
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Column 2 - For Workers */}
                <div className="space-y-8">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-neutral-50 bg-opacity-20 flex items-center justify-center mb-5">
                      <FaBriefcase className="text-3xl text-neutral-100" />
                    </div>
                    <h3 
                      className={`text-3xl font-bold mb-5 ${fontClasses.heading}`}
                      style={{ color: getNeutral100Color() }}
                    >
                      For Workers
                    </h3>
                  </div>
                  
                  <div className="space-y-5">
                    {[
                      // the word "monetize your skills" should be bold
                      <>Easily <span className="font-bold">monetize your skills</span> and find jobs right in your locality.</>,
                      // the word "Build your professional reputation" should be bold
                      <><span className="font-bold">Build your professional reputation</span> through client feedback and a dedicated profile.</>,
                      // the word "reach more clients" should be bold
                      <>Discover new opportunities and <span className="font-bold">reach more clients</span> in your community.</>
                    ].map((text, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <FaCheck className="text-green-400 mt-1.5 text-xl flex-shrink-0" />
                        <p 
                          className={`text-lg ${fontClasses.body}`}
                          style={{ color: getNeutral100Color() }}
                        >
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
