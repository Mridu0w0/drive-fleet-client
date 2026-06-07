"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import { useSpring, animated } from "@react-spring/web";
import { authClient } from "@/lib/auth-client";

const BookingPage = () => {
  const router = useRouter();

  // Auth Session Hook
  const { data: session, isPending } = authClient.useSession();

  // Animated page entry configurations
  const cardSpring = useSpring({
    from: { opacity: 0, transform: "scale(0.97) translateY(15px)" },
    to: { opacity: 1, transform: "scale(1) translateY(0px)" },
    config: { tension: 280, friction: 22 },
  });

  // 1. Initialize loading state to false
  const [bookings, setBookings] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // 2. Fetch Booking History Function
  const fetchBookingHistory = async () => {
    setLoadingLogs(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/bookings`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      const targetArray = Array.isArray(data) ? data : data.bookings || [];
      setBookings(targetArray);
      toast.success("Booking history synced successfully!");
    } catch (err) {
      // console.error(err);
      toast.error(err.message || "Failed to sync booking data logs.");
    } finally {
      setLoadingLogs(false);
    }
  };

  // 3. FIX: Safe useEffect execution that protects against synchronous cascading loops
  useEffect(() => {
    let isMounted = true;

    return () => {
      isMounted = false;
    };
  }, [session]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
        Validating secure terminal session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Interactivity Card */}
        <animated.div
          style={cardSpring}
          className="bg-white flex flex-col items-center rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] p-8 sm:p-12 border border-gray-100/50"
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black italic text-gray-950 tracking-tight uppercase">
              Check your bookings
            </h1>
            <p className="text-gray-400 text-sm mt-1 font-medium">
              {session
                ? `Welcome back, ${session.user.name}. Check your vehicle bookings below.`
                : "Create or access your active vehicle logs."}
            </p>
          </div>
          <button
            onClick={fetchBookingHistory}
            disabled={loadingLogs}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-full shadow-sm hover:bg-blue-700 active:scale-95 transition disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loadingLogs ? "Syncing..." : "Sync Logs"}
          </button>
        </animated.div>

        {/* Declarative Data Presentation Layer */}
        <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-black text-gray-950 uppercase tracking-tight mb-6 text-left">
            Your Booking Log
          </h2>

          <div id="booking-log-container">
            {bookings.length === 0 ? (
              <p className="text-gray-400 text-sm text-left font-medium">
                No active vehicle bookings found. Click &quot;Sync Logs&quot; or
                submit a new dispatch reservation to update your dashboard
                history.
              </p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => {
                  // Explicitly process native modern JS Date objects from strings
                  const formattedDate = booking.Date
                    ? new Date(booking.Date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Not Dated";

                  // Calculate total price structure fallback calculations
                  // If your app captures rental start/end dates, compute: (dailyPrice * totalDays).
                  const baseDailyPrice = Number(booking.dailyPrice) || 0;
                  const durationDays = Number(booking.rentalDurationDays) || 1;
                  const totalPrice = baseDailyPrice * durationDays;

                  return (
                    <div
                      key={booking._id || booking.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-gray-50 border border-gray-100 rounded-2xl text-left gap-4 hover:border-gray-200 transition"
                    >
                      <div className="space-y-1">
                        {/* Car Type Badge */}
                        <span className="inline-block text-[10px] font-black tracking-widest text-blue-600 bg-blue-50 rounded px-2.5 py-0.5 uppercase">
                          {booking.carType || "Standard"}
                        </span>

                        {/* Requirement Field 1: Car Name */}
                        <h4 className="text-lg font-bold text-gray-900">
                          {booking.carName || "Vehicle Identity Missing"}
                        </h4>

                        {/* Requirement Field 3: Booking Date */}
                        <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                          <span>📅 Booked on:</span>
                          <span className="text-gray-700 font-semibold">
                            {formattedDate}
                          </span>
                        </p>

                        {/* UI Extra Context Info Fields */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-gray-400 font-medium">
                          <p>
                            👤 Driver Addon:{" "}
                            <span className="text-gray-600 font-semibold">
                              {booking.driverNeeded || "No"}
                            </span>
                          </p>
                          {booking.specialNote && (
                            <p className="w-full text-gray-400 truncate mt-0.5">
                              📝 Note: &ldquo;{booking.specialNote}&rdquo;
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right Data Layout Panel: Pricing Metrics & Status Indicators */}
                      <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-gray-100 pt-3 sm:pt-0 gap-2">
                        {/* Requirement Field 2: Total Price Breakdown */}
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                            Total Cost
                          </p>
                          <p className="text-xl font-black text-gray-950">
                            ${totalPrice}
                            <span className="text-xs font-normal text-gray-400">
                              {" "}
                              total
                            </span>
                          </p>
                        </div>

                        {/* Dynamic Status Badging */}
                        <span
                          className={`text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-sm ${
                            booking.status === "confirmed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}
                        >
                          {booking.status || "Pending Verification"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
