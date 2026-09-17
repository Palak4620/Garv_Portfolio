import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "./Garv_logo_enhanched.png";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);

  return (
    <header className="flex justify-between items-center px-4 md:px-16 py-4 relative max-w-7xl mx-auto w-full z-50">

      {/* ================= LOGO ================= */}
      <Link
        to="/"
        onClick={() => {
          setMenuOpen(false);
          setExploreOpen(false);
        }}
        className="cursor-pointer"
      >
        <motion.img
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          src={logo}
          alt="Garv Logo"
          className="h-10 w-auto"
        />
      </Link>

      {/* ================= DESKTOP NAV ================= */}
      <nav className="hidden md:flex items-center gap-8">

        {/* HOME */}
        <Link
          to="/"
          className="text-gray-300 hover:text-white transition"
        >
          Home
        </Link>

        {/* EXPLORE */}
        <div className="relative group">

          <button
            type="button"
            className="text-gray-300 hover:text-white flex items-center gap-1 transition"
          >
            Explore

            <span className="text-xs transition-transform duration-200 group-hover:rotate-180">
              ▾
            </span>
          </button>

          {/* Explore Dropdown */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">

            <div className="w-60 bg-[#1f1f1f] border border-white/10 rounded-xl shadow-xl py-2">

              {/* Promo Videos */}
              <Link
                to="/works/promo-videos"
                className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                🎬 Promo Videos
              </Link>

              {/* Logo Animations */}
              <Link
                to="/works/logo-animations"
                className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                ✨ Logo Animations
              </Link>

              {/* Short-form Content */}
              <Link
                to="/works/short-form-content"
                className="block px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
              >
                📱 Short-form Content
              </Link>

            </div>
          </div>
        </div>

        {/* CONTACT */}
        <a
          href="/#contact"
          className="text-gray-300 hover:text-white transition"
        >
          Contact
        </a>

      </nav>

      {/* ================= MOBILE MENU BUTTON ================= */}
      <div className="md:hidden">

        <button
          onClick={() => {
            setMenuOpen(!menuOpen);
            setExploreOpen(false);
          }}
          aria-label="Toggle Menu"
          className="text-white"
        >
          {menuOpen ? (
            <FaTimes className="text-2xl" />
          ) : (
            <FaBars className="text-2xl" />
          )}
        </button>

      </div>

      {/* ================= MOBILE MENU ================= */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: -200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -200, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 w-full bg-[#1f1f1f] flex flex-col items-center gap-4 py-5 md:hidden z-50"
          >

            {/* HOME */}
            <Link
              to="/"
              onClick={() => {
                setMenuOpen(false);
                setExploreOpen(false);
              }}
              className="text-gray-300 hover:text-white transition"
            >
              Home
            </Link>

            {/* EXPLORE BUTTON */}
            <button
              type="button"
              onClick={() => setExploreOpen(!exploreOpen)}
              className="text-gray-300 hover:text-white flex items-center gap-2 transition"
            >
              Explore

              <span
                className={`text-xs transition-transform duration-200 ${
                  exploreOpen ? "rotate-180" : ""
                }`}
              >
                ▾
              </span>
            </button>

            {/* MOBILE EXPLORE OPTIONS */}
            <AnimatePresence>
              {exploreOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center gap-3 overflow-hidden"
                >

                  {/* Promo Videos */}
                  <Link
                    to="/works/promo-videos"
                    onClick={() => {
                      setMenuOpen(false);
                      setExploreOpen(false);
                    }}
                    className="text-sm text-gray-400 hover:text-white transition"
                  >
                    🎬 Promo Videos
                  </Link>

                  {/* Logo Animations */}
                  <Link
                    to="/works/logo-animations"
                    onClick={() => {
                      setMenuOpen(false);
                      setExploreOpen(false);
                    }}
                    className="text-sm text-gray-400 hover:text-white transition"
                  >
                    ✨ Logo Animations
                  </Link>

                  {/* Short-form Content */}
                  <Link
                    to="/works/short-form-content"
                    onClick={() => {
                      setMenuOpen(false);
                      setExploreOpen(false);
                    }}
                    className="text-sm text-gray-400 hover:text-white transition"
                  >
                    📱 Short-form Content
                  </Link>

                </motion.div>
              )}
            </AnimatePresence>

            {/* CONTACT */}
            <a
              href="/#contact"
              onClick={() => setMenuOpen(false)}
              className="text-gray-300 hover:text-white transition"
            >
              Contact
            </a>

          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}

export default Header;