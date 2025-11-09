"use client"

import Link from "next/link"
import { Phone, Mail, Apple, PlayCircle } from "lucide-react"
import Image from "next/image"
import { ArrowRight, Check, Menu, X , ChevronDown , MapPin , Clock} from "lucide-react"
import { useState , useEffect } from "react"
import "react-datepicker/dist/react-datepicker.css"
import background from "../../../public/image(6).png"
import Img from "../../../public/ImgKe.png"
import Toyota from "../../../public/Logo.png"
import Ford from "../../../public/Logo(1).png"
import Mercedes from "../../../public/Logo(2).png"
import Jeep from "../../../public/Logo(3).png"
import BMW from "../../../public/Logo(4).png"
import Audi from "../../../public/Logo(5).png"
import { useRouter } from "next/navigation"


export default function Home() {

     const [vehicle, setVehicle] = useState([]);
 
      const router = useRouter();
      const handleClick1 = () => {
     router.push('/cardetails'); // navigate to /cardetails
   };
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getVehicles();
        setVehicle(data); 
      } catch (error) {
        console.error("Error loading vehicles:", error);
      }
    };
  
    fetchVehicles();
  }, []);

  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedVehicleType, setSelectedVehicleType] = useState('All vehicles');
  const [typeFilters, setTypeFilters] = useState({
    Sport: true,
    SUV: true,
    MPV: true,
    Sedan: false,
    Coupe: false,
    Hatchback: false,
  });
  const [capacityFilters, setCapacityFilters] = useState({
    '2 Person': true,
    '4 Person': false,
    '6 Person': false,
    '8 or More': true,
  });
  const [priceRange, setPriceRange] = useState(80);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [vehicles, setVehicles] = useState([
    { brand: "Mercedes", price: 25, model: "Sedan", type: "Sedan", capacity: 4 },
    { brand: "Mercedes", price: 50, model: "Sport", type: "Sport", capacity: 2 },
    { brand: "Mercedes", price: 45, model: "SUV", type: "SUV", capacity: 6 },
    { brand: "Porsche", price: 40, model: "Sport", type: "Sport", capacity: 2 },
    { brand: "Toyota", price: 35, model: "MPV", type: "MPV", capacity: 8 },
    { brand: "Porsche", price: 50, model: "SUV", type: "SUV", capacity: 4 },
  ]);

  const handleFilterClick = (filter) => {
    setSelectedFilter(prevFilter => prevFilter === filter ? null : filter);
  };

  const handleVehicleTypeClick = (type) => {
    setSelectedVehicleType(type);
  };


const handleImageClick = () => {
    navigate('/Cardetails');
  };

  const handleTypeFilterChange = (filterName) => {
    setTypeFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
  };

  const handleCapacityFilterChange = (filterName) => {
    setCapacityFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
  };

  const getBrands = () => ['All', ...new Set(vehicles.map(v => v.brand))];

  const filteredVehicles = vehicles.filter(vehicle => {
    const typeMatch = selectedVehicleType === 'All vehicles' || vehicle.type === selectedVehicleType;
    const brandMatch = selectedBrand === 'All' || vehicle.brand === selectedBrand;
    const priceMatch = vehicle.price <= priceRange;
    const capacityMatch = (
      (capacityFilters['2 Person'] && vehicle.capacity === 2) ||
      (capacityFilters['4 Person'] && vehicle.capacity === 4) ||
      (capacityFilters['6 Person'] && vehicle.capacity === 6) ||
      (capacityFilters['8 or More'] && vehicle.capacity >= 8)
    );
    const typeFilterMatch = typeFilters[vehicle.type];

    return typeMatch && brandMatch && priceMatch && capacityMatch && typeFilterMatch;
  });

  

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section with Background */}
       <div className="relative w-full  h-screen bg-[#0f172a] overflow-hidden">
        <Image src={background || "/placeholder.svg"} alt="Hero background" fill className="object-cover" priority />



        {/* Hero Content */}
        <div className="relative z-5 w-full flex flex-col h-full mt-20 lg:mt-0 justify-center items-center px-4 sm:px-6 lg:px-20 pb-16 md:pb-24 pt-16 md:pt-0">
 <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mt-8 md:mt-16 mb-4 text-center"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Popular Picks <span className="text-[#ea580c]"> - Trusted by</span> 
          </h1>

          <p className="text-[#ea580c] text-4xl sm:text-4xl font-bold md:text-6xl lg:text-8xl max-w-4xl mb-8 md:mb-16 text-center">
Thousands       </p>



        </div>
      </div>

<div className="container mx-auto p-4 sm:p-6 mt-16 max-w-8xl">
      <div className="mb-8">
        <h1 className="text-xl sm:text-4xl font-bold text-black mb-4 sm:mb-6 text-center">Available Vehicles</h1>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          {['Location', 'Price', 'Time Duration', 'Brand', 'Filter'].map((filter) => (
            <button
              key={filter}
              className={`px-3 sm:px-4 py-1 sm:py-2 border rounded-md flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap ${
                selectedFilter === filter ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 text-gray-700'
              }`}
              onClick={() => handleFilterClick(filter)}
            >
              <span className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${selectedFilter === filter ? 'bg-white' : 'bg-gray-400'}`}></span>
              {filter}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          {['All vehicles', 'Sedan', 'Cabriolet', 'Pickup', 'SUV', 'Minivan'].map((type) => (
            <button 
              key={type} 
              className={`px-4 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm whitespace-nowrap ${
                selectedVehicleType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'
              }`}
              onClick={() => handleVehicleTypeClick(type)}
            >
              {type}
            </button>
          ))}
        </div>
        {/* <select
          className="px-3 sm:px-4 py-1 sm:py-2 border rounded-md text-xs sm:text-sm"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          {getBrands().map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select> */}
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="w-full lg:w-64 flex-shrink-0 bg-white shadow-md lg:shadow-lg rounded-lg p-4 lg:p-6 border border-gray-200">
          <div className="space-y-6">
            <div>
              <h3 className="text-xs text-gray-500 mb-3">TYPE</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                {Object.entries(typeFilters).map(([name, checked]) => (
                  <label key={name} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={checked} 
                      className="form-checkbox h-4 w-4 text-blue-600"
                      onChange={() => handleTypeFilterChange(name)}
                    />
                    <span className="text-sm text-black">{name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs text-gray-500 mb-3">CAPACITY</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
                {Object.entries(capacityFilters).map(([name, checked]) => (
                  <label key={name} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      checked={checked} 
                      className="form-checkbox h-4 w-4 text-blue-600"
                      onChange={() => handleCapacityFilterChange(name)}
                    />
                    <span className="text-sm text-black">{name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs text-gray-500 mb-3">PRICE</h3>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-black mt-2">Max. ${priceRange}.00</div>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredVehicles.map((vehicle, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4"
            >
              <div className="aspect-[16/9] relative rounded-lg overflow-hidden bg-gray-100"     onClick={() => handleImageClick()}>
                <Image
                  src={Img}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="w-full h-full object-contain "
                />
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">{vehicle.brand}</h3>
                  <p className="text-xs sm:text-sm text-gray-900">{vehicle.model}</p>
                </div>
                <div className="text-right">
                  <div className="text-[#3563e9] font-semibold">
                    ${vehicle.price}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500">per day</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded-full"></span>
                  <span>Automatic</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded-full"></span>
                  <span>{vehicle.capacity} Person</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded-full"></span>
                  <span>Air Conditioner</span>
                </div>
              </div>
                <button onClick={handleClick1}  className="w-full cursor-pointer bg-[#3563e9] text-white py-2 rounded-md text-sm">
                View Details
              </button>

            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 pt-20 pb-20">
          <Image src={Toyota} alt="Toyota" className="h-6 sm:h-8 md:h-10 opacity-50 hover:opacity-100 transition-opacity" />
          <Image src={Ford} alt="Ford" className="h-6 sm:h-8 md:h-10 opacity-50 hover:opacity-100 transition-opacity" />
          <Image src={Mercedes} alt="Mercedes" className="h-6 sm:h-8 md:h-10 opacity-50 hover:opacity-100 transition-opacity" />
          <Image src={Jeep} alt="Jeep" className="h-6 sm:h-8 md:h-10 opacity-50 hover:opacity-100 transition-opacity" />
          <Image src={BMW} alt="BMW" className="h-6 sm:h-8 md:h-10 opacity-50 hover:opacity-100 transition-opacity" />
          <Image src={Audi} alt="Audi" className="h-6 sm:h-8 md:h-10 opacity-50 hover:opacity-100 transition-opacity" />
        </div>
    </div>



      {/* Rent/Host Section */}

 
    </div>
  )
}
