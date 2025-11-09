"use client"

import  React from "react"

import { useState , useEffect} from "react"
import { Phone, Mail, Apple, PlayCircle , Heart, Star, ArrowRight, Check, Menu,   Fuel, Users , ChevronDown, Upload, X, Car, Settings, ImageIcon, CheckCircle, AlertCircle, Plus, BarChart3 } from "lucide-react"
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function VehicleForm() {
 const router = useRouter() // initialize router
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [images, setImages] = useState([])
  const [imageUrls, setImageUrls] = useState([])

  const [user, setUser] = useState(null)

  const [activeTab, setActiveTab] = useState("basic")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    vehicle_model: "",
    vehicle_share: "No",
    vehicle_number: "",
    zip_code: "",
    availability: "Available",
    gear_box: "Automatic",
    fuel: "Petrol",
    air_conditioner: "Yes",
    vehicle_seat: 7,
    distance: "",
    vehicle_type: 5,
    equipment: [],
    price: "",
    status: "pending"
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === "vehicle_seat" || name === "vehicle_type") {
      setFormData((prev) => ({ ...prev, [name]: Number.parseInt(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleEquipmentChange = (equipmentId) => {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(equipmentId)
        ? prev.equipment.filter((id) => id !== equipmentId)
        : [...prev.equipment, equipmentId],
    }))
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  useEffect(() => {
    const storedUser = localStorage.getItem("userData")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  if (!user) return <div>Loading...</div>

 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");
  setShowSuccess(false);

  try {
    const data = new FormData();

    // Append all form fields
    data.append("name", formData.name);
    data.append("vehicle_model", formData.vehicle_model);
    data.append("vehicle_share", formData.vehicle_share);
    data.append("vehicle_number", formData.vehicle_number);
    data.append("zip_code", formData.zip_code);
    data.append("availability", formData.availability);
    data.append("gear_box", formData.gear_box);
    data.append("fuel", formData.fuel);
    data.append("air_conditioner", formData.air_conditioner);
    data.append("vehicle_seat", formData.vehicle_seat);
    data.append("distance", formData.distance);
    data.append("vehicle_type", formData.vehicle_type);
    data.append("price", formData.price);
    data.append("status", formData.status); // Assuming status is a field you want to send

    // Append array of equipment (as JSON string or individual fields, depends on backend)
    formData.equipment.forEach((id) => data.append("equipment[]", id));

    // Append images
    images.forEach((image, index) => {
      data.append(`images`, image); // adjust field name as needed
    });

    // Send FormData using fetch (or use axios with `headers: { 'Content-Type': 'multipart/form-data' }`)
    const response = await fetch(` ${process.env. NEXT_PUBLIC_API_BASE_URL}/api/vehicle/vehicle/`, {
      method: "POST",
      body: data,
    });

    if (!response.ok) {
      throw new Error("Failed to add vehicle");
    }

    setShowSuccess(true);
    setFormData({
      name: "",
      vehicle_model: "",
      vehicle_share: "No",
      vehicle_number: "",
      zip_code: "",
      availability: "Available",
      gear_box: "Automatic",
      fuel: "Petrol",
      air_conditioner: "Yes",
      vehicle_seat: 7,
      distance: "",
      vehicle_type: 5,
      equipment: [],
      price: "",
      status: "pending"
      
    });
    setImages([]);
  } catch (err) {
    setError(err.message || "Something went wrong.");
  } finally {
    setIsLoading(false);
  }
};


  const tabs = [
    { id: "basic", label: "Basic Information", icon: Car },
    { id: "specs", label: "Specifications", icon: Settings },
    { id: "images", label: "Images", icon: ImageIcon },
  ]

  const stats = [
    { label: "Total Vehicles", value: "24", change: "+2 this month", color: "text-orange-600" },
    { label: "Active Bookings", value: "18", change: "+5 today", color: "text-green-600" },
    { label: "Revenue", value: "$12,450", change: "+15% this month", color: "text-blue-600" },
  ]

  const equipmentOptions = [
    { id: 1, name: "GPS Navigation" },
    { id: 2, name: "Bluetooth" },
    { id: 3, name: "Backup Camera" },
    { id: 4, name: "Sunroof" },
    { id: 5, name: "Leather Seats" },
    { id: 6, name: "Heated Seats" },
  ]

  return (

      <div className="min-h-screen bg-gray-50 py-24">
       
        <div className="relative w-full shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)] lg:h-full bg-[white] overflow-hidden">



      </div>




      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
   <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back , {user.username} 👋</h1>
            <p className="text-orange-100 text-lg">Ready to add a new vehicle to your fleet?</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/20 rounded-full p-4">
              <Car className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      

      {/* Main Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border-l-4 border-green-400 p-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-400 mr-3" />
              <div>
                <p className="text-green-800 font-semibold">Success!</p>
                <p className="text-green-700">Vehicle has been added to your fleet successfully.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-6">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-400 mr-3" />
              <div>
                <p className="text-red-800 font-semibold">Error</p>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Header */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 px-8 py-6 border-b border-orange-200">
          <h2 className="text-2xl font-bold text-gray-900">Add New Vehicle</h2>
          <p className="text-gray-600 mt-1">Fill in the details below to add a new vehicle to your fleet</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <nav className="flex space-x-8 px-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-3 py-4 px-2 border-b-2 font-medium text-md transition-all ${
                    activeTab === tab.id
                      ? "border-orange-500 text-orange-600 bg-white"
                      : "border-transparent  hover:text-gray-700 hover:border-gray-300 text-black"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Basic Information Tab */}
          {activeTab === "basic" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Vehicle Name <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Toyota Camry"
                    className="w-full px-4 py-3 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Vehicle Model <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicle_model"
                    value={formData.vehicle_model}
                    onChange={handleChange}
                    placeholder="e.g. 2021"
                    className="w-full px-4 py-3 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Vehicle Type <span className="text-orange-500">*</span>
                  </label>
                  <select
                    name="vehicle_type"
                    value={formData.vehicle_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value={1}>SUV</option>
                    <option value={2}>Sedan</option>
                    <option value={3}>Hatchback</option>
                    
                    <option value={4}>Coupe</option>
                    <option value={5}>Mid-size 4x4 SUV</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Seat Capacity <span className="text-orange-500">*</span>
                  </label>
                  <select
                    name="vehicle_seat"
                    value={formData.vehicle_seat}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value={5}>5 Seats</option>
                    <option value={7}>7 Seats</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Vehicle Number <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicle_number"
                    value={formData.vehicle_number}
                    onChange={handleChange}
                    placeholder="e.g. AB123CD"
                    className="w-full px-4 py-3 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Zip Code <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                    placeholder="e.g. 12345"
                    className="w-full px-4 py-3 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Availability <span className="text-orange-500">*</span>
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="Available">Available</option>
                    <option value="Unavailable">Unavailable</option>
                    <option value="Maintenance">Under Maintenance</option>
                    <option value="Booked">Booked</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Price per Day ($) <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 2000.00"
                    className="w-full px-4 py-3 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-6">
                <label className="block text-md font-semibold text-gray-700 mb-4">Vehicle Sharing</label>
                <div className="flex space-x-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="vehicle_share"
                      value="Yes"
                      checked={formData.vehicle_share === "Yes"}
                      onChange={handleChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 text-black"
                    />
                    <span className="ml-3 text-md font-medium text-gray-700">Yes, available for sharing</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="vehicle_share"
                      value="No"
                      checked={formData.vehicle_share === "No"}
                      onChange={handleChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 text-black"
                    />
                    <span className="ml-3 text-md font-medium text-gray-700">No, private use only</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Specifications Tab */}
          {activeTab === "specs" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Gear Box <span className="text-orange-500">*</span>
                  </label>
                  <select
                    name="gear_box"
                    value={formData.gear_box}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                    <option value="CVT">CVT</option>
                    <option value="Semi-Automatic">Semi-Automatic</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Fuel Type <span className="text-orange-500">*</span>
                  </label>
                  <select
                    name="fuel"
                    value={formData.fuel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="CNG">CNG</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-md font-semibold text-gray-700 mb-2">
                    Distance (KM) <span className="text-orange-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="distance"
                    value={formData.distance}
                    onChange={handleChange}
                    placeholder="e.g. 10000"
                    className="w-full px-4 py-3 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-md font-semibold text-gray-700 mb-2">Air Conditioner</label>
                  <select
                    name="air_conditioner"
                    value={formData.air_conditioner}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 text-black rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl p-6">
                <label className="block text-md font-semibold text-gray-700 mb-4">Equipment</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {equipmentOptions.map((equipment) => (
                    <label key={equipment.id} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.equipment.includes(equipment.id)}
                        onChange={() => handleEquipmentChange(equipment.id)}
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 text-black rounded"
                      />
                      <span className="ml-3 text-md font-medium text-gray-700">{equipment.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Images Tab */}
          {activeTab === "images" && (
            <div className="space-y-8">
              <div className="bg-orange-50 rounded-xl p-8 text-center">
                <ImageIcon className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                <input
  type="file"
  multiple
  accept="image/*"
  onChange={(e) => setImages(Array.from(e.target.files))}
/>

              </div>
            </div>
          )}

          {/* Navigation and Submit */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-200">
            <div className="flex space-x-4">
              {activeTab !== "basic" && (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
                    if (currentIndex > 0) {
                      setActiveTab(tabs[currentIndex - 1].id)
                    }
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-black text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                >
                  ← Previous
                </button>
              )}

              {activeTab !== "images" && (
                <button
                  type="button"
                  onClick={() => {
                    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab)
                    if (currentIndex < tabs.length - 1) {
                      setActiveTab(tabs[currentIndex + 1].id)
                    }
                  }}
                  className="px-6 py-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors font-medium"
                >
                  Next →
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold flex items-center space-x-3 shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Adding Vehicle...</span>
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  <span>Add Vehicle to Fleet</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
      </div>


 
    </div>
    
  )
}
