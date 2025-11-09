"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { 
  Search, 
  Calendar, 
  CreditCard, 
  Key, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  Shield, 
  Users, 
  MapPin,
  Smartphone,
  Car,
  FileText,
  Star,
  Play,
  ChevronDown,
  ChevronUp
} from "lucide-react"

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [expandedFaq, setExpandedFaq] = useState(null)

  const steps = [
    {
      id: 1,
      icon: <Search className="w-12 h-12" />,
      title: "Browse & Select",
      description: "Choose from our wide range of vehicles that suit your needs and budget",
      details: [
        "Filter by car type, size, and features",
        "Compare prices and availability",
        "Read genuine customer reviews",
        "View detailed car specifications"
      ],
      color: "bg-blue-500"
    },
    {
      id: 2,
      icon: <Calendar className="w-12 h-12" />,
      title: "Pick Your Dates",
      description: "Select your pickup and drop-off dates and locations",
      details: [
        "Flexible pickup and return times",
        "Multiple location options",
        "Real-time availability checking",
        "Instant price calculation"
      ],
      color: "bg-green-500"
    },
    {
      id: 3,
      icon: <CreditCard className="w-12 h-12" />,
      title: "Secure Booking",
      description: "Complete your reservation with our secure payment system",
      details: [
        "Multiple payment options accepted",
        "SSL encrypted transactions",
        "Instant booking confirmation",
        "Easy cancellation policy"
      ],
      color: "bg-purple-500"
    },
    {
      id: 4,
      icon: <Key className="w-12 h-12" />,
      title: "Pick Up & Drive",
      description: "Collect your vehicle and hit the road with confidence",
      details: [
        "Quick 5-minute pickup process",
        "Vehicle inspection included",
        "24/7 roadside assistance",
        "GPS navigation available"
      ],
      color: "bg-orange-500"
    }
  ]

  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Quick & Easy",
      description: "Book in under 3 minutes with our streamlined process"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Fully Insured",
      description: "Comprehensive insurance coverage included with every rental"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "24/7 Support",
      description: "Round-the-clock customer service for any assistance needed"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Multiple Locations",
      description: "Convenient pickup and drop-off points across the city"
    }
  ]

  const faqs = [
    {
      question: "What do I need to rent a car?",
      answer: "You'll need a valid driver's license, credit card, and to be at least 21 years old. International visitors need a valid passport and international driving permit."
    },
    {
      question: "Can I cancel or modify my booking?",
      answer: "Yes, you can cancel or modify your booking up to 24 hours before pickup time without any charges. Changes within 24 hours may incur a small fee."
    },
    {
      question: "What's included in the rental price?",
      answer: "The rental price includes basic insurance, unlimited mileage, 24/7 roadside assistance, and one additional driver. Fuel, tolls, and premium insurance are not included."
    },
    {
      question: "What happens if I return the car late?",
      answer: "We offer a 30-minute grace period. After that, you'll be charged for an additional day if returned more than 2 hours late."
    },
    {
      question: "Do you offer one-way rentals?",
      answer: "Yes, we offer one-way rentals between select locations. Additional fees may apply depending on the pickup and drop-off locations."
    }
  ]

  const testimonials = [
    {
      name: "Sarah Johnson",
      rating: 5,
      text: "Incredibly smooth process from start to finish. The car was clean and exactly as described!",
      location: "New York"
    },
    {
      name: "Mike Chen",
      rating: 5,
      text: "Great value for money and excellent customer service. Will definitely use again.",
      location: "Los Angeles"
    },
    {
      name: "Emma Davis",
      rating: 5,
      text: "The booking process was so easy, and pickup was quick. Highly recommend!",
      location: "Chicago"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 pt-12 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            How It <span className=" text-[#ea580c] mt-2">Works</span>
            
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Renting a car has never been easier. Follow these simple steps to get on the road in minutes.
          </p>
         
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Simple Steps to Your Perfect Ride
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From browsing to driving, weve made every step as simple as possible
          </p>
        </div>

        {/* Desktop Steps */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-24 left-0 right-0 h-1 bg-gray-200">
              <div 
                className="h-full bg-[#ea580c] transition-all duration-1000"
                style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-4 gap-8 relative z-10">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`text-center cursor-pointer transition-all duration-300 ${
                    activeStep >= index ? 'opacity-100' : 'opacity-60'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-white mb-6 shadow-lg transition-all duration-300 ${
                    activeStep >= index 
                      ? `${step.color} scale-110` 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  
                  {activeStep === index && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg mt-6 animate-fade-in">
                      <ul className="space-y-2 text-left">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Steps */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start gap-6">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white flex-shrink-0 ${step.color}`}>
                {step.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Next Step Button */}
        <div className="text-center mt-12 lg:block hidden">
          <button 
            onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
            className="bg-[#ea580c] hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 mx-auto"
          >
            {activeStep === steps.length - 1 ? 'Start Over' : 'Next Step'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Why Choose Our Service?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Weve designed our service with your convenience and peace of mind in focus
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-[#ea580c] mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Demo Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Experience Our App
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Download our mobile app for an even smoother booking experience with exclusive features.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Mobile Check-in</h4>
                    <p className="text-gray-600">Skip the counter and unlock your car with your phone</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Car className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Real-time Tracking</h4>
                    <p className="text-gray-600">Track your rental status and get live updates</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Digital Documents</h4>
                    <p className="text-gray-600">All your rental documents in one secure place</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Link href="/comingsoon" className="flex items-center gap-2 text-sm hover:text-gray-300">
                   
                    <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Download for iOS
                </button>
                  </Link>
                                 <Link href="/comingsoon" className="flex items-center gap-2 text-sm hover:text-gray-300">
                   
                    <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                  Download for Android
                </button>
                  </Link>
              </div>

            </div>

            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl p-8 h-96 flex items-center justify-center">
              <div className="text-center">
                <Smartphone className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive App Demo</p>
                <p className="text-sm text-gray-500 mt-2">Click to explore features</p>
              </div>
            </div>
          </div>
        </div>
      </div>

     

     

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Hit the Road?
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands who have discovered the easiest way to rent a car. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/availablevehicle" className="bg-[#ea580c] hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105">
              Book Your Car Now
            </Link>
           
          </div>
        </div>
      </div>
    </div>
  )
}