"use client";

import { useState, useEffect, useRef } from "react";
import { HiArrowDown } from "react-icons/hi";
import PastJobCard from "./cards/PastJobCard";

interface Job {
  postId: string;
  title: string;
  address: string;
  hiredDate: string;
}

export default function JobListSection() {
  const jobs: Job[] = [
    { postId: "1", title: "Frontend Developer", address: "Makati, Philippines", hiredDate: "2023-05-15" },
    { postId: "2", title: "Backend Engineer", address: "Cebu City, Philippines", hiredDate: "2022-11-01" },
    { postId: "3", title: "UI/UX Designer", address: "Quezon City, Philippines", hiredDate: "2021-08-20" },
    { postId: "4", title: "Software Intern", address: "Taguig, Philippines", hiredDate: "2020-06-10" },
    { postId: "5", title: "Fullstack Developer", address: "Davao City, Philippines", hiredDate: "2019-03-05" },
    { postId: "6", title: "DevOps Engineer", address: "Bacolod, Philippines", hiredDate: "2018-01-12" },
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    setIsScrollable(el.scrollHeight > el.clientHeight);

    const handleScroll = () => {
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
      setIsAtBottom(atBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [jobs]);

  return (
    <div className="p-6 relative ">
      <p className="font-inter font-semibold -mt-8 mb-2 body">
        Previous Jobs at{" "}
        <span className="font-inter font-extrabold text-primary-primary500 transition duration-200 ease-in-out hover:text-primary-600 hover:scale-105 inline-block cursor-pointer">
          HANAPBUHAY
        </span>
      </p>

      {/* Jobs container */}
      <div
        ref={scrollRef}
        className="rounded-lg max-h-[275px] overflow-y-auto scrollbar-hide py-2 px-2 snap-y snap-mandatory scroll-smooth"
        style={{
          scrollPaddingTop: '0.5rem',  
          scrollPaddingBottom: '0.5rem' 
        }}
      >
        <div className="flex flex-col gap-4">
          {jobs.map((job) => (
            <div key={job.postId} className="snap-start">
              <PastJobCard
                postId={job.postId}
                title={job.title}
                address={job.address}
                hiredDate={job.hiredDate}
              />
            </div>
          ))}
        </div>
      </div>

      {isScrollable && !isAtBottom && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 bg-gradient-to-t from-white/95 to-transparent p-0 text-sm text-gray-neutral500">
          <HiArrowDown className="w-4 h-4 animate-bounce" />
        </div>
      )}
    </div>
  );
}