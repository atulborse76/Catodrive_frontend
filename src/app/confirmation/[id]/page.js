// app/confirmation/[id]/page.js
"use client"

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import { 
  Phone, 
  Mail, 
  Star, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  CreditCard, 
  Download,
  Plane,
  Home,
  Printer,
  MessageCircle,
  Shield,
  Award,
  Car
} from 'lucide-react'
import Link from 'next/link'

export default function ConfirmationPage() {
  const router = useRouter()
  const params = useParams()
  
  console.log("Confirmation page params:", params);
  console.log("Booking ID from URL:", params?.id); 
  
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [vehicle, setVehicle] = useState(null)
  // Add these state declarations near your other state
const [reviews, setReviews] = useState([])
const [reviewsLoading, setReviewsLoading] = useState(false)
const [averageRating, setAverageRating] = useState(0)

  // Add this near your other state declarations
const [userData, setUserData] = useState(null)

// Add this useEffect to get user data from localStorage
useEffect(() => {
  const storedUserData = localStorage.getItem('userData')
  if (storedUserData) {
    setUserData(JSON.parse(storedUserData))
  }
}, [])
 
const fetchVehicleReviews = async (vehicleId) => {
  try {
    setReviewsLoading(true)
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/reviews/`
    )
    
    // Filter reviews for this specific vehicle
    const vehicleReviews = response.data.data.filter(
      review => review.vehicle.id === parseInt(vehicleId)
    )
    
    setReviews(vehicleReviews)
    
    // Calculate average rating
    if (vehicleReviews.length > 0) {
      const avg = vehicleReviews.reduce((sum, review) => sum + review.rating, 0) / vehicleReviews.length
      setAverageRating(Math.round(avg * 10) / 10) // Round to 1 decimal place
    }
  } catch (error) {
    console.error("Error fetching reviews:", error)
  } finally {
    setReviewsLoading(false)
  }
}
  
// Update your existing useEffect for fetching booking data
useEffect(() => {
  const fetchBookingData = async () => {
    try {
      setLoading(true)
      const bookingId = params?.id || localStorage.getItem('currentBookingId')
      
      if (!bookingId) {
        throw new Error("No booking ID provided")
      }

      // Fetch booking details
      const bookingResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/booking/booking/${bookingId}/`
      )
      
      if (!bookingResponse.data?.data) {
        throw new Error("Invalid booking data structure")
      }
      
      const bookingData = bookingResponse.data.data
      setBooking(bookingData)

      // Extract vehicle ID
      const vehicleId = bookingData.vehicle?.id || bookingData.vehicle
      
      if (vehicleId) {
        try {
          const vehicleResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vehicle/vehicle/${vehicleId}/`
          )
          const vehicleData = vehicleResponse.data?.data
          setVehicle(vehicleData)
          
          // Fetch reviews for this vehicle
          await fetchVehicleReviews(vehicleId)
        } catch (vehicleError) {
          console.error('Error fetching vehicle details:', vehicleError)
        }
      }
    } catch (err) {
      console.error('Error fetching booking data:', err)
      setError(err.response?.data?.detail || 'Failed to load booking details')
    } finally {
      setLoading(false)
    }
  }

  if (params?.id) {
    fetchBookingData()
  }
}, [params?.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Your Booking</h3>
          <p className="text-gray-600">Please wait while we fetch your booking details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5 mr-2" />
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-6">
            <Car className="h-8 w-8 text-gray-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Not Found</h2>
          <p className="text-gray-600 mb-8">We couldnt find the booking you are looking for.</p>
          <Link 
            href="/" 
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5 mr-2" />
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified'
    const options = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'Not specified'
    return timeString
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-20">
      {/* Success Animation Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-green-200 rounded-full opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Confirmation Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-6 shadow-lg">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🎉 Booking Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Your adventure is all set and ready to go
          </p>
          <div className="inline-flex items-center bg-white px-6 py-3 rounded-full shadow-lg">
            <span className="text-sm font-medium text-gray-600 mr-2">Booking Reference:</span>
            <span className="font-mono font-bold text-blue-600 text-lg">#{booking.id}</span>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          {/* Vehicle Section */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-blue-100 rounded-full mr-4">
                <Car className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Your Vehicle</h2>
            </div>
            
            {vehicle ? (
              <div className="flex flex-col md:flex-row items-start md:items-center bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6">
                <div className="w-full md:w-48 h-32 rounded-xl mr-6 mb-4 md:mb-0 bg-white shadow-md overflow-hidden">
                  {vehicle.images?.[0]?.image ? (
                    <img 
                      src={`${process.env. NEXT_PUBLIC_API_BASE_URL}${vehicle.images[0].image}`}
                      alt={vehicle.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Car className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{vehicle.name}</h3>
                  <div className="flex items-center mb-3">
                    <div className="flex text-yellow-400 mr-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < 4 ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    {reviewsLoading ? (
          <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full animate-pulse">
            Loading reviews...
          </span>
        ) : (
          <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
            {averageRating.toFixed(1)} ({reviews.length} reviews)
          </span>
        )}
                  </div>
                  <div className="flex items-center text-green-600 font-medium">
                    <Shield className="w-5 h-5 mr-2" />
                    <span>Fully Insured & Protected</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-6 text-center">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Vehicle details will be updated shortly</p>
              </div>
            )}
          </div>

          {/* Booking Details Grid */}
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pickup Information */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-100 rounded-full mr-3">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Pickup Details</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Location</p>
                  <p className="text-gray-800 font-medium">{booking.pick_up_location || 'Not specified'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Date</p>
                    <div className="flex items-center text-gray-800">
                      <Calendar className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-sm">{formatDate(booking.pick_up_Date)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Time</p>
                    <div className="flex items-center text-gray-800">
                      <Clock className="w-4 h-4 mr-2 text-green-600" />
                      <span className="text-sm">{formatTime(booking.pick_up_time)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dropoff Information */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-full mr-3">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Dropoff Details</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Location</p>
                  <p className="text-gray-800 font-medium">{booking.Drop_off_location || 'Not specified'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Date</p>
                    <div className="flex items-center text-gray-800">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm">{formatDate(booking.drop_of_Date)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Time</p>
                    <div className="flex items-center text-gray-800">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      <span className="text-sm">{formatTime(booking.drop_of_time)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="px-8 pb-8">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center">
                  <Plane className="w-5 h-5 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Flight Number</p>
                    <p className="text-gray-800 font-medium">{booking.flight_number || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <CreditCard className="w-5 h-5 text-purple-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Amount</p>
                    <p className="text-2xl font-bold text-purple-600">${booking.total_payment || '0.00'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information */}
      {/* Customer Information */}
<div className="px-8 pb-8">
  <div className="flex items-center mb-6">
    <div className="p-3 bg-indigo-100 rounded-full mr-4">
      <User className="h-6 w-6 text-indigo-600" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800">Customer Information</h2>
  </div>
  
  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">Full Name</p>
        <p className="text-gray-800 font-medium">
          {userData?.name || booking.name || 'Not provided'}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">Email Address</p>
        <p className="text-gray-800 font-medium">
          {userData?.email || booking.email || 'Not provided'}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">Phone Number</p>
        <p className="text-gray-800 font-medium">
          {booking.Phone_number || 'Not provided'}
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">Address</p>
        <p className="text-gray-800 font-medium">
          {booking.Address || 'Not provided'}{booking.Town ? `, ${booking.Town}` : ''}
        </p>
      </div>
    </div>
  </div>
</div>
        </div>

        {/* Next Steps Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
          <div className="flex items-center mb-6">
            <div className="p-3 bg-yellow-100 rounded-full mr-4">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">What Happens Next?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 font-bold text-xl">1</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Confirmation Email</h3>
              <p className="text-gray-600 text-sm">You will receive a detailed confirmation email within 5 minutes</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-xl">2</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Team Contact</h3>
              <p className="text-gray-600 text-sm">Our team will contact you to confirm pickup arrangements</p>
            </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 font-bold text-xl">3</span>
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Pickup Day</h3>
              <p className="text-gray-600 text-sm">Bring your drivers license and be ready for your adventure!</p>
            </div>
          </div>
        </div>

        {/* Contact & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-green-100 rounded-full mr-4">
                <MessageCircle className="h-6 w-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Need Help?</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:shadow-md transition-shadow">
                <Phone className="h-6 w-6 text-green-600 mr-4" />
                <div>
                  <p className="font-medium text-gray-800">Call Us</p>
                  <p className="text-green-600 font-bold">+1 (234) 567-8900</p>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:shadow-md transition-shadow">
                <Mail className="h-6 w-6 text-blue-600 mr-4" />
                <div>
                  <p className="font-medium text-gray-800">Email Support</p>
                  <p className="text-blue-600 font-bold">support@carrental.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            
            <div className="space-y-4">
              <Link
                href="/"
                className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
              
              <button
                onClick={() => window.print()}
                className="w-full inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Printer className="w-5 h-5 mr-2" />
                Print Confirmation
              </button>
              
             
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-12 p-6 bg-white rounded-2xl shadow-lg">
          <p className="text-gray-600 mb-2">
            Thank you for choosing our car rental service! 
          </p>
          <p className="text-sm text-gray-500">
            We are committed to making your journey memorable and hassle-free. 
            Safe travels! 🌟
          </p>
        </div>
      </div>
    </div>
  )
}