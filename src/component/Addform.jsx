"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function AddCarPage() {
  // const [loading, setLoading] = useState(false);
  const { data: session, isPending } = authClient.useSession();
  const loading = isPending;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formFields = Object.fromEntries(formData.entries());

    const submissionData = {
      ...formFields,

      booking_count: 0,
      ownerEmail: session?.user?.email,
    };

    console.log("Submitting Car Data to Database:", submissionData);

    try {
      const response = await fetch("http://localhost:5000/api/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      // const result = await response.json();

      if (response.ok) {
        toast.success("DriveFleet vehicle listing added successfully!");

        redirect("/ExploreCarsPage");
      } else {
        toast.error(result.message || "Failed to finalize database insertion.");
      }
    } catch (err) {
      console.error("Network communication failure:", err);
      toast.error(
        "Database connection timeout. Verify local port configuration.",
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10">
        {/* Consistent Page Heading Style */}
        <div className="mb-8 border-b border-gray-100 pb-5">
          <h1 className="text-3xl font-extrabold text-gray-950 tracking-tight">
            Add Car Listing
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Fill out the detailed attributes below to register a vehicle to our
            platform distribution network.
          </p>
        </div>

        {/* Vehicle Management Input Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Field: Car Name */}
            <div>
              <label
                htmlFor="carName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Car Name
              </label>
              <input
                type="text"
                id="carName"
                name="carName"
                required
                placeholder="e.g., Tesla Model S Plaid"
                // value={formData.carName}
                // onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
              />
            </div>

            {/* Field: Daily Rent Price */}
            <div>
              <label
                htmlFor="dailyPrice"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Daily Rent Price ($)
              </label>
              <input
                type="number"
                id="dailyPrice"
                name="dailyPrice"
                required
                min="1"
                placeholder="e.g., 120"
                // value={formData.dailyPrice}
                // onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
              />
            </div>

            {/* Field: Car Type Dropdown */}
            <div>
              <label
                htmlFor="carType"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Car Type
              </label>
              <select
                id="carType"
                name="carType"
                // value={formData.carType}
                // onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-950 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm cursor-pointer"
              >
                <option value="SUV">SUV</option>
                <option value="Sedan">Sedan</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Luxury">Luxury</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Electric">Electric</option>
              </select>
            </div>

            {/* Field: Seat Capacity */}
            <div>
              <label
                htmlFor="seatCapacity"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Seat Capacity
              </label>
              <input
                type="number"
                id="seatCapacity"
                name="seatCapacity"
                required
                min="1"
                placeholder="e.g., 5"
                // value={formData.seatCapacity}
                // onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
              />
            </div>

            {/* Field: Image URL */}
            <div className="sm:col-span-2">
              <label
                htmlFor="imageUrl"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Image URL
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                required
                placeholder="Direct Link from Image Hosting Sites (e.g., https://i.ibb.co/...)"
                // value={formData.imageUrl}
                // onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
              />
            </div>

            {/* Field: Pickup Location */}
            <div>
              <label
                htmlFor="pickupLocation"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Pickup Location
              </label>
              <input
                type="text"
                id="pickupLocation"
                name="pickupLocation"
                required
                placeholder="e.g., Downtown Terminal, NY"
                // value={formData.pickupLocation}
                // onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
              />
            </div>

            {/* Field: Availability Status Dropdown */}
            <div>
              <label
                htmlFor="availabilityStatus"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Availability Status
              </label>
              <select
                id="availabilityStatus"
                name="availabilityStatus"
                // value={formData.availabilityStatus}
                // onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-950 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm cursor-pointer"
              >
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>

            {/* Field: Description */}
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows="4"
                placeholder="Provide details about the vehicle's features, mileage, fuel efficiency, or structural condition..."
                // value={formData.description}
                // onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-950 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm resize-none"
              ></textarea>
            </div>
          </div>

          {/* Submission and Layout Action buttons */}
          <div className="pt-4 border-t border-gray-100 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-lg border border-gray-200 font-medium text-gray-600 bg-white hover:bg-gray-50 transition text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center px-6 py-2.5 border border-transparent font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition shadow-sm text-sm disabled:opacity-70 disabled:cursor-not-allowed min-w-32.5"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                "Submit Car"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
