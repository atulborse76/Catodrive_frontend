"use client"

import { ArrowRight } from "lucide-react"
import Image from "next/image"
import background from "../../../public/1.jpg"
import Img from "../../../public/ImgKe.png"

export default function BlogPage() {
  const blogPosts = [
    {
      title: "How To Choose The Right Car For Your Trip",
      excerpt: "Discover the perfect vehicle for your needs with our comprehensive guide.",
      date: "Dec 7, 2023",
      category: "Tips"
    },
    {
      title: "Top 10 Road Trip Destinations for 2024",
      excerpt: "Explore the most scenic routes and must-visit locations this year.",
      date: "Nov 28, 2023",
      category: "Travel"
    },
    {
      title: "Electric Vehicles: The Future of Car Rentals",
      excerpt: "Learn how our EV fleet is changing the rental industry.",
      date: "Nov 15, 2023",
      category: "Innovation"
    },
    {
      title: "Winter Driving Safety Tips",
      excerpt: "Essential advice for driving safely in winter conditions.",
      date: "Nov 5, 2023",
      category: "Safety"
    }
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
     <div className="relative w-full  h-screen bg-[#0f172a] overflow-hidden">
  <Image
    src={background || "/placeholder.svg"}
    alt="Hero background"
    fill
    className="object-cover" // You can use blur-md or blur-lg for stronger effect
    priority
  />

 <div className="relative z-5 w-full flex flex-col h-full mt-20 lg:mt-0 justify-center items-center px-4 sm:px-6 lg:px-20 pb-16 md:pb-24 pt-16 md:pt-0">
  <h1
    className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold text-white mt-8 md:mt-16 mb-4 text-center tracking-tight leading-tight"
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
    Latest <span className="text-[#ea580c]">News</span> &
  </h1>

  <p
    className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-extrabold text-[#ea580c] max-w-5xl mb-8 md:mb-16 text-center tracking-wide"
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
    Helpful Articles
  </p>
</div>




</div>


      {/* Blog Content */}
      <div className="max-w-[88rem] mx-auto px-4 mt-20 mb-24">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-black mb-16">Our Blog</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 relative">
                <Image 
                  src={Img}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  {post.category}
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                <h3 className="text-xl font-bold text-black mb-3">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <button className="flex items-center text-blue-600 font-medium">
                  Read more <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-24 bg-gray-50 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-gray-600 mb-6">Get the latest updates, tips, and special offers directly to your inbox.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}