"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

export default function ExploreCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and Filter States (Challenge requirements)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  const gridContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  {
    /* Card Item variants: Dictates entry paths and interaction behaviors.
  Combines fade-in entry paths with slight hover escalations.
*/
  }
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 24,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
    hover: {
      y: -6,
      scale: 1.01,
      boxShadow:
        "0 10px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
      },
    },
  };

  // Fetch data dynamically based on active search and filter choices
  useEffect(() => {
    const fetchFilteredCars = async () => {
      try {
        setLoading(true);
        setError(null);

        // Synchronizes with the MongoDB backend query parameter system
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append("search", searchQuery);
        if (selectedType && selectedType !== "All")
          queryParams.append("type", selectedType);

        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(
          `${baseUrl}/api/cars?${queryParams.toString()}`,
        );

        if (!response.ok) {
          throw new Error(
            "Failed to retrieve vehicle inventory. Please try reloading.",
          );
        }

        const data = await response.json();
        setCars(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Debounce/Trigger fetching when queries alter
    const delayDebounceFn = setTimeout(() => {
      fetchFilteredCars();
    }, 400); // 400ms debounce to prevent spamming backend on every single keystroke

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, selectedType]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Consistent Main Heading Style */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-950 tracking-tight">
            Explore Fleet
          </h1>
          <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-base">
            Search, filter, and discover your next drive from our comprehensive,
            up-to-date vehicular catalog.
          </p>
        </div>

        {/* Challenge Section: Search and Filter Control Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-10 flex flex-col sm:flex-row gap-4 items-center justify-between">
          {/* Search Input Box (Regex matching on Backend) */}
          <div className="w-full sm:max-w-md relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search cars by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
            />
          </div>

          {/* Car Type Dropdown Filter */}
          <div className="w-full sm:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-950 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="SUV">SUV</option>
              <option value="Sedan">Sedan</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Luxury">Luxury</option>
              <option value="Electric">Electric</option>
            </select>
          </div>
        </div>

        {/* Requirement: Loading Spinner during fetch states */}
        {loading && (
          <div className="flex justify-center items-center min-h-75">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Requirement: Custom inline error alerts (No default windows alerts) */}
        {error && !loading && (
          <div className="max-w-xl mx-auto my-8 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-center shadow-inner">
            <p className="font-semibold text-sm">Data Loading Error</p>
            <p className="text-xs mt-1 text-red-600">{error}</p>
          </div>
        )}

        {/* Main Interface Layout: Grid with absolute equal heights & widths */}
        {!loading && !error && (
          <>
            <motion.div
              variants={gridContainerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {cars.map((car) => (
                /* Convert individual wrapper anchors into motion.div cards */
                <motion.div
                  key={car._id}
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col h-full shadow-sm transition-shadow duration-200"
                >
                  {/* Aspect Ratio Box to enforce identical picture spaces across layout columns */}
                  <div className="relative h-52 w-full bg-gray-100 shrink-0">
                    <Image
                      height={250}
                      width={400}
                      src={
                        car.imageUrl || "https://via.placeholder.com/400x250"
                      }
                      alt={car.carName}
                      className="w-full h-full object-cover"
                    />

                    {/* Status Badge - Explicitly displays available or unavailable units */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                          car.availabilityStatus === "Available"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {car.availabilityStatus}
                      </span>
                    </div>
                  </div>

                  {/* Card Main Body Content - flex-grow keeps structural consistency across asymmetric description strings */}
                  <div className="p-6 flex flex-col grow">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-950 truncate">
                        {car.carName}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 uppercase tracking-wider">
                        {car.carType}
                      </span>
                    </div>

                    {/* Non-lorem contextual card text body */}
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4 grow">
                      {car.description ||
                        "Premium clean layout detailing full high-end passenger features and complete rental tracking conditions."}
                    </p>

                    {/* Informative Grid Details Segment */}
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 border-t border-b border-gray-50 py-3 mb-4 text-xs font-medium text-gray-600">
                      <div className="flex items-center gap-1.5 truncate">
                        <svg
                          className="h-4 w-4 text-gray-400 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        <span className="truncate">{car.pickupLocation}</span>
                      </div>
                      <div className="flex items-center gap-1.5 justify-end">
                        <svg
                          className="h-4 w-4 text-gray-400 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                          />
                        </svg>
                        <span>{car.seatCapacity} Seats</span>
                      </div>
                    </div>

                    {/* Card Price / Call-To-Action Footer */}
                    <div className="flex justify-between items-center mt-auto pt-2">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                          Daily Rate
                        </p>
                        <p className="text-xl font-black text-blue-600">
                          ${car.dailyPrice}
                          <span className="text-xs font-normal text-gray-400">
                            /day
                          </span>
                        </p>
                      </div>

                      {/* Requirement: Consistent Details Navigation Button */}
                      <Link
                        href={`/ExploreCarsPage/${car._id}`}
                        className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition shadow-sm"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Handle Empty State Outputs gracefully */}
            {cars.length === 0 && (
              <div className="text-center bg-white rounded-xl border border-gray-100 p-12 max-w-md mx-auto my-6">
                <svg
                  className="mx-auto h-12 w-12 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-4 text-sm font-bold text-gray-900">
                  No Vehicles Match Query
                </h3>
                <p className="mt-2 text-xs text-gray-500">
                  Try refining your search text spelling or choosing an
                  alternative category filter type.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
