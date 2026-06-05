"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function MyAddedCarsPage() {
  const router = useRouter();
  const [cars, setCars] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const loading = isPending;

  // Fetch cars tied to logged-in session user
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/cars");
        if (!response.ok) {
          throw new Error("Failed to fetch cars data");
        }
        const data = await response.json();

        const myOwnCars = data.filter(
          (car) => car.ownerEmail === session?.user?.email,
        );
        setCars(myOwnCars);
      } catch (err) {
        setError(err.message);
      }
    };

    if (session?.user) {
      fetchCars();
    }
  }, [session?.user]);

  // Handle Details Route Navigation
  const handleDetails = (car) => {
    router.push(`/ExploreCarsPage/${car._id}`);
  };

  // Handle Update Route Navigation (Moves to another page!)
  const handleUpdateNavigation = (carId) => {
    router.push(`/update/${carId}`);
  };

  // Handle Database Deletion Entry
  const handleDeleteConfirm = async () => {
    if (!selectedCar?._id) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/cars/${selectedCar._id}`,
        { method: "DELETE" },
      );
      const data = await response.json();

      if (response.ok) {
        setCars((prevCars) =>
          prevCars.filter((c) => c._id !== selectedCar._id),
        );
        setIsDeleteOpen(false);
        alert("Car deleted successfully!");
      } else {
        alert(`Failed to delete: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting car:", error);
      alert("An error occurred while deleting the car.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-6xl text-center">
        <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200 inline-block">
          ❌ Error: {error}. Make sure your Express server is running.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Added Cars</h1>

      <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <th className="px-6 py-4">Car Image</th>
              <th className="px-6 py-4">Car Name</th>
              <th className="px-6 py-4">Car Type</th>
              <th className="px-6 py-4 text-center">Booking Count</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm text-gray-700">
            {cars.map((car) => (
              <tr key={car._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative w-20 h-12">
                    <Image
                      width={200}
                      height={200}
                      src={car.imageUrl}
                      alt={car.carName}
                      className="w-full h-full object-cover rounded-md border border-gray-200"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {car.carName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    {car.carType}
                  </span>
                </td>
                <td className="px-6 py-4 text-center font-semibold whitespace-nowrap">
                  {car.booking_count || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => handleDetails(car)}
                      className="px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 text-xs font-medium transition"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleUpdateNavigation(car._id)}
                      className="px-3 py-1.5 bg-amber-500 text-white rounded hover:bg-amber-600 text-xs font-medium transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCar(car);
                        setIsDeleteOpen(true);
                      }}
                      className="px-3 py-1.5 bg-rose-600 text-white rounded hover:bg-rose-700 text-xs font-medium transition"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {cars.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-10 text-center text-gray-400"
                >
                  No cars found in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {isDeleteOpen && selectedCar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-sm p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-rose-100 text-rose-600 mb-4 text-xl">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Listing?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to remove{" "}
              <strong>{selectedCar.carName}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded hover:bg-rose-700 transition flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
