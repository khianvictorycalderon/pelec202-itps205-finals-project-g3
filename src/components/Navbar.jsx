import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-2
     ${
       isActive
         ? 'bg-cyan-600 text-white'
         : 'text-cyan-300 hover:text-white hover:bg-cyan-600'
     }`;

  const mobileLinkClass = ({ isActive }) =>
    `w-full text-center px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2
     ${
       isActive
         ? 'bg-cyan-600 text-white'
         : 'text-cyan-300 hover:text-white hover:bg-cyan-600'
     }`;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-sky-900 px-4 py-3 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* --- Logo --- */}
          <div className="flex items-center space-x-3">
            <img
              src="images/GHO_Logo.png"
              alt="Logo"
              className="h-12 w-12 object-cover rounded-full bg-white p-1"
            />
            <span className="text-cyan-300 font-bold text-lg hidden sm:block">
              Global Health Observatory System
            </span>
          </div>

          {/* --- Desktop Menu --- */}
          <div className="hidden md:flex space-x-4">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>

            <NavLink to="/browse" className={linkClass}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </NavLink>
          </div>

          {/* --- Mobile Button --- */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-cyan-300 hover:text-white"
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* --- Mobile Menu --- */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 pb-2 flex flex-col items-center space-y-2">

            <NavLink
              to="/"
              className={mobileLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/browse"
              className={mobileLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </NavLink>

          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;