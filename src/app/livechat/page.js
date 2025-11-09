"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Send, Paperclip, Phone, Video, MoreHorizontal, User, Bot } from "lucide-react"
import background from "../../../public/car2.jpg"

export default function LiveChatPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! Welcome to Car Rental Support. I'm Sarah, your customer service representative. How can I help you today?",
      sender: "agent",
      timestamp: "2:30 PM",
      agentName: "Sarah"
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      const userMessage = {
        id: messages.length + 1,
        text: newMessage,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }
      
      setMessages([...messages, userMessage])
      setNewMessage('')
      setIsTyping(true)
      
      // Simulate agent response
      setTimeout(() => {
        setIsTyping(false)
        const agentResponse = {
          id: messages.length + 2,
          text: "Thank you for your message. Let me look into that for you right away. I'll have an answer shortly.",
          sender: "agent",
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          agentName: "Sarah"
        }
        setMessages(prev => [...prev, agentResponse])
      }, 2000)
    }
  }

  const quickReplies = [
    "I need to extend my rental",
    "How do I add a driver?",
    "What documents do I need?",
    "Billing question",
    "Emergency assistance"
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col py-20">
      {/* Hero Section */}
      <div className="relative w-full min-h-screen  bg-[#0f172a] overflow-hidden">
        <Image src={background || "/placeholder.svg"} alt="Hero background" fill className="object-cover" priority />

        <div className="relative z-5 w-full flex flex-col h-full mt-20 lg:mt-0 justify-center items-center px-4 sm:px-6 lg:px-20 pb-16 md:pb-24 pt-16 md:pt-0">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mt-8 md:mt-16 mb-4 text-center">
            Live 
          </h1>
          <p className="text-[#ea580c] text-4xl sm:text-4xl font-bold md:text-6xl lg:text-8xl max-w-4xl mb-8 md:mb-16 text-center">
            Chat
          </p>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-[88rem] mx-auto px-4 mt-12 mb-12 flex-1">
       

        {/* Chat Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-black mb-2">24/7 Support</h3>
            <p className="text-sm text-gray-600">Our chat support is available around the clock to assist you</p>
          </div>
          
          <div className="text-center p-6 bg-blue-50 rounded-xl">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-black mb-2">Instant Response</h3>
            <p className="text-sm text-gray-600">Get immediate answers to your questions and concerns</p>
          </div>
          
          <div className="text-center p-6 bg-orange-50 rounded-xl">
            <div className="w-12 h-12 bg-[#ea580c] rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-black mb-2">Expert Help</h3>
            <p className="text-sm text-gray-600">Connect with experienced customer service representatives</p>
          </div>
        </div>

        {/* Alternative Contact Methods */}
        <div className="mt-16 bg-blue-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">Prefer other ways to reach us?</h3>
            <p className="text-gray-600 mb-6">Were here to help through multiple channels. Choose what works best for you.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                Call: +1 (555) 123-4567
              </button>
              <button className="border border-blue-600 text-blue-600 font-medium px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                Email Support
              </button>
              <button className="border border-blue-600 text-blue-600 font-medium px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                Help Center
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}