'use client';

import React from 'react';
import { Smartphone, Car, Zap, Clock, MapPin, ShieldCheck } from 'lucide-react';

const ComingSoonPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center bg-blue-100 rounded-full p-4 mb-6">
            <Smartphone className="h-10 w-10 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            The <span className="text-blue-600">CatoDrive</span> App is Coming Soon!
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your ultimate car rental experience is about to get even better with our mobile app.
          </p>
        </div>

        {/* App Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why You&apos;ll Love Our App
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Car className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Instant Bookings</h3>
              </div>
              <p className="text-gray-600">
                Reserve your perfect vehicle in under 60 seconds with our streamlined booking process.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Express Pickup</h3>
              </div>
              <p className="text-gray-600">
                Skip the counter - your car will be waiting at your selected location when you arrive.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Flexible Rentals</h3>
              </div>
              <p className="text-gray-600">
                Extend your rental with one tap when your plans change - no phone calls needed.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                  <MapPin className="h-6 w-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Digital Key</h3>
              </div>
              <p className="text-gray-600">
                Unlock your rental car directly from your phone with our secure digital key technology.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 p-3 rounded-full mr-4">
                  <ShieldCheck className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">24/7 Support</h3>
              </div>
              <p className="text-gray-600">
                Get help anytime with our in-app chat support and roadside assistance features.
              </p>
            </div>

            {/* Feature 6 - Notify Me */}
            {/* <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow border-2 border-blue-200">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Smartphone className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Get Notified</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Be the first to know when we launch! Enter your email below.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-r-lg transition-colors">
                  Notify Me
                </button>
              </div>
            </div> */}
          </div>
        </div>

        {/* App Download Section */}
        <div className="text-center bg-white rounded-xl shadow-lg p-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Transform Your Rental Experience?</h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Download the CatoDrive app when we launch and enjoy seamless car rentals wherever you go.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* App Store Button (Placeholder) */}
            <div className="relative group">
              <button className="bg-black text-white px-8 py-4 rounded-lg flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.94-.19 1.83-.76 2.76-.78 1.17-.03 2.15.43 2.89 1.24-2.56 1.5-2 5.92.44 7.25-.54 1.5-.42 3.04.33 4.19 1.03 1.57 2.7 1.68 3.4 1.58-.09-.63-.32-1.94-.96-2.78zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-xl font-semibold">App Store</div>
                </div>
              </button>
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Coming Soon
              </div>
            </div>
            
            {/* Play Store Button (Placeholder) */}
            <div className="relative group">
              <button className="bg-black text-white px-8 py-4 rounded-lg flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.063 3.627A1.947 1.947 0 0 0 2 5.542v12.916c0 .696.348 1.291.887 1.658l10.662-7.99-10.486-8.5zm18.709 9.295L13.001 12l8.771-6.924a1.944 1.944 0 0 1 .012 3.196l-.012.65zM12.601 13.415l-2.672 2.024 5.764 5.273a1.94 1.94 0 0 0 2.09.098l-5.182-7.395zm-2.96-8.453l2.676 2.029L3.056 20.11c-.28.2-.618.31-.973.31a1.94 1.94 0 0 1-1.938-1.938V5.542c0-.758.43-1.43 1.088-1.766l8.18 6.6z"/>
                </svg>
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-xl font-semibold">Google Play</div>
                </div>
              </button>
              <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Coming Soon
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Teaser */}
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Loved by Travelers Across Texas</h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            The CatoDrive app made my weekly business rentals so easy - no more waiting in lines at the airport!
          </p>
          <p className="font-medium text-gray-900">- James W., Dallas</p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;