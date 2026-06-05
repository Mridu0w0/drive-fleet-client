"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSpring, animated } from "@react-spring/web";
import { toast, Toaster } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const ProfilePage = () => {
  const router = useRouter();

  // 1. Consume secure user session information from your Auth Context Client
  const { data: session, isPending } = authClient.useSession();

  // 2. Profile entrance physics animation sequence matching your page layout styles
  const entryAnimation = useSpring({
    from: { opacity: 0, transform: "scale(0.98) translateY(20px)" },
    to: { opacity: 1, transform: "scale(1) translateY(0px)" },
    config: { tension: 260, friction: 24 },
  });

  // Guard routing loading loops
  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">
        Validating secure dashboard profile session...
      </div>
    );
  }

  // Private route validation check fallback redirection
  if (!session) {
    toast.error("Please login to view your platform profile deck.");
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />

      <div className="max-w-4xl mx-auto">
        <animated.div
          style={entryAnimation}
          className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100/60 overflow-hidden"
        >
          {/* Header Banner Accents */}
          <div className="h-40 bg-gradient-to-r from-blue-600 to-indigo-700 relative" />

          {/* User Core Bio Panel Segment */}
          <div className="px-8 sm:px-12 pb-12 relative">
            <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 mb-8 gap-4">
              <div className="relative h-32 w-32 rounded-full border-4 border-white bg-gray-100 shadow-md overflow-hidden">
                <Image
                  src={
                    session.user?.image ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250"
                  }
                  alt={session.user?.name || "User Avatar"}
                  fill
                  sizes="128px"
                  className="object-cover"
                  priority
                />
              </div>

              {/* Navigation Actions Shortcuts */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => router.push("/AddCarPage")}
                  className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition shadow-sm"
                >
                  ➕ Add New Car
                </button>
                <button
                  onClick={() => router.push("/myBookings")}
                  className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
                >
                  📋 View My Bookings
                </button>
              </div>
            </div>

            {/* Profile Field Details Segment */}
            <div className="border-b border-gray-100 pb-8 text-center sm:text-left">
              <h1 className="text-3xl font-black italic text-gray-950 tracking-tight uppercase">
                {session.user?.name || "Drivefleet Driver"}
              </h1>
              <p className="text-gray-500 font-medium text-sm mt-1">
                📧 {session.user?.email}
              </p>
              <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                ⚡ Active Verification Session
              </div>
            </div>

            {/* Platform Analytics Cards Grid Section */}
            <div className="mt-8">
              <h2 className="text-lg font-black text-gray-950 uppercase tracking-tight mb-4">
                Drivefleet Member Statistics
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* Stat block 1 */}
                <div className="p-5 bg-gray-50 border border-gray-100 rounded-2xl">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Authorized Level
                  </p>
                  <p className="text-2xl font-black text-blue-600 mt-1">
                    Verified Owner
                  </p>
                </div>

                {/* Stat block 2 */}
                <div
                  className="p-5 bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer hover:border-blue-200 transition"
                  onClick={() => router.push("/myBookings")}
                >
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Active Bookings Tracked
                  </p>
                  <p className="text-2xl font-black text-gray-950 mt-1">
                    View Logs &rarr;
                  </p>
                </div>

                {/* Stat block 3 */}
                <div
                  className="p-5 bg-gray-50 border border-gray-100 rounded-2xl cursor-pointer hover:border-blue-200 transition"
                  onClick={() => router.push("/myAddedCars")}
                >
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    My Fleets Listed
                  </p>
                  <p className="text-2xl font-black text-gray-950 mt-1">
                    Manage Inventory &rarr;
                  </p>
                </div>
              </div>
            </div>

            {/* Compliance Note Section */}
            <div className="mt-8 p-5 bg-blue-50/50 border border-blue-100 rounded-2xl text-left">
              <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
                🔒 Security Note
              </h4>
              <p className="text-xs text-blue-600/90 leading-relaxed font-medium">
                Your profile credentials are encrypted and verified using secure
                JSON Web Tokens stored in HttpOnly cookies[cite: 175, 178].
                Database listings can only be edited or deleted by verified
                owners[cite: 142, 151].
              </p>
            </div>
          </div>
        </animated.div>
      </div>
    </div>
  );
};

export default ProfilePage;
