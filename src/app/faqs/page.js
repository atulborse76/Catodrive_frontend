"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import background from "../../../public/car5.webp"

export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState(null)

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  const faqs = [
    {
      question: "What do I need to rent a car?",
      answer: "You'll need a valid driver's license, a credit card in your name, and proof of insurance if you're not purchasing ours. Renters must be at least 21 years old (25 for premium vehicles)."
    },
    {
      question: "Can I extend my rental period?",
      answer: "Yes, extensions are possible based on vehicle availability. Please contact us at least 24 hours before your scheduled return time to arrange an extension."
    },
    {
      question: "What's your fuel policy?",
      answer: "We operate on a 'full-to-full' policy. You'll receive the car with a full tank and should return it full to avoid refueling charges."
    },
    {
      question: "Do you offer one-way rentals?",
      answer: "Yes, one-way rentals are available between most of our locations for an additional fee. Please check availability when booking."
    },
    {
      question: "What happens if I return the car late?",
      answer: "We allow a 29-minute grace period. After that, you'll be charged for an additional hour. Returns more than 90 minutes late will incur a full day's charge."
    },
    {
      question: "Can someone else drive the rental car?",
      answer: "Additional drivers must be registered at the time of rental and meet all requirements. There may be a small fee for additional drivers."
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
    Frequently Asked
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
    Questions
  </p>
</div>

      </div>

      {/* FAQ Content */}
      <div className="max-w-[88rem] mx-auto px-4 mt-20 mb-24">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-black mb-16">Common Questions</h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                <button 
                  className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-gray-50"
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className="text-lg font-semibold text-black">{faq.question}</h3>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${activeIndex === index ? 'transform rotate-180' : ''}`} />
                </button>
                {activeIndex === index && (
                  <div className="p-6 pt-0 bg-white">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Still have questions */}
        <div className="mt-24 bg-blue-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">Still have questions?</h3>
            <p className="text-gray-600 mb-6">Our customer service team is available 24/7 to assist you with any inquiries.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contactus" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                Contact Us
              </Link>
              {/* <button className="border border-blue-600 text-blue-600 font-medium px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                Call Now
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}