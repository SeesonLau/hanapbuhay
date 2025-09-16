// src/components/ui/HeaderHome.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { getWhiteColor } from '@/lib/colors';

export default function HeaderHome() {
  const whiteWithOpacity = getWhiteColor(0.15);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="w-[1820px] min-w-[1320px] px-4 py-3 rounded-xl backdrop-blur-sm inline-flex justify-start items-center gap-80"
      style={{ backgroundColor: whiteWithOpacity }}
    >
      {/* Logo - Clickable to home */}
      <Link href="/" className="w-48 h-16 relative cursor-pointer">
        <Image
          className="w-48 h-16"
          src="/image/hanapbuhay-logo.svg"
          alt="HanapBuhat Logo"
          width={187}
          height={68}
          priority
        />
      </Link>

      <div className="w-[800px] flex justify-center items-center gap-12">
        {/* Benefits */}
        <button
          onClick={() => scrollToSection('benefits')}
          className="flex justify-center items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-24 h-9 text-center justify-center text-neutral-200 text-lg font-medium font-['DM_Sans'] leading-relaxed">
            Benefits
          </div>
        </button>

        {/* How it Works */}
        <button
          onClick={() => scrollToSection('how-it-works')}
          className="flex justify-center items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-40 h-9 text-center justify-center text-neutral-200 text-lg font-medium font-['DM_Sans'] leading-relaxed">
            How it Works
          </div>
        </button>

        {/* Testimonials */}
        <button
          onClick={() => scrollToSection('testimonials')}
          className="flex justify-center items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-28 h-9 text-center justify-center text-neutral-200 text-lg font-medium font-['DM_Sans'] leading-relaxed">
            Testimonials
          </div>
        </button>

        {/* Contact Us */}
        <button
          onClick={() => scrollToSection('contact-us')}
          className="flex justify-center items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-32 h-9 text-center justify-center text-neutral-200 text-lg font-medium font-['DM_Sans'] leading-relaxed">
            Contact Us
          </div>
        </button>
      </div>
    </div>
  );
}
