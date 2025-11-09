"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ReservationSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const cards = [
    {
      id: 1,
      title: "Build your deal, step-by-step",
      description: "Add part exchange, finance and choose delivery or collection. We'll guide you through it all! Then complete the sale with the seller.",
      stepNumber: 1,
      bgColor: "bg-slate-800",
      textColor: "text-white",
      descColor: "text-gray-300"
    },
    {
      id: 2,
      title: "Peace of mind with a free vehicle history check", 
      description: "Order with confidence with our free vehicle history check to avoid costly surprises if you decide to buy.",
      stepNumber: 2,
      bgColor: "bg-gradient-to-br from-blue-100 to-indigo-100",
      textColor: "text-gray-900",
      descColor: "text-gray-700",
      hasCarImage: true
    },
    {
      id: 3,
      title: "Save time and do more online",
      description: "Get ahead by sorting some of the details online. Or if you'd like more support, you can talk it through with the dealer later.",
      stepNumber: 3,
      bgColor: "bg-gradient-to-br from-slate-700 to-slate-900",
      textColor: "text-white",
      descColor: "text-gray-300",
      hasClockIcon: true
    }
  ];

  const nextSlide = () => {
    if (currentSlide < 2) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const getVisibleCards = () => {
    if (currentSlide === 0) {
      // State 1: Card 1 (full) + Card 2 (full) + Card 3 (half)
      return [
        { card: cards[0], size: 'full', show: true },
        { card: cards[1], size: 'full', show: true },
        { card: cards[2], size: 'half', show: true }
      ];
    } else if (currentSlide === 1) {
      // State 2: Card 1 (half) + Card 2 (full) + Card 3 (full)
      return [
        { card: cards[0], size: 'half', show: true },
        { card: cards[1], size: 'full', show: true },
        { card: cards[2], size: 'full', show: true }
      ];
    } else {
      // State 3: Card 2 (half) + Card 3 (full) + Card 1 (hidden)
      return [
        { card: cards[1], size: 'half', show: true },
        { card: cards[2], size: 'full', show: true }
      ];
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 gap-6 items-stretch">
          
          {/* Left Section - Reserve with Autotrader */}
          <div className="col-span-12 lg:col-span-4 bg-white p-8">
            <div className="text-gray-600 text-sm font-medium mb-3">
              Reserve with CatoDrive
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
              Reserve online with CatoDrive
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Once youve found your car, build your deal to reserve online.
            </p>
            
            {/* Search Button */}
            <Link href="/availablevehicle" className="w-full bg-white border-2 border-blue-600 text-blue-600 py-4 px-6 rounded-full text-base font-medium hover:bg-blue-50 transition-colors">
              Search Cars
            </Link>
          </div>

          {/* Carousel Section */}
          <div className="col-span-12 lg:col-span-8 relative overflow-hidden">
            
            {/* Navigation Arrows */}
            <button 
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center transition-all shadow-lg ${
                currentSlide === 0 
                  ? 'bg-opacity-40 cursor-not-allowed' 
                  : 'bg-opacity-90 hover:bg-opacity-100 cursor-pointer'
              }`}
            >
              <ChevronLeft className={`h-6 w-6 ${currentSlide === 0 ? 'text-gray-400' : 'text-gray-700'}`} />
            </button>
            
            <button 
              onClick={nextSlide}
              disabled={currentSlide === 2}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full flex items-center justify-center transition-all shadow-lg ${
                currentSlide === 2 
                  ? 'bg-opacity-40 cursor-not-allowed' 
                  : 'bg-opacity-90 hover:bg-opacity-100 cursor-pointer'
              }`}
            >
              <ChevronRight className={`h-6 w-6 ${currentSlide === 2 ? 'text-gray-400' : 'text-gray-700'}`} />
            </button>

            {/* Cards Container */}
            <div className="flex space-x-6 transition-all duration-500 ease-in-out">
              {getVisibleCards().map((item, index) => {
                const { card, size, show } = item;
                const isHalf = size === 'half';
                
                if (!show) return null;
                
                return (
                  <div
                    key={`${card.id}-${currentSlide}`}
                    className={`${card.bgColor} rounded-2xl p-8 transition-all duration-500 ${
                      isHalf ? 'w-48 opacity-75 scale-95' : 'w-80 scale-100'
                    } shadow-lg flex-shrink-0 relative`}
                    style={{ minHeight: '320px' }}
                  >

                    {/* Card Content */}
                    {card.hasCarImage && (
                      <div className="text-center mb-6">
                        <div className="bg-white rounded-xl px-4 py-2 inline-block mb-4 shadow-sm">
                          <span className="text-sm font-semibold text-gray-800">Reserve online</span>
                        </div>
                        <div className="mb-4">
                          <img 
                            src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 60'%3E%3C!-- Car body --%3E%3Cpath d='M20 35 L25 25 L75 25 L80 35 L85 35 L85 40 L80 40 L80 45 L75 45 L75 40 L25 40 L25 45 L20 45 L20 40 L15 40 L15 35 Z' fill='%23e5e7eb'/%3E%3C!-- Windows --%3E%3Cpath d='M28 25 L28 32 L45 32 L45 25 Z' fill='%23cbd5e1'/%3E%3Cpath d='M55 25 L55 32 L72 32 L72 25 Z' fill='%23cbd5e1'/%3E%3C!-- Wheels --%3E%3Ccircle cx='30' cy='40' r='6' fill='%23374151'/%3E%3Ccircle cx='70' cy='40' r='6' fill='%23374151'/%3E%3Ccircle cx='30' cy='40' r='3' fill='%23e5e7eb'/%3E%3Ccircle cx='70' cy='40' r='3' fill='%23e5e7eb'/%3E%3C/svg%3E" 
                            alt="Car illustration" 
                            className="w-32 h-16 mx-auto"
                          />
                        </div>
                      </div>
                    )}

                    {card.hasClockIcon && (
                      <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 border-4 border-dotted border-white rounded-full flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-white rounded-full relative">
                            <div className="absolute top-1 left-1/2 w-0.5 h-3 bg-white transform -translate-x-1/2"></div>
                            <div className="absolute top-2 left-1/2 w-2 h-0.5 bg-white transform -translate-x-1/2"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <h3 className={`text-2xl font-bold mb-4 ${card.textColor} ${isHalf ? 'text-lg' : ''}`}>
                      {card.title}
                    </h3>
                    
                    {!isHalf && (
                      <p className={`text-sm leading-relaxed ${card.descColor}`}>
                        {card.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
        
        {/* Navigation dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReservationSection;