"use client";

import { useState, useEffect, useRef } from "react";
import { HiArrowDown } from "react-icons/hi";
import PastJobCard from "./cards/PastJobCard";
import { ApplicationService } from "@/lib/services/applications-services";
import { PostService } from "@/lib/services/posts-services";
import { ApplicationStatus } from "@/lib/constants/application-status";
import { Post } from "@/lib/models/posts";

interface Job {
  postId: string;
  title: string;
  location: string;
  hiredDate: string;
}

interface JobListSectionProps {
  userId: string;
  userType: 'applicant' | 'employer';
}

export default function JobListSection({ userId, userType }: JobListSectionProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        if (userType === 'applicant') {
          // Fetch accepted applications for applicants
          const { applications } = await ApplicationService.getApplicationsByUserId(userId, {
            status: [ApplicationStatus.APPROVED],
            pageSize: 100,
            sortBy: 'updatedAt',
            sortOrder: 'desc'
          });

          // Map through applications and fetch post details for each
          const jobsList: Job[] = await Promise.all(
            applications.map(async (app: any) => {
              // Access the joined posts data from the application response
              const postTitle = app.posts?.title || 'Unknown Job';
              const postLocation = app.posts?.location || 'Unknown Location';
              
              return {
                postId: app.postId,
                title: postTitle,
                location: postLocation,
                hiredDate: new Date(app.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              };
            })
          );

          setJobs(jobsList);
        } else {
          // Fetch posted jobs for employers
          const { posts } = await PostService.getPostsByUserId(userId, {
            page: 1,
            pageSize: 100,
            sortBy: 'createdAt',
            sortOrder: 'desc'
          });

          const jobsList: Job[] = posts.map((post: Post) => ({
            postId: post.postId,
            title: post.title,
            location: post.location || 'Unknown Location',
            hiredDate: new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          }));

          setJobs(jobsList);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [userId, userType]);

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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="p-6">
        <p className="font-inter font-semibold -mt-3 body mb-4">
          {userType === 'applicant' ? 'Previous Applied Jobs at' : 'Previous Posted Jobs at'}{" "}
          <span className="font-inter font-extrabold text-primary-primary500 transition duration-200 ease-in-out hover:text-primary-600 hover:scale-105 inline-block cursor-pointer">
            HANAPBUHAY
          </span>
        </p>
        <p className="text-center text-gray-neutral400 py-8">
          {userType === 'applicant' ? 'No applied jobs yet' : 'No posted jobs yet'}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 relative">
      <p className="font-inter font-semibold -mt-4 body">
        {userType === 'applicant' ? 'Previous Applied Jobs at' : 'Previous Posted Jobs at'}{" "}
        <span className="font-inter font-extrabold text-primary-primary500 transition duration-200 ease-in-out hover:text-primary-600 hover:scale-105 inline-block cursor-pointer">
          HANAPBUHAY
        </span>
      </p>

      {/* Jobs container */}
      <div
        ref={scrollRef}
        className="rounded-lg max-h-[330px] overflow-y-auto scrollbar-hide py-2 px-2 snap-y snap-mandatory scroll-smooth"
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
                address={job.location}
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