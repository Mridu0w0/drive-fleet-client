import React from "react";
import Image from "next/image";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-600 selection:text-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-950 via-slate-900 to-blue-950 py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <span className="inline-block px-4 py-1.5 text-xs font-black tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-full uppercase">
            On-Demand Logistics
          </span>
          <h1 className="text-4xl sm:text-6xl font-black italic tracking-tight text-white uppercase">
            THE FORCE BEHIND <br className="hidden sm:inline" /> Your Next
            Journey
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 font-medium leading-relaxed">
            DriveFleet engineer premium transit ecosystems for creators,
            professionals, and scaling enterprise networks. No complications. No
            compromises.
          </p>
        </div>
      </section>

      {/* Strategic Vision Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-gray-950 uppercase italic">
              REDEFINING MODERN HIGHWAY DEPLOYMENT
            </h2>
            <div className="space-y-4 text-gray-600 text-sm sm:text-base leading-relaxed">
              <p>
                Founded on the philosophy that modern transportation should
                adapt to human scheduling rather than constraints, DriveFleet
                merges software with high-end machinery.
              </p>
              <p>
                We do not just provide generic vehicle alternatives. We supply
                certified infrastructure that meets strict safety baselines and
                satisfies rigorous performance metrics. Every asset inside our
                database undergoes thorough automated diagnostic tracking to
                guarantee complete peace of mind.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-blue-600">
                  99.4%
                </p>
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                  Uptime SLA
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-gray-950">
                  24k+
                </p>
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                  Active Trips
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-gray-950">
                  100%
                </p>
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">
                  Carbon Neutral
                </p>
              </div>
            </div>
          </div>

          {/* Visual Presentation Element */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <div className="relative aspect-[4/3] w-full bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100">
              {/* Fallback pattern graphic when actual vehicle files are omitted */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/40 to-slate-950 opacity-90 z-10 flex flex-col justify-end p-8 text-left">
                <span className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-2">
                  DriveFleet Premium Core
                </span>
                <p className="text-lg font-bold text-white uppercase tracking-tight">
                  Systematic Fleet Allocation Intelligence
                </p>
              </div>
              {/* Optional: Swap the pattern container below with a realistic car Image element if preferred */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:16px_16px] opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="bg-gray-50 py-20 px-4 border-y border-gray-100">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-950 uppercase italic">
              OUR OPERATIONAL OPERATING VALUES
            </h2>
            <p className="text-sm text-gray-400 max-w-md mx-auto font-medium">
              The rules driving our logistics stack forwards daily.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 bg-white border border-gray-200/60 rounded-3xl text-left shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 font-bold rounded-xl flex items-center justify-center text-sm mb-5">
                01
              </div>
              <h3 className="text-base font-black text-gray-950 uppercase tracking-tight mb-2">
                Automated Execution
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                Our architecture handles dynamic tokens and direct profile
                storage mechanics cleanly behind the scenes, processing
                dispatches instantaneously.
              </p>
            </div>

            <div className="p-8 bg-white border border-gray-200/60 rounded-3xl text-left shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 font-bold rounded-xl flex items-center justify-center text-sm mb-5">
                02
              </div>
              <h3 className="text-base font-black text-gray-950 uppercase tracking-tight mb-2">
                Transparent Framework
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                No tracking fees, surprise premiums, or obscured policy layers.
                What you see logged inside your secure session log history is
                exactly what you receive.
              </p>
            </div>

            <div className="p-8 bg-white border border-gray-200/60 rounded-3xl text-left shadow-sm hover:shadow-md transition">
              <div className="w-10 h-10 bg-blue-50 text-blue-600 font-bold rounded-xl flex items-center justify-center text-sm mb-5">
                03
              </div>
              <h3 className="text-base font-black text-gray-950 uppercase tracking-tight mb-2">
                Sustained Continuity
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">
                We design with high performance and low dependency footprints in
                mind. Our workflows optimize asset movement efficiently across
                active global regions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Conversion Deck */}
      <section className="max-w-5xl mx-auto px-4 py-24 text-center">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 sm:p-16 shadow-lg text-white space-y-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ffffff10_0%,transparent_60%)]"></div>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight italic relative z-10">
            READY TO COMMENCE YET?
          </h2>
          <p className="max-w-lg mx-auto text-sm sm:text-base text-blue-100 font-medium opacity-90 relative z-10">
            Gain immediate terminal visibility. Secure deployment variables,
            configure classifications, and map operations directly from your
            central interface.
          </p>
          <div className="pt-4 relative z-10">
            <a
              href="/bookings"
              className="inline-block bg-white hover:bg-gray-50 active:scale-[0.99] text-gray-950 font-bold px-8 py-4 rounded-full shadow-md transition text-sm tracking-wide uppercase"
            >
              Configure Fleet Reservation
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
