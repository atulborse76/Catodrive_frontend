"use client"

import Link from "next/link"
import { Phone, Mail, Apple, PlayCircle } from "lucide-react"
import Image from "next/image"
import { ArrowRight, Check, Menu, X , ChevronDown , MapPin , Clock} from "lucide-react"
import { useState , useEffect } from "react"
import "react-datepicker/dist/react-datepicker.css"
import background from "../../../public/image(4).png"
import Img from "../../../public/ImgKe.png"
import Toyota from "../../../public/Logo.png"
import Ford from "../../../public/Logo(1).png"
import Mercedes from "../../../public/Logo(2).png"
import Jeep from "../../../public/Logo(3).png"
import BMW from "../../../public/Logo(4).png"
import Audi from "../../../public/Logo(5).png"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter();

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
        const response = await fetch(` ${process.env. NEXT_PUBLIC_API_BASE_URL}/api/vehicle/vehicle/`); // Replace with your actual API
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
      } catch (err) {
        console.error("Failed to load vehicles:", err);
      }
    };

    fetchVehicles();
  }, []);

  const handleViewDetails = (id) => {
  console.log(id)  
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

  const getBrands = () => ["All", ...new Set(vehicles.map(v => v.vehicle_model).filter(Boolean))];

  const filteredVehicles = vehicles.filter(vehicle => {
    const type = vehicle.vehicle_type?.name;
    const model = vehicle.vehicle_model;
    const price = parseInt(vehicle.price);
    const capacity = vehicle.vehicle_seat?.capacity;

    const typeMatch = selectedVehicleType === "All vehicles" || selectedVehicleType === type;
    const brandMatch = selectedBrand === "All" || selectedBrand === model;
    const priceMatch = price <= priceRange;
    const capacityMatch = capacityFilters[`${capacity} Person`] === true;
    const typeFilterMatch = typeFilters[type] === true;

    return typeMatch && brandMatch && priceMatch && capacityMatch && typeFilterMatch;});

  

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
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-[#ea580c] mt-8 md:mt-16 mb-4 text-center"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Explore Our Fleet <span className="text-white">Of Excellence</span>
          </h1>




        </div>
      </div>

  <div className="container mx-auto p-4 sm:p-6 mt-16 max-w-8xl">
      <div className="mb-8">
        <h1 className="text-xl sm:text-4xl font-bold text-black mb-4 sm:mb-6 text-center">
          Select a vehicle group
        </h1>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          {["Location", "Price", "Time Duration", "Brand", "Filter"].map((filter) => (
            <button
              key={filter}
              className={`px-3 sm:px-4 py-1 sm:py-2 border rounded-md flex items-center gap-2 text-xs sm:text-sm whitespace-nowrap ${
                selectedFilter === filter
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 text-gray-700"
              }`}
              onClick={() => handleFilterClick(filter)}
            >
              <span
                className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
                  selectedFilter === filter ? "bg-white" : "bg-gray-400"
                }`}
              ></span>
              {filter}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6">
          {["All vehicles", ...Object.keys(typeFilters)].map((type) => (
            <button
              key={type}
              className={`px-4 sm:px-6 py-1 sm:py-2 rounded-full text-xs sm:text-sm whitespace-nowrap ${
                selectedVehicleType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
              onClick={() => handleVehicleTypeClick(type)}
            >
              {type}
            </button>
          ))}
        </div>
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
                max="10000"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-black mt-2">Max. ${priceRange}</div>
            </div>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredVehicles.map((vehicle, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div className="aspect-[16/9] relative rounded-lg overflow-hidden bg-gray-100" onClick={() => router.push("/cardetails")}> 
               <img
  src={`http://143.110.242.217:8031${vehicle.images?.[1]?.image || vehicle.images?.[0]?.image}`}
  alt={vehicle.vehicle_model || "Vehicle"}
  className="w-full h-full object-cover rounded-md"
/>

              </div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">{vehicle.name || "Unknown Model"}</h3>
                  <p className="text-xs sm:text-sm text-gray-900">{vehicle.vehicle_type?.name || "Unknown Type"}</p>
                </div>
                <div className="text-right">
                  <div className="text-[#3563e9] font-semibold">${vehicle.price}</div>
                  <div className="text-xs sm:text-sm text-gray-500">per day</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded-full"></span>
                  <span>{vehicle.gear_box || "N/A"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded-full"></span>
                  <span>{vehicle.vehicle_seat?.capacity} Person</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-400 rounded-full"></span>
                  <span>{vehicle.air_conditioner === "Yes" ? "Air Conditioner" : "No AC"}</span>
                </div>
              </div>
            <button onClick={() => handleViewDetails(vehicle.id)} className="w-full cursor-pointer bg-[#3563e9] text-white py-2 rounded-md text-sm">
  View Details
</button>

            </div>
          ))}
        </div>
      </div>
    </div>



      {/* Rent/Host Section */}


    </div>
  )
}
