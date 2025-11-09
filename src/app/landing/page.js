"use client"

import Link from "next/link"
import { Phone, Mail, Apple, PlayCircle, Navigation } from "lucide-react"
import Image from "next/image"
import { ArrowRight, Calendar, Check, MapPin, Menu, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useRouter } from 'next/navigation';
import background from "../../../public/backgorund.jpg"
import { Search, ChevronRight } from 'lucide-react';
import Steps from "../steps/page"
import axios from "axios"
import { Car, Award, Users, Shield, RefreshCw, Monitor, Settings, Fuel } from "lucide-react";
import TestimonialsPage from "../testimonial/page"

export default function Home() {
  const router = useRouter();
  const [pickupDate, setPickupDate] = useState(() => {
    const now = new Date();
    const roundedMinutes = Math.ceil(now.getMinutes() / 15) * 15;
    now.setMinutes(roundedMinutes);
    return now;
  });

  const [returnDate, setReturnDate] = useState(() => {
    const returnDate = new Date(pickupDate);
    returnDate.setHours(pickupDate.getHours() + 1);
    return returnDate;
  });
  
  const [location, setLocation] = useState("Dellas")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchResultsRef = useRef(null);
  const [showResults, setShowResults] = useState(false);

  // Single API call to fetch only approved cars
  useEffect(() => {
    const fetchApprovedCars = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vehicle/vehicle/?status=approved`
        );
        console.log("Approved cars:", response.data.data);
        setCars(response.data.data || []);
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedCars();
  }, []);

  const handleClick = (id) => {
    router.push(`/cardetails?id=${id}`);
  };

  const handleClick1 = () => {
    router.push('/availablevehicle');
  };

  const formatDate = (date) => {
    if (!date) return ""
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const dayName = days[date.getDay()]
    const day = date.getDate()
    const month = months[date.getMonth()]
    const hours = date.getHours()
    const minutes = date.getMinutes()

    return `${dayName} ${day} ${month}, ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
  }

const handleSearch = async () => {
  try {
    // Fetch bookings data
    const bookingsResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/booking/booking/`
    );
    
    // Filter for approved cars
    const approvedCars = cars.filter(car => car.status === "approved");
    
    // Filter out cars that have bookings during the selected period
    const availableCars = approvedCars.filter(car => {
      // Find bookings for this car
      const carBookings = bookingsResponse.data.data.filter(
        booking => booking.vehicle.id === car.id
      );
      
      // Check if any booking overlaps with our selected dates
      const isBooked = carBookings.some(booking => {
        // Create Date objects for booking dates
        const bookingPickupDate = new Date(`${booking.pick_up_Date}T${booking.pick_up_time}`);
        const bookingDropoffDate = new Date(`${booking.drop_of_Date}T${booking.drop_of_time}`);
        
        // Create Date objects for search dates
        const searchPickupDate = pickupDate;
        const searchDropoffDate = returnDate;
        
        // Check for overlap (simplified check - you might need more precise logic)
        return (
          (searchPickupDate >= bookingPickupDate && searchPickupDate <= bookingDropoffDate) ||
          (searchDropoffDate >= bookingPickupDate && searchDropoffDate <= bookingDropoffDate) ||
          (searchPickupDate <= bookingPickupDate && searchDropoffDate >= bookingDropoffDate)
        );
      });
      
      // Only include if not booked
      return !isBooked;
    });
    
    setSearchResults(availableCars);
    setShowResults(true);
    
    setTimeout(() => {
      const resultsSection = document.getElementById("search-results");
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
    
  } catch (error) {
    console.error("Error fetching bookings:", error);
    // Fallback to just showing approved cars if bookings can't be fetched
    setSearchResults(cars.filter(car => car.status === "approved"));
    setShowResults(true);
  }
};
const [searchResults, setSearchResults] = useState([]);
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }
useEffect(() => {
  const handleClickOutside = (event) => {
    if (searchResultsRef.current && !searchResultsRef.current.contains(event.target)) {
      setShowResults(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section with Background */}
      <div className="relative w-full min-h-screen lg:h-screen bg-[#0f172a] overflow-hidden">
        <Image src={background || "/placeholder.svg"} alt="Hero background" fill className="object-cover" priority />



        {/* Hero Content */}
       <div className="relative z-5 w-full h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-20">

  <h1
    className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mt-8 md:mt-16 mb-4 text-center"
    style={{ fontFamily: "var(--font-space-grotesk)" }}
  >
    Drive Your <span className="text-[#ea580c]">Dream Car</span>
  </h1>

  <p className="text-white text-lg sm:text-xl md:text-2xl max-w-4xl mb-8 md:mb-16 text-center">
    Experience luxury and comfort with our premium fleet of vehicles.
  </p>

  {/* Search Form */}
  <div className="bg-white rounded-xl rounded-b-none shadow-md p-4 flex flex-col w-full max-w-[1050px] mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
 
<div className="flex items-center gap-2 border-b md:border-b-0 md:border-r border-gray-300 p-2">
  <MapPin className="text-gray-400 w-6 h-6 flex-shrink-0" />
  <div className="w-full">
    <div className="text-xs font-bold text-gray-800">Location</div>
    <select
      value={location}
      onChange={(e) => setLocation(e.target.value)}
      className="w-full outline-none text-gray-700 text-sm bg-transparent"
    >
      <option value="Dellas">Dallas</option>
    </select>
  </div>
</div>

<div className="flex items-center gap-2 border-b md:border-b-0 md:border-r border-gray-300 p-2">
  <Calendar className="text-gray-400 w-6 h-6 flex-shrink-0" />
  <div className="w-full">
    <div className="text-xs font-bold text-gray-800">Pickup date</div>
    <DatePicker
      selected={pickupDate}
      onChange={(date) => {
        if (!date) return;
        setPickupDate(date);
        
        // If return date is now invalid, adjust it (3 hours = 10,800,000 milliseconds)
        if (returnDate.getTime() < date.getTime() + 10800000) {
          const newReturnDate = new Date(date.getTime() + 10800000);
          setReturnDate(newReturnDate);
        }
      }}
      minDate={new Date()}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      dateFormat="EEE, MMM d, HH:mm"
      className="w-full outline-none text-gray-700 cursor-pointer text-sm"
      selectsStart
      startDate={pickupDate}
      endDate={returnDate}
    />
  </div>
</div>

{/* Return Date */}
<div className="flex items-center gap-2 border-b md:border-b-0 md:border-r border-gray-300 p-2">
  <Calendar className="text-gray-400 w-6 h-6 flex-shrink-0" />
  <div className="w-full">
    <div className="text-xs font-bold text-gray-800">Return date</div>
    <DatePicker
      selected={returnDate}
      onChange={(date) => {
        if (!date) return;
        const minReturnTime = pickupDate.getTime() + 3600000; // 1 hour in ms
        setReturnDate(date.getTime() < minReturnTime ? new Date(minReturnTime) : date);
      }}
      minDate={pickupDate}
      minTime={(() => {
        if (returnDate.getDate() === pickupDate.getDate() && 
            returnDate.getMonth() === pickupDate.getMonth() && 
            returnDate.getFullYear() === pickupDate.getFullYear()) {
          const minTime = new Date(pickupDate);
          minTime.setHours(minTime.getHours() + 1);
          return minTime;
        }
        return new Date(0); // Midnight
      })()}
      maxTime={new Date(0, 0, 0, 23, 59, 59)}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      dateFormat="EEE, MMM d, HH:mm"
      className="w-full outline-none text-gray-700 cursor-pointer text-sm"
      selectsEnd
      startDate={pickupDate}
      endDate={returnDate}
      filterTime={(time) => {
        if (time.getDate() === pickupDate.getDate() && 
            time.getMonth() === pickupDate.getMonth() && 
            time.getFullYear() === pickupDate.getFullYear()) {
          return time.getTime() >= pickupDate.getTime() + 3600000;
        }
        return true;
      }}
    />
  </div>
</div>
      {/* Search Button */}
      <div className="flex justify-center p-2">
        <button
          className="w-full bg-[#ea580c] hover:bg-orange-600 text-white px-6 py-2 rounded-md font-semibold transition-colors duration-200"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
    </div>
  </div>

  {/* Search Results - List View */}

{searchResults.length > 0 && showResults && (
  <div ref={searchResultsRef} className="w-full max-w-[1050px] mx-auto">
    <div className="bg-white rounded-xl rounded-t-none shadow-md overflow-hidden">
      <div className="p-2 px-4 border-b bg-gray-50">
        <h2 className="text-md font-semibold text-gray-800">
          {searchResults.filter(car => car.status === "approved").length} approved vehicles found
        </h2>
      </div>
      
      <div className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
        {searchResults
          .filter(car => car.status === "approved") // Add this filter
          .map((car, index) => (
            <div key={car.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
              {/* Rest of your car listing UI remains exactly the same */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-48 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={car.images?.[0]?.image ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${car.images[0].image}` : "/placeholder.svg"}
                    alt={car.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {car.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {car.vehicle_type?.name || "Premium Vehicle"}
                      </p>
                      
                      {car.description && (
                        <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                          {car.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 md:text-right">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#ea580c]">
                          ${car.price} <span className="text-sm text-gray-600">/ day</span>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => router.push(`/cardetails?id=${car.id}`)}
                        className="bg-[#ea580c] hover:bg-orange-600 text-white px-6 py-2 rounded-md font-semibold transition-colors duration-200 whitespace-nowrap"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  </div>
)}
</div>
      </div>

      {/* Car Brands Section */}
      {/* <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-20 bg-gray-50 flex justify-center items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-16">
            <Image src="/BMW.png" alt="BMW" width={80} height={50} className="h-16 w-auto object-contain" />
            <img src="/lexus-logo.png" alt="Lexus" width={80} height={40} className="h-16 w-auto object-contain" />
            <img src="/Marcedes.png" alt="Mercedes" width={80} height={40} className="h-16 w-auto object-contain" />
            <img src="/Honda.png" alt="Honda" width={80} height={40} className="h-16 w-auto object-contain" />
            <img src="/Hyundai.png" alt="Hyundai" width={90} height={40} className="h-16 w-auto object-contain" />
            <img src="/Nissan.png" alt="Nissan" width={80} height={40} className="h-16 w-auto object-contain" />
            <img src="/Toyota.png" alt="Toyota" width={80} height={40} className="h-16 w-auto object-contain" />
            <img src="/KIA.png" alt="Kia" width={120} height={40} className="h-16 w-auto object-contain" />
          </div>
        </div>
      </section> */}

      {/* How it Works Section */}
      

   

    <Steps />

    <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-20 -mt-6 sm:-mt-8 md:-mt-10 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <p className="text-gray-500 mt-4 text-xl sm:text-md">How it Works</p>
            <h2
              style={{ fontFamily: "var(--font-space-grotesk)" }}
              className="text-4xl sm:text-xl md:text-3xl font-semibold text-gray-800 mt-2"
            >
              Simple steps to Get the Car
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="flex justify-center">
                <Image
                  src="/Group1.png"
                  alt="Choose a Car"
                  width={200}
                  height={200}
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-40 lg:h-40 xl:w-48 xl:h-48 object-contain"
                />
              </div>
              <div className="mt-4 md:mt-6">
                <h3 className="text-lg md:text-xl font-bold text-yellow-500">Choose a Car</h3>
                <p className="text-gray-600 mt-2">Browse top vehicles easily.</p>
              </div>
              {/* Connector */}
              <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gray-200 -z-10"></div>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="flex justify-center">
                <Image
                  src="/Group2.png"
                  alt="Pick Your Dates"
                  width={180}
                  height={180}
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-40 lg:h-40 xl:w-48 xl:h-48 object-contain"
                />
              </div>
              <div className="mt-4 md:mt-6">
                <h3 className="text-lg md:text-xl font-bold text-orange-500">Pick Your Dates</h3>
                <p className="text-gray-600 mt-2">Select pickup and return dates.</p>
              </div>
              {/* Connector */}
              <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gray-200 -z-10"></div>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="flex justify-center">
                <Image
                  src="/Group3.png"
                  alt="Book"
                  width={180}
                  height={180}
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-40 lg:h-40 xl:w-48 xl:h-48 object-contain"
                />
              </div>
              <div className="mt-4 md:mt-6">
                <h3 className="text-lg md:text-xl font-bold text-sky-500">Book</h3>
                <p className="text-gray-600 mt-2">Reserve your car online through our App.</p>
              </div>
              {/* Connector */}
              <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gray-200 -z-10"></div>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="flex justify-center">
                <Image
                  src="/Group4.png"
                  alt="Drive & Enjoy"
                  width={180}
                  height={180}
                  className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-40 lg:h-40 xl:w-48 xl:h-48 object-contain"
                />
              </div>
              <div className="mt-4 md:mt-6">
                <h3 className="text-lg md:text-xl font-bold text-red-500">Drive & Enjoy</h3>
                <p className="text-gray-600 mt-2">Pick up your car and drive.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

       {/* <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h2
          style={{ fontFamily: "var(--font-space-grotesk)" }}
          className="text-3xl sm:text-4xl font-bold text-[#0f172a] mb-4"
        >
          Popular Cars
        </h2>
        <p
          style={{ fontFamily: "var(--font-space-grotesk)" }}
          className="text-[#0f172a] mb-8 font-montserrat"
        >
          <span className="border-b-2 border-blue-500 pb-1">Browse</span> our top
          selection of vehicles available for rent.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {cars.map((car) => (
            <div
              key={car.id}
              className="border rounded-xl shadow-sm hover:shadow-md transition overflow-hidden bg-white"
            >
              <div className="relative">
                <img
                  src={car.image || "https://via.placeholder.com/300x200"}
                  alt={car.name}
                  className="w-full h-40 sm:h-48 object-cover"
                />
                <button className="absolute top-4 right-4 bg-white p-2 rounded-md shadow">
                  <svg
                    className="w-5 h-5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-4 text-black">
                <h3 className="text-lg font-bold">{car.name}</h3>
                <p className="text-sm text-gray-600">{car.description}</p>

                <div className="flex justify-between mt-3 border-y border-gray-200 py-3">
                  <Spec icon="👥" label={`${car.seat || "5"} Seats`} />
                  <Spec icon="⛽" label={car.fuel || "Petrol"} />
                  <Spec icon="⚙️" label={car.transmission || "Manual"} />
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-xl font-bold">${car.price_per_day || "25"}/day</p>
                  <button
                    onClick={() => handleClick(car.name)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition"
                  >
                    Book Now!
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section> */}

{/* Popular Cars Section */}
<section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
  <div className="max-w-7xl mx-auto">
    {/* Header Section - Keeping your original UI */}
    <div className="text-center mb-8">
      <h2
        style={{ fontFamily: "var(--font-space-grotesk)" }}
        className="text-4xl sm:text-xl md:text-3xl font-semibold text-gray-800 mt-2"
      >
        Popular Cars
      </h2>
      <p
        style={{ fontFamily: "var(--font-space-grotesk)" }}
        className="text-slate-600"
      >
        <span className="border-b-2 border-blue-500 pb-1">Browse</span> our top selection of vehicles available for rent.
      </p>
    </div>

    {loading ? (
      <div className="flex justify-center items-center py-12">
        <p className="text-slate-500">Loading cars...</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cars
          .filter(car => car.status === "approved") // Only this line changed
          .map((car) => (
            <div 
              key={car.id} 
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 ease-out flex flex-col h-full group cursor-pointer"
            >
              {/* Image Section - Original UI */}
              <div className="relative overflow-hidden">
                <img
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${car.images?.[1]?.image || car.images?.[0]?.image || ""}`}
                  alt={car.vehicle_model || "Car"}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-sm hover:shadow-lg hover:scale-110 transition-all duration-300 hover:bg-red-50 group">
                  <svg className="w-4 h-4 text-gray-600 group-hover:text-red-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Content Section - Original UI */}
              <div className="p-5 flex flex-col flex-grow">
                <div className="mb-4">
                  <h3 className="font-semibold text-slate-900 mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
                    {car.name || "Unknown Model"}
                  </h3>
                  <p className="text-sm text-gray-600">2023 Model</p>
                </div>

                <div className="flex flex-col gap-2 mb-4 flex-grow">
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300">
                    <svg className="w-4 h-4 text-gray-600 flex-shrink-0 group-hover:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm text-gray-700">{car.vehicle_seat?.capacity || "5"} seats</span>
                  </div>
                  
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300 delay-75">
                    <svg className="w-4 h-4 text-gray-600 flex-shrink-0 group-hover:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-700">{car.fuel || "Petrol"}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-300 delay-150">
                    <svg className="w-4 h-4 text-gray-600 flex-shrink-0 group-hover:text-blue-500 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    <span className="text-sm text-gray-700">{car.gear_box || "Auto"}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-auto">
                  <div className="flex justify-between items-center">
                    <div className="group-hover:scale-105 transition-transform duration-300">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">${car.price || "N/A"}</span>
                        <span className="text-sm text-gray-500">/day</span>
                      </div>
                      <p className="text-xs text-gray-500">Per day (inc. tax)</p>
                    </div>

                    <button
                      onClick={() => handleClick(car.id)}
                      className="bg-gray-700 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-all duration-300 text-sm whitespace-nowrap transform hover:scale-105 hover:shadow-lg active:scale-95"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {/* See All Button - Original UI */}
        <div className="flex justify-center mt-8 col-span-full">
          <button
            onClick={handleClick1}
            className="flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-semibold rounded-full shadow-sm hover:shadow-lg border border-gray-200 transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:bg-orange-50 group"
          >
            <span>See All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    )}
  </div>
</section>



      {/* Why Choose Us Section */}
          <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-20 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <p style={{ fontFamily: "var(--font-space-grotesk)" }} className="text-gray-500 uppercase font-medium">
            ADVANTAGES
          </p>
          <h2
            style={{ fontFamily: "var(--font-space-grotesk)" }}
            className="text-4xl sm:text-xl md:text-3xl font-semibold text-gray-800 mt-2"
          >
            Why Choose CatoDrive
          </h2>
          <p style={{ fontFamily: "var(--font-space-grotesk)" }} className="text-gray-700 mt-4 max-w-3xl mx-auto">
            We present many guarantees and advantages when you rent a car with us for your trip. Here are some of the
            advantages that you will get
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-20 mt-8 md:mt-12">
          {/* Card 1 - Easy Rent */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex-shrink-0 flex justify-center sm:justify-start">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <Car className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div>
              <h3
                style={{ fontFamily: "var(--font-space-grotesk)" }}
                className="text-xl font-bold text-[#0f172a] text-center sm:text-left"
              >
                Easy Rent
              </h3>
              <p
                style={{ fontFamily: "var(--font-space-grotesk)" }}
                className="text-gray-600 mt-2 text-center sm:text-left"
              >
                Rent a car at our rental with an easy and fast process without disturbing your productivity
              </p>
            </div>
          </div>

          {/* Card 2 - Premium Quality */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex-shrink-0 flex justify-center sm:justify-start">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h3
                style={{ fontFamily: "var(--font-space-grotesk)" }}
                className="text-xl font-bold text-[#0f172a] text-center sm:text-left"
              >
                Premium Quality
              </h3>
              <p
                style={{ fontFamily: "var(--font-space-grotesk)" }}
                className="text-gray-600 mt-2 text-center sm:text-left"
              >
                Our cars are always maintained engine health and cleanliness to provide a more comfortable driving
                experience
              </p>
            </div>
          </div>

          {/* Card 3 - Professional Agent */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex-shrink-0 flex justify-center sm:justify-start">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div>
              <h3
                style={{ fontFamily: "var(--font-space-grotesk)" }}
                className="text-xl font-bold text-[#0f172a] text-center sm:text-left"
              >
                Professional Agent
              </h3>
              <p
                style={{ fontFamily: "var(--font-space-grotesk)" }}
                className="text-gray-600 mt-2 text-center sm:text-left"
              >
                You can ask your travel companion to escort and guide your journey.
              </p>
            </div>
          </div>

          {/* Card 4 - Car Safety */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex-shrink-0 flex justify-center sm:justify-start">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div>
              <h3
                style={{ fontFamily: "var(--font-space-grotesk)" }}
                className="text-xl font-bold text-[#0f172a] text-center sm:text-left"
              >
                Car Safety
              </h3>
              <p
                style={{ fontFamily: "var(--font-space-grotesk)" }}
                className="text-gray-600 mt-2 text-center sm:text-left"
              >
                We guarantee the safety of the engine on the car always running well with regular checks on the car
                engine.
              </p>
            </div>
          </div>

          {/* Card 5 - Refund */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex-shrink-0 flex justify-center sm:justify-start">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div>
              <h3
                style={{ fontFamily: "var(--font-space-grotesk)" }}
                className="text-xl font-bold text-[#0f172a] text-center sm:text-left"
              >
                Refund
              </h3>
              <p
                style={{ fontFamily: "var(--font-space-grotesk)" }}
                className="text-gray-600 mt-2 text-center sm:text-left"
              >
                Our service guarantee provides a money back opportunity if the car does not match the information
                provided.
              </p>
            </div>
          </div>

          {/* Card 6 - Live Monitoring */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="flex-shrink-0 flex justify-center sm:justify-start">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                <Monitor className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div>
              <h3
                style={{ fontFamily: "var(--font-space-grotesk)" }}
                className="text-xl font-bold text-[#0f172a] text-center sm:text-left"
              >
                Live Monitoring
              </h3>
              <p
                style={{ fontFamily: "var(--font-space-grotesk)" }}
                className="text-gray-600 mt-2 text-center sm:text-left"
              >
                Our service provides direct customer monitoring to monitor trips in terms of safety and comfort.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Ready to Drive Section */}
      <section className="py-12 md:py-16 px-4 sm:px-6 lg:px-20 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 md:gap-10 items-center">
         <div className="grid grid-cols-2 gap-4 order-2 md:order-1">
  {/* Left column with two stacked images */}
  <div className="flex flex-col gap-4">
    <div className="rounded-2xl overflow-hidden h-[120px] sm:h-[170px] md:h-[200px] lg:h-[220px]">
      <Image src="/Blog1.png" alt="Car 1" width={400} height={150} className="w-full h-full object-cover" />
    </div>
    <div className="rounded-2xl overflow-hidden h-[120px] sm:h-[170px] md:h-[200px] lg:h-[220px]">
      <Image src="/Blog2.png" alt="Car 2" width={400} height={150} className="w-full h-full object-cover" />
    </div>
  </div>

  {/* Right column with one tall image */}
  <div className="rounded-2xl overflow-hidden h-[250px] sm:h-[350px] md:h-[400px] lg:h-[450px]">
    <Image src="/h72.png" alt="Luxury Car" width={400} height={450} className="w-full h-full object-cover" />
  </div>
</div>


          <div className="space-y-6 order-1 md:order-2">
            <h2
              style={{ fontFamily: "var(--font-space-grotesk)" }}
              className="text-4xl sm:text-xl md:text-3xl font-semibold text-gray-800 mt-2"
            >
              Ready to Drive Your Dream Car?
            </h2>
            <p style={{ fontFamily: "var(--font-space-grotesk)" }} className="text-gray-700 text-center md:text-left">
              We are committed to providing our customers with exceptional service, competitive pricing, and a wide
              range of.
            </p>

            <div className="space-y-4 mt-6 md:mt-13">
              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-1 rounded-full">
                  <Check className="w-3 h-3 text-black" />
                </div>
                <p style={{ fontFamily: "var(--font-space-grotesk)" }} className="text-gray-700 font-medium">
                  Wide Selection of Luxury and Economy Vehicles.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-1 rounded-full">
                  <Check className="w-3 h-3 text-black" />
                </div>
                <p style={{ fontFamily: "var(--font-space-grotesk)" }} className="text-gray-700 font-medium">
                  Simple Booking Process with Instant Confirmation.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-blue-50 p-1 rounded-full">
                  <Check className="w-3 h-3 text-black" />
                </div>
                <p style={{ fontFamily: "var(--font-space-grotesk)" }} className="text-gray-700 font-medium">
                  Best Prices Guaranteed for Your Perfect Ride.
                </p>
              </div>
            </div>

           <Link
  href="/availablevehicle"
  className="bg-[#ea580c] w-3/5 lg:w-2/5 text-white px-6 py-3 rounded-md font-medium flex items-center gap-2"
>
  Start Your Journey
  <ArrowRight className="w-5 h-5" />
</Link>



          </div>
        </div>
      </section>

      <TestimonialsPage />
     

      {/* Rent/Host Section */}
      <section className="bg-gray-50 py-8">
        <div className="w-full flex justify-center items-center px-4">
          <Image
            src="/host.png"
            height={900}
            width={1050}
            className="mb-10 mt-10 max-w-full h-auto"
            alt="Host your car"
          />
        </div>
      </section>

  
    </div>
  )
}
