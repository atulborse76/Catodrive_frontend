"use client"

import Link from "next/link"
import { Phone, Mail, Apple, PlayCircle } from "lucide-react"
import Image from "next/image"
import { ArrowRight, Check, Menu, X, ChevronDown } from "lucide-react"
import { useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import background from "../../../public/image 61.png"
import img from "../../../public/Img+ button.png"
import GFR from "../../../public/GFR.png"
import Frame from "../../../public/Frame.png"

function Feature({ title, description }) {
  return (
    <div className="space-y-3">
      <h4 className="text-xl sm:text-2xl text-gray-900 font-semibold">{title}</h4>
      <p className="text-base sm:text-lg text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function CarBanner() {
  return (
    <div className="min-h-screen flex items-center lg:-mt-24 lg:-mb-24 justify-center px-4">
      <div className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-2xl overflow-hidden relative justify-center max-w-7xl flex flex-col md:flex-row items-center w-full">
        <div className="px-8 py-6 flex justify-center relative z-10 w-full md:w-1/2">
          <div className="max-w-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              Need a premium rental in Dallas?
            </h2>
            <p className="text-white/90 mb-2">+214-XXX-XXXX</p>
            <p className="text-white/80 text-sm mb-4">
              Whether you&apos;re arriving at DFW or need a business vehicle, we deliver quality cars with exceptional service right to your location.
            </p>
            {/* <button href="/availablevehicle" className="bg-orange-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-400 transition-colors">
              Reserve Your Car
            </button> */}
          </div>
        </div>
        <div className="w-full md:w-1/2 h-64 md:h-96">
          <Image
            src={Frame}
            alt="Luxury rental car in Dallas"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

function Review({ quote, author, company }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
      <div className="p-6 space-y-6 flex-grow">
        <div className="text-4xl sm:text-5xl text-[#2c6aa0]">&#34;</div>
        <blockquote className="text-base flex text-center sm:text-lg text-gray-900">
          {quote}
        </blockquote>
      </div>
      <div className="bg-[#2c6aa0] p-4">
        <div className="flex items-center justify-center gap-4">
          {/* <div className="w-12 h-12 bg-white/20 rounded-full"></div> */}
          <div className="text-white">
            <div className="font-medium">{author}</div>
            <div className="text-sm text-white/80">{company}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Accordion({ items, openAccordion, toggleAccordion }) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="border rounded-lg text-gray-900 overflow-hidden">
          <button
            className="flex justify-between items-center w-full p-4 h-20 text-xl text-left font-semibold"
            onClick={() => toggleAccordion(index)}
          >
            {item.question}
            <ChevronDown className={`w-5 h-5 transition-transform ${openAccordion === index ? 'transform rotate-180' : ''}`} />
          </button>
          {openAccordion === index && (
            <div className="p-4 text-gray-900 bg-gray-50">
              <p>{item.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Statistic({ number, label }) {
  return (
    <div className="space-y-2">
      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-blue-600">{number}</div>
      <div className="text-base sm:text-lg text-gray-600">{label}</div>
    </div>
  );
}

function MemoryItem({ text }) {
  return (
    <div className="flex items-start gap-2">
      <div className="mt-1">
        <Check className="h-5 w-5 text-blue-600" />
      </div>
      <p className="text-md text-gray-600">{text}</p>
    </div>
  );
}

export default function Home() {
  const [openAccordion, setOpenAccordion] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleAccordion = (index) => {
    if (openAccordion === index) {
      setOpenAccordion(null);
    } else {
      setOpenAccordion(index);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Background */}
      <div className="relative w-full h-screen bg-[#0f172a] overflow-hidden">
        <Image src={background || "/placeholder.svg"} alt="Dallas skyline background" fill className="object-cover" priority />

        {/* Hero Content */}
        <div className="relative z-5 w-full py-16 flex flex-col h-full mt-20 sm:mt-0 justify-center items-center px-4 sm:px-6 lg:px-20 pb-16 md:pb-24 pt-16 md:pt-0">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mt-8 md:mt-16 mb-4 text-center"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Dallas Premium Car Rental
          </h1>

          <p className="text-[#ea580c] text-4xl sm:text-4xl font-bold md:text-8xl max-w-4xl mb-8 md:mb-16 text-center">
            Business & Airport Excellence
          </p>
        </div>
      </div>

      {/* Why Choose CatoDrive Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Why Choose Our Dallas Car Rental?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Premium vehicles, exceptional service, and convenient DFW airport pickup - everything you need for business or leisure in Dallas.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {[
              {
                title: "DFW Airport Convenience",
                desc: "Meet-and-greet service at Dallas/Fort Worth International with no airport shuttle wait times.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                ),
              },
              {
                title: "Business Fleet Ready",
                desc: "Professional-grade vehicles with WiFi, navigation, and premium interiors for your corporate needs.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                ),
              },
              {
                title: "Flexible Rental Terms",
                desc: "Daily, weekly, or monthly rentals with 24/7 customer support and roadside assistance.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                ),
              },
              {
                title: "Dallas Local Expertise",
                desc: "We know the Metroplex - get insider tips on routes, parking, and business locations.",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                ),
              },
            ].map(({ title, desc, icon }, i) => (
              <div key={i} className="bg-white border border-white rounded-2xl p-6 shadow-md text-left">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icon}
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm">{desc}</p>
                <p className="text-gray-600 text-sm mt-2 font-medium mb-1">Dallas business traveler approved</p>
              </div>
            ))}
          </div>

          <div className="max-w-6xl mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-2 mb-8 sm:mb-12 lg:mb-32 lg:mt-32">
              {/* Left Column: Heading */}
              <div className="flex items-start">
                <h3 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-6xl">
                  DFW&apos;s premier<br />
                  business rental<br />
                  experience
                </h3>
              </div>

              {/* Right Column: Features */}
              <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
                <div>
                  <h4 className="font-bold text-xl text-gray-900 mb-2">Airport Delivery</h4>
                  <p className="text-md text-gray-700">
                    Skip the rental car counter - we&apos;ll meet you at baggage claim with your vehicle ready to go.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-xl text-gray-900 mb-2">Corporate Accounts</h4>
                  <p className="text-md text-gray-700">
                    Special rates and billing options for Dallas-area businesses with frequent rental needs.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-xl text-gray-900 mb-2">Latest Models</h4>
                  <p className="text-md text-gray-700">
                    Our fleet features current-year luxury sedans and SUVs with under 20,000 miles.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-xl text-gray-900 mb-2">Extended Hours</h4>
                  <p className="text-md text-gray-700">
                    Early morning or late night flights? We accommodate all DFW arrival and departure times.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="space-y-8 sm:space-y-12 mb-8 sm:mb-12 lg:mb-16">
            {/* <div className="relative w-full mx-auto rounded-lg overflow-hidden bg-gray-100" style={{ height: '550px', maxHeight: '800px' }}>
              <div className="absolute inset-0 bg-blue-100 rounded-lg overflow-hidden">
                <Image
                  src={img}
                  alt="Luxury car at DFW airport"
                  className="w-full h-full object-cover"
                />
              </div>
            </div> */}

            <div className="grid grid-cols-1 lg:mt-36 sm:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto text-center">
              <Statistic number="95%" label="On-time airport deliveries" />
              <Statistic number="200+" label="Corporate clients in DFW" />
              <Statistic number="24/7" label="Roadside assistance" />
            </div>
          </div>

          {/* Memories Section */}
          <div className="max-w-7xl mx-auto px-4 lg:mt-36 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16 my-16">
              
              {/* Left: Content */}
              <div className="w-full lg:w-1/2 space-y-6">
                <h2 className="text-3xl sm:text-5xl font-bold text-gray-900">
                  Business travel made seamless in Dallas
                </h2>
                <p className="text-gray-500 text-md">
                  We understand corporate travel demands - that&apos;s why we&apos;ve optimized every aspect of your rental experience.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <MemoryItem text="Express check-in/out for frequent business renters" />
                  <MemoryItem text="Complimentary airport meet-and-greet service" />
                  <MemoryItem text="Detailed vehicle sanitization between each rental" />
                  <MemoryItem text="Real-time flight tracking for delayed arrivals" />
                </div>
              </div>

              {/* Right: Image */}
              <div className="relative aspect-[4/3] w-full lg:w-1/2">
                <div className="absolute inset-0 rounded-xl overflow-hidden shadow-md">
                  <Image
                    src={GFR}
                    alt="Business professional with rental car at DFW"
                    className="w-full h-full object-cover"
                    layout="fill"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Download App Section */}
          <div className="bg-[#4B96F8] min-h-[400px] flex items-center justify-center mt-40 sm:mt-40 md:mt-60 lg:mt-100 px-4 py-16">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-16">
              {/* Phone Mockup */}
              <div className="w-64 md:w-80 -mt-32 sm:-mt-48 md:-mt-72 relative">
                <div className="bg-black rounded-[3rem] p-3 relative">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black rounded-b-3xl"></div>
                  <div className="bg-white w-full aspect-[10/19.5] rounded-[2.3rem]"></div>
                </div>
              </div>

              {/* Content */}
              <div className="text-white text-center md:text-left max-w-lg">
                <p className="text-sm font-medium tracking-wide uppercase mb-2">
                  Mobile convenience
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                  Manage rentals on the go
                </h2>
                <p className="text-white/90 mb-8 text-base sm:text-lg">
                  Our app lets Dallas business travelers: extend rentals, request roadside assistance, 
                  locate vehicles in parking lots, and access digital receipts - all from your phone.
                </p>
                
                {/* App Store Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
                  <a 
                    href="#" 
                    className="block w-48 sm:ml-0 md:ml-10"
                    aria-label="Download on the App Store"
                  >
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                      alt="Download on the App Store"
                      className="w-full"
                    />
                  </a>
                  <a 
                    href="#" 
                    className="block w-48"
                    aria-label="Get it on Google Play"
                  >
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                      alt="Get it on Google Play"
                      className="w-full"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="py-8 sm:py-12 mt-10 md:py-16 lg:py-20">
            <h2 className="text-2xl sm:text-3xl md:text-5xl text-gray-900 font-bold text-center mb-8 sm:mb-12 lg:mb-16 lg:mt-18">Dallas Business Travelers Love Us</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <Review 
                quote="As a consultant flying weekly into DFW, their airport service saves me hours. The car is always waiting when I land - couldn't be easier."
                author="Michael T."
                company="Deloitte Consulting"
              />
              <Review 
                quote="Our sales team uses them exclusively in Dallas. The corporate account setup was simple and the monthly billing is perfect for our expense reports."
                author="Sarah K."
                company="Texas Instruments"
              />
              <Review 
                quote="When my flight was delayed 3 hours, they adjusted the pickup without me even calling. That's the kind of service that keeps me coming back."
                author="David R."
                company="American Airlines"
              />
            </div>
          </div>

          {/* FAQ Section */}
          <div className="py-8 sm:py-12 md:py-16 lg:py-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-gray-900 font-bold text-center mb-8 sm:mb-12 lg:mb-16">Dallas Rental Questions</h2>
            <div className="max-w-8xl mx-auto">
              <Accordion
                items={[
                  {
                    question: "How does DFW airport pickup work?",
                    answer: "After you collect your luggage, our representative will meet you at your designated terminal with your rental car ready to go. We track your flight in real-time to accommodate delays. The entire process typically takes less than 15 minutes from baggage claim to being on the road."
                  },
                  {
                    question: "Do you offer one-way rentals within Texas?",
                    answer: "Yes, we offer one-way rentals between major Texas cities (Dallas, Houston, Austin, San Antonio) with advanced notice. Additional fees may apply depending on the drop-off location."
                  },
                  {
                    question: "What's included in your business rental package?",
                    answer: "Our business package includes unlimited mileage, premium roadside assistance, automatic toll payment, WiFi hotspot, and detailed monthly billing statements. Corporate accounts also receive priority vehicle selection and discounted rates."
                  },
                  {
                    question: "Can I rent a car for someone else in my company?",
                    answer: "Absolutely. Our corporate accounts allow authorized employees to book vehicles for other team members. Just provide the driver's information when making the reservation and ensure they meet our rental requirements."
                  },
                  {
                    question: "How do I handle parking tickets or tolls?",
                    answer: "All our vehicles include automatic toll payment via our TollPass system, billed to your rental. For parking tickets, we'll handle the initial payment then charge the registered credit card plus a $15 processing fee."
                  }
                ]}
                openAccordion={openAccordion}
                toggleAccordion={toggleAccordion}
              />
            </div>
          </div>
        </div>
        <CarBanner/>
      </section>
    </div>
  )
}