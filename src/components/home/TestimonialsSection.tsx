// src/components/home/TestimonialsSection.tsx
import Image from 'next/image';
import { getBlueDarkColor, getNeutral600Color, getNeutral300Color, getWhiteColor } from '@/styles/colors';
import { fontClasses } from '@/styles/fonts';

export default function TestimonialsSection() {
  return (
    <section 
      id="testimonials" 
      className="min-h-screen flex items-center justify-center relative py-20"
    >
      <div className="container mx-auto px-4">
        {/* Testimonials Heading */}
        <div className="text-center mb-16">
          <h2 
            className={`text-5xl md:text-6xl font-bold ${fontClasses.heading}`}
            style={{ color: getBlueDarkColor('default') }}
          >
            Testimonials
          </h2>
        </div>
        
        {/* Three Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
          {/* Column 1 - Maria D. */}
          <div 
            className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20 flex flex-col items-center text-center"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4" style={{ borderColor: getWhiteColor(0.2) }}>
              <Image 
                src="/image/phoebe.jpeg" 
                alt="Maria D." 
                width={128} 
                height={128} 
                className="object-cover w-full h-full"
              />
            </div>
            <p 
              className={`text-lg mb-6 ${fontClasses.body}`}
              style={{ color: getNeutral300Color() }}
            >
              "I found a fantastic handyman for my plumbing issue in less than an hour. The rating system gave me peace of mind. Highly recommend!"
            </p>
            <p 
              className={`text-lg font-bold mb-2 ${fontClasses.body}`}
              style={{ color: getWhiteColor() }}
            >
              - Maria D.
            </p>
            <p 
              className={`text-md ${fontClasses.body}`}
              style={{ color: getNeutral600Color() }}
            >
              Client
            </p>
          </div>
          
          {/* Column 2 - Michelle R. */}
          <div 
            className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20 flex flex-col items-center text-center"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4" style={{ borderColor: getWhiteColor(0.2) }}>
              <Image 
                src="/image/phoebe.jpeg" 
                alt="Michelle R." 
                width={128} 
                height={128} 
                className="object-cover w-full h-full"
              />
            </div>
            <p 
              className={`text-lg mb-6 ${fontClasses.body}`}
              style={{ color: getNeutral300Color() }}
            >
              "HanapBuhay helped me get steady work as a tutor. The local job postings are exactly what I needed to grow my side business."
            </p>
            <p 
              className={`text-lg font-bold mb-2 ${fontClasses.body}`}
              style={{ color: getWhiteColor() }}
            >
              - Michelle R.
            </p>
            <p 
              className={`text-md ${fontClasses.body}`}
              style={{ color: getNeutral600Color() }}
            >
              Freelancer
            </p>
          </div>
          
          {/* Column 3 - Phoebe W. */}
          <div 
            className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20 flex flex-col items-center text-center"
            style={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4" style={{ borderColor: getWhiteColor(0.2) }}>
              <Image 
                src="/image/phoebe.jpeg" 
                alt="Phoebe W." 
                width={128} 
                height={128} 
                className="object-cover w-full h-full"
              />
            </div>
            <p 
              className={`text-lg mb-6 ${fontClasses.body}`}
              style={{ color: getNeutral300Color() }}
            >
              "I found a fantastic handyman for my plumbing issue in less than an hour. The rating system gave me peace of mind. Highly recommend!"
            </p>
            <p 
              className={`text-lg font-bold mb-2 ${fontClasses.body}`}
              style={{ color: getWhiteColor() }}
            >
              - Phoebe W.
            </p>
            <p 
              className={`text-md ${fontClasses.body}`}
              style={{ color: getNeutral600Color() }}
            >
              Client
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
