"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react"; // or your custom session hook
import { toast } from "react-hot-toast"; // assuming react-hot-toast is used
import { authClient } from "@/lib/auth-client";

const BookingActionButton = ({
  availabilityStatus,
  carType,
  carName,
  carId,
  dailyPrice,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const submitButtonRef = useRef(null);
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const loading = isPending;

  const openModal = () => {
    if (!session) {
      toast.error("Please login to access your booking deck");
      router.push("/login");
      return;
    }
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const onSubmit = (e) => {
    e.preventDefault();

    if (!session) {
      toast.error("Please login to access your booking deck");
      router.push("/login");
      return;
    }

    if (submitButtonRef.current) {
      submitButtonRef.current.disabled = true;
      submitButtonRef.current.innerText = "Processing Dispatch Reservation...";
    }

    const formData = new FormData(e.currentTarget);
    const formPayload = Object.fromEntries(formData.entries());

    // Explicitly construct the payload matching your backend expectations
    const bookingPayload = {
      // Fields captured by your HTML form name attributes
      driverNeeded: formPayload.driverNeeded,
      specialNote: formPayload.specialNote, // This maps to your description/notes field

      // Fields injected from component props
      carId: carId,
      carName: carName,
      carType: carType,
      dailyPrice: dailyPrice,

      // User info
      userEmail: session.user?.email,
      userName: session.user?.name,

      Date: new Date().toISOString(),
    };

    //jwt
    // const { data: tokenData } = authClient.token();

    fetch("http://localhost:5000/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${tokenData?.token}`,
      },
      body: JSON.stringify(bookingPayload),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          toast.error(result.error || "Failed to submit booking");
          if (submitButtonRef.current) {
            submitButtonRef.current.disabled = false;
            submitButtonRef.current.innerText = "Confirm Fleet Booking";
          }
          return;
        }

        toast.success("Drivefleet booking created successfully!");
        e.target.reset(); // Native form reset clear-out
        closeModal();

        // Optional: Trigger global history paints if defined contextually
        // if (typeof fetchBookingHistory === "function") fetchBookingHistory();

        router.push("/myBookings"); // Send user to view confirmation deck
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          "Synchronization issue. Verify backend environment key setup.",
        );
        if (submitButtonRef.current) {
          submitButtonRef.current.disabled = false;
          submitButtonRef.current.innerText = "Confirm Fleet Booking";
        }
      });
  };

  return (
    <>
      <button
        onClick={openModal}
        disabled={availabilityStatus !== "Available"}
        className={`w-full py-3 px-4 rounded-xl font-bold text-white transition-all shadow-md ${
          availabilityStatus === "Available"
            ? "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {availabilityStatus === "Available" ? "Book Now" : "Unavailable"}
      </button>

      {/* Modal Overlay backdrop Container */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all border border-gray-100">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-50 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Reserve Vehicle
                </h3>
                <p className="text-xs text-gray-500">
                  {carName} ({carType})
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-xl font-medium p-1 leading-none"
              >
                &times;
              </button>
            </div>

            {/* Modal Body / Booking Form */}
            <form onSubmit={onSubmit} className="p-6 space-y-4">
              {/* Driver Needed Option */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Driver Needed?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-slate-50 transition-all has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50/50">
                    <input
                      type="radio"
                      name="driverNeeded"
                      value="Yes"
                      defaultChecked
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      Yes
                    </span>
                  </label>
                  <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-slate-50 transition-all has-checked:border-blue-600 has-checked:bg-blue-50/50">
                    <input
                      type="radio"
                      name="driverNeeded"
                      value="No"
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-800">
                      No
                    </span>
                  </label>
                </div>
              </div>

              {/* Special Notes Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Special Note
                </label>
                <textarea
                  name="specialNote"
                  rows={3}
                  placeholder="Any extra preferences, setup instructions or pickup times..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder-gray-400 transition-all resize-none"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  ref={submitButtonRef}
                  className="flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-sm font-bold text-white shadow-md transition-all"
                >
                  Confirm Fleet Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingActionButton;
