"use client";

import React from "react";
import login from "../../../public/Group 1(4).png";
import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, Apple, PlayCircle, Heart, Star } from "lucide-react";
import { ArrowRight, Check, Menu, X, Fuel, Settings, Users, ChevronDown, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Helper function to dispatch auth change event
const dispatchAuthChange = () => {
  window.dispatchEvent(new Event('authChange'));
};

export default function SignupPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  // OTP verification states
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [googleAuthStatus, setGoogleAuthStatus] = useState(null);

  const handleLogin = () => {
    router.push('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle Google credential response
  const handleCredentialResponse = async (response) => {
    console.log('🔐 Google credential response received for signup');
    console.log('🎟️ ID Token length:', response.credential?.length || 0);
    
    try {
      setIsLoading(true);
      setError("");
      
      // Send the id_token to your backend for verification (signup endpoint)
      console.log('🌐 Sending token to backend signup verification endpoint...');
      const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/google_auth/google/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: response.credential,
          is_signup: true // Add flag to indicate this is signup
        }),
      });

      console.log('📡 Verification response status:', verifyResponse.status);
      
      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json().catch(() => ({}));
        console.log('❌ Google signup verification failed:', errorData);
        throw new Error(errorData.msg || `Google signup failed (HTTP ${verifyResponse.status})`);
      }

      const responseData = await verifyResponse.json();
      console.log('✅ Google signup successful:', responseData);
      
      // Store tokens - Use same structure as login
      localStorage.setItem('token', responseData.access);
      localStorage.setItem('refresh_token', responseData.refresh);
      
      // Create user data object from the flat response structure
      const userData = {
        email: responseData.email,
        name: responseData.name,
        username: responseData.username
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('customerId', responseData.username);
      
      console.log('💾 Google signup tokens stored');
      setGoogleAuthStatus('success');
      
      // IMPORTANT: Dispatch auth change event to update header
      dispatchAuthChange();
      
      // Redirect to profile
      console.log('🚀 Redirecting to /profile...');
      router.push('/profile');
      
    } catch (error) {
      console.error("❌ Google signup error:", error);
      setGoogleAuthStatus('error');
      setError(error.message || "Google signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Google Sign-In
  useEffect(() => {
    console.log('🔄 useEffect triggered for signup');
    
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const customerId = localStorage.getItem('customerId');
    
    if (token && customerId) {
      console.log('✅ User already authenticated, redirecting to profile...');
      router.push('/profile');
      return;
    }

    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('📜 Google Identity Services script loaded for signup');
      
      // Initialize Google Sign-In
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: "489409603071-1173d9hsk8h8o2in6gh7uuo80rni5imu.apps.googleusercontent.com",
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Render the sign-in button
        window.google.accounts.id.renderButton(
          document.getElementById("google-signup-button"),
          {
            theme: "outline",
            size: "large",
            width: 350,
            text: "signup_with",
            shape: "rectangular",
          }
        );

        console.log('✅ Google Sign-Up initialized and button rendered');
      }
    };

    document.head.appendChild(script);

    // Cleanup function
    return () => {
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [router]);
   
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    re_password: "",
    vehicle_types: "",
    username: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

    const passwordRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
  
    if (!passwordRegex.test(formData.password)) {
      setError('Password must contain at least 8 characters, one uppercase letter, one number, and one special character');
      setIsLoading(false);
      return;
    }
    
    if (formData.password !== formData.re_password) {
      setError('Passwords do not match');
      setIsLoading(false);
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
        vehicle_types: formData.vehicle_types, // Fixed typo
      }),
    });

    // Handle both JSON and HTML responses
    const text = await response.text();
    let data;
    
    try {
      data = JSON.parse(text); // Try to parse as JSON
    } catch {
      // If not JSON, check if it's an HTML error page
      if (text.includes('SMTPAuthenticationError')) {
        // Special case: Registration succeeded but email failed
        console.warn('Registration succeeded but email failed');
        setShowOtpModal(true);
        return;
      }
      throw new Error('Server error occurred');
    }

    if (response.ok) {
      setShowOtpModal(true);
    } else {
      setError(data.message || data.detail || 'Registration failed');
    }
  } catch (error) {
    setError(error.message || 'Network error. Please try again.');
    console.error('Registration error:', error);
  } finally {
    setIsLoading(false);
  }
};

const sendOtp = async () => {
  setIsLoading(true);
  setError("");
  
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customer/otp`,
      {
        method: "POST", // Ensure this is POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          is_registration: true,
        }),
      }
    );

    // Special case: If we get 500 but OTP is sent
    if (response.status === 500) {
      console.warn("Backend returned 500 but OTP was sent");
      setOtpSent(true);
      setError("");
      return;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'Failed to send OTP');
    }

    setOtpSent(true);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};

const verifyOtp = async () => {
  setIsLoading(true);
  setError("");

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customer/verifyotp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp: otp.trim(),
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Invalid OTP');
    }

    const data = await response.json();
    // Store tokens and redirect
    localStorage.setItem('token', data.token);
    router.push('/profile');
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="relative w-full shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] lg:h-full bg-[white] overflow-hidden"></div>

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left Side Image */}
        <div className="md:w-1/2 w-full relative px-4 py-10 md:px-16 md:py-20 flex justify-center items-center">
          <div className="relative w-full h-64 md:h-full lg:ml-10 rounded-lg overflow-hidden">
            <Image
              src={login}
              alt="Login Side Image"
              className="hidden lg:block object-cover w-full h-full"
              priority
            />
          </div>
        </div>

        {/* Right Side Form */}
        <div className="md:w-1/2 w-full flex items-center justify-center mb-10 px-4 md:px-10 lg:px-20">
          <div className="w-full max-w-lg">
            <h1 className="text-3xl md:text-5xl text-center font-bold text-[#FF7A30] mb-8">
              Create New Account
            </h1>

            {/* Google Auth Status */}
            {googleAuthStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-800 font-medium">✓ Google signup successful!</div>
                <div className="text-sm text-green-600 mt-1">Redirecting to your profile...</div>
              </div>
            )}

            {googleAuthStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-800 font-medium">❌ Google signup failed</div>
                <div className="text-sm text-red-600 mt-1">Please try again or use the form below</div>
              </div>
            )}

            {/* Google Sign-In Button Container */}
            <div className="w-full flex justify-center mb-6">
              <div id="google-signup-button" className="w-full max-w-[350px]"></div>
            </div>

            <div className="flex items-center justify-center mb-4">
              <span className="text-sm text-gray-400">or</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-black">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7A30] focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7A30] focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password (min 8 chars, 1 uppercase, 1 number, 1 special char)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7A30] focus:border-transparent"
                  required
                  disabled={isLoading}
                />
                {formData.password && !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(formData.password) && (
                  <p className="mt-1 text-sm text-red-600">
                    Password must contain at least 8 characters, one uppercase letter, one number, and one special character
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="re_password" className="block text-sm font-medium text-gray-700 mb-1">
                  Re-enter Password
                </label>
                <input
                  type="password"
                  id="re_password"
                  value={formData.re_password}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7A30] focus:border-transparent"
                  required
                  disabled={isLoading}
                />
                {formData.password && formData.re_password && formData.password !== formData.re_password && (
                  <p className="mt-1 text-sm text-red-600">
                    Passwords do not match
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="vehicle_types" className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <div className="relative">
                  <select
                    id="vehicle_types"
                    value={formData.vehicle_types}
                    onChange={handleChange}
                    className="appearance-none w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7A30] focus:border-transparent"
                    required
                    disabled={isLoading}
                  >
                    <option value="" disabled>Choose your vehicle type</option>
                    <option value="Driver">Driver</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}

              <button
                type="submit"
                className={`w-full bg-[#FF7A30] text-white py-3 rounded-xl hover:bg-[#e86e29] transition-colors font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Registering...
                  </span>
                ) : 'Register'}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-md text-[#FF7A30]">
                Already have an account?
                <button onClick={handleLogin} className="text-black hover:underline ml-1">
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-[#FF7A30]">
          {error.includes('couldn\'t send') ? 'Email Failed' : 'Verify Your Email'}
        </h2>
              <button 
                onClick={() => setShowOtpModal(false)} 
                className="text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                <X size={24} />
              </button>
            </div>
            
            <p className="mb-6 text-gray-600">
              We have sent a verification code to <span className="font-semibold">{formData.email}</span>. 
              Please enter the code below to verify your email address.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="modal-otp" className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  id="modal-otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 border text-black border-gray-300 rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF7A30] focus:border-transparent"
                  required
                  disabled={isLoading}
                />
              </div>
              
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              
              <div className="flex gap-2">
                <button
                  onClick={sendOtp}
                  className={`flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition-colors font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : (otpSent ? "Resend OTP" : "Send OTP")}
                </button>
                <button
                  onClick={verifyOtp}
                  className={`flex-1 bg-[#FF7A30] text-white py-3 rounded-xl hover:bg-[#e86e29] transition-colors font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}