import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & Mission Statement Column */}
          <div className="space-y-4">
            <Link
              href="/"
              className="text-2xl font-bold text-white tracking-tight hover:text-blue-400 transition"
            >
              DriveFleet
            </Link>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              Premium automotive marketplace and rental ecosystem. Discover
              perfect configurations, verify bookings atomically, or list your
              private vehicles seamlessly.
            </p>
          </div>

          {/* Marketplace Fleet Exploration Links */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Explore Fleet
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-400 transition duration-150"
                >
                  Home Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/ExploreCarsPage"
                  className="hover:text-blue-400 transition duration-150"
                >
                  Find Vehicles
                </Link>
              </li>
            </ul>
          </div>

          {/* Management Dashboard Operations Links */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Hosting Operations
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/addcars"
                  className="hover:text-blue-400 transition duration-150"
                >
                  Register / Add Car
                </Link>
              </li>
              <li>
                <Link
                  href="/myBookings"
                  className="hover:text-blue-400 transition duration-150"
                >
                  My Bookings Terminal
                </Link>
              </li>
              <li>
                <Link
                  href="/my-added-cars"
                  className="hover:text-blue-400 transition duration-150"
                >
                  Manage Fleet Inventory
                </Link>
              </li>
            </ul>
          </div>

          {/* Corporate Support & Contact Node (Mapped from your schemas) */}
          <div>
            <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
              Logistics & Support
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex flex-col">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Administrator Identity
                </span>
                <span className="text-gray-200 font-medium mt-0.5">
                  admin@drivefleet.com
                </span>
              </li>
              <li className="flex flex-col">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Central Logistics Hub
                </span>
                <span className="text-gray-200 font-medium mt-0.5">
                  Brooklyn Central Stop, NY
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Structural Divider Line */}
        <hr className="border-gray-800 my-8" />

        {/* Bottom Metadata & Legal Compliance Nodes */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500 space-y-4 sm:space-y-0">
          <p>
            &copy; {new Date().getFullYear()} DriveFleet Marketplace Network.
            All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className="hover:text-gray-400 transition duration-150"
            >
              Privacy Contract
            </Link>
            <Link
              href="/terms"
              className="hover:text-gray-400 transition duration-150"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
