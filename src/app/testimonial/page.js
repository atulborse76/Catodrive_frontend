'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: 'James Wilson',
    role: 'Business Traveler',
    feedback: 'I rent cars weekly for work, and CatoDrive consistently impresses me. Their DFW airport pickup service saves me at least an hour every trip - no shuttle waits, just a clean car ready at arrivals. The Mercedes E-Class I got last week was so comfortable that I actually looked forward to my commute!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Sarah Chen',
    role: 'Weekend Traveler',
    feedback: 'First time renting from CatoDrive and it was flawless! The online booking took 3 minutes, and when we arrived, the staff upgraded us to an SUV at no extra cost. The car smelled brand new and had full tank of gas - little touches that made our Hill Country getaway perfect.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Michael Rodriguez',
    role: 'Frequent Renter',
    feedback: 'What keeps me coming back is their reliability. Whether I need a compact for downtown meetings or a truck for Home Depot runs, they always have what I need. Their app lets me extend rentals with one tap when my flights get delayed - no stressful phone calls!',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Emily Park',
    role: 'Family Vacationer',
    feedback: 'Traveling with three kids is chaotic, but CatoDrive made the car rental part easy. They installed our car seats in advance and helped load all our luggage. The Toyota Highlander had enough space for all our gear, and the free roadside assistance gave me peace of mind on our road trip to San Antonio.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'David Thompson',
    role: 'First-Time Customer',
    feedback: 'I was nervous about renting after bad experiences elsewhere, but CatoDrive changed my mind. The agent patiently explained all the features of the BMW I rented, and when I scratched the rim (oops!), their damage waiver covered it completely with no hassle. Now I recommend them to all my friends.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Lisa Johnson',
    role: 'Luxury Car Renter',
    feedback: 'For my anniversary weekend, I surprised my wife with a convertible Mustang from CatoDrive. The car was detailed to perfection with a full tank and even had a complimentary "Happy Anniversary" note inside! Cruising through Highland Park with the top down made our celebration unforgettable. Worth every penny.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Robert Kim',
    role: 'Road Trip Enthusiast',
    feedback: 'Just completed a 1,200-mile Texas road trip in a CatoDrive rental. The Hyundai Tucson handled everything from Dallas highways to Big Bend dirt roads flawlessly. Their unlimited mileage policy saved me hundreds compared to other companies, and the 24/7 support line gave me confidence driving through remote areas.',
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Amanda Williams',
    role: 'Last-Minute Booker',
    feedback: 'When my flight got rescheduled last-minute, CatoDrive saved my business trip. I booked a car through their app during my layover, and it was waiting when I landed at Love Field at midnight. The agent even stayed late to complete the paperwork - now that iss service! I will never use airport rental counters again.',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Daniel Brown',
    role: 'Moving Helper',
    feedback: 'Rented a Ford F-150 to move my daughter into her SMU dorm. The truck bed fit all her furniture perfectly, and CatoDrive waived the young driver fee since she is a student. The drop-off took 2 minutes - just parked it and texted them the mileage. So much better than U-Haul!',
    image: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Priya Patel',
    role: 'International Visitor',
    feedback: 'As someone visiting from India, I appreciated how CatoDrive made the rental process simple. They accepted my international license without issues, explained Texas driving laws clearly, and even programmed my hotel into the GPS. The Toyota Camrys fuel efficiency saved me so much on gas while exploring Dallas!',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face'
  }
];

const TestimonialsPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const autoPlayRef = useRef(null);
  const userInteractedRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  
    if (autoPlay) {
      autoPlayRef.current = setInterval(() => {
        if (!userInteractedRef.current) {
          moveCarousel('next', false);
        }
        userInteractedRef.current = false;
      }, 2000);
    }
  
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoPlay]);

  const moveCarousel = (direction, userInitiated = true) => {
    if (isAnimating) return;
    
    if (userInitiated) {
      userInteractedRef.current = true;
    }

    setIsAnimating(true);
    setActiveIndex(prev => {
      if (direction === 'next') {
        return prev === testimonials.length - 1 ? 0 : prev + 1;
      } else {
        return prev === 0 ? testimonials.length - 1 : prev - 1;
      }
    });
    
    setTimeout(() => setIsAnimating(false), 400);
  };

  const handleCardClick = (clickedIndex) => {
    if (isAnimating || clickedIndex === activeIndex) return;
    
    userInteractedRef.current = true;
    setIsAnimating(true);
    setActiveIndex(clickedIndex);
    setTimeout(() => setIsAnimating(false), 400);
  };

const getCardStyle = (index) => {
    const diff = (index - activeIndex + testimonials.length) % testimonials.length;
    const center = 0;
    
    let translateX = 0;
    let translateZ = 0;
    let opacity = 1;
    let scale = 1;
    let cursor = 'pointer';

    if (isMobile) {
      // Mobile styles
      if (diff === center) {
        translateX = 0;
        opacity = 1;
        scale = 1;
      } else {
        translateX = diff > 0 ? 100 : -100;
        opacity = 0;
        scale = 0.8;
      }
      translateZ = 0;
    } else {
      // Desktop styles
      if (diff === center) {
        translateZ = 0;
        scale = 1;
        cursor = 'default';
      } else if (diff === 1 || diff === testimonials.length - 1) {
        translateX = diff === 1 ? 150 : -150;
        translateZ = -100;
        scale = 0.8;
        opacity = 0.8;
      } else if (diff === 2 || diff === testimonials.length - 2) {
        translateX = diff === 2 ? 300 : -300;
        translateZ = -200;
        scale = 0.6;
        opacity = 0.6;
      } else {
        translateX = diff > center ? 450 : -450;
        translateZ = -300;
        scale = 0.4;
        opacity = 0;
      }
    }

        let zIndex;
    if (diff === center) {
      zIndex = 1000; // Highest for center card
    } else if (diff === 1 || diff === testimonials.length - 1) {
      zIndex = 999; // Slightly lower for immediate adjacent cards
    } else if (diff === 2 || diff === testimonials.length - 2) {
      zIndex = 998; // Even lower for next set
    } else {
      zIndex = 997; // Lowest for farthest cards
    }

    return {
      transform: `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale})`,
      opacity,
      zIndex,
      transition: 'all 0.4s ease-out',
      cursor
    };
  };

  return (
    <div className="pt-12 md:pt-16 lg:pt-20  bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
        <div className="text-center">
          <h2 className="text-4xl sm:text-xl mb-16 md:text-4xl font-semibold text-gray-800 mt-2">What Our Clients Say</h2>
          
        </div>

        <div 
          className="relative h-[280px] md:h-[400px] flex justify-center items-center"
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
          onTouchStart={() => setAutoPlay(false)}
          onTouchEnd={() => {
            setTimeout(() => setAutoPlay(true), 5000);
          }}
        >
          <div className="absolute inset-0 flex justify-center items-center transform-style-3d">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="absolute flex justify-center items-center w-[300px] md:w-[400px] h-[330px] md:h-[340px]"
                style={getCardStyle(index)}
                onClick={() => handleCardClick(index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleCardClick(index);
                  }
                }}
                aria-label={`View testimonial from ${testimonial.name}`}
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow h-full">
                  <div className="p-4 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 border-b border-gray-100">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="text-center md:text-left">
                      <h3 className="text-lg md:text-xl text-semibold text-gray-800">
                        {testimonial.name}
                      </h3>
                      <h3 className=" text-gray-600">
                        {testimonial.role}
                      </h3>
                    </div>
                  </div>

                  <div className="p-4 md:p-6">
                    <p className="text-sm md:text-base text-justify text-gray-500 pb-6 max-w-lg mx-auto">
                      {testimonial.feedback}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-12 md:mt-12">
          <button
            onClick={() => moveCarousel('prev')}
            className="p-2 rounded-full bg-pineGreen/10 hover:bg-pineGreen/20 transition-colors"
            disabled={isAnimating}
          >
            <ChevronLeft className="w-6 h-6 text-black" />
          </button>
          <button
            onClick={() => moveCarousel('next')}
            className="p-2 rounded-full bg-pineGreen/10 hover:bg-pineGreen/20 transition-colors"
            disabled={isAnimating}
          >
            <ChevronRight className="w-6 h-6 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;