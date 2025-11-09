"use client";

import React, { useState, useEffect } from "react";
import login from "../../../public/Group 1(4).png";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import ForgotPasswordModal from "../components/forgotpassword";
import { Loader2 } from "lucide-react";

// Helper function to dispatch auth change event
const dispatchAuthChange = () => {
  window.dispatchEvent(new Event('authChange'));
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [googleAuthStatus, setGoogleAuthStatus] = useState(null);
  
  const router = useRouter();

  const handleSignup = () => {
    router.push('/signup');
  };

  // Handle Google credential response
  const handleCredentialResponse = async (response) => {
    console.log('🔐 Google credential response received');
    console.log('🎟️ ID Token length:', response.credential?.length || 0);
    
    try {
      setIsLoading(true);
      setError("");
      
      // Send the id_token to your backend for verification
      console.log('🌐 Sending token to backend verification endpoint...');
      const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/google_auth/google/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: response.credential
        }),
      });

      console.log('📡 Verification response status:', verifyResponse.status);
      
      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json().catch(() => ({}));
        console.log('❌ Google login verification failed:', errorData);
        throw new Error(errorData.msg || `Google login failed (HTTP ${verifyResponse.status})`);
      }

      const responseData = await verifyResponse.json();
      console.log('✅ Google login successful:', responseData);
      
      // Store tokens - FIXED: Use actual response structure
      localStorage.setItem('token', responseData.access);           // Changed from access_token
      localStorage.setItem('refresh_token', responseData.refresh);  // Changed from refresh_token
      
      // Create user data object from the flat response structure
      const userData = {
        email: responseData.email,
        name: responseData.name,
        username: responseData.username
      };
      
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Use username as identifier since there's no id field
      localStorage.setItem('customerId', responseData.username); // or responseData.email
      
      console.log('💾 Google login tokens stored');
      setGoogleAuthStatus('success');
      
      // IMPORTANT: Dispatch auth change event to update header
      dispatchAuthChange();
      
      // Redirect to profile
      console.log('🚀 Redirecting to /profile...');
      router.push('/profile');
      
    } catch (error) {
      console.error("❌ Google login error:", error);
      setGoogleAuthStatus('error');
      setError(error.message || "Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Google Sign-In
  useEffect(() => {
    console.log('🔄 useEffect triggered');
    
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
      console.log('📜 Google Identity Services script loaded');
      
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
          document.getElementById("google-signin-button"),
          {
            theme: "outline",
            size: "large",
            width: 350,
            text: "continue_with",
            shape: "rectangular",
          }
        );

        console.log('✅ Google Sign-In initialized and button rendered');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('📝 Regular login form submitted');
    console.log('📧 Email:', email);
    console.log('🔒 Password length:', password.length);
    
    setError("");
    setIsLoading(true);

    try {
      console.log('🌐 Making login request to:', `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customer/login`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customer/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('📡 Login response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('❌ Login failed, error data:', errorData);
        throw new Error(errorData.msg || `Login failed (HTTP ${response.status})`);
      }

      const responseData = await response.json();
      console.log('✅ Login successful, response data:', responseData);
      
      localStorage.setItem('token', responseData.access_token);
      localStorage.setItem('refresh_token', responseData.refresh_token);
      localStorage.setItem('userData', JSON.stringify(responseData.data));
      localStorage.setItem('customerId', responseData.data.id);
      
      console.log('💾 Regular login tokens stored');
      
      // IMPORTANT: Dispatch auth change event to update header
      dispatchAuthChange();
      
      console.log('🚀 Redirecting to /profile...');
      router.push('/profile');
      
    } catch (error) {
      console.error("❌ Login error:", error);
      setError(error.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white py-16">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left side - Image */}
        <div className="hidden lg:flex w-full lg:w-1/2 relative justify-center items-center px-10 py-10">
          <div className="relative w-full h-full p-20 rounded-lg overflow-hidden">
            <Image
              src={login}
              alt="Login Side Image"
              className="object-cover w-full h-full rounded-lg"
              priority
            />
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 lg:px-16 xl:px-24 py-10">
          <div className="w-full max-w-md">
            <h1 className="text-4xl sm:text-5xl text-center font-bold text-[#FF7A30] mb-2">
              Welcome back
            </h1>
            
            {/* Google Auth Status */}
            {googleAuthStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-800 font-medium">✓ Google login successful!</div>
                <div className="text-sm text-green-600 mt-1">Redirecting to your profile...</div>
              </div>
            )}

            {googleAuthStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="text-red-800 font-medium">❌ Google login failed</div>
                <div className="text-sm text-red-600 mt-1">Please try again or use email/password</div>
              </div>
            )}

            {/* Google Sign-In Button Container */}
            <div className="w-full flex justify-center mb-6">
              <div id="google-signin-button" className="w-full max-w-[350px]"></div>
            </div>

            <div className="flex items-center justify-center mb-4">
              <span className="text-sm text-gray-400">or</span>
            </div>

            {error && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                error.includes("not registered") ? 
                  "bg-blue-100 border border-blue-400 text-blue-700" : 
                  "bg-red-100 border border-red-400 text-red-700"
              }`}>
                {error}
                {error.includes("not registered") && (
                  <button 
                    onClick={handleSignup}
                    className="ml-2 font-semibold hover:underline"
                  >
                    Sign up now
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="text-black">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A30] focus:border-transparent"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A30] focus:border-transparent"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    className="h-4 w-4 text-[#FF7A30] border-gray-300 rounded" 
                    disabled={isLoading}
                  />
                  <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Remember Me</label>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-[#FF7A30] hover:underline"
                  disabled={isLoading}
                >
                  Forgot Password
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-[#FF7A30] text-white py-3 rounded-xl hover:bg-[#e86e29] transition-colors font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Logging in...
                  </span>
                ) : 'Log in'}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-md text-gray-600">
                Don&apos;t have an account yet?
                <button 
                  onClick={handleSignup} 
                  className="text-[#FF7A30] hover:underline ml-1"
                  disabled={isLoading}
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ForgotPasswordModal 
        show={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
    </div>
  );
}