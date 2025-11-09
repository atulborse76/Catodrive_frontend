"use client"

import Link from "next/link"
import { Phone, Mail, Apple, PlayCircle } from "lucide-react"
import Image from "next/image"
import { ArrowRight, Check, Menu, X, ChevronDown, MapPin, Clock, Headphones, HelpCircle, MessageSquare } from "lucide-react"
import { useState } from "react"
import background from "../../../public/4.jpg"

export default function ContactSupport() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <div className="relative w-full  min-h-screen bg-[#0f172a] overflow-hidden">
        <Image src={background || "/placeholder.svg"} alt="Hero background" fill className="object-cover" priority />

        {/* Hero Content */}
       <div className="relative z-5 w-full h-screen flex flex-col mt-20 lg:mt-0 justify-center items-center px-4 sm:px-6 lg:px-20 pb-16 md:pb-24 pt-16 md:pt-0">
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
    We Are Here To Help 
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
    24*7  Support
  </p>
</div>

      </div>

      {/* Support Options Section */}
      <div className="max-w-[88rem] mx-auto px-4 mt-20">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 text-black">
          How Can We Help You?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Live Chat */}
          <div className="bg-blue-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl text-gray-900 font-bold mb-3">Support Team</h3>
            <p className="text-gray-600 mb-4">Get instant help from our support team with our 24/7 live chat service.</p>
            {/* <button className="text-blue-600 font-semibold flex items-center">
              Start Chat <ArrowRight className="ml-2 w-4 h-4" />
            </button> */}
          </div>

          {/* FAQ Center */}
          <div className="bg-orange-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-orange-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <HelpCircle className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">FAQ Center</h3>
            <p className="text-gray-600 mb-4">Find quick answers to common questions in our comprehensive knowledge base.</p>
            {/* <Link href="/faq" className="text-orange-600 font-semibold flex items-center">
              Browse FAQs <ArrowRight className="ml-2 w-4 h-4" />
            </Link> */}
          </div>

          {/* Phone Support */}
          <div className="bg-green-50 p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6">
              <Headphones className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Phone Support</h3>
            <p className="text-gray-600 mb-4">Speak directly with our customer service representatives for personalized assistance.</p>
            {/* <button className="text-green-600 font-semibold flex items-center">
              Call Now <ArrowRight className="ml-2 w-4 h-4" />
            </button> */}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="max-w-[88rem] mx-auto px-4 mt-10 mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-12 text-black">
          Contact Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Phone */}
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Phone className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Phone</h3>
            <p className="text-base text-gray-700 mb-2">24/7 Support Line</p>
            <p className="text-lg font-medium text-blue-600">+1(979)-997-95556</p>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Mail className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Email</h3>
            <p className="text-base text-gray-700 mb-2">General Inquiries</p>
            <p className="text-lg font-medium text-blue-600">support@catodrive.com</p>
          </div>

          {/* Location */}
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <MapPin className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Headquarters</h3>
            <p className="text-base text-gray-700">12534 Central drv,  </p>
            <p className="text-base text-gray-700">apt 126 
Bedford,</p>
            <p className="text-base text-gray-700">Dallas, Tx 76021</p>
          </div>

          {/* Working Hours */}
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl">
            <div className="bg-blue-100 p-4 rounded-full mb-4">
              <Clock className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-black mb-2">Working Hours</h3>
            <p className="text-base text-gray-700 mb-1">Monday-Friday: 7am - 7pm</p>
            <p className="text-base text-gray-700 mb-1">Saturday: 7am - 7pm</p>
            <p className="text-base text-gray-700">Sunday: 7am - 7pm</p>
          </div>
        </div>
      </div>

      {/* Emergency Support Banner */}
      <div className="bg-red-50 py-12 px-4 my-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-6 md:mb-0">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <Phone className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-black">Emergency Roadside Assistance</h3>
              <p className="text-gray-600">Available 24/7 for all our customers</p>
            </div>
          </div>
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
            Call Now: +1 (469) 480-7805
          </button>
        </div>
      </div>
    </div>
  )
}