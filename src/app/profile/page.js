"use client";

import React from "react";
import { Phone, Mail, User, Lock, MapPin, Car, Edit3, Settings, LogOut, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function ModernProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null); 

    useEffect(() => {
  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  };
  checkAuth();
}, [router]);

useEffect(() => {
  const fetchUserData = async () => {
    try {
      // First check localStorage
      const storedUser = localStorage.getItem('userData');
      const token = localStorage.getItem('token');
      
      if (storedUser && token) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setEditedUser({...userData});
        return;
      }

      // If no stored user but has token, fetch from API
      if (token) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
          setEditedUser({...data});
          localStorage.setItem('userData', JSON.stringify(data));
        } else {
          throw new Error('Failed to fetch user data');
        }
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      router.push('/login');
    }
  };

  fetchUserData();
}, []);

// In your ModernProfilePage component, update the handleEditClick function:

const handleEditClick = async () => {
  if (isEditing) {
    setIsLoading(true);
    setError(null);
    try {
      const customerId = localStorage.getItem('customerId');
      if (!customerId) {
        throw new Error("User not authenticated");
      }

      const { re_password, otp, ...updateData } = editedUser;

      const response = await fetch(` ${process.env. NEXT_PUBLIC_API_BASE_URL}/api/customer/${customerId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updateData)
      });

      // First check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(text || "Invalid server response");
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to update profile");
      }

      const updatedUser = { ...user, ...updateData };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setIsEditing(false);
      
    } catch (error) {
      let errorMessage = error.message;
      
      // Handle HTML error responses
      if (errorMessage.startsWith("<!DOCTYPE html>")) {
        errorMessage = "Server error - please try again later";
      }
      
      setError(errorMessage);
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  } else {
    setIsEditing(true);
  }
};
const handleLogout = () => {
  // Clear user data from localStorage
  localStorage.removeItem('userData');
  localStorage.removeItem('token');
  localStorage.removeItem('customerId');
  
  // Redirect to login page
  router.push('/login');
};
  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedUser({...user});
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Profile
          </h1>
          <div className="flex items-center gap-3">
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200">
              <Settings className="w-5 h-5" />
            </button>

          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Hero Section */}
        <div className="bg-white rounded-3xl shadow-lg shadow-blue-500/10 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-12 relative">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          <div className="px-8 pb-8 -mt-2 relative">
            <div className="flex items-end gap-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white">
                  <img src="/profill.png" className="w-12 h-12 text-gray-400" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex-1 mt-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 w-full"
                    />
                  ) : (
                    user.username
                  )}
                </h2>
                <p className="text-gray-600 mb-3">
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-gray-50 border border-gray-300 rounded-xl px-3 py-2 w-full"
                    />
                  ) : (
                    user.email
                  )}
                </p>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {user.vehcile_types}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <button 
                      onClick={handleCancelClick}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                    <button 
  onClick={handleEditClick}
  disabled={isLoading}
  className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
>
  {isLoading ? (
    <span className="flex items-center">
      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Saving...
    </span>
  ) : (
    <>
      <Save className="w-4 h-4" />
      Save
    </>
  )}{error && (
  <div className="text-red-600 text-sm mt-2 p-2 bg-red-50 rounded-lg">
    Error: {error}
  </div>
)}
</button>
                  </>
                ) : (
                  <button 
                    onClick={handleEditClick}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          {/* Personal Info Card */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-500/10 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Username</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      className="bg-gray-50 rounded-xl px-4 py-4 border-2 border-gray-200 focus:border-blue-200 w-full"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-xl px-4 py-4 border-2 border-transparent focus-within:border-blue-200">
                      <p className="text-gray-900 font-medium">{user.username}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">User Type</label>
                  <div className="bg-gray-50 rounded-xl px-4 py-4 border-2 border-transparent focus-within:border-blue-200">
                    <p className="text-gray-900 font-medium">{user.vehcile_types}</p>
                  </div>
                </div>
               
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Phone Number</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedUser.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      className="bg-gray-50 rounded-xl px-4 py-4 border-2 border-gray-200 focus:border-blue-200 w-full"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-xl px-4 py-4 border-2 border-transparent focus-within:border-blue-200">
                      <p className={user.phone ? "text-gray-900 font-medium" : "text-gray-500 italic"}>
                        {user.phone || "Not provided"}
                      </p>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Password</label>
                  {isEditing ? (
                    <input
                      type="password"
                      value={editedUser.re_password}
                      onChange={(e) => handleInputChange('re_password', e.target.value)}
                      className="bg-gray-50 rounded-xl px-4 py-4 border-2 border-gray-200 focus:border-blue-200 w-full"
                    />
                  ) : (
                    <div className="bg-gray-50 rounded-xl px-4 py-4 border-2 border-transparent focus-within:border-blue-200">
                      <p className="text-gray-900 font-medium">{user.re_password}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-500/10 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/vehicleform" className="w-full bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center gap-3">
                  <Car className="w-5 h-5" />
                  Rent Your Vehicle
                </Link>
                
               
                {/* <button className="w-full bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 text-orange-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  Add Phone
                </button> */}
                           <button 
                          onClick={handleLogout}
                           className="p-2 w-full text-gray-600 flex hover:text-red-600 bg-red-50 rounded-xl py-3 px-4 transition-all duration-200"
                           >
                            <LogOut className="w-5 h-5 mx-2" /><p className="text-black ">Logout</p>
  
                           </button>
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-500/10 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-green-600" />
                Security
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                  <span className="text-sm font-medium text-green-800">Password</span>
                  <span className="text-green-600 text-sm">✓ Protected</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl">
                  <span className="text-sm font-medium text-blue-800">Email</span>
                  <span className="text-blue-600 text-sm">✓ Verified</span>
                </div>
                <button className="w-full text-blue-600 hover:text-blue-700 font-medium py-2 text-sm border border-blue-200 rounded-xl hover:bg-blue-50 transition-all duration-200">
                  Change Password
                </button>
              </div>
            </div>

            {/* Activity Card */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-500/10 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Profile Updated</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Email Verified</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Account Created</p>
                    <p className="text-xs text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Email Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-500/10 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Primary Email Address
            </h3>
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-white border border-gray-300 rounded-xl px-3 py-2 w-full"
                    />
                  ) : (
                    <>
                      <p className="font-semibold text-gray-900">{user.email}</p>
                      <p className="text-sm text-gray-600">Primary email • Verified</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics Card */}
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-500/10 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Account Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-gray-600">Bookings Made</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <div className="text-2xl font-bold text-green-600">2</div>
                <div className="text-sm text-gray-600">Days Active</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <div className="text-2xl font-bold text-purple-600">100%</div>
                <div className="text-sm text-gray-600">Profile Complete</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <div className="text-2xl font-bold text-orange-600">0</div>
                <div className="text-sm text-gray-600">Reviews Given</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}