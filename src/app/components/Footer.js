"use client";

import Link from "next/link";
import { Phone, Mail, Apple, PlayCircle, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    re_password: "",
    vehicle_types: "",
    username: "",
  });

  const vehicleTypes = [
    "SUV",
    "Sedan",
    "Hatchback",
    "Coupe",
    "Mid-size 4x4 SUV"
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.re_password) {
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customer/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          re_password: formData.re_password,
          vehcile_types: formData.vehicle_types,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setShowSignupModal(false);
        setFormData({
          email: "",
          password: "",
          re_password: "",
          vehicle_types: "",
          username: "",
        });
        router.push('/login');
      } else {
        alert("Error: " + data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleSignupClick = () => {
    setShowSignupModal(true);
  };

  const closeModal = () => {
    setShowSignupModal(false);
    setFormData({
      email: "",
      password: "",
      re_password: "",
      vehicle_types: "",
      username: "",
    });
  };

  return (
    <>
      <div className="bg-[#0a0c17] text-white">
        <div className="container mx-auto px-4 py-12">
          {/* Main content section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-16">
            {/* Left column */}
            <div className="flex flex-col items-start pl-0 -ml-16">
              <img 
                src="/logo1.png" 
                alt="CatoDrive vehicle" 
                className="w-full max-w-md rounded-lg"
              />
              <p className="text-2xl text-center mt-4 font-bold max-w-md w-full">
                Skip the cab, grab the keys!
              </p>
            </div>

            {/* Right column */}
            <div>
              <h2 className="text-xl font-bold mb-2">Join CatoDrive</h2>
              <p className="text-sm mb-6">Wheels when you want em – book now, drive later.</p>

              <div className="space-y-3">
                <div>
                  <label htmlFor="newsletter-email" className="text-xs block mb-1">
                    Your email address
                  </label>
                  <input 
                    type="email" 
                    id="newsletter-email" 
                    className="w-full bg-[#111327] rounded-md p-3 outline-none text-sm" 
                  />
                </div>

                <button 
                  onClick={handleSignupClick}
                  className="w-full bg-[#3b5bf5] hover:bg-[#2a4ae0] text-white py-3 rounded-md transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>

          {/* Footer section */}
          <footer className="mt-12 md:mt-20">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
              {/* Company */}
              <div>
                <h3 className="font-bold mb-4">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/aboutus" className="hover:text-gray-300">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/services" className="hover:text-gray-300">
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link href="/faqs" className="hover:text-gray-300">
                      FAQs
                    </Link>
                  </li>
                  <li>
                    <Link href="/termsandcondition" className="hover:text-gray-300">
                      Terms
                    </Link>
                  </li>
                  <li>
                    <Link href="/contactus" className="hover:text-gray-300">
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-bold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/getintouch" className="hover:text-gray-300">
                      Get in Touch
                    </Link>
                  </li>
                  <li>
                    <Link href="/howitwork" className="hover:text-gray-300">
                      How it works
                    </Link>
                  </li>
                </ul>
              </div>

{/* Our Brands */}

<div>
  <h3 className="font-bold mb-4">Our Brands</h3>
  <ul className="space-y-2 text-sm">
    <li>
      <Link 
        href="/availablevehicle?name=Volkswagen" 
        className="hover:text-gray-300"
      >
        Volkswagen
      </Link>
    </li>
    <li>
      <Link 
        href="/availablevehicle?name=Toyota" 
        className="hover:text-gray-300"
      >
        Toyota
      </Link>
    </li>
    <li>
      <Link 
        href="/availablevehicle?name=BMW" 
        className="hover:text-gray-300"
      >
        BMW
      </Link>
    </li>
     <li>
      <Link 
        href="/availablevehicle?name=Jeep" 
        className="hover:text-gray-300"
      >
        Jeep
      </Link>
    </li>
     <li>
      <Link 
        href="/availablevehicle?name=Chevrolet" 
        className="hover:text-gray-300"
      >
        Chevrolet
      </Link>
    </li>
    
  </ul>
</div>

              {/* Vehicles Type */}
           
<div>
  <h3 className="font-bold mb-4">Vehicles Type</h3>
  <ul className="space-y-2 text-sm">
    {vehicleTypes.map((type) => (
      <li key={type}>
        <Link 
          href={`/availablevehicle?type=${encodeURIComponent(type)}`}
          className="hover:text-gray-300"
        >
          {type}
        </Link>
      </li>
    ))}
  </ul>
</div>

              {/* Our Mobile App */}
              <div>
                <h3 className="font-bold mb-4">Our Mobile App</h3>
                <div className="space-y-3">
                  <Link href="/comingsoon" className="flex items-center gap-2 text-sm hover:text-gray-300">
                    <Apple size={20} />
                    <div>
                      <div className="text-xs">Download on the</div>
                      <div className="font-medium">Apple Store</div>
                    </div>
                  </Link>
                  <Link href="/comingsoon" className="flex items-center gap-2 text-sm hover:text-gray-300">
                    <PlayCircle size={20} />
                    <div>
                      <div className="text-xs">Get it on</div>
                      <div className="font-medium">Google Play</div>
                    </div>
                  </Link>
                </div>

                <div className="mt-8">
                  <h3 className="font-bold mb-4">Connect With Us</h3>
                  <div className="flex gap-3">
                       <div className="flex space-x-2">
                      <Link href="#" className="bg-white/10 rounded-md p-2 text-white transition">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </Link>

                      <Link href="#" className="bg-white/10 rounded-md p-2 text-white transition">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                        </svg>
                      </Link>

                      <Link href="#" className="bg-white/10 rounded-md p-2 text-white transition">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </Link>

                      <Link href="#" className="bg-white/10 rounded-md p-2 text-white transition">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                      </Link>

                      

                     <Link 
  href="https://x.com/CatoDrive" 
  className="bg-white/10 rounded-md p-2 text-white transition hover:bg-white/20"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Visit our X (Twitter) profile"
>
  <svg 
    className="w-5 h-5" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
  </svg>
</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-800 mx-auto justify-between items-center text-xs text-gray-400">
              <div>© 2025 catodrive.com. All rights reserved.</div>
            </div> 
          </footer>
        </div>
      </div>

      {/* Signup Modal */}
{showSignupModal && (
  <div 
    className="fixed inset-0 top-20 bg-black bg-opacity-50 z-1000 flex items-start justify-center p-4 overflow-y-auto pt-[--header-height]"
    onClick={closeModal}
    style={{"--header-height": "64px"}} // Set your actual header height here
  >
    <div 
      className="bg-white rounded-xl w-full max-w-md my-4 max-h-[calc(100vh-var(--header-height)-2rem)] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#FF7A30]">Create New Account</h2>
          <button 
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700 text-xl focus:outline-none"
            aria-label="Close signup modal"
          >
            ×
          </button>
        </div>

        {/* Google Signup Button */}
        <button 
          className="w-full border rounded-xl border-gray-300 py-3 flex items-center justify-center gap-2 mb-4 hover:bg-gray-50 transition-colors"
          type="button"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20c0-1.341-.138-2.65-.389-3.917H43.611z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          <span className="text-sm font-medium text-gray-700">Sign up with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center mb-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-sm text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7A30] focus:border-transparent"
              required
              minLength={3}
              maxLength={20}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7A30] focus:border-transparent"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7A30] focus:border-transparent"
              required
              minLength={8}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7A30] focus:border-transparent"
              required
            />
          </div>

          {/* Vehicle Type */}
          <div>
            <label htmlFor="vehicleType" className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Type
            </label>
            <div className="relative">
              <select
                id="vehicleType"
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="appearance-none w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF7A30] focus:border-transparent"
                required
              >
                <option value="" disabled>Choose your vehicle type</option>
                <option value="Driver">Driver</option>
                <option value="Owner">Car Owner</option>
              </select>
              <div className="absolute right-3 top-3.5 pointer-events-none">
                <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#FF7A30] text-white py-3 rounded-xl hover:bg-[#e86e29] transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[#FF7A30] focus:ring-offset-2"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                closeModal();
                router.push('/login');
              }}
              className="text-[#FF7A30] hover:underline font-medium focus:outline-none"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
)}
    </>
  );
}