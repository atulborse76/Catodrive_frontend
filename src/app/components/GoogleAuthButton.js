"use client";

import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function GoogleAuthButton() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsLoading(true);
    setError("");

    try {
      // Send the credential to your backend
      const response = await fetch('https://backend.catodrive.com/accounts/google/login/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || errorData.message || "Google login failed");
      }

      const data = await response.json();
      
      // Store authentication tokens
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      localStorage.setItem('userData', JSON.stringify(data.user));
      
      // Redirect to profile
      window.location.href = '/profile';

    } catch (error) {
      console.error("Google login error:", error);
      setError(error.message || "Failed to login with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google login failed. Please try again.");
  };

  return (
    <GoogleOAuthProvider 
      clientId="489409603071-1173d9hsk8h8o2in6gh7uuo80rni5imu.apps.googleusercontent.com"
    >
      <div className="w-full flex justify-center mb-6">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
          text="continue_with"
          shape="rectangular"
          size="large"
          width="350"
          ux_mode="popup"
        />
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="text-gray-500 text-sm mt-2">
            Processing...
          </div>
        )}
      </div>
    </GoogleOAuthProvider>
  );
}