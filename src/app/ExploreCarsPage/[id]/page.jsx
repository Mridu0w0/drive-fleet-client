import Image from "next/image";
import React from "react";
import BookingActionButton from "@/component/BookingActionButton";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const CarDetails = async ({ params }) => {
  const { id } = await params;

  const token = await auth.api.getToken({ headers: await headers() });

  console.log("Car ID:", id);
  const res = await fetch(`http://localhost:5000/api/cars/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const car = await res.json();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <span className="text-sm text-gray-500">
          Cars / {car.carType} / {car.carName}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="w-full h-100 rounded-2xl overflow-hidden shadow-md">
            <Image
              width={400}
              height={300}
              src={car.imageUrl}
              alt={car.carName}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-800 bg-blue-100 rounded-full mb-2">
              {car.carType}
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900">
              {car.carName}
            </h1>
          </div>

          <hr className="border-gray-200" />

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                Capacity
              </p>
              <p className="text-lg font-bold text-gray-800 mt-1">
                {car.seatCapacity} Seats
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                Total Bookings
              </p>
              <p className="text-lg font-bold text-gray-800 mt-1">
                {car.booking_count} trips
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 col-span-2 md:col-span-1">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">
                Location
              </p>
              <p
                className="text-sm font-bold text-gray-800 mt-1 truncate"
                title={car.pickupLocation}
              >
                {car.pickupLocation}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed">{car.description}</p>
          </div>

          <hr className="border-gray-200" />

          <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              DF
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Managed by</p>
              <p className="text-sm font-semibold text-gray-700">
                {car.ownerEmail}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="border border-gray-200 rounded-2xl p-6 shadow-sm sticky top-6 bg-white space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-3xl font-black text-gray-900">
                  ${car.dailyPrice}
                </span>
                <span className="text-gray-500 text-sm"> / day</span>
              </div>
              <div>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    car.availabilityStatus === "Available"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      car.availabilityStatus === "Available"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  ></span>
                  {car.availabilityStatus}
                </span>
              </div>
            </div>

            {/* Injected additional props for the payload */}
            <BookingActionButton
              availabilityStatus={car.availabilityStatus}
              carType={car.carType}
              carName={car.carName}
              carId={car._id}
              dailyPrice={car.dailyPrice}
            />

            <div className="text-xs text-gray-500 space-y-2 pt-2">
              <div className="flex items-center gap-2">
                <p>✅ Free cancellation up to 24 hours before pickup</p>
              </div>
              <div className="flex items-center gap-2">
                <p>✅ Insurance pre-included by DriveFleet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
