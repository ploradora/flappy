'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { gsap } from 'gsap';

export const ResultsContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const contentRef = useRef<HTMLDivElement>(null);
  const [submissionData, setSubmissionData] = useState({
    url: '',
    title: ''
  });

  useEffect(() => {
    // Get URL parameters if available
    const url = searchParams.get('url') || '';
    const title = searchParams.get('title') || '';
    
    setSubmissionData({ url, title });
    
    // Animate content
    if (contentRef.current) {
      const tl = gsap.timeline();
      
      // Fade in and slide up the main container
      tl.fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
      
      // Stagger animate the children
      tl.fromTo(
        contentRef.current.children,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          stagger: 0.15, 
          duration: 0.6, 
          ease: 'back.out(1.7)' 
        },
        "-=0.4" // Start slightly before the previous animation finishes
      );
      
      // Special animation for the link
      const link = contentRef.current.querySelector('.overview-link');
      if (link) {
        tl.fromTo(
          link,
          { scale: 0.9, opacity: 0.7 },
          { 
            scale: 1, 
            opacity: 1, 
            duration: 0.4, 
            ease: 'elastic.out(1, 0.5)',
            repeat: 1,
            yoyo: true
          },
          "-=0.2"
        );
      }
    }
  }, [searchParams]);

  return (
    <div 
      ref={contentRef}
      className="container mx-auto px-4 py-12 max-w-2xl"
    >
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-100 mb-8 text-center">
        <div className="mb-6 text-green-500">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-20 w-20 mx-auto" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-4 text-gray-800">
          Thank You!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Your submission has been received successfully.
        </p>
        
        {submissionData.url ? (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-3 text-gray-700">Your Submission</h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Title:</p>
              <p className="font-medium text-gray-800">
                {submissionData.title || 'No title provided'}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-1">URL:</p>
              <a 
                href={submissionData.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 transition-colors break-all"
              >
                {submissionData.url}
              </a>
            </div>
          </div>
        ) : (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600">
              No submission data available. Please use the form on the submit page.
            </p>
          </div>
        )}
        
        <Link 
          href="/overview" 
          className="overview-link inline-block px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-all transform hover:scale-105"
        >
          Back to Overview
        </Link>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        <p>
          Thank you for using our bookmark manager. Your submission has been processed.
        </p>
      </div>
    </div>
  );
};