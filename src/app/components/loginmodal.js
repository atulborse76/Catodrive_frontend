"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginModal({ show, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

// components/LoginModal.js
const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customer/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || data.status === 'failure') {
      throw new Error(data.msg || "Login failed");
    }

    if (!data.data?.id) {
      throw new Error("Invalid user data received");
    }

    // Store auth data
    localStorage.setItem('userData', JSON.stringify(data.data));
    localStorage.setItem('customerId', data.data.id);

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('authChange'));

    // Close modal and trigger success
    onLoginSuccess(data.data.id);
    onClose();
  } catch (error) {
    setError(error.message || "Login failed");
  } finally {
    setIsLoading(false);
  }
};
const handleGoogleAuth = async () => {
  try {
    setIsLoading(true);
    setError("");
    
    // 1. Generate state token
    const state = crypto.randomUUID();
    sessionStorage.setItem('oauth_state', state);
    
    // 2. Prepare callback URL
    const callbackUrl = `${window.location.origin}/api/auth/callback`;
    
    // 3. Construct backend auth URL
    const authUrl = `https://backend.catodrive.com/accounts/google/login/?
      state=${encodeURIComponent(state)}&
      next=${encodeURIComponent(callbackUrl)}`;
    
    // 4. Open popup
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.innerWidth - width) / 2;
    const top = window.screenY + (window.innerHeight - height) / 2;
    
    const popup = window.open(
      authUrl,
      'GoogleAuthPopup',
      `width=${width},height=${height},top=${top},left=${left}`
    );
    
    if (!popup) {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }

    // 5. Listen for messages from callback
    const messageListener = (event) => {
      if (event.origin !== window.location.origin) return;
      
      switch (event.data.type) {
        case 'oauth-success':
          localStorage.setItem('token', event.data.token);
          localStorage.setItem('userData', JSON.stringify(event.data.user));
          localStorage.setItem('customerId', event.data.customerId);
          router.push('/profile');
          break;
          
        case 'oauth-error':
          setError(event.data.message || 'Google login failed');
          break;
      }
      
      window.removeEventListener('message', messageListener);
    };

    window.addEventListener('message', messageListener);

    // 6. Check for popup closure
    const popupChecker = setInterval(() => {
      if (popup.closed) {
        clearInterval(popupChecker);
        if (!localStorage.getItem('token')) {
          setError('Login cancelled or failed');
        }
      }
    }, 500);

  } catch (error) {
    console.error('Google auth error:', error);
    setError(error.message || 'Failed to initiate Google login');
    setIsLoading(false);
  }
};
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {/* Modal header */}
        <div className="flex justify-between items-center mb-4 gap-2">
  <button 
    onClick={handleGoogleAuth}
    className="flex-1 border rounded-lg border-gray-300 py-2 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
    disabled={isLoading}
  >
    <svg width="16" height="16" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20c0-1.341-0.138-2.65-0.389-3.917H43.611z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
    <span className="text-sm font-medium text-gray-700">Continue with Google</span>
  </button>
  
  <button 
    onClick={onClose} 
    className="text-gray-500 hover:text-gray-700 p-1"
    disabled={isLoading}
  >
    ✕
  </button>
</div>

        {/* Error message */}
        {error && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            error.includes("not registered") ? 
              "bg-blue-100 border border-blue-400 text-blue-700" : 
              "bg-red-100 border border-red-400 text-red-700"
          }`}>
            {error}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="text-black">
          <div className="mb-4">
            <label htmlFor="modal-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="modal-email"
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
            <label htmlFor="modal-password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="modal-password"
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

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-[#FF7A30] text-white py-3 rounded-xl hover:bg-[#e86e29] transition-colors font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging in...
              </span>
            ) : 'Log in'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-md text-gray-600">
            Dont have an account?{' '}
            <button 
              onClick={() => {
                onClose();
                router.push('/signup');
              }} 
              className="text-[#FF7A30] hover:underline"
              disabled={isLoading}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}