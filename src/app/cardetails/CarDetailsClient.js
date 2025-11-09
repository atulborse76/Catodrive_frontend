"use client"

import Link from "next/link"
import { Phone, Mail, Apple, PlayCircle, Heart, ArrowRight, Menu, X, Fuel, Settings, Users, Star } from "lucide-react"
import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import axios from "axios"
import Profile from "../../../public/Profill.png"
import Image from "next/image"

export default function Home() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")
  const router = useRouter()

  const [vehicle, setVehicle] = useState({})
  const [reviews, setReviews] = useState([])
  const [similarVehicles, setSimilarVehicles] = useState([])
  const [selectedImg, setSelectedImg] = useState(0)
  const [loading, setLoading] = useState(true)
  const [reviewsLoading, setReviewsLoading] = useState(true)
  const [similarLoading, setSimilarLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    title: "",
    rating: 0,
    context: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [showAllReviews, setShowAllReviews] = useState(false)

  useEffect(() => {
    if (!id) return

    // Fetch vehicle details
    fetchVehicleDetails(id)
  }, [id])

  const fetchVehicleDetails = async (vehicleId) => {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vehicle/vehicle/${vehicleId}`)
      const vehicleData = response.data.data
      
      localStorage.removeItem("vehicle")
      localStorage.setItem("vehicle", JSON.stringify(vehicleData))
      setVehicle(vehicleData)
      
      // Fetch reviews and similar vehicles in parallel
      await Promise.all([
        fetchVehicleReviews(vehicleId),
        vehicleData.vehicle_type?.id && fetchSimilarVehicles(vehicleData.vehicle_type.id, vehicleId)
      ])
      
      setLoading(false)
    } catch (error) {
      console.error("Vehicle API Error:", error)
      setLoading(false)
    }
  }

const fetchVehicleReviews = async (vehicleId) => {
  setReviewsLoading(true);
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/reviews/`
    );
    
    // Filter reviews by vehicle ID on the client side
    const vehicleReviews = response.data.data.filter(
      (review) => review.vehicle.id === parseInt(vehicleId)
    );
    
    const formattedReviews = vehicleReviews.map((item) => ({
      id: item.id,
      name: item.title || "Anonymous",
      username: item.user_name || "Anonymous",
      date: new Date(item.created_at).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      rating: item.rating,
      avatar: "/man.png",
      text: item.context,
    }));
    
    setReviews(formattedReviews);
  } catch (error) {
    console.error("Review Fetch Error:", error);
  } finally {
    setReviewsLoading(false);
  }
};

  const fetchSimilarVehicles = async (vehicleTypeId, currentVehicleId) => {
    try {
      setSimilarLoading(true)
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/vehicle/vehicle/?vehicle_type=${vehicleTypeId}&status=approved`
      )
      
      const similar = response.data.data
        .filter(vehicle => vehicle.id !== currentVehicleId && vehicle.status === "approved")
        .slice(0, 3)
        .map(vehicle => ({
          id: vehicle.id,
          name: vehicle.name,
          type: vehicle.vehicle_type?.name || "N/A",
          capacity: vehicle.vehicle_seat?.capacity || "N/A",
          transmission: vehicle.gear_box,
          fuel: vehicle.fuel,
          price: vehicle.price,
          image: vehicle.images?.[0]?.image 
            ? `${process.env.NEXT_PUBLIC_API_BASE_URL}${vehicle.images[0].image}` 
            : "/placeholder.svg",
        }))
      
      setSimilarVehicles(similar)
      setSimilarLoading(false)
    } catch (error) {
      console.error("Similar Vehicles Fetch Error:", error)
      setSimilarLoading(false)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const reviewData = {
        title: reviewForm.title,
        rating: reviewForm.rating,
        context: reviewForm.context,
        vehicle: id,
      }

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reviews/reviews/`, 
        reviewData
      )
      
      setSubmitSuccess(true)
      setReviewForm({ title: "", rating: 0, context: "" })
      fetchVehicleReviews(id) // Refresh reviews
    } catch (error) {
      console.error("Review Submission Error:", error)
    } finally {
      setIsSubmitting(false)
      setTimeout(() => setSubmitSuccess(false), 3000)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setReviewForm(prev => ({ ...prev, [name]: value }))
  }

  const handleStarClick = (rating) => {
    setReviewForm(prev => ({ ...prev, rating }))
  }

  const handleClick1 = () => router.push("/billing")
  const handleRentNow = () => console.log("Rent now clicked")
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)
  const toggleReviewForm = () => setShowReviewForm(!showReviewForm)

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
              className={`w-6 h-6 ${star <= rating ? "text-orange-400 fill-current" : "text-gray-300"}`}
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl text-gray-600">Loading vehicle details...</div>
      </div>
    )
  }

  const images = vehicle?.images?.map((img) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${img.image}`) || []
  const currentImage = images[selectedImg] || "/placeholder.svg?height=350&width=690"

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Vehicle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 shadow-sm">
              <img
                src={currentImage}
                alt={vehicle?.name || "Vehicle image"}
                className="w-full h-full object-cover transition-opacity duration-300"
                onError={(e) => {
                  e.target.src = "/placeholder.svg?height=350&width=690"
                }}
              />
              <button 
                className="absolute top-4 right-4 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white transition-colors"
                onClick={() => {
                  const newFav = !vehicle.isFavorite
                  setVehicle({...vehicle, isFavorite: newFav})
                }}
              >
                <Heart className={`w-5 h-5 ${vehicle.isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {images.length > 0 ? (
                images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImg(index)}
                    className={`aspect-[4/3] rounded-lg overflow-hidden transition-all ${
                      selectedImg === index
                        ? "ring-2 ring-blue-500"
                        : "hover:ring-1 hover:ring-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=120&width=160"
                      }}
                    />
                  </button>
                ))
              ) : (
                <div className="col-span-3 flex items-center justify-center h-full text-gray-500 py-8">
                  <p>No images available</p>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl sm:text-xl md:text-3xl font-semibold text-gray-800 mt-2">
                {vehicle?.name || "N/A"}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={4} />
                <span className="text-gray-500 text-sm">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </span>
              </div>
            </div>

            <p className="text-4xl sm:text-xl md:text-3xl font-medium text-gray-700 mt-2">
              {vehicle?.vehicle_model
                ? `${vehicle.vehicle_model} is a premium ${vehicle.vehicle_type?.name || "vehicle"} with ${vehicle.gear_box} transmission and ${vehicle.fuel} fuel type.`
                : "Vehicle description not available."}
            </p>

            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-200">
              <div className="space-y-1">
                <span className="text-gray-500 text-sm">Type</span>
                <p className="font-semibold text-gray-700">{vehicle?.vehicle_type?.name || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-sm">Capacity</span>
                <p className="font-semibold text-gray-700">{vehicle?.vehicle_seat?.capacity || "N/A"} Person</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-sm">Transmission</span>
                <p className="font-semibold text-gray-700">{vehicle?.gear_box || "N/A"}</p>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 text-sm">Fuel</span>
                <p className="font-semibold text-gray-700">{vehicle?.fuel || "N/A"}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  ${vehicle?.price || "0"}
                  <span className="text-gray-500 text-lg font-normal">/day</span>
                </p>
              </div>
              <button
                onClick={handleClick1}
                className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm"
              >
                Rent Now
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-12 px-4">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-xl font-medium text-gray-900">Reviews</h2>
              <div className="w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mt-1"></div>
            </div>
            <div className="flex items-center gap-2">
              {reviews.length > 0 && (
                <button 
                  onClick={() => setShowAllReviews(!showAllReviews)}
                  className="text-gray-500 hover:text-gray-900 text-xs transition-colors underline decoration-dotted underline-offset-4"
                >
                  {showAllReviews ? "Show less" : `Show all (${reviews.length})`}
                </button>
              )}
              <button 
                onClick={toggleReviewForm}
                className="group bg-black text-white px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 hover:scale-105"
              >
                <span className="relative z-10">
                  {showReviewForm ? "Cancel" : "Write Review"}
                </span>
              </button>
            </div>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="relative mb-8">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✍</span>
                  </div>
                  <h3 className="text-base font-medium text-gray-900">Write Review</h3>
                </div>
                
                {submitSuccess && (
                  <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg border border-green-100">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-green-500">✓</span>
                      Review submitted successfully!
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={reviewForm.title}
                      onChange={handleInputChange}
                      placeholder="Review title"
                      className="w-full px-0 py-2 text-gray-700 border-0 border-b border-gray-200 focus:border-blue-500 focus:outline-none text-sm placeholder-gray-400 bg-transparent transition-colors"
                      required
                    />
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-gray-600">Rating</span>
                      <StarRating 
                        rating={reviewForm.rating} 
                        interactive={true} 
                        onRate={handleStarClick} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <textarea
                      id="context"
                      name="context"
                      value={reviewForm.context}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Share your experience with this vehicle..."
                      className="w-full px-0 text-gray-700 py-2 border-0 border-b border-gray-200 focus:border-blue-500 focus:outline-none resize-none text-sm placeholder-gray-400 bg-transparent transition-colors"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Reviews Display */}
          {reviewsLoading ? (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-1 text-gray-400">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {(showAllReviews ? reviews : reviews.slice(0, 2)).map((review) => (
                <div 
                  key={review.id} 
                  className="bg-white p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0">
                      <Image
                        width={40}
                        height={40}
                        src={review.avatar}
                        alt={review.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{review.name}</h4>
                          <p className="text-gray-500 text-xs">@{review.username}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-xs mb-1">{review.date}</p>
                          <StarRating rating={review.rating} />
                        </div>
                      </div>
                      
                      <p className="text-gray-700 text-sm leading-relaxed">{review.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-lg">💭</span>
              </div>
              <p className="text-gray-500 text-sm">No reviews yet. Be the first to review this vehicle!</p>
            </div>
          )}
        </section>

        {/* Similar Vehicles */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Similar Vehicles</h2>
            {similarVehicles.length > 0 && (
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View all
              </button>
            )}
          </div>

          {similarLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-gray-600">Loading similar vehicles...</div>
            </div>
          ) : similarVehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarVehicles.map((vehicle) => (
                <div key={vehicle.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{vehicle.name}</h3>
                        <p className="text-gray-500 text-sm">{vehicle.type}</p>
                      </div>
                      <button className="text-gray-400 hover:text-red-500">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="aspect-[5/3] bg-gray-100 flex items-center justify-center">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="obejct-cover w-full h-full "
                      onError={(e) => {
                        e.target.src = "/placeholder.svg"
                      }}
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Fuel className="w-4 h-4" />
                        <span>{vehicle.fuel}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Settings className="w-4 h-4" />
                        <span>{vehicle.transmission}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{vehicle.capacity}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div>
                        <p className="font-bold text-gray-900">${vehicle.price}<span className="text-gray-500 text-sm font-normal">/day</span></p>
                      </div>
                      <button 
                        className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        onClick={() => router.push(`/cardetails?id=${vehicle.id}`)}
                      >
                        Rent Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-gray-500">No similar vehicles found</p>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}