"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react"; // or your custom session hook
import { toast } from "react-hot-toast"; // assuming react-hot-toast is used
import { authClient } from "@/lib/auth-client";
import { createAuthClient } from "better-auth/client";
// import { createAuthClient } from "better-auth/client";

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

  const onSubmit = async (e) => {
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

    const bookingPayload = {
      driverNeeded: formPayload.driverNeeded,
      specialNote: formPayload.specialNote,

      carId: carId,
      carName: carName,
      carType: carType,
      dailyPrice: dailyPrice,

      userEmail: session.user?.email,
      userName: session.user?.name,

      Date: new Date().toISOString(),
    };

    try {
      const sessionContext = await authClient.getSession();

      const { data: tokenData } = await authClient.token();

      fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData?.token || ""}`,
        },
        body: JSON.stringify(bookingPayload),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
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
          e.target.reset();
          closeModal();

          router.push("/myBookings");
        })
        .catch((err) => {
          // console.error("Backend dispatch error:", err);
          toast.error(
            "Booking failed. Please check authorization properties.",
            err,
          );
          if (submitButtonRef.current) {
            submitButtonRef.current.disabled = false;
            submitButtonRef.current.innerText = "Confirm Fleet Booking";
          }
        });
    } catch (authError) {
      // console.error("Auth initialization failure:", authError);
      toast.error("Failed to secure active user token wrapper.", authError);
      if (submitButtonRef.current) {
        submitButtonRef.current.disabled = false;
        submitButtonRef.current.innerText = "Confirm Fleet Booking";
      }
    }
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
                  <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 cursor-pointer hover:bg-slate-50 transition-all has-checked:border-blue-600 has-checked:bg-blue-50/50">
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
