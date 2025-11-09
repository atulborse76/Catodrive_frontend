"use client";

import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";

export default function ForgotPasswordModal({ show, onClose }) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1); // 1 = email step, 2 = password step
  const [message, setMessage] = useState({ text: "", type: "" }); // type: success/error
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      if (step === 1) {
        // Step 1: Verify email
        const response = await fetch(`${process.env. NEXT_PUBLIC_API_BASE_URL}/api/customer/change_password/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok) {
          setStep(2);
          setMessage({ text: "Email verified. Please set your new password.", type: "success" });
        } else {
          setMessage({ text: data.message || "Email verification failed", type: "error" });
        }
      } else {
        // Step 2: Reset password
        if (newPassword !== confirmPassword) {
          setMessage({ text: "Passwords do not match", type: "error" });
          return;
        }

        const response = await fetch(` ${process.env. NEXT_PUBLIC_API_BASE_URL}/api/customer/change_password/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password: newPassword,
            repassword: confirmPassword,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setMessage({ 
            text: "Password reset successfully! You can now login with your new password.", 
            type: "success" 
          });
          // Close modal after 2 seconds
          setTimeout(() => {
            onClose();
            resetForm();
          }, 2000);
        } else {
          setMessage({ 
            text: data.error || data.message || "Password reset failed", 
            type: "error" 
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({ text: "An error occurred. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setNewPassword("");
    setConfirmPassword("");
    setStep(1);
    setMessage({ text: "", type: "" });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#FF7A30]">
              {step === 1 ? "Forgot Password" : "Reset Password"}
            </h2>
            <button 
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {message.text && (
            <div className={`mb-4 p-3 rounded-md ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {step === 1 ? (
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A30] focus:border-transparent"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 border text-gray-700 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A30] focus:border-transparent"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 borde text-gray-700 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF7A30] focus:border-transparent"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#FF7A30] text-white py-3 rounded-xl hover:bg-[#e86e29] transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="animate-spin" size={20} />}
              {step === 1 
                ? (isLoading ? "Verifying..." : "Continue") 
                : (isLoading ? "Resetting..." : "Reset Password")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}