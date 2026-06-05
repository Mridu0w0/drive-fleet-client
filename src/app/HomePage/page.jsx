"use client"; // Required for React hooks and client-side Link interactions

import React, { useState, useEffect } from "react";
import Link from "next/link"; // Next.js native routing link optimization
import Image from "next/image";

export default function HomePage() {
  // State management using React Hooks
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching dynamic database data using standard react hooks and fetch API
  useEffect(() => {
    const fetchCarsFromDatabase = async () => {
      try {
        setLoading(true);
        // Connect directly to your local Express backend server port
        const response = await fetch("http://localhost:5000/api/cars");
        const data = await response.json();

        // Ensure we display your required minimum of 6 cards
        setCars(data);
      } catch (error) {
        console.error("Error communicating with backend database:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarsFromDatabase();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans">
      {/* =========================================================
          1. BANNER SECTION
          ========================================================= */}
      <section className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 min-h-[550px] flex items-center justify-center text-white px-4 py-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center mix-blend-overlay opacity-20"></div>

        <div className="relative max-w-4xl mx-auto text-center z-10 space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-200 to-white bg-clip-text text-transparent drop-shadow-md">
            DriveFleet Car Rental Platform
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
            Unlock your next journey with our seamlessly premium fleet. Explore
            flexible rentals, maintain secure bookings, and hit the open road
            today with absolute confidence.
          </p>
          <div className="pt-4">
            <Link
              href="/ExploreCarsPage"
              className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold tracking-wide text-white bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out rounded-lg shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5 focus:outline-none"
            >
              Explore Cars
              <svg
                className="ml-2 w-5 h-5 transition-transform duration-300 transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          2. DYNAMIC SECTION: AVAILABLE CARS SECTION (Database Data)
          ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Available Rental Fleet
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Explore active vehicles directly connected to our database system,
            prepared for instant booking deployments.
          </p>
        </div>

        {/* Dynamic State Component Render: Shows loading spinner when data is fetching */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-medium">
            No cars found in the database. Ensure your server is running on port
            5000 and seeded with data.
          </div>
        ) : (
          /* Responsive equal height and width grid layout rendering your minimum 6 cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <div
                key={car._id || car.id}
                className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full"
              >
                {/* Car Image container with uniform spacing layout */}
                <div className="relative h-48 w-full bg-slate-100">
                  <Image
                    height={192}
                    width={384}
                    src={car.imageUrl}
                    alt={car.carName}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Car Details Info body */}
                <div className="p-6 flex-grow space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-slate-900">
                      {car.carName}
                    </h3>

                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700">
                      {car.carType}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
                    {car.description}
                  </p>
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-sm font-medium text-slate-600">
                    <span>👥 {car.seatCapacity} Seats</span>
                  </div>
                </div>
                {/* Pricing & Footer Call-To-Action View Details Button */}
                <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-50 bg-slate-50/50">
                  <div>
                    <span className="text-xl font-extrabold text-slate-900">
                      ${car.dailyPrice}
                    </span>

                    <span className="text-xs text-slate-500 block">
                      / day rent
                    </span>
                  </div>
                  <Link
                    href={`/ExploreCarsPage/${car._id || car.id}`}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* =========================================================
          3. EXTRA STATIC SECTION 1: "WHY CHOOSE US"
          ========================================================= */}
      <section className="bg-white border-y border-slate-100 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Engineered for Seamless Journeys
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              We eliminate complex processes from standard vehicle logistics to
              deliver a direct, transparent workflow tailored around your time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center space-y-3 p-4">
              <div className="mx-auto h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl">
                🛡️
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Comprehensive Coverage
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Drive without processing baseline risks. Every transaction
                guarantees complete protection profiles for total ease of mind.
              </p>
            </div>
            <div className="text-center space-y-3 p-4">
              <div className="mx-auto h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl">
                ⏳
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Instant Online Approvals
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Zero complex validation forms or operational delays. Rent
                vehicles matching your timing demands straight from your profile
                interface.
              </p>
            </div>
            <div className="text-center space-y-3 p-4">
              <div className="mx-auto h-12 w-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xl">
                💎
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Transparent Flat Pricing
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                What you see is what you fulfill. No hidden transaction
                administrative additions or dynamic surprise changes mid-trip.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. EXTRA STATIC SECTION 2: "HOW IT WORKS"
          ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            Three Steps to the Open Road
          </h2>
          <p className="mt-4 text-lg text-slate-500">
            Getting your keys is structural, straightforward, and entirely
            managed from your device.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="bg-white p-8 rounded-xl border border-slate-100 relative">
            <span className="text-4xl font-black text-slate-100 absolute right-6 top-6">
              01
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Browse and Filter
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Explore listings by body type, configuration capacities, or
              location coordinates. Use our active index engine to target your
              exact driving specifications.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl border border-slate-100 relative">
            <span className="text-4xl font-black text-slate-100 absolute right-6 top-6">
              02
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Reserve Instantly
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Verify calendar windows, configure dynamic driver additions, and
              safely process reservations with automatic token logging security.
            </p>
          </div>
          <div className="bg-white p-8 rounded-xl border border-slate-100 relative">
            <span className="text-4xl font-black text-slate-100 absolute right-6 top-6">
              03
            </span>
            <h3 className="text-xl font-bold text-slate-900 mb-3">
              Collect & Drive
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Arrive at the destination spot specified inside your clean
              dashboard logs, match your digital rental details, and transition
              directly onto the road.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
