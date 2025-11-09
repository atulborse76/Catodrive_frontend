"use client"

import React, { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Phone, Mail, Star } from "lucide-react"
import Modal from 'react-modal'
import { useSession } from "next-auth/react" 
import LoginModal from '../components/loginmodal'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Add these styles for the modal
const customStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    top: 'auto',
    left: 'auto',
    right: 'auto',
    bottom: 'auto',
    margin: '0 auto',
    border: 'none',
    borderRadius: '0.5rem',
    padding: '0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    maxHeight: '90vh',
    overflow: 'auto',
  }
};

// City to locations mapping
const cityLocations = {
  "Dallas": {
    pickup: [
      "Dallas/Fort Worth International Airport (DFW)",
      "Dallas Love Field (DAL)"
    ],
    dropoff: [
      "Dallas/Fort Worth International Airport (DFW)",
      "Dallas Love Field (DAL)",
      "Addison Airport (ADS)",
      "Dallas Executive Airport (RBD)",
      "Arlington Municipal Airport (GKY)",
      "Grand Prairie Municipal Airport (GPM)",
      "Lancaster Regional Airport (LNC)",
      "Mesquite Metro Airport (HQZ)",
      "Fort Worth Alliance Airport (AFW)",
      "Fort Worth Meacham International Airport (FTW)",
      "Denton Enterprise Airport (DTO)",
      "Mid‑Way Regional Airport (JWY)",
      "Caddo Mills Municipal Airport (7F3)",
      "Commerce Municipal Airport (2F7)",
      "Ennis Municipal Airport (F41)",
      "Ferris Red Oak Municipal Heliport (12T)",
      "Garland/DFW Heloplex (T57)",
      "DeSoto Heliport (73T)",
      "Dallas CBD Vertiport (JDB)",
      "Majors Airport – Greenville (GVT)",
      "McKinney National Airport (TKI)",
      "Northwest Regional Airport (52F)",
      "Parker County Airport (WEA)",
      "Rhome Meadows Airport (T76)",
      "Bourland Field (50F)",
      "Air Park–Dallas (F69)"
    ]
  },
};

export default function CarRentalForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [vehicle, setVehicle] = useState(null)
  const [bookingId, setBookingId] = useState(null)
  const [amount, setAmount] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState("")
  const [isDocUploadOpen, setIsDocUploadOpen] = useState(false)
  const [isThankYouOpen, setIsThankYouOpen] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState(null)
  const [availableLocations, setAvailableLocations] = useState([])
  const [reviews, setReviews] = useState([])
  const [customerId, setCustomerId] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('customerId') : null
  )
  
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [pendingBookingData, setPendingBookingData] = useState(null)
  const [isFetchingLocation, setIsFetchingLocation] = useState(false)
  const { data: session } = useSession()

  // Payment states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentIntent, setPaymentIntent] = useState(null)
  const [showPaymentProcessing, setShowPaymentProcessing] = useState(false)

  useEffect(() => {
    Modal.setAppElement('#root')
  }, [])

  // Form data states
  const [billingData, setBillingData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipcode: ""
  })

  const [rentalData, setRentalData] = useState({
    rentalType: "pickup",
    pickupLocation: "",
    pickupDate: "",
    pickupTime: "",
    dropoffLocation: "",
    dropoffDate: "",
    dropoffTime: "",
    flightNumber: "",
  })

  const [paymentData, setPaymentData] = useState({
    method: "credit-card",
    cardNumber: "",
    expiryDate: "",
    cardHolder: "",
    cvc: "",
    paymentId: null,
    paymentStatus: "pending"
  })

  // UI states
  const [agreements, setAgreements] = useState({
    marketing: false,
    terms: false
  })

  const [availablePickupLocations, setAvailablePickupLocations] = useState([])
  const [availableDropoffLocations, setAvailableDropoffLocations] = useState([])

  // Location fetching
  useEffect(() => {
    if (currentStep === 1 && navigator.geolocation) {
      setIsFetchingLocation(true)
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDBVacETwtRCfrK9FJo0ee3gUQA-ImyCPc`
            )
            
            if (response.data.results.length > 0) {
              const result = response.data.results[0]
              const addressComponents = result.address_components
              
              const streetNumber = addressComponents.find(c => c.types.includes('street_number'))?.long_name || ''
              const route = addressComponents.find(c => c.types.includes('route'))?.long_name || ''
              const city = addressComponents.find(c => c.types.includes('locality'))?.long_name || ''
              const state = addressComponents.find(c => c.types.includes('administrative_area_level_1'))?.long_name || ''
              const zipcode = addressComponents.find(c => c.types.includes('postal_code'))?.long_name || ''
              
              let streetAddress = ''
              if (streetNumber && route) {
                streetAddress = `${streetNumber} ${route}`
              } else if (route) {
                streetAddress = route
              }
              
              setBillingData(prev => ({
                ...prev,
                address: streetAddress,
                city,
                state,
                zipcode
              }))
            }
          } catch (error) {
            console.error("Error fetching location data:", error)
          } finally {
            setIsFetchingLocation(false)
          }
        },
        (error) => {
          console.error("Geolocation error:", error)
          setIsFetchingLocation(false)
        }
      )
    }
  }, [currentStep])

  const [loginStateUpdated, setLoginStateUpdated] = useState(false);
  const handleLoginSuccess = async () => {
    const storedCustomerId = localStorage.getItem('customerId');
    const storedUserData = localStorage.getItem('userData');
    
    setCustomerId(storedCustomerId);
    setLoginStateUpdated(prev => !prev);

    if (pendingBookingData) {
      setBillingData(pendingBookingData.billingData);
      setRentalData(pendingBookingData.rentalData);
      setVehicle(pendingBookingData.vehicle);
      setCurrentStep(pendingBookingData.currentStep || 1);
      setPendingBookingData(null);
    }
    
    setShowLoginModal(false);
  };

  // Update available locations when city changes
  useEffect(() => {
    if (rentalData.city && cityLocations[rentalData.city]) {
      setAvailablePickupLocations(cityLocations[rentalData.city].pickup)
      setAvailableDropoffLocations(cityLocations[rentalData.city].dropoff)
    } else {
      setAvailablePickupLocations([])
      setAvailableDropoffLocations([])
    }
  }, [rentalData.city])

  useEffect(() => {
    const storedVehicle = localStorage.getItem("vehicle")
    if (storedVehicle) {
      setVehicle(JSON.parse(storedVehicle))
    }

    if (session?.user?.id) {
      setCustomerId(session.user.id)
    } else {
      const storedCustomerId = localStorage.getItem('customerId')
      if (storedCustomerId) {
        setCustomerId(storedCustomerId)
      }
    }
  }, [session])

  // Handle form field changes
  const handleBillingChange = (field, value) => {
    setBillingData(prev => ({ ...prev, [field]: value }))
  }

  const handleRentalChange = (field, value) => {
    setRentalData(prev => ({ ...prev, [field]: value }))
  }

  const handlePaymentChange = (field, value) => {
    setPaymentData(prev => ({ ...prev, [field]: value }))
  }

  // Step validation functions
  const validateStep1 = () => {
    return billingData.name && billingData.email && billingData.phone && billingData.address
  }

  const validateStep2 = () => {
    return rentalData.city && rentalData.pickupLocation && rentalData.pickupDate && rentalData.pickupTime
  }

  const validateStep3 = () => {
    if (paymentData.method === "credit-card") {
      return paymentData.cardNumber && paymentData.expiryDate && paymentData.cardHolder && paymentData.cvc
    }
    return true
  }

  // Payment Functions
  const createTemporaryBooking = async () => {
    try {
      const formData = new FormData();
      formData.append("customer", customerId.toString());
      formData.append("vehicle", vehicle?.id || "");
      formData.append("total_payment", calculateTotalPrice().toString());
      formData.append("name", billingData.name);
      formData.append("email", billingData.email);
      formData.append("Phone_number", billingData.phone);
      formData.append("Address", billingData.address);
      formData.append("Town", billingData.city);
      formData.append("pick_up_location", rentalData.pickupLocation);
      formData.append("pick_up_Date", rentalData.pickupDate);
      formData.append("pick_up_time", rentalData.pickupTime);
      formData.append("Drop_off_location", rentalData.dropoffLocation);
      formData.append("drop_of_Date", rentalData.dropoffDate);
      formData.append("drop_of_time", rentalData.dropoffTime);
      formData.append("flight_number", rentalData.flightNumber);
      formData.append("status", "pending");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/booking/booking/`, 
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      console.log('[Booking] Temporary booking response:', response.data);
      
      if (response.data.status === "success" && response.data.data?.id) {
        return {
          success: true,
          bookingId: response.data.data.id
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Booking creation failed"
        };
      }
    } catch (error) {
      console.error("[Booking] Error creating temporary booking:", error);
      return {
        success: false,
        message: error.response?.data?.detail || "Booking creation error"
      };
    }
  };

  const createPaymentIntent = async (bookingId) => {
    try {
      console.log('[Payment] Creating payment intent for booking:', bookingId);
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/payment/create/`,
        {
          booking_id: bookingId.toString()
        }
      );

      console.log('[Payment] Raw response:', response);
      
      let paymentData;
      
      if (response.data.payment_id) {
        paymentData = response.data;
      } else if (response.data.data && response.data.data.payment_id) {
        paymentData = response.data.data;
      } else if (response.data.data && typeof response.data.data === 'object') {
        paymentData = response.data.data;
      } else {
        paymentData = response.data;
      }

      console.log('[Payment] Extracted payment data:', paymentData);
      
      return paymentData;
      
    } catch (error) {
      console.error("[Payment] Error creating payment intent:", error);
      throw new Error(error.response?.data?.message || error.message || "Failed to create payment intent");
    }
  };

  const processCreditCardPayment = async (paymentIntentId) => {
    try {
      console.log('[Payment] Processing credit card payment for:', paymentIntentId);
      
      if (!paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cardHolder || !paymentData.cvc) {
        throw new Error("Please fill all credit card details");
      }

      await new Promise(resolve => setTimeout(resolve, 3000));
      
      console.log('[Payment] Payment simulation completed successfully');
      return {
        success: true,
        paymentId: paymentIntentId,
        status: 'completed'
      };
      
    } catch (error) {
      console.error("[Payment] Credit card processing error:", error);
      throw error;
    }
  };

  const processPayPalPayment = async (paymentIntentId) => {
    try {
      console.log('[Payment] Processing PayPal payment for:', paymentIntentId);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        paymentId: paymentIntentId,
        status: 'completed'
      };
      
    } catch (error) {
      console.error("[Payment] PayPal processing error:", error);
      throw error;
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/booking/booking/${bookingId}/`,
        {
          status: status
        }
      );

      console.log(`[Booking] Status updated to ${status}:`, response.data);
      return response.data;
    } catch (error) {
      console.error("[Booking] Error updating status:", error);
      throw error;
    }
  };

  const cleanupTemporaryBooking = async (bookingId) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/booking/booking/${bookingId}/`
      );
      console.log("Cleaned up temporary booking:", bookingId);
    } catch (error) {
      console.error("Failed to cleanup temporary booking:", error);
    }
  };

  const handlePaymentProcessing = async () => {
    console.log('[Payment] Starting payment processing');
    setIsProcessingPayment(true);
    setShowPaymentProcessing(true);
    setSubmitMessage("");

    let temporaryBookingId = null;

    try {
      console.log('[Payment] Step 1 - Creating temporary booking');
      const bookingResponse = await createTemporaryBooking();
      
      if (!bookingResponse.success) {
        throw new Error(bookingResponse.message || "Failed to create booking");
      }

      temporaryBookingId = bookingResponse.bookingId;
      setBookingId(temporaryBookingId);
      console.log('[Payment] Temporary booking created:', temporaryBookingId);

      console.log('[Payment] Step 2 - Creating payment intent');
      const paymentIntentData = await createPaymentIntent(temporaryBookingId);
      setPaymentIntent(paymentIntentData);
      console.log('[Payment] Payment intent created:', paymentIntentData);

      console.log('[Payment] Step 3 - Processing payment method:', paymentData.method);
      let paymentResult;

      if (paymentData.method === "credit-card") {
        paymentResult = await processCreditCardPayment(
          paymentIntentData.payment_id || paymentIntentData.id
        );
      } else if (paymentData.method === "paypal") {
        paymentResult = await processPayPalPayment(
          paymentIntentData.payment_id || paymentIntentData.id
        );
      }

      console.log('[Payment] Payment result:', paymentResult);

      if (paymentResult.success) {
        console.log('[Payment] Step 4 - Updating booking status to approved');
        await updateBookingStatus(temporaryBookingId, 'approved');
        
        setPaymentData(prev => ({
          ...prev,
          paymentId: paymentResult.paymentId,
          paymentStatus: 'completed'
        }));

        setCurrentStep(4);
        setSubmitMessage("Payment successful! Please complete your rental.");
        console.log('[Payment] Payment completed successfully');
        
      } else {
        throw new Error("Payment processing failed");
      }

    } catch (error) {
      console.error("[Payment] Payment processing error:", error);
      setSubmitMessage(`Payment failed: ${error.message}`);
      
      if (temporaryBookingId) {
        console.log('[Payment] Cleaning up temporary booking:', temporaryBookingId);
        await cleanupTemporaryBooking(temporaryBookingId);
        setBookingId(null);
      }
    } finally {
      setIsProcessingPayment(false);
      setShowPaymentProcessing(false);
    }
  };

  const handleSubmit = async () => {
    if (!customerId) {
      setPendingBookingData({
        billingData,
        rentalData,
        vehicle,
        currentStep
      });
      setShowLoginModal(true);
      return;
    }

    if (currentStep === 1 && !validateStep1()) {
      setSubmitMessage("Please fill all billing information");
      return;
    }

    if (currentStep === 2 && !validateStep2()) {
      setSubmitMessage("Please fill all rental information");
      return;
    }

    if (currentStep === 2) {
      console.log('[Submit] Step 2 - Checking availability before proceeding');
      const isAvailable = await checkVehicleAvailability();
      console.log('[Submit] Availability result:', isAvailable);
      
      if (!isAvailable) {
        return;
      }
      
      setCurrentStep(3);
    } else if (currentStep === 3) {
      await handlePaymentProcessing();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const checkVehicleAvailability = async () => {
    try {
      console.log('[Availability Check] Checking for vehicle:', vehicle?.id);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/booking/booking/`,
        {
          params: {
            vehicle: vehicle?.id,
            pick_up_Date: rentalData.pickupDate,
            drop_of_Date: rentalData.dropoffDate,
            status: 'approved'
          }
        }
      );

      console.log('[Availability Check] Response:', response.data);

      if (response.data.data && response.data.data.length > 0) {
        const conflictingBookings = response.data.data.filter(b => 
          b.vehicle.id === vehicle?.id && 
          b.status === 'approved'
        );
        
        console.log('[Availability Check] Conflicting bookings:', conflictingBookings);

        if (conflictingBookings.length > 0) {
          setSubmitMessage("This vehicle is already booked for the selected dates.");
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("[Availability Check] Error:", error);
      return true;
    }
  };

  const [bookedDates, setBookedDates] = useState([]);

  const fetchBookedDates = async (vehicleId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/booking/booking/`,
        {
          params: {
            vehicle: vehicleId,
            status: 'approved'
          }
        }
      );
      
      if (response.data.data) {
        const dates = response.data.data.flatMap(booking => {
          if (booking.status !== 'approved') {
            return [];
          }
          
          const start = new Date(booking.pick_up_Date);
          const end = new Date(booking.drop_of_Date);
          const datesInRange = [];
          
          for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
            datesInRange.push(new Date(date).toISOString().split('T')[0]);
          }
          return datesInRange;
        });
        
        return [...new Set(dates)];
      }
      return [];
    } catch (error) {
      console.error("Error fetching booked dates:", error);
      return [];
    }
  };

  useEffect(() => {
    if (vehicle?.id) {
      fetchBookedDates(vehicle.id);
    }
  }, [vehicle?.id]);

  const CustomDateInput = React.memo(({ value, onChange, minDate, vehicleId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [hoveredDate, setHoveredDate] = useState(null);
    const [bookedDates, setBookedDates] = useState([]);
    const [loadingDates, setLoadingDates] = useState(false);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen && vehicleId) {
          const fetchBookedDates = async () => {
            setLoadingDates(true);
            try {
              const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/booking/booking/`,
                {
                  params: {
                    vehicle: vehicleId,
                    status: 'approved'
                  }
                }
              );

              console.log('Fetched bookings:', response.data.data);

              if (response.data?.data) {
                const dates = response.data.data.flatMap(booking => {
                  if (booking.vehicle?.id !== parseInt(vehicleId) || 
                      booking.status !== 'approved') {
                    return [];
                  }
                  
                  const start = new Date(booking.pick_up_Date);
                  const end = new Date(booking.drop_of_Date);
                  const datesInRange = [];
                  
                  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
                    const dateStr = date.toISOString().split('T')[0];
                    datesInRange.push(dateStr);
                  }
                  return datesInRange;
                });

                const uniqueDates = [...new Set(dates)];
                console.log('Blocked dates (approved bookings only):', uniqueDates);
                setBookedDates(uniqueDates);
              }
            } catch (error) {
              console.error('Error fetching booked dates:', error);
            } finally {
              setLoadingDates(false);
            }
          };

          fetchBookedDates();
        }
      }, [isOpen, vehicleId]);

    const isDateBooked = (date) => {
      if (!date) return false;
      const dateStr = date.toISOString().split('T')[0];
      return bookedDates.includes(dateStr);
    };

    const renderDayContents = (day, date) => {
      const booked = isDateBooked(date);
      return (
        <div 
          className={`relative w-full h-full flex items-center justify-center
            ${booked ? 'text-gray-400 line-through' : 'text-gray-900'}
            ${booked ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
          onMouseEnter={() => setHoveredDate(date.toISOString().split('T')[0])}
          onMouseLeave={() => setHoveredDate(null)}
        >
          {day}
          {booked && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                className="w-4 h-4 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
            </div>
          )}
        </div>
      );
    };

    const handleDateChange = (date) => {
      if (!isDateBooked(date)) {
        const dateStr = date.toISOString().split('T')[0];
        onChange({ target: { value: dateStr } });
        setIsOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target) ) {
        setIsOpen(false);
      }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <div className="relative" ref={wrapperRef}>
        <input
          type="text"
          ref={inputRef}
          value={value}
          onChange={() => {}}
          onClick={() => setIsOpen(true)}
          className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          placeholder="Select date"
          readOnly
        />
        
        {isOpen && (
          <div className="absolute z-50 mt-1 bg-white shadow-lg rounded-lg p-3 border border-gray-200">
            {loadingDates ? (
              <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="text-sm mb-2 px-2">
                  {bookedDates.length > 0 ? (
                    <div className="text-red-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Red dates are already booked
                    </div>
                  ) : (
                    <div className="text-green-500 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      All dates available for booking
                    </div>
                  )}
                </div>
                
                <DatePicker
                  selected={value ? new Date(value) : null}
                  onChange={handleDateChange}
                  minDate={new Date(minDate)}
                  filterDate={(date) => !isDateBooked(date)}
                  inline
                  renderDayContents={renderDayContents}
                  dayClassName={(date) => {
                    return isDateBooked(date) ? 
                      'bg-red-50 hover:bg-red-100 cursor-not-allowed' : 
                      'hover:bg-blue-50';
                  }}
                  calendarClassName="border-0"
                  disabledKeyboardNavigation
                  excludeDates={bookedDates.map(date => new Date(date))}
                />
              </>
            )}
            
            {hoveredDate && bookedDates.includes(hoveredDate) && (
              <div className="absolute z-50 bg-gray-900 text-white text-xs rounded py-1 px-2 bottom-full mb-2 left-1/2 transform -translate-x-1/2">
                Vehicle already booked for this date
                <div className="absolute top-full left-1/2 w-2 h-2 bg-gray-900 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  });

  CustomDateInput.displayName = "CustomDateInput";

  const goToPreviousStep = () => {
    setCurrentStep(Math.max(1, currentStep - 1))
  }

  const completeRental = () => {
    setIsDocUploadOpen(true)
  }

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (bookingId && currentStep < 4) {
        console.log("User leaving with incomplete booking:", bookingId);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [bookingId, currentStep]);

const handleDocUpload = async () => {
  if (!uploadedDocs || uploadedDocs.length === 0) {
    setSubmitMessage("Please upload at least one document");
    return;
  }

  if (!customerId || !bookingId || !billingData.email) {
    setSubmitMessage("Missing booking information. Please restart the process.");
    return;
  }

  setIsSubmitting(true);
  setSubmitMessage("");
  
  try {
    console.log('[Document Upload] Starting document upload process');
    console.log('[Document Upload] Booking ID:', bookingId);
    console.log('[Document Upload] Customer ID:', customerId);
    console.log('[Document Upload] Files:', uploadedDocs);

    const formData = new FormData();
    formData.append("customer", customerId.toString());
    formData.append("booking", bookingId.toString());
    formData.append("customer_email", billingData.email);
    formData.append("payment", paymentData.paymentId || bookingId.toString());
    
    // Append each file individually
    Array.from(uploadedDocs).forEach((file, index) => {
      console.log(`[Document Upload] Appending file ${index + 1}:`, file.name, file.type, file.size);
      formData.append("licence_images", file, file.name);
    });

    // Log FormData contents for debugging
    for (let pair of formData.entries()) {
      console.log(`[FormData] ${pair[0]}:`, pair[1]);
    }

    console.log('[Document Upload] Sending request to API...');
    
    const uploadResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/licence/licence/`, 
      formData,
      { 
        headers: { 
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    console.log("Document upload successful:", uploadResponse.data);
    
    // Show success message and close modal
    setIsDocUploadOpen(false);
    setIsThankYouOpen(true);
    setSubmitMessage("Documents uploaded successfully! Your booking is now complete.");
    
  } catch (error) {
    console.error("Document upload failed:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    });
    
    let errorMessage = "Document upload failed. Please try again.";
    
    if (error.code === 'ERR_NETWORK') {
      errorMessage = "Network error. Please check your internet connection and try again.";
    } else if (error.response?.status === 413) {
      errorMessage = "File too large. Please upload smaller files.";
    } else if (error.response?.status === 415) {
      errorMessage = "Unsupported file type. Please upload JPG, PNG, or PDF files.";
    } else if (error.response?.data?.message) {
      errorMessage = `Upload failed: ${error.response.data.message}`;
    } else if (error.response?.data?.detail) {
      errorMessage = `Upload failed: ${error.response.data.detail}`;
    }
    
    setSubmitMessage(errorMessage);
  } finally {
    setIsSubmitting(false);
  }
};

  useEffect(() => {
    const incompleteBooking = localStorage.getItem('incompleteBooking');
    if (incompleteBooking) {
      try {
        const { bookingId, timestamp } = JSON.parse(incompleteBooking);
        const hoursSince = (Date.now() - timestamp) / (1000 * 60 * 60);
        
        if (hoursSince > 1) {
          cleanupTemporaryBooking(bookingId);
          localStorage.removeItem('incompleteBooking');
        }
      } catch (error) {
        localStorage.removeItem('incompleteBooking');
      }
    }
  }, []);

  const closeThankYouModal = () => {
    setIsThankYouOpen(false)
    console.log("Redirecting to confirmation with booking ID:", bookingId)
    router.push(`/confirmation/${bookingId}`)
  }

  const isFutureDate = (dateString) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const selectedDate = new Date(dateString)
    return selectedDate >= today
  }

  const calculateRentalDays = () => {
    if (!rentalData.pickupDate || !rentalData.dropoffDate) return 0
    
    const startDate = new Date(rentalData.pickupDate)
    const endDate = new Date(rentalData.dropoffDate)
    const diffTime = endDate - startDate
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(1, diffDays)
  }

  const calculateTotalPrice = () => {
    if (!vehicle?.price) return 0
    const rentalDays = calculateRentalDays()
    return vehicle.price * rentalDays
  }

  const isFutureDateTime = (dateString, timeString) => {
    const now = new Date()
    const selectedDate = new Date(dateString)
    
    if (selectedDate.toDateString() === now.toDateString()) {
      const [hours, minutes] = timeString.split(':').map(Number)
      const selectedTime = new Date()
      selectedTime.setHours(hours, minutes, 0, 0)
      return selectedTime >= now
    }
    
    return isFutureDate(dateString)
  }

  useEffect(() => {
    const fetchData = async () => {
      const storedVehicle = localStorage.getItem("vehicle");
      if (storedVehicle) {
        const vehicleData = JSON.parse(storedVehicle);
        setVehicle(vehicleData);
        
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/reviews/`
          );
          
          const vehicleReviews = response.data.data.filter(
            review => review.vehicle.id === vehicleData.id
          );
          
          setReviews(vehicleReviews);
        } catch (error) {
          console.error("Error fetching reviews:", error);
          setReviews([]);
        }
      }
    };

    fetchData();
  }, []);

  const StarRating = ({ rating, interactive = false, onRate = () => {} }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={interactive ? () => onRate(star) : undefined}
            className={interactive ? "focus:outline-none" : ""}
            disabled={!interactive}
          >
            <svg
              className={`w-4 h-4 ${star <= rating ? "text-orange-400 fill-current" : "text-gray-300"}`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24" id="root">
      <div className="max-w-8xl p-4 md:p-12 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Indicator */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                {[1, 2, 3, 4].map(step => (
                  <div key={step} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center 
                      ${currentStep >= step ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                      {step}
                    </div>
                    <span className="text-xs mt-1 text-gray-500">
                      {step === 1 ? "Billing" : step === 2 ? "Rental" : step === 3 ? "Payment" : "Confirm"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 1: Billing Info */}
            {currentStep === 1 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Billing Info</h2>
                    <p className="text-gray-500 text-sm">Please enter your billing information</p>
                  </div>
                  <span className="text-gray-400 text-sm">Step 1 of 4</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={billingData.name}
                      onChange={(e) => handleBillingChange("name", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="Your email"
                      value={billingData.email}
                      onChange={(e) => handleBillingChange("email", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border text-black border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={billingData.phone}
                      onChange={(e) => handleBillingChange("phone", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border text-black border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      placeholder="Address"
                      value={billingData.address}
                      onChange={(e) => handleBillingChange("address", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border text-black border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={billingData.city}
                      onChange={(e) => handleBillingChange("city", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isFetchingLocation}
                    />
                    {isFetchingLocation && (
                      <p className="text-xs text-gray-500 mt-1">Detecting your location...</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      placeholder="State"
                      value={billingData.state}
                      onChange={(e) => handleBillingChange("state", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isFetchingLocation}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                    <input
                      type="text"
                      placeholder="Zip code"
                      value={billingData.zipcode}
                      onChange={(e) => handleBillingChange("zipcode", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isFetchingLocation}
                    />
                  </div>
                </div>
              </div>
            )}

            <LoginModal
              show={showLoginModal}
              onClose={() => setShowLoginModal(false)}
              onLoginSuccess={handleLoginSuccess}
            />

            {/* Step 2: Rental Info */}
            {currentStep === 2 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Rental Info</h2>
                    <p className="text-gray-500 text-sm">Please select your rental details</p>
                  </div>
                  <span className="text-gray-400 text-sm">Step 2 of 4</span>
                </div>

                {/* City Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <select
                    value={rentalData.city}
                    onChange={(e) => handleRentalChange("city", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a city</option>
                    {Object.keys(cityLocations).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  {/* Pickup Section */}
                  {rentalData.city && (
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <label className="text-lg font-bold text-gray-900">Pick - Up</label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Pickup Location */}
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                          <select
                            value={rentalData.pickupLocation}
                            onChange={(e) => handleRentalChange("pickupLocation", e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select pickup location</option>
                            {availablePickupLocations.map(location => (
                              <option key={location} value={location}>{location}</option>
                            ))}
                          </select>
                        </div>
                        
                        {/* Pickup Date */}
                       <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
              <CustomDateInput
                value={rentalData.pickupDate}
                onChange={(e) => {
                  if (isFutureDate(e.target.value)) {
                    handleRentalChange("pickupDate", e.target.value);
                    if (rentalData.pickupTime) {
                      const pickupDateTime = new Date(`${e.target.value}T${rentalData.pickupTime}`);
                      const minDropoffDate = new Date(pickupDateTime.getTime() + 24 * 60 * 60 * 1000);
                      const formattedMinDate = minDropoffDate.toISOString().split('T')[0];
                      
                      if (!rentalData.dropoffDate || rentalData.dropoffDate < formattedMinDate) {
                        handleRentalChange("dropoffDate", formattedMinDate);
                      }
                    }
                  }
                }}
                minDate={new Date().toISOString().split('T')[0]}
                vehicleId={vehicle?.id}
              />
              {rentalData.pickupDate && !isFutureDate(rentalData.pickupDate) && (
                <p className="text-xs text-red-500 mt-1">Please select a future date</p>
              )}
            </div>

                        {/* Pickup Time */}
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Time</label>
                          <input
                            type="time"
                            value={rentalData.pickupTime}
                            onChange={(e) => {
                              if (rentalData.pickupDate) {
                                if (isFutureDateTime(rentalData.pickupDate, e.target.value)) {
                                  handleRentalChange("pickupTime", e.target.value)
                                  
                                  const pickupDateTime = new Date(`${rentalData.pickupDate}T${e.target.value}`)
                                  const minDropoffDateTime = new Date(pickupDateTime.getTime() + 3 * 60 * 60 * 1000)
                                  const formattedMinDate = minDropoffDateTime.toISOString().split('T')[0]
                                  const formattedMinTime = minDropoffDateTime.toTimeString().substring(0, 5)
                                  
                                  if (!rentalData.dropoffDate || 
                                      rentalData.dropoffDate < formattedMinDate || 
                                      (rentalData.dropoffDate === formattedMinDate && rentalData.dropoffTime < formattedMinTime)) {
                                    handleRentalChange("dropoffDate", formattedMinDate)
                                    handleRentalChange("dropoffTime", formattedMinTime)
                                  }
                                }
                              } else {
                                handleRentalChange("pickupTime", e.target.value)
                              }
                            }}
                            className="w-full px-4 py-3 bg-gray-50 border text-black border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {rentalData.pickupTime && rentalData.pickupDate && 
                          !isFutureDateTime(rentalData.pickupDate, rentalData.pickupTime) && (
                            <p className="text-xs text-red-500 mt-1">Please select a future time</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dropoff Section */}
                  {rentalData.pickupLocation && rentalData.pickupDate && rentalData.pickupTime && (
                    <div className="mb-8 fade-in">
                      <div className="flex items-center mb-4">
                        <label className="text-lg font-bold text-gray-900">Drop - Off</label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Dropoff Location */}
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                          <select
                            value={rentalData.dropoffLocation}
                            onChange={(e) => handleRentalChange("dropoffLocation", e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select dropoff location</option>
                            {availableDropoffLocations.map(location => (
                              <option key={location} value={location}>{location}</option>
                            ))}
                          </select>
                        </div>
                        
                        {/* Dropoff Date */}
                       <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Date</label>
              <CustomDateInput
                value={rentalData.dropoffDate}
                onChange={(e) => {
                  const pickupDate = new Date(rentalData.pickupDate);
                  const selectedDropoffDate = new Date(e.target.value);
                  
                  if (selectedDropoffDate >= pickupDate) {
                    handleRentalChange("dropoffDate", e.target.value);
                    
                    if (selectedDropoffDate.toDateString() === pickupDate.toDateString() && rentalData.dropoffTime) {
                      const pickupTime = new Date(`${rentalData.pickupDate}T${rentalData.pickupTime}`);
                      const dropoffTime = new Date(`${e.target.value}T${rentalData.dropoffTime}`);
                      
                      if (dropoffTime <= pickupTime) {
                        handleRentalChange("dropoffTime", "");
                      }
                    }
                  }
                }}
                minDate={rentalData.pickupDate || new Date().toISOString().split('T')[0]}
                vehicleId={vehicle?.id}
              />
              {rentalData.dropoffDate && new Date(rentalData.dropoffDate) < new Date(rentalData.pickupDate) && (
                <p className="text-xs text-red-500 mt-1">
                  Dropoff date cannot be before pickup date
                </p>
              )}
            </div>

                        {/* Dropoff Time */}
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-2">Time</label>
                          <input
                            type="time"
                            value={rentalData.dropoffTime}
                            onChange={(e) => {
                              if (!rentalData.dropoffDate) {
                                handleRentalChange("dropoffTime", e.target.value);
                                return;
                              }
                              
                              const isSameDay = rentalData.dropoffDate === rentalData.pickupDate;
                              const pickupDateTime = new Date(`${rentalData.pickupDate}T${rentalData.pickupTime}`);
                              const selectedDropoffDateTime = new Date(`${rentalData.dropoffDate}T${e.target.value}`);
                              
                              if (!isSameDay || selectedDropoffDateTime > pickupDateTime) {
                                handleRentalChange("dropoffTime", e.target.value);
                              }
                            }}
                            min={
                              rentalData.dropoffDate === rentalData.pickupDate 
                                ? rentalData.pickupTime 
                                : undefined
                            }
                            className="w-full px-4 py-3 bg-gray-50 text-black border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          {rentalData.dropoffTime && 
                           rentalData.dropoffDate === rentalData.pickupDate && 
                           new Date(`${rentalData.dropoffDate}T${rentalData.dropoffTime}`) <= 
                           new Date(`${rentalData.pickupDate}T${rentalData.pickupTime}`) && (
                            <p className="text-xs text-red-500 mt-1">
                              Dropoff time must be after pickup time for same-day returns
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Flight Number (Optional) */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Flight Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="Enter your flight number"
                    value={rentalData.flightNumber}
                    onChange={(e) => handleRentalChange("flightNumber", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border text-black border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Payment Method */}
            {currentStep === 3 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
                    <p className="text-gray-500 text-sm">Complete your payment details</p>
                  </div>
                  <span className="text-gray-400 text-sm">Step 3 of 4</span>
                </div>

                <div className="mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="credit-card"
                          name="payment-method"
                          value="credit-card"
                          checked={paymentData.method === "credit-card"}
                          onChange={() => handlePaymentChange("method", "credit-card")}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="credit-card" className="ml-2 text-sm font-medium text-gray-900">
                          Credit Card
                        </label>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                          VISA
                        </div>
                        <div className="w-8 h-5 bg-gradient-to-r from-red-500 to-yellow-500 rounded text-white text-xs flex items-center justify-center font-bold">
                          MC
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="paypal"
                          name="payment-method"
                          value="paypal"
                          checked={paymentData.method === "paypal"}
                          onChange={() => handlePaymentChange("method", "paypal")}
                          className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="paypal" className="ml-2 text-sm font-medium text-gray-900">
                          PayPal
                        </label>
                      </div>
                      <div className="w-8 h-5 bg-blue-900 rounded text-white text-xs flex items-center justify-center font-bold">
                        PP
                      </div>
                    </div>
                  </div>

                  {paymentData.method === "credit-card" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 mt-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          value={paymentData.cardNumber}
                          onChange={(e) => handlePaymentChange("cardNumber", e.target.value)}
                          className="w-full px-4 py-3 text-black bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          maxLength={16}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={paymentData.expiryDate}
                          onChange={(e) => handlePaymentChange("expiryDate", e.target.value)}
                          className="w-full px-4 py-3 text-black bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Holder</label>
                        <input
                          type="text"
                          placeholder="Name on card"
                          value={paymentData.cardHolder}
                          onChange={(e) => handlePaymentChange("cardHolder", e.target.value)}
                          className="w-full px-4 py-3 text-black bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                        <input
                          type="text"
                          placeholder="CVC"
                          value={paymentData.cvc}
                          onChange={(e) => handlePaymentChange("cvc", e.target.value)}
                          className="w-full px-4 py-3 text-black bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          maxLength={4}
                        />
                      </div>
                    </div>
                  )}

                  {paymentData.method === "paypal" && (
                    <div className="pl-6 mt-4 p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        You will be redirected to PayPal to complete your payment after clicking "Make Payment"
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <label className="font-medium text-black">Amount to Pay:</label>
                    <span className="text-lg text-black font-bold">${calculateTotalPrice()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Confirmation</h2>
                    <p className="text-gray-500 text-sm">Review and confirm your rental</p>
                  </div>
                  <span className="text-gray-400 text-sm">Step 4 of 4</span>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="marketing"
                      checked={agreements.marketing}
                      onChange={(e) => setAgreements(prev => ({ ...prev, marketing: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <label htmlFor="marketing" className="ml-3 text-sm text-gray-700">
                      I agree to receive marketing emails
                    </label>
                  </div>
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreements.terms}
                      onChange={(e) => setAgreements(prev => ({ ...prev, terms: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    />
                    <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
                      I agree to the terms and conditions
                    </label>
                  </div>
                </div>

                <div className="mt-6 flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <div className="font-medium">Your rental is confirmed!</div>
                    <div className="text-xs text-gray-500">Booking ID: {bookingId || "N/A"}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation and Status */}
            <div className="mt-8 flex flex-col space-y-4">
              {submitMessage && (
                <div className={`p-3 rounded-lg ${
                  submitMessage.toLowerCase().includes("success") ? "bg-green-100 text-green-700" : 
                  submitMessage.includes("already booked") ? "bg-yellow-100 text-yellow-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {submitMessage}
                </div>
              )}

              <div className="flex justify-between">
                {currentStep > 1 && (
                  <button
                    onClick={goToPreviousStep}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Previous
                  </button>
                )}

                <button
                  onClick={currentStep === 4 ? completeRental : handleSubmit}
                  disabled={
                    (currentStep === 1 && !validateStep1()) ||
                    (currentStep === 2 && !validateStep2()) ||
                    (currentStep === 3 && (!validateStep3() || isProcessingPayment)) ||
                    (currentStep === 4 && (!agreements.terms)) ||
                    isSubmitting
                  }
                  className={`px-6 py-3 rounded-lg text-white ${
                    currentStep === 4 ? "bg-green-500 hover:bg-green-600" : "bg-blue-600 hover:bg-blue-700"
                  } transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto`}
                >
                  {isProcessingPayment ? "Processing Payment..." : 
                   isSubmitting ? "Processing..." :
                   currentStep === 4 ? "Complete Rental" : 
                   currentStep === 3 ? "Make Payment" : "Next"}
                </button>
              </div>
            </div>
          </div>

          {/* Rental Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rental Summary</h3>
              <p className="text-gray-500 text-sm mb-6">
                Prices may change depending on rental duration and vehicle type.
              </p>

              {vehicle && (
                <div className="flex items-center mb-6">
                  <div className="w-24 h-16 rounded-lg mr-4 bg-gray-100 flex items-center justify-center overflow-hidden">
                    {vehicle.images?.[0]?.image ? (
                      <img 
                        src={` ${process.env. NEXT_PUBLIC_API_BASE_URL}${vehicle.images[0].image}`}
                        alt={vehicle.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="text-gray-400 text-xs">No Image</div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-2xl text-gray-900">{vehicle.name}</h4>
                    <div className="flex items-center mt-1">
                      {/* Optional: Add rating display */}
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${calculateTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>$0</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Insurance</span>
                  <span>Included</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-900">Total Rental Price</div>
                    <div className="text-sm text-gray-500">Includes all fees and taxes</div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">${calculateTotalPrice()}</div>
                </div>
              </div>

              <div className="mt-6 flex items-center text-sm text-gray-500">
                <Phone className="w-4 h-4 mr-2" />
                <span>Need help? Call +1 (234) 567-8900</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Upload Modal */}
      <Modal
        isOpen={isDocUploadOpen}
        onRequestClose={() => setIsDocUploadOpen(false)}
        style={customStyles}
        contentLabel="Upload Documents Modal"
      >
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl text-gray-800 font-semibold mb-4">Upload Documents</h2>
          <p className="text-gray-600 mb-4">Please upload your ID or drivers license for verification</p>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents</label>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={(e) => setUploadedDocs(e.target.files)}
              className="block w-full text-md p-2 text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">Accepted formats: JPG, PNG, PDF</p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setIsDocUploadOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleDocUpload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Uploading..." : "Submit"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Thank You Modal */}
      <Modal
        isOpen={isThankYouOpen}
        onRequestClose={closeThankYouModal}
        style={customStyles}
        contentLabel="Thank You Modal"
      >
        <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-6">Your booking is now complete. We have sent a confirmation to your email.</p>
          <button
            onClick={closeThankYouModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto"
          >
            Close
          </button>
        </div>
      </Modal> 

      {/* Payment Processing Modal */}
      <Modal
        isOpen={showPaymentProcessing}
        onRequestClose={() => !isProcessingPayment && setShowPaymentProcessing(false)}
        style={customStyles}
        contentLabel="Payment Processing Modal"
      >
        <div className="bg-white rounded-lg p-6 max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
            {isProcessingPayment ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            ) : (
              <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <h2 className="text-xl font-semibold mb-2 text-gray-900">
            {isProcessingPayment ? "Processing Payment..." : "Payment Complete!"}
          </h2>
          <p className="text-gray-600 mb-6">
            {isProcessingPayment 
              ? "Please wait while we process your payment. This may take a few seconds."
              : "Your payment has been processed successfully. You can now complete your rental."
            }
          </p>
          {!isProcessingPayment && (
            <button
              onClick={() => setShowPaymentProcessing(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto transition-colors"
            >
              Continue to Confirmation
            </button>
          )}
        </div>
      </Modal>
    </div>
  )
}