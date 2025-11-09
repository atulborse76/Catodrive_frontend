/* eslint-disable react/jsx-no-undef */
const CarResultItem = ({ car, pickupDate, returnDate, onViewDetails }) => {
  const totalPrice = calculateTotalPrice(car.price, pickupDate, returnDate);
  
  return (
    <div className="p-4 hover:bg-gray-50 transition-colors duration-200">
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
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-600 text-sm">
                  {car.vehicle_type?.name || "Premium Vehicle"}
                </span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  Available
                </span>
              </div>
              
              {car.description && (
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                  {car.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-2">
                <div className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  <Users className="w-3 h-3 mr-1" />
                  {car.vehicle_seat?.capacity || '5'} seats
                </div>
                <div className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  <Settings className="w-3 h-3 mr-1" />
                  {car.gear_box || 'Automatic'}
                </div>
                <div className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  <Fuel className="w-3 h-3 mr-1" />
                  {car.fuel || 'Petrol'}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2 md:text-right">
              <div className="text-right">
                <div className="text-2xl font-bold text-[#ea580c]">
                  ${car.price} <span className="text-sm text-gray-600">/ day</span>
                </div>
                <p className="text-xs text-gray-500">
                  Total: ${totalPrice} for {calculateRentalDays(pickupDate, returnDate)} days
                </p>
              </div>
              
              <button 
                onClick={onViewDetails}
                className="bg-[#ea580c] hover:bg-orange-600 text-white px-6 py-2 rounded-md font-semibold transition-colors duration-200 whitespace-nowrap"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};