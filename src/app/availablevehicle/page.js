"use client"

import Link from "next/link"
import { Phone, Mail, Apple, PlayCircle } from "lucide-react"
import Image from "next/image"
import { ArrowRight, Check, Menu, X, ChevronDown, MapPin, Clock, Fuel, Users, Settings } from "lucide-react"
import { useState, useEffect, Suspense } from "react"
import "react-datepicker/dist/react-datepicker.css"
import background from "../../../public/image(5).jpeg"
import Img from "../../../public/ImgKe.png"
import Toyota from "../../../public/Logo.png"
import Ford from "../../../public/Logo(1).png"
import Mercedes from "../../../public/Logo(2).png"
import Jeep from "../../../public/Logo(3).png"
import BMW from "../../../public/Logo(4).png"
import Audi from "../../../public/Logo(5).png"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation";

function AvailableVehiclesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [urlFilterApplied, setUrlFilterApplied] = useState(false);

  const [vehicles, setVehicles] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState("All vehicles");
  const [priceRange, setPriceRange] = useState(1000);
  const [typeFilters, setTypeFilters] = useState({});
  const [capacityFilters, setCapacityFilters] = useState({});
  const [selectedBrand, setSelectedBrand] = useState("All");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        // Check for brand name in URL params first
        const brandFromUrl = searchParams.get('name');
        const typeFromUrl = searchParams.get('type');
        
        let url = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vehicle/vehicle/?status=approved`;
        
        // If brand name is in URL, add it to the API request
        if (brandFromUrl) {
          url += `&name=${encodeURIComponent(brandFromUrl)}`;
          setSelectedBrand(brandFromUrl);
        }

        const response = await fetch(url);
        const json = await response.json();
        const data = json.data || [];
        setVehicles(data);

        const types = [...new Set(data.map(v => v.vehicle_type?.name).filter(Boolean))];
        const capacities = [...new Set(data.map(v => v.vehicle_seat?.capacity).filter(Boolean))];

        const initialTypeFilters = {};
        const initialCapacityFilters = {};

        types.forEach(type => {
          initialTypeFilters[type] = true;
        });

        capacities.forEach(cap => {
          initialCapacityFilters[`${cap} Person`] = true;
        });

        setTypeFilters(initialTypeFilters);
        setCapacityFilters(initialCapacityFilters);

        // Check for vehicle type from URL
        if (typeFromUrl && types.includes(typeFromUrl)) {
          setSelectedVehicleType(typeFromUrl);
          const updatedTypeFilters = {...initialTypeFilters};
          Object.keys(updatedTypeFilters).forEach(key => {
            updatedTypeFilters[key] = key === typeFromUrl;
          });
          setTypeFilters(updatedTypeFilters);
        }
      } catch (err) {
        console.error("Failed to load vehicles:", err);
      }
    };

    fetchVehicles();
  }, [searchParams]); 

  const handleViewDetails = (id) => {
    router.push(`/cardetails?id=${id}`);
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(prev => (prev === filter ? null : filter));
  };

  const handleVehicleTypeClick = (type) => {
    setSelectedVehicleType(type);
  };

  const handleTypeFilterChange = (name) => {
    setTypeFilters(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleCapacityFilterChange = (name) => {
    setCapacityFilters(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const getBrands = () => ["All", ...new Set(vehicles.map(v => v.name.split(' ')[0]).filter(Boolean))];

  const filteredVehicles = vehicles.filter(vehicle => {
    const isApproved = vehicle.status === "approved";
    const type = vehicle.vehicle_type?.name;
    const brand = vehicle.name.split(' ')[0]; // Extract brand from name (first word)
    const price = parseInt(vehicle.price);
    const capacity = vehicle.vehicle_seat?.capacity;

    const urlType = searchParams.get('type');
    const urlBrand = searchParams.get('name');
    
    // If URL has a brand parameter, only match that brand
    const brandMatch = urlBrand 
      ? vehicle.name.toLowerCase().includes(urlBrand.toLowerCase())
      : selectedBrand === "All" || brand === selectedBrand;

    const typeMatch = urlType 
      ? type === urlType
      : selectedVehicleType === "All vehicles" || selectedVehicleType === type;

    const priceMatch = price <= priceRange;
    const capacityMatch = capacityFilters[`${capacity} Person`] === true;
    const typeFilterMatch = typeFilters[type] === true;

    return isApproved && typeMatch && brandMatch && priceMatch && capacityMatch && typeFilterMatch;
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const toggleMobileFilters = () => {
    setMobileFiltersOpen(!mobileFiltersOpen)
  }

  // Close filters on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileFiltersOpen && 
          !event.target.closest('.mobile-filters-container') && 
          !event.target.closest('.mobile-filter-toggle')) {
        setMobileFiltersOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [mobileFiltersOpen])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Enhanced Hero Section */}
      <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 overflow-hidden">
        <Image 
          src={background || "/placeholder.svg"} 
          alt="Hero background" 
          fill 
          className="object-cover opacity-40" 
          priority 
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

        {/* Hero Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center px-6 text-center">
          <div className="max-w-5xl mx-auto space-y-8">
            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              Whats Ready For{" "}
              <span className="bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                The Road
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light">
              Discover premium vehicles for your next adventure
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Select Your Perfect Vehicle
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-8"></div>
          
          {/* Vehicle Type Buttons */}
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {["All vehicles", ...Object.keys(typeFilters)].map((type) => (
              <button
                key={type}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedVehicleType === type
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:shadow-md"
                }`}
                onClick={() => handleVehicleTypeClick(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-8">
          {/* Enhanced Sidebar - Desktop & Mobile Dropdown */}
          <div className="w-full xl:w-80 flex-shrink-0">
            {/* Mobile Filter Toggle Button */}
            <div className="xl:hidden mb-6">
              <button
                onClick={toggleMobileFilters}
                className="mobile-filter-toggle w-full bg-white rounded-2xl shadow-lg p-4 border border-gray-200 flex items-center justify-between hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center">
                  <Settings className="w-5 h-5 text-gray-600 mr-3" />
                  <span className="text-lg font-semibold text-gray-900">Filters</span>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                    mobileFiltersOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>
            </div>

            {/* Filter Panel */}
            <div className={`mobile-filters-container ${
              mobileFiltersOpen ? 'block' : 'hidden'
            } xl:block`}>
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 xl:sticky xl:top-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center xl:block hidden">Filters</h3>
                
                <div className="space-y-8">
                  {/* Type Filter */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Vehicle Type
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(typeFilters).map(([name, checked]) => (
                        <label key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                          <span className="text-gray-700 font-medium">{name}</span>
                          <input
                            type="checkbox"
                            checked={checked}
                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            onChange={() => handleTypeFilterChange(name)}
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Capacity Filter */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Capacity
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(capacityFilters).map(([name, checked]) => (
                        <label key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                          <span className="text-gray-700 font-medium">{name}</span>
                          <input
                            type="checkbox"
                            checked={checked}
                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                            onChange={() => handleCapacityFilterChange(name)}
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                      Price Range
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full h-2 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="text-center mt-3">
                        <span className="text-2xl font-bold text-gray-900">${priceRange}</span>
                        <span className="text-gray-500 ml-2">max per day</span>
                      </div>
                    </div>
                  </div>

                  {/* Mobile: Apply Filters Button */}
                  <div className="xl:hidden pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Vehicle Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filteredVehicles.map((vehicle, index) => (
                <div 
                  key={index} 
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${vehicle.images?.[1]?.image || vehicle.images?.[0]?.image}`}
                      alt={vehicle.vehicle_model || "Vehicle"}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                          {vehicle.name || "Unknown Model"}
                        </h3>
                        <p className="text-gray-500 text-sm font-medium mt-1">
                          {vehicle.vehicle_type?.name || "Unknown Type"}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          ${vehicle.price}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">per day</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-100 flex-grow">
                      <div className="text-center">
                        <Settings className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                        <span className="text-xs text-gray-600 font-medium block">
                          {vehicle.gear_box || "Manual"}
                        </span>
                      </div>
                      <div className="text-center">
                        <Users className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                        <span className="text-xs text-gray-600 font-medium block">
                          {vehicle.vehicle_seat?.capacity} Person
                        </span>
                      </div>
                      <div className="text-center">
                        <Fuel className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                        <span className="text-xs text-gray-600 font-medium block">
                          {vehicle.air_conditioner === "Yes" ? "AC" : "No AC"}
                        </span>
                      </div>
                    </div>

                    {/* Action Button - Always at bottom */}
                    <div className="mt-auto pt-4">
                      <button 
                        onClick={() => handleViewDetails(vehicle.id)}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredVehicles.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <Settings className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No Vehicles Found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Try adjusting your filters or search criteria to find more vehicles.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AvailableVehicles() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AvailableVehiclesContent />
    </Suspense>
  );
}