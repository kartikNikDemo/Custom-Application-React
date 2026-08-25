import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import axiosInstance from '../BaseComponent/axiosInstance';

function CustomNavbar() {
  const [navbarList, setNavbarList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [canSeeModuleSetup, setcanSeeModuleSetup] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      const initialTheme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const root = window.document.documentElement;
      if (initialTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      return initialTheme;
    }
    return 'light';
  });


  useEffect(() => {
    // 1. Fetch modules
    fetchModules();

    // 2. Setup window resize listener
    if (typeof window !== 'undefined') {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);


  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === 'dark' ? 'light' : 'dark';
      const root = window.document.documentElement;
      if (nextTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('theme', nextTheme);
      return nextTheme;
    });
  };

  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));

  const getVisibleAndHiddenModules = () => {
    // Determine visibility limit based on Tailwind-style width breakpoints
    let limit = 3; // default for lg screens (>= 1024px)
    if (windowWidth >= 1536) {
      limit = 8; // 2xl screens (>= 1536px)
    } else if (windowWidth >= 1280) {
      limit = 5; // xl screens (>= 1280px)
    }

    return {
      visible: navbarList.slice(0, limit),
      hidden: navbarList.slice(limit)
    };
  };

  const { visible: visibleModules, hidden: hiddenModules } = getVisibleAndHiddenModules();

  const fetchModules = async () => {
    try {
      const moduleAccess = JSON.parse(localStorage.getItem("moduleAccess")) || [];
      const role = localStorage.getItem("role");
      const response = await axiosInstance.get("/module/getAllModule");
      console.log("Navbar modules:", response.data);
      let sortedModules = response.data || [];

      if (role === "ROLE_EMPLOYEE") {
        sortedModules = sortedModules.filter((module) => {
          const access = moduleAccess.find(
            (item) => String(item.moduleId) === String(module.id)
          );

          return access?.canView === true;
        });
      }

      if (role === "ROLE_ADMIN") {
        setcanSeeModuleSetup(true);
      }

      sortedModules.sort(
        (a, b) =>
          (Number(a.displayOrder) || 0) -
          (Number(b.displayOrder) || 0)
      );
      setNavbarList(sortedModules);
    } catch (error) {
      console.error("Error fetching navbar modules:", error);
    }
  };



  const handleLogout = () => {
    try {
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isSettingsActive = location.pathname.startsWith('/settings') || location.pathname.startsWith('/moduleSetup');
  const isEmployeeActive = location.pathname.startsWith('/employee');

  const canSeeEmployeeModule = () => {
    const role = localStorage.getItem("role");
    if (role === "ROLE_ADMIN") return true;
    const moduleAccess = JSON.parse(localStorage.getItem("moduleAccess")) || [];
    const access = moduleAccess.find(
      (item) => item.moduleId === "EMPLOYEE_MANAGEMENT"
    );
    return access?.canView === true;
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-gray-200/90 dark:border-gray-800/90 shadow-sm transition-all duration-300">
      {/* Top Ambient Gradient Accent Line */}
      <div className="h-[3px] w-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600"></div>

      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Left Side: Brand Logo & Navigation Module Links (Starting from LHS, No Icons) */}
          <div className="flex items-center gap-5 flex-1 min-w-0">
            {/* Brand Logo (Starting directly from LHS) */}
            <Link
              // to="/adminDashboard"
              className="flex items-center gap-2.5 shrink-0 group cursor-pointer"
              style={{ textDecoration: 'none' }}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <i className="fa-solid fa-cube text-sm"></i>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white font-sans">
                  Portal<span className="text-blue-600">Flow</span>
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/80 dark:border-blue-800/50 rounded-full shadow-2xs">
                  PRO
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links (Text only, active pill gradient, starting from LHS) */}
            <div className="hidden lg:flex items-center space-x-1.5 flex-1 min-w-0">
              {visibleModules.map((module) => {
                const targetPath = `/${module.moduleKey || module.name}/${module.id}`;
                const isActive = location.pathname === targetPath;

                return (
                  <Link
                    key={module.id || module.name}
                    to={targetPath}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20 scale-[1.02]"
                      : "!text-gray-900 dark:!text-gray-200 hover:!text-black dark:hover:!text-white hover:bg-gray-100/80 dark:hover:bg-gray-900/80 hover:scale-[1.01]"
                      }`}
                    style={{ textDecoration: 'none' }}
                  >
                    {module.name}
                  </Link>
                );
              })}

              {/* More Dropdown */}
              {hiddenModules.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setIsMoreOpen(!isMoreOpen)}
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer !text-gray-900 dark:!text-gray-200 hover:bg-gray-100/80 dark:hover:bg-gray-900/80 flex items-center gap-1.5 border-0 bg-transparent"
                  >
                    <span>More</span>
                    <i className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`}></i>
                  </button>

                  {isMoreOpen && (
                    <>
                      {/* Click-away backdrop */}
                      <div className="fixed inset-0 z-40" onClick={() => setIsMoreOpen(false)} />

                      <div className="absolute left-0 mt-2 w-48 rounded-2xl bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl border border-gray-200/80 dark:border-gray-800/80 shadow-lg py-2 z-50 animate-fadeIn">
                        {hiddenModules.map((module) => {
                          const targetPath = `/${module.moduleKey || module.name}/${module.id}`;
                          const isActive = location.pathname === targetPath;

                          return (
                            <Link
                              key={module.id || module.name}
                              to={targetPath}
                              onClick={() => setIsMoreOpen(false)}
                              className={`block px-4 py-2 text-sm font-semibold transition-all duration-150 ${isActive
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold"
                                : "!text-gray-900 dark:!text-gray-200 hover:!text-black dark:hover:!text-white hover:bg-gray-100/80 dark:hover:bg-gray-900/80"
                                }`}
                              style={{ textDecoration: 'none' }}
                            >
                              {module.name}
                            </Link>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              )}

              {canSeeModuleSetup && (
                <Link
                  to="/moduleSetup"
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${isSettingsActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20 scale-[1.02]"
                    : "!text-gray-900 dark:!text-gray-200 hover:!text-black dark:hover:!text-white hover:bg-gray-100/80 dark:hover:bg-gray-900/80 hover:scale-[1.01]"
                    }`}
                  style={{ textDecoration: 'none' }}
                >
                  Module Setup
                </Link>
              )}
              {canSeeEmployeeModule() && (
                <Link
                  to="/employee"
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap cursor-pointer ${isEmployeeActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20 scale-[1.02]"
                    : "!text-gray-900 dark:!text-gray-200 hover:!text-black dark:hover:!text-white hover:bg-gray-100/80 dark:hover:bg-gray-900/80 hover:scale-[1.01]"
                    }`}
                  style={{ textDecoration: 'none' }}
                >
                  Employees
                </Link>
              )}
            </div>
          </div>

          {/* Right Side (RHS): User Status & Log Out Button */}
          <div className="hidden lg:flex items-center gap-4 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-all duration-300 active:scale-95 cursor-pointer border-0"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <i className="fa-solid fa-sun text-amber-500 text-base transition-transform duration-500 hover:rotate-90"></i>
              ) : (
                <i className="fa-solid fa-moon text-indigo-600 text-base transition-transform duration-500 hover:-rotate-12"></i>
              )}
            </button>

            {/* Admin User Avatar Badge */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-900 to-slate-800 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-500/20 dark:ring-blue-400/30">
                A
              </div>
            </div>

            {/* Log Out Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200/90 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-gradient-to-r hover:from-rose-600 hover:to-red-600 hover:text-white hover:border-transparent text-xs font-bold transition-all duration-200 shadow-2xs hover:shadow-md hover:shadow-rose-500/20 cursor-pointer bg-transparent active:scale-95"
            >
              <i className="fa-solid fa-power-off text-xs"></i>
              <span>Log Out</span>
            </button>
          </div>

          {/* Mobile Theme Toggle & Hamburger */}
          <div className="flex items-center gap-2.5 lg:hidden">
            {/* Mobile Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 transition-all duration-300 active:scale-95 cursor-pointer border-0"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <i className="fa-solid fa-sun text-amber-500 text-base transition-transform duration-500 hover:rotate-90"></i>
              ) : (
                <i className="fa-solid fa-moon text-indigo-600 text-base transition-transform duration-500 hover:-rotate-12"></i>
              )}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-900/80 focus:outline-none border-0 bg-transparent cursor-pointer transition active:scale-95"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <i className="fa-solid fa-xmark text-xl text-gray-800 dark:text-gray-200"></i>
              ) : (
                <i className="fa-solid fa-bars-staggered text-xl text-gray-800 dark:text-gray-200"></i>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel Drawer */}
      {isOpen && (
        <div className="lg:hidden border-t border-gray-200/80 dark:border-gray-800/80 bg-white/95 dark:bg-gray-950/95 backdrop-blur-xl animate-fadeIn">
          <div className="px-4 pt-3 pb-3 space-y-1.5">
            {navbarList.map((module) => {
              const targetPath = `/${module.moduleKey || module.name}/${module.id}`;
              const isActive = location.pathname === targetPath;

              return (
                <Link
                  key={module.id || module.name}
                  to={targetPath}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20"
                    : "!text-gray-900 dark:!text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                    }`}
                  style={{ textDecoration: 'none' }}
                  onClick={() => setIsOpen(false)}
                >
                  {module.name}
                </Link>
              );
            })}
            {canSeeModuleSetup && (
              <Link
                to="/moduleSetup"
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isSettingsActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20"
                  : "!text-gray-900 dark:!text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                  }`}
                style={{ textDecoration: 'none' }}
                onClick={() => setIsOpen(false)}
              >
                Module Setup
              </Link>
            )}
            {canSeeEmployeeModule() && (
              <Link
                to="/employee"
                className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isEmployeeActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-500/20"
                  : "!text-gray-900 dark:!text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
                  }`}
                style={{ textDecoration: 'none' }}
                onClick={() => setIsOpen(false)}
              >
                Employees
              </Link>
            )}
          </div>

          {/* Mobile Log Out Button */}
          <div className="pt-3 pb-4 border-t border-gray-200/80 dark:border-gray-800/80 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Admin Session</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs font-bold hover:bg-rose-600 hover:text-white transition cursor-pointer"
            >
              <i className="fa-solid fa-power-off text-xs"></i>
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default CustomNavbar;
