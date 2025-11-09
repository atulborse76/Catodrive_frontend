"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Users, Zap } from "lucide-react"
import background from "../../../public/image 62.png"

export default function GetInTouchPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    preferredContact: 'email'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState({
  success: false,
  message: ''
})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  
  // Basic validation
  if (!formData.name || !formData.email || !formData.subject || !formData.message) {
    setSubmitStatus({
      success: false,
      message: 'Please fill all required fields'
    })
    return
  }

  setIsSubmitting(true)
  setSubmitStatus({ success: false, message: '' })
  
  try {
    const payload = {
      name: formData.name,
      email: formData.email,
      mobile: formData.phone || '', // Fallback to empty string if not provided
      pre_mobile: formData.phone || '', // Using same phone number as pre_mobile
      subject: formData.subject,
      message: formData.message
    }

    const response = await fetch(`${process.env. NEXT_PUBLIC_API_BASE_URL}/api/contact/contact/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send message')
    }

    setSubmitStatus({
      success: true,
      message: 'Your message has been sent successfully! We will get back to you soon.'
    })
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      preferredContact: 'email'
    })
    
  } catch (error) {
    console.error('Error submitting form:', error)
    setSubmitStatus({
      success: false,
      message: error.message || 'There was an error sending your message. Please try again later.'
    })
  } finally {
    setIsSubmitting(false)
  }
}

  const contactMethods = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Let's Chat",
      description: "Drop us a message and we'll get back to you within 24 hours",
      details: "Average response time: 2 hours",
      color: "bg-blue-50 text-blue-600 border-blue-200"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Call Us Direct",
      description: "Speak with our friendly team right away",
      details: "+1(979)-997-95556",
      color: "bg-green-50 text-green-600 border-green-200"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Visit Our Office",
      description: "Come say hello at our headquarters",
      details: "12534 Central drv, apt 126 Bedford, Dallas, Tx 76021",
      color: "bg-purple-50 text-purple-600 border-purple-200"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Join Our Community",
      description: "Connect with us on social media",
      details: "Follow @catodrive for updates",
      color: "bg-pink-50 text-pink-600 border-pink-200"
    }
  ]

  const quickLinks = [
    { title: "Booking Support", description: "Help with reservations and modifications" },
    { title: "Technical Issues", description: "App or website problems" },
    { title: "Billing Questions", description: "Payment and invoice inquiries" },
    { title: "General Feedback", description: "Share your thoughts with us" }
  ]

  return (
    <div className="min-h-screen bg-white py-20">
      {/* Hero Section */}
      <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <Image 
          src={background || "/placeholder.svg"} 
          alt="Hero background" 
          fill 
          className="object-cover opacity-30" 
          priority 
        />
        
       <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-4 sm:px-6 lg:px-20 py-20">
  <div className="text-center max-w-4xl mx-auto mt-16 ">
    <h1
      className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mt-6 leading-tight"
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
      Get In <span className="text-[#ea580c]">Touch</span>
    </h1>

    <p className="text-xl md:text-2xl text-gray-300 mt-6 max-w-2xl mx-auto leading-relaxed">
      We are here to help you every step of the way. Reach out and let start a conversation.
    </p>
  </div>
</div>

      </div>

      {/* Contact Methods Section */}
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Choose Your Way to Connect
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you prefer to chat, call, or visit in person, weve got you covered
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {contactMethods.map((method, index) => (
            <div key={index} className={`p-8 rounded-2xl border-2 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${method.color}`}>
              <div className="mb-6">
                {method.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{method.title}</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{method.description}</p>
              <p className="font-semibold text-sm">{method.details}</p>
            </div>
          ))}
        </div>

        {/* Main Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Contact Form */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-10 shadow-lg">
            <div className="flex items-center gap-3 mb-8">
              <Send className="w-8 h-8 text-[#ea580c]" />
              <h3 className="text-3xl font-bold text-slate-900">Send us a Message</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 text-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 text-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 text-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label htmlFor="preferredContact" className="block text-sm font-semibold text-gray-700 mb-3">
                    Preferred Contact Method
                  </label>
                  <select
                    id="preferredContact"
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 text-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="text">Text Message</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-3">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 border-gray-200 text-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="How can we help you?"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-3">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 border-2 text-gray-600 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                  placeholder="Tell us more about your inquiry..."
                  required
                ></textarea>
              </div>

              <div className="space-y-4">
  <button
    type="submit"
    disabled={isSubmitting}
    className="w-full bg-[#ea580c] hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 flex items-center justify-center gap-3"
  >
    {isSubmitting ? (
      <>
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        Sending...
      </>
    ) : (
      <>
        Send Message
        <Send className="w-5 h-5" />
      </>
    )}
  </button>

  {submitStatus.message && (
    <div className={`mt-4 p-4 rounded-xl ${
      submitStatus.success 
        ? 'bg-green-50 text-green-800' 
        : 'bg-red-50 text-red-800'
    }`}>
      {submitStatus.message}
    </div>
  )}
</div>
            </form>
          </div>

          {/* Quick Links & Info */}
          <div className="space-y-8">
            {/* Quick Help */}
            <div className="bg-slate-50 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-8 h-8 text-[#ea580c]" />
                <h3 className="text-2xl font-bold text-slate-900">Quick Help</h3>
              </div>
              <div className="space-y-4">
                {quickLinks.map((link, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl hover:shadow-md transition-shadow cursor-pointer">
                    <h4 className="font-semibold text-slate-900 mb-1">{link.title}</h4>
                    <p className="text-sm text-gray-600">{link.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-blue-50 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-8 h-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-slate-900">Were Available</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Monday - Friday</span>
                  <span className="text-gray-600">7:00 AM - 7:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Saturday - Sunday</span>
                  <span className="text-gray-600">7:00 AM - 7:00 PM</span>
                </div>
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Emergency Support:</strong> Available 24/7 for urgent assistance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of satisfied customers who trust us with their car rental needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-[#ea580c] hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105">
              Emergency Support: +1(979)-997-95556
            </button>
            <Link href="/availablevehicle" className="border-2 border-white text-white hover:bg-white hover:text-slate-900 font-semibold px-8 py-4 rounded-full transition-all duration-300">
              Browse Our Fleet
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}