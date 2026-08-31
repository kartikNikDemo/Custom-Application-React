import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-indigo-500/30 overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-blue-600/20 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDelay: "4s" }}></div>
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">AppForge</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link to="/register" className="text-sm font-medium bg-white text-black hover:bg-gray-200 px-5 py-2.5 rounded-full transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Start Building
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300 mb-8 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping absolute"></span>
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 relative"></span>
          AppForge 2.0 is now live
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-8 leading-[1.1]">
          Build Custom Apps. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400">
            Without Limits.
          </span>
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Design, deploy, and scale tailor-made applications for your business. No coding required. Empower your team with the tools they actually need.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/register" className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-semibold text-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all hover:scale-105">
            Create Your App Free
          </Link>
          <Link to="/login" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all backdrop-blur-sm">
            View Demo
          </Link>
        </div>

        {/* Floating UI Mockup Representation */}
        <div className="mt-24 relative max-w-5xl mx-auto" style={{ perspective: "1000px" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-20 top-1/2"></div>
          <div 
            className="w-full h-80 md:h-[500px] rounded-t-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-700 ease-out border-b-0 group"
            style={{ transform: "rotateX(12deg) translateY(1rem)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "rotateX(0deg) translateY(0)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "rotateX(12deg) translateY(1rem)";
            }}
          >
            {/* Mockup Header */}
            <div className="h-12 border-b border-white/10 flex items-center px-4 gap-2 bg-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <div className="ml-4 h-6 w-48 bg-white/10 rounded-md"></div>
            </div>
            {/* Mockup Body */}
            <div className="flex-1 p-6 flex gap-6">
              {/* Sidebar */}
              <div className="w-48 hidden md:flex flex-col gap-3">
                <div className="h-8 w-full bg-white/10 rounded-md"></div>
                <div className="h-8 w-3/4 bg-white/5 rounded-md"></div>
                <div className="h-8 w-5/6 bg-white/5 rounded-md"></div>
                <div className="h-8 w-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-md flex items-center px-3 text-xs">Modules</div>
              </div>
              {/* Main Content Area */}
              <div className="flex-1 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <div className="h-8 w-32 bg-white/10 rounded-md"></div>
                  <div className="h-8 w-24 bg-fuchsia-500/20 rounded-md"></div>
                </div>
                <div className="flex-1 border border-white/5 rounded-xl bg-white/5 p-4 flex gap-4 flex-wrap content-start">
                  {/* Grid Items */}
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-24 w-32 bg-white/5 border border-white/5 rounded-lg flex flex-col p-3 gap-2 hover:bg-white/10 transition-colors cursor-pointer group-hover:bg-white/10 duration-500" style={{ transitionDelay: `${i * 50}ms` }}>
                      <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500/40 to-fuchsia-500/40"></div>
                      <div className="h-2 w-16 bg-white/20 rounded-full mt-auto"></div>
                      <div className="h-2 w-10 bg-white/10 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="relative z-10 border-t border-white/5 bg-black/50 backdrop-blur-sm py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to build</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Stop waiting for IT. Create custom data models, intuitive interfaces, and automated workflows in a fraction of the time.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6 border border-indigo-500/30 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Custom Data Modules</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Define your own schemas, fields, and relationships. Whether it's employees, inventory, or projects, structure data your way.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-500/20 flex items-center justify-center mb-6 border border-fuchsia-500/30 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Deployment</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Changes go live instantly. Add a new field or create a new module, and your users see the updates in real-time without downtime.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Enterprise Grade</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Built with robust security, role-based access control, and scalable architecture to handle your most critical business operations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-fuchsia-500"></div>
            <span className="font-semibold text-gray-300">AppForge</span>
          </div>
          <p>© {new Date().getFullYear()} AppForge. Empowering creators.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
