import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 transition-all"
          >
            Ekyaalo
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-lg font-medium px-3 py-2 rounded-md hover:bg-gray-700 hover:text-blue-300 transition-all duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/cases"
              className="text-lg font-medium px-3 py-2 rounded-md hover:bg-gray-700 hover:text-blue-300 transition-all duration-300"
            >
              Cases
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu (shown when isOpen is true) */}
        <div className={`${isOpen ? "block" : "hidden"} md:hidden`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-800 rounded-b-lg">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-white hover:bg-gray-700 hover:text-blue-300 rounded-md transition-all duration-300"
              onClick={toggleMenu}
            >
              Sign In
            </Link>
            <Link
              to="/cases"
              className="block px-3 py-2 text-base font-medium text-white hover:bg-gray-700 hover:text-blue-300 rounded-md transition-all duration-300"
              onClick={toggleMenu}
            >
              Cases
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
