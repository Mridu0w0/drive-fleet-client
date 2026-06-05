"use client";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const loading = isPending;

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pathname = usePathname();
  const isActive = (path) => pathname === path;

  const handleLogout = async () => {
    await authClient.signOut();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <div className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo Section */}
          <div className="shrink-0 flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold text-blue-600 tracking-tight"
            >
              DriveFleet
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link
              href="/"
              className={`font-medium transition duration-150 ${isActive("/") ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
            >
              Home
            </Link>
            <Link
              href="/ExploreCarsPage"
              className={`font-medium transition duration-150 ${isActive("/ExploreCarsPage") ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
            >
              Explore Cars
            </Link>
            <Link
              href="/about"
              className={`font-medium transition duration-150 ${isActive("/about") ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
            >
              About
            </Link>

            {session && (
              <>
                <Link
                  href="/addcars"
                  className={`font-medium transition duration-150 ${isActive("/addcars") ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
                >
                  Add Car
                </Link>
                <Link
                  href="/myBookings"
                  className={`font-medium transition duration-150 ${isActive("/myBookings") ? "text-blue-600" : "text-gray-700 hover:text-blue-600"}`}
                >
                  My Bookings
                </Link>
              </>
            )}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex navbar-end gap-2 w-auto">
            {isPending ? (
              <span></span>
            ) : !session ? (
              <div className="flex gap-2">
                <Link
                  href="/register"
                  className={`btn btn-sm md:btn-md ${isActive("/register") ? "btn-primary" : "btn-outline btn-primary"}`}
                >
                  Register
                </Link>
                <Link
                  href="/login"
                  className={`btn btn-sm md:btn-md ${isActive("/login") ? "btn-primary" : "btn-outline btn-primary"}`}
                >
                  Login
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`avatar placeholder online focus:outline-none ${isActive("/profile") ? "ring ring-primary ring-offset-2 rounded-full" : ""}`}
                  >
                    <div className="bg-neutral text-neutral-content rounded-full w-8 md:w-10 overflow-hidden relative border border-gray-200">
                      <Image
                        src={
                          session.user?.image ||
                          "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                        }
                        alt="Profile"
                        width={40}
                        height={40}
                        className="object-cover h-full w-full"
                      />
                    </div>
                  </button>

                  {/* Desktop Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {session.user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      <Link
                        href="/ProfilePage"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/addcars"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Add Car
                      </Link>
                      <Link
                        href="/myBookings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Bookings
                      </Link>
                      <Link
                        href="/myAddedCars"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Added Cars
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium border-t border-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Hamburger Menu Button (Mobile view) */}
          <div className="-mr-2 flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden bg-white border-t border-gray-100 shadow-inner"
          id="mobile-menu"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/ExploreCarsPage"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Explore Cars
            </Link>
          </div>

          {/* Mobile Profile Display and Auth Controls */}
          <div className="pt-4 pb-3 border-t border-gray-200">
            {loading ? (
              <div className="px-4 flex items-center justify-between animate-pulse">
                <div className="h-10 w-10 rounded-full bg-gray-200" />
              </div>
            ) : session ? (
              <div>
                {/* Clickable Mobile User Header Block */}
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-full px-4 flex items-center text-left focus:outline-none active:bg-gray-50 py-2"
                >
                  <div className="shrink-0">
                    <Image
                      height={40}
                      width={40}
                      className="h-10 w-10 rounded-full object-cover border border-gray-200"
                      src={
                        session.user?.image ||
                        "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
                      }
                      alt={session.user?.name || "User Avatar"}
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="text-base font-medium text-gray-800">
                      {session.user?.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {session.user?.email}
                    </div>
                  </div>
                  {/* Small chevron arrow indicators */}
                  <span className="text-gray-400 text-xs">
                    {isProfileOpen ? "▲" : "▼"}
                  </span>
                </button>

                {/* Collapsible Mobile Links (Displays on photo click) */}
                {isProfileOpen && (
                  <div className="px-4 mt-2 space-y-1 bg-gray-50/50 py-2 border-y border-gray-100">
                    <Link
                      href="/profile"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsProfileOpen(false);
                      }}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/addcars"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsProfileOpen(false);
                      }}
                    >
                      Add Car
                    </Link>
                    <Link
                      href="/myBookings"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsProfileOpen(false);
                      }}
                    >
                      My Bookings
                    </Link>
                    <Link
                      href="/myAddedCars"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-blue-600"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsProfileOpen(false);
                      }}
                    >
                      My Added Cars
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition border-t border-gray-100 mt-1"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="px-4 grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-200 text-base font-medium rounded-md text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
