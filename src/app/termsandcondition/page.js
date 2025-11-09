"use client"

import Image from "next/image"
import background from "../../../public/3.jpeg"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero Section */}
      <div className="relative w-full  h-screen bg-[#0f172a] overflow-hidden">
         <Image
    src={background || "/placeholder.svg"}
    alt="Hero background"
    fill
    className="object-cover "
    priority
  />

        <div className="relative z-5 w-full flex flex-col h-full mt-20 lg:mt-0 justify-center items-center px-4 sm:px-6 lg:px-20 pb-16 md:pb-24 pt-16 md:pt-0">
  <h1
    className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mt-8 md:mt-16 mb-4 text-center"
    style={{
      textShadow: `
        0 0 6px rgba(234,88,12,0.6),
        0 0 12px rgba(234,88,12,0.4),
        1px 1px 0 black,
        -1px -1px 0 black,
        1px -1px 0 black,
        -1px 1px 0 black
      `,
    }}
  >
    Terms &
  </h1>

  <p
    className="text-[#ea580c] text-4xl sm:text-4xl font-bold md:text-6xl lg:text-8xl max-w-4xl mb-8 md:mb-16 text-center"
    style={{
      textShadow: `
        0 0 8px rgba(234,88,12,0.8),
        0 0 16px rgba(234,88,12,0.6),
        0 0 32px rgba(234,88,12,0.5),
        1px 1px 0 black,
        -1px -1px 0 black,
        1px -1px 0 black,
        -1px 1px 0 black
      `,
      WebkitTextStroke: '0.5px black',
    }}
  >
    Conditions
  </p>
</div>

      </div>

      {/* Terms Content */}
      <div className="max-w-[88rem] mx-auto px-4 mt-20 mb-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-black mb-8">Rental Terms and Conditions</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold text-black mb-4">1. Rental Agreement</h3>
              <p className="text-gray-700 mb-4">
                By renting a vehicle from Premium Rentals, you agree to comply with all terms outlined in this agreement. 
                The rental period begins at the time specified in your reservation and ends when the vehicle is returned 
                to our designated location.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Minimum rental age: 21 years (25 for premium vehicles)</li>
                <li>Valid drivers license required for all drivers</li>
                <li>Credit card in renters name must be presented</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-black mb-4">2. Payment and Charges</h3>
              <p className="text-gray-700 mb-4">
                All rentals are subject to the following charges unless otherwise specified:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Base rental rate</li>
                <li>Taxes and fees</li>
                <li>Optional protection packages</li>
                <li>Additional driver fees (if applicable)</li>
                <li>Fuel charges if vehicle not returned full</li>
                <li>Late return fees</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-black mb-4">3. Vehicle Use and Restrictions</h3>
              <p className="text-gray-700 mb-4">
                The rented vehicle may only be used by authorized drivers and must not be used for:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Transporting hazardous materials</li>
                <li>Ride-sharing services unless explicitly authorized</li>
                <li>Racing or performance testing</li>
                <li>Any illegal activities</li>
                <li>Off-road driving unless vehicle is specifically designed for such use</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-black mb-4">4. Insurance and Liability</h3>
              <p className="text-gray-700 mb-4">
                Basic insurance coverage is included with all rentals. Additional coverage options are available:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Collision Damage Waiver (CDW)</li>
                <li>Supplemental Liability Insurance (SLI)</li>
                <li>Personal Accident Insurance (PAI)</li>
                <li>Personal Effects Coverage (PEC)</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Renters are responsible for all damage to the vehicle regardless of fault unless CDW is purchased.
              </p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-black mb-4">Important Note</h3>
              <p className="text-gray-700">
                This is a summary of our key terms. The full rental agreement provided at the time of rental contains 
                complete terms and conditions. By renting a vehicle, you agree to be bound by the full terms of that agreement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}