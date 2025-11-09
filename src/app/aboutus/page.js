"use client"

import { Phone, Mail, MapPin, Clock } from "lucide-react"
import Image from "next/image"
import background from "../../../public/car6.png"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
     <div className="relative w-full  h-screen bg-[#0f172a] overflow-hidden">
  <Image
    src={background || "/placeholder.svg"}
    alt="Hero background"
    fill
    className="object-cover "
    priority
  />

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
      About Our
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
      Premium Car Rental
    </p>
  </div>
</div>


      {/* About Content */}
      <div className="max-w-[88rem] mx-auto px-4 mt-20 mb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-6">Our Story</h2>
            <p className="text-lg text-gray-700 mb-6">
              Founded in 2010, we started as a small local car rental service with just 5 vehicles. 
              Today, we operate in over 50 locations nationwide with a fleet of more than 5,000 vehicles.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              Our mission is to provide exceptional rental experiences with premium vehicles, 
              transparent pricing, and outstanding customer service.
            </p>
            <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
              <p className="text-lg font-medium text-gray-800">
                We believe in making car rental simple, convenient, and enjoyable for every customer.
              </p>
            </div>
          </div>
          
          <div className="bg-gray-100 rounded-2xl p-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-blue-600 mb-3">5,000+</h3>
                <p className="text-gray-600">Vehicles in Fleet</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-blue-600 mb-3">50+</h3>
                <p className="text-gray-600">Locations</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-blue-600 mb-3">250+</h3>
                <p className="text-gray-600">Team Members</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-bold text-blue-600 mb-3">1M+</h3>
                <p className="text-gray-600">Happy Customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="max-w-[88rem] mx-auto px-4 mt-16 mb-24">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-black mb-16">Get In Touch</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-24">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Phone className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-black">Phone</p>
              <p className="text-base text-gray-700">+1(979)-997-95556</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Mail className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-black">Email</p>
              <p className="text-base text-gray-700">info@catodrive.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <MapPin className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-black">Headquarters</p>
              <p className="text-base text-gray-700">12534 Central drv, apt 126 
Bedford, Dallas, Tx 76021</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <Clock className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-semibold text-black">Working Hours</p>
              <p className="text-base text-gray-700">Mon-Sun: 7am-7pm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}