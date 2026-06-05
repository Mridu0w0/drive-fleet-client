"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function UpdateCarForm({ carId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Non-editable static metadata
  const [carMeta, setCarMeta] = useState({ carName: "", seatCapacity: "" });

  // Controlled states for editable fields
  const [formData, setFormData] = useState({
    dailyPrice: "",
    carType: "SUV",
    imageUrl: "",
    pickupLocation: "",
    availabilityStatus: "Available",
    description: "",
  });

  // Fetch individual car data details on mount
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/cars/${carId}`);
        if (!response.ok) throw new Error("Failed to load car details");
        const data = await response.json();

        // Populate read-only metadata
        setCarMeta({
          carName: data.carName || "",
          seatCapacity: data.seatCapacity || "",
        });

        // Populate controlled form inputs
        setFormData({
          dailyPrice: data.dailyPrice || "",
          carType: data.carType || "SUV",
          imageUrl: data.imageUrl || "",
          pickupLocation: data.pickupLocation || "",
          availabilityStatus: data.availabilityStatus || "Available",
          description: data.description || "",
        });
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (carId) fetchCarDetails();
  }, [carId]);

  // Track field changes safely
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "dailyPrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const response = await fetch(`http://localhost:5000/api/cars/${carId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Car listing updated successfully!");
        router.push("/myAddedCars");
        router.refresh();
      } else {
        alert("Failed to update car listing.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-sm font-semibold text-gray-500">
        Loading car details...
      </div>
    );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-52 my-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Car Name - READ ONLY */}
        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-2">
            Car Name (Not Editable)
          </label>
          <input
            type="text"
            disabled
            value={carMeta.carName}
            className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-lg text-gray-400 cursor-not-allowed text-sm"
          />
        </div>

        {/* Daily Rent Price - EDITABLE */}
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
            value={formData.dailyPrice}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-950 text-sm"
          />
        </div>

        {/* Car Type - EDITABLE */}
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
            value={formData.carType}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-950 bg-white text-sm cursor-pointer"
          >
            <option value="SUV">SUV</option>
            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
            <option value="Luxury">Luxury</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Electric">Electric</option>
          </select>
        </div>

        {/* Seat Capacity - READ ONLY */}
        <div>
          <label className="block text-sm font-semibold text-gray-400 mb-2">
            Seat Capacity (Not Editable)
          </label>
          <input
            type="number"
            disabled
            value={carMeta.seatCapacity}
            className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-lg text-gray-400 cursor-not-allowed text-sm"
          />
        </div>

        {/* Image URL - EDITABLE */}
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
            value={formData.imageUrl}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-950 text-sm"
          />
        </div>

        {/* Pickup Location - EDITABLE */}
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
            value={formData.pickupLocation}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-950 text-sm"
          />
        </div>

        {/* Availability Status - EDITABLE */}
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
            value={formData.availabilityStatus}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-950 bg-white text-sm cursor-pointer"
          >
            <option value="Available">Available</option>
            <option value="Unavailable">Unavailable</option>
          </select>
        </div>

        {/* Description - EDITABLE */}
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
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-gray-950 text-sm resize-none"
          ></textarea>
        </div>
      </div>

      {/* Control Actions */}
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
          disabled={updating}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-white bg-blue-600 hover:bg-blue-700 font-medium text-sm disabled:opacity-70"
        >
          {updating ? "Updating..." : "Update Car"}
        </button>
      </div>
    </form>
  );
}
