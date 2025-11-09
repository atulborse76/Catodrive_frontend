"use client"

import { Check, MapPin, Clock } from "lucide-react"
import Image from "next/image"
import background from "../../../public/2.png"

export default function ServicesPage() {
  const services = [
    {
      title: "Short-Term Rentals",
      description: "Daily or weekly rentals perfect for vacations or business trips.",
      features: ["Flexible durations", "Wide vehicle selection", "24/7 support"]
    },
    {
      title: "Long-Term Leasing",
      description: "Monthly rentals with discounted rates for extended needs.",
      features: ["Significant savings", "Maintenance included", "Easy upgrades"]
    },
    {
      title: "Luxury Vehicle Rentals",
      description: "Premium cars for special occasions or business needs.",
      features: ["High-end models", "Chauffeur options", "VIP treatment"]
    },
    {
      title: "Airport Rentals",
      description: "Convenient pickup and drop-off at major airports.",
      features: ["24/7 availability", "Express check-in", "Shuttle service"]
    },
    {
      title: "Corporate Fleet Solutions",
      description: "Custom rental programs for business clients.",
      features: ["Volume discounts", "Dedicated account manager", "Detailed reporting"]
    },
    {
      title: "One-Way Rentals",
      description: "Pick up in one location and drop off in another.",
      features: ["Nationwide network", "Flexible drop-off", "Competitive rates"]
    }
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <div className="relative w-full  h-screen bg-[#0f172a] overflow-hidden">
        <Image src={background || "/placeholder.svg"} alt="Hero background" fill className="object-cover" priority />

       <div className="relative z-5 w-full flex flex-col h-full mt-20 lg:mt-0 justify-center items-center px-4 sm:px-6 lg:px-20 pb-16 md:pb-24 pt-16 md:pt-0">
  <h1
    className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mt-8 md:mt-16 mb-4 text-center"
    style={{
      textShadow: `
        0 0 6px rgba(234,88,12,0.6),
        0 0 12px rgba(234,88,12,0.4),
        1px 1px 0 black,
        -1px -1px 0 black,
        1px -1px 0 black,
        -1px 1px 0 black
      `,
    }}
  >
    Our Premium
  </h1>

  <p
    className="text-[#ea580c] text-4xl sm:text-4xl font-bold md:text-6xl lg:text-8xl max-w-4xl mb-8 md:mb-16 text-center"
    style={{
      textShadow: `
        0 0 8px rgba(234,88,12,0.8),
        0 0 16px rgba(234,88,12,0.6),
        0 0 32px rgba(234,88,12,0.5),
        1px 1px 0 black,
        -1px -1px 0 black,
        1px -1px 0 black,
        -1px 1px 0 black
      `,
      WebkitTextStroke: '0.5px black',
    }}
  >
    Rental Services
  </p>
</div>

      </div>

      {/* Services Content */}
      <div className="max-w-[88rem] mx-auto px-4 mt-20 mb-24">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-black mb-16">What We Offer</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-black mb-6">Why Choose Our Services?</h3>
            <p className="text-lg text-gray-700 mb-6">
              We pride ourselves on offering the most comprehensive rental solutions with 
              transparent pricing, exceptional customer service, and a meticulously maintained fleet.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <Check className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-black">No Hidden Fees</h4>
                  <p className="text-gray-600">Clear pricing with all costs included upfront</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <Check className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-black">24/7 Roadside Assistance</h4>
                  <p className="text-gray-600">Help whenever you need it, day or night</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-2xl  h-full">
            <div className=" relative h-full w-full">
              <Image 
                src="/services.jpg"
                alt="Service coverage map"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}