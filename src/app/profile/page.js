"use client";

import React from "react";
import { Phone, Mail, User, Lock, MapPin, Car, Edit3, Settings, LogOut, Save, X, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    pageSize: 10
  });
  const [vehicleNames, setVehicleNames] = useState({});

  // Unsplash profile images array
  const profileImages = [
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
  ];

  const [currentProfileImage, setCurrentProfileImage] = useState(profileImages[0]);

  // Function to fetch vehicle details
  const fetchVehicleDetails = async (vehicleId) => {
    if (!vehicleId || vehicleNames[vehicleId]) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vehicle/vehicle/${vehicleId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const vehicleData = await response.json();
        setVehicleNames(prev => ({
          ...prev,
          [vehicleId]: vehicleData.name || `Vehicle ${vehicleId}`
        }));
      } else {
        console.error(`Failed to fetch vehicle ${vehicleId}`);
        setVehicleNames(prev => ({
          ...prev,
          [vehicleId]: `Vehicle ${vehicleId}`
        }));
      }
    } catch (error) {
      console.error(`Error fetching vehicle ${vehicleId}:`, error);
      setVehicleNames(prev => ({
        ...prev,
        [vehicleId]: `Vehicle ${vehicleId}`
      }));
    }
  };

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
        const storedUser = localStorage.getItem('userData');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setEditedUser({...userData});
          return;
        }

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

  useEffect(() => {
    if (user) {
      fetchAllUserBookings();
    }
  }, [user]);

  // Fetch vehicle names when bookings change
  useEffect(() => {
    if (bookings.length > 0) {
      bookings.forEach(booking => {
        if (booking.vehicle) {
          fetchVehicleDetails(booking.vehicle);
        }
      });
    }
  }, [bookings]);

  const fetchAllUserBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const token = localStorage.getItem('token');
      const customerId = localStorage.getItem('customerId');
      const authType = localStorage.getItem('authType');

      console.log('🔍 Fetching ALL bookings with:', { customerId, authType });

      let allBookings = [];
      let currentPage = 1;
      let totalPages = 1;

      // Fetch all pages up to 100 (10 pages with 10 per page)
      while (currentPage <= 10) {
        let apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/booking/booking?page=${currentPage}&page_size=10`;
        
        // Determine the correct customer ID to use
        let actualCustomerId = customerId;
        
        if (authType === 'google' && customerId && customerId.startsWith('google_')) {
          actualCustomerId = customerId.replace('google_', '');
          apiUrl += `&google_customer=${actualCustomerId}`;
        } else if (customerId && !customerId.startsWith('google_')) {
          apiUrl += `&customer=${customerId}`;
        } else {
          console.error('❌ No valid customer ID found');
          break;
        }

        console.log(`🌐 Fetching bookings page ${currentPage} from:`, apiUrl);

        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log(`📡 Bookings page ${currentPage} response status:`, response.status);

        if (response.ok) {
          const data = await response.json();
          console.log(`✅ Bookings page ${currentPage} data received:`, data);
          
          if (data.data && Array.isArray(data.data)) {
            // Add bookings from this page
            allBookings = [...allBookings, ...data.data];
            
            // Update pagination info from first page
            if (currentPage === 1) {
              setPagination({
                currentPage: data.page || 1,
                totalPages: data.total_pages || 1,
                totalRecords: data.total_records || data.data.length,
                pageSize: data.page_size || 10
              });
              totalPages = data.total_pages || 1;
            }

            // If this page has less than page_size items, we've reached the end
            if (data.data.length < 10) {
              console.log(`📄 Reached last page (page ${currentPage} has ${data.data.length} items)`);
              break;
            }

            // If we've fetched all pages, break
            if (currentPage >= totalPages) {
              console.log(`📄 Fetched all ${totalPages} pages`);
              break;
            }
          } else {
            console.log(`📭 No bookings array in page ${currentPage} response data`);
            break;
          }
        } else {
          console.error(`❌ Failed to fetch bookings page ${currentPage}, status:`, response.status);
          const errorText = await response.text();
          console.error('❌ Error response:', errorText);
          break;
        }

        currentPage++;
      }

      // Sort all bookings by date (newest first)
      const sortedBookings = allBookings.sort((a, b) => new Date(b.pick_up_Date) - new Date(a.pick_up_Date));
      setBookings(sortedBookings);
      console.log('📦 All bookings loaded:', sortedBookings.length, 'total bookings');

    } catch (error) {
      console.error('❌ Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  // Function to fetch a specific page (for pagination controls)
  const fetchBookingsPage = async (pageNumber) => {
    setIsLoadingBookings(true);
    try {
      const token = localStorage.getItem('token');
      const customerId = localStorage.getItem('customerId');
      const authType = localStorage.getItem('authType');

      let apiUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/booking/booking?page=${pageNumber}&page_size=10`;
      
      if (authType === 'google' && customerId && customerId.startsWith('google_')) {
        const actualCustomerId = customerId.replace('google_', '');
        apiUrl += `&google_customer=${actualCustomerId}`;
      } else if (customerId && !customerId.startsWith('google_')) {
        apiUrl += `&customer=${customerId}`;
      } else {
        console.error('❌ No valid customer ID found');
        return;
      }

      console.log(`🌐 Fetching bookings page ${pageNumber} from:`, apiUrl);

      const response = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Bookings page ${pageNumber} data received:`, data);
        
        if (data.data && Array.isArray(data.data)) {
          const sortedBookings = data.data.sort((a, b) => new Date(b.pick_up_Date) - new Date(a.pick_up_Date));
          setBookings(sortedBookings);
          setPagination({
            currentPage: data.page || pageNumber,
            totalPages: data.total_pages || 1,
            totalRecords: data.total_records || data.data.length,
            pageSize: data.page_size || 10
          });
        }
      }
    } catch (error) {
      console.error('❌ Error fetching bookings page:', error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const handleEditClick = async () => {
    if (isEditing) {
      setIsLoading(true);
      setError(null);
      try {
        const customerId = localStorage.getItem('customerId');
        if (!customerId) {
          throw new Error("User not authenticated");
        }

        // Extract actual customer ID (remove google_ prefix if present)
        const actualCustomerId = customerId.startsWith('google_') 
          ? customerId.replace('google_', '') 
          : customerId;

        const { re_password, otp, ...updateData } = editedUser;

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/customer/${actualCustomerId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(updateData)
        });

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
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.removeItem('customerId');
    localStorage.removeItem('authType');
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    try {
      return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid Time';
    }
  };

  // Get vehicle name from cache
  const getVehicleName = (vehicleId) => {
    return vehicleNames[vehicleId] || `Vehicle #${vehicleId}`;
  };

  // Pagination controls
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchBookingsPage(newPage);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPages = 5;
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxPages - 1);
    
    if (endPage - startPage + 1 < maxPages) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Debug function to check stored data
  const debugStoredData = () => {
    const token = localStorage.getItem('token');
    const customerId = localStorage.getItem('customerId');
    const authType = localStorage.getItem('authType');
    const userData = localStorage.getItem('userData');
    
    console.log('🔍 Debug Stored Data:', {
      token: token ? 'Present' : 'Missing',
      customerId,
      authType,
      userData: userData ? JSON.parse(userData) : 'Missing'
    });
  };

  // Call debug on component mount
  useEffect(() => {
    debugStoredData();
  }, []);

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
            <button 
              onClick={debugStoredData}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 text-xs"
              title="Debug Data"
            >
              🐛
            </button>
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
                <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center border-4 border-white overflow-hidden">
                  <img 
                    src={currentProfileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
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
                    user.username || user.name || 'User'
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
                    {user.vehcile_types || 'Customer'}
                  </span>
                  {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                    ID: {localStorage.getItem('customerId')}
                  </span> */}
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {pagination.totalRecords} Bookings
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
            {error && (
              <div className="text-red-600 text-sm mt-2 p-2 bg-red-50 rounded-lg">
                Error: {error}
              </div>
            )}
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
                      <p className="text-gray-900 font-medium">{user.username || user.name || 'N/A'}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">User Type</label>
                  <div className="bg-gray-50 rounded-xl px-4 py-4 border-2 border-transparent focus-within:border-blue-200">
                    <p className="text-gray-900 font-medium">{user.vehcile_types || 'Customer'}</p>
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
              </div>
            </div>

            {/* All Bookings Section */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-500/10 p-8 mt-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  My Bookings ({pagination.totalRecords} total)
                </h3>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={fetchAllUserBookings}
                    disabled={isLoadingBookings}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-2"
                  >
                    {isLoadingBookings ? 'Refreshing...' : 'Load All (100 max)'}
                  </button>
                </div>
              </div>
              
              {isLoadingBookings ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : bookings.length > 0 ? (
                <>
                  <div className="space-y-4 mb-6">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="bg-gray-50 rounded-xl p-4 border-2 border-transparent hover:border-blue-200 transition-all duration-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Car className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Booking </p>
                              <p className="text-sm text-gray-600">
                                {booking.pick_up_location} → {booking.Drop_off_location}
                              </p>
                            </div>
                          </div>
                          {/* Status tag removed as requested */}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div className="space-y-1">
                            <p className="text-gray-400 text-xs">Pickup Date & Time</p>
                            <p className="font-medium text-black">{formatDate(booking.pick_up_Date)}</p>
                            <p className="text-gray-600">{formatTime(booking.pick_up_time)}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-400 text-xs">Drop-off Date & Time</p>
                            <p className="font-medium text-black">{formatDate(booking.drop_of_Date)}</p>
                            <p className="text-gray-600">{formatTime(booking.drop_of_time)}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-400 text-xs">Duration & Payment</p>
                            <p className="font-medium text-black">{booking.total_days || '1'} day</p>
                            <p className="text-green-600 font-semibold">${booking.total_payment || '0.00'}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-gray-400 text-xs">Contact</p>
                            {/* <p className="font-medium">{getVehicleName(booking.vehicle)}</p> */}
                            <p className="text-gray-600">{booking.name}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  {pagination.totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                      <div className="text-sm text-gray-700">
                        Showing page {pagination.currentPage} of {pagination.totalPages} 
                        ({bookings.length} bookings on this page)
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePageChange(pagination.currentPage - 1)}
                          disabled={pagination.currentPage === 1}
                          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </button>
                        
                        <div className="flex gap-1">
                          {getPageNumbers().map(page => (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                pagination.currentPage === page
                                  ? 'bg-blue-600 text-white'
                                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => handlePageChange(pagination.currentPage + 1)}
                          disabled={pagination.currentPage === pagination.totalPages}
                          className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No bookings found</p>
                  <p className="text-sm text-gray-400 mt-1">Start by booking your first vehicle!</p>
                  <Link 
                    href="/availablevehicle" 
                    className="text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                  >
                    Browse vehicles
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-500/10 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/availablevehicle" className="w-full bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center gap-3">
                  <Car className="w-5 h-5" />
                  Browse Vehicles
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 w-full text-gray-600 flex hover:text-red-600 bg-red-50 rounded-xl py-3 px-4 transition-all duration-200"
                >
                  <LogOut className="w-5 h-5 mx-2" />
                  <p className="text-black">Logout</p>
                </button>
              </div>
            </div>

            {/* Security Card */}
            {/* <div className="bg-white rounded-2xl shadow-lg shadow-gray-500/10 p-6">
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
            </div> */}

            {/* Profile Images Card */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-500/10 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Profile Picture</h3>
              <div className="grid grid-cols-2 gap-3">
                {profileImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentProfileImage(image)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      currentProfileImage === image ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`Profile ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Email Section */}
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
      </div>
    </div>
  );
}