import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "tailwindcss/tailwind.css";
import {
  FaInstagram,
  FaLinkedin,
  FaMapMarkerAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { Link } from "react-router-dom";

import logo from "./Garv_logo_enhanched.png";
import bgLogo from "./Garv_logo_enhanched.png";

const Portfolio = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [workOpen, setWorkOpen] = useState(false);

  return (
    <div className="bg-[#121212] text-white font-sans overflow-x-hidden">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="flex justify-between items-center px-4 md:px-16 py-4 relative max-w-7xl mx-auto w-full">

        {/* Logo */}
        <motion.img
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          src={logo}
          alt="Garv Logo"
          className="h-10 w-auto"
        />

        {/* =================================================
            DESKTOP NAVIGATION
        ================================================= */}

        <nav className="hidden md:flex items-center gap-6">

          {/* Work Dropdown */}
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

            {/* Dropdown */}
            <div
              className="
                absolute
                top-full
                left-1/2
                -translate-x-1/2
                pt-3
                opacity-0
                invisible
                group-hover:opacity-100
                group-hover:visible
                transition-all
                duration-200
                z-50
              "
            >
              <div className="w-56 bg-[#1f1f1f] border border-white/10 rounded-lg shadow-xl py-2">

                <Link
                  to="/works/promo-videos"
                  className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
                >
                  Promo Videos
                </Link>

                <Link
                  to="/works/logo-animations"
                  className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
                >
                  Logo Animations
                </Link>

                <Link
                  to="/works/short-form-content"
                  className="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition"
                >
                  Short-form Content
                </Link>

              </div>
            </div>

          </div>

  <a
            href="/#work"
            className="text-gray-300 hover:text-white transition"
          >
            Work
          </a>


          {/* Skills */}
          <a
            href="/#skills"
            className="text-gray-300 hover:text-white transition"
          >
            Skills
          </a>

          {/* Contact */}
          <a
            href="/#contact"
            className="text-gray-300 hover:text-white transition"
          >
            Contact
          </a>

        </nav>

        {/* =================================================
            MOBILE MENU TOGGLE
        ================================================= */}

        <div className="md:hidden">
          <button
            onClick={() => {
              setMenuOpen(!menuOpen);
              setWorkOpen(false);
            }}
            aria-label="Toggle Menu"
          >
            {menuOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>

        {/* =================================================
            MOBILE MENU
        ================================================= */}

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ y: -200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -200, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="
                absolute
                top-full
                left-0
                w-full
                bg-[#1f1f1f]
                flex
                flex-col
                items-center
                gap-4
                py-4
                md:hidden
                z-50
              "
            >

              {/* Work */}
              <button
                type="button"
                onClick={() => setWorkOpen(!workOpen)}
                className="text-gray-300 hover:text-white flex items-center gap-2"
              >
                Explore

                <span
                  className={`text-xs transition-transform duration-200 ${
                    workOpen ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>

              {/* Mobile Work Dropdown */}
              <AnimatePresence>
                {workOpen && (
                  <motion.div
                    initial={{
                      height: 0,
                      opacity: 0,
                    }}
                    animate={{
                      height: "auto",
                      opacity: 1,
                    }}
                    exit={{
                      height: 0,
                      opacity: 0,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="flex flex-col items-center gap-3 overflow-hidden"
                  >

                    <Link
                      to="/works/promo-videos"
                      onClick={() => {
                        setMenuOpen(false);
                        setWorkOpen(false);
                      }}
                      className="text-sm text-gray-400 hover:text-white transition"
                    >
                      Promo Videos
                    </Link>

                    <Link
                      to="/works/logo-animations"
                      onClick={() => {
                        setMenuOpen(false);
                        setWorkOpen(false);
                      }}
                      className="text-sm text-gray-400 hover:text-white transition"
                    >
                      Logo Animations
                    </Link>

                    <Link
                      to="/works/short-form-content"
                      onClick={() => {
                        setMenuOpen(false);
                        setWorkOpen(false);
                      }}
                      className="text-sm text-gray-400 hover:text-white transition"
                    >
                      Short-form Content
                    </Link>

                  </motion.div>
                )}
              </AnimatePresence>

              
              {/* Skills */}
              <a
                href="/#work"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-white"
              >
                Work
              </a>

              {/* Skills */}
              <a
                href="/#skills"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-white"
              >
                Skills
              </a>

              {/* Contact */}
              <a
                href="/#contact"
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-white"
              >
                Contact
              </a>

            </motion.div>
          )}
        </AnimatePresence>

      </header>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="relative px-4 pt-16 pb-16 md:px-20 flex flex-col gap-6 max-w-8xl mx-auto overflow-hidden">

        {/* =================================================
            BACKGROUND LOGO
        ================================================= */}

        <div
          className="
            absolute
            top-0
            h-[490px]
            w-[210%]
            pointer-events-none
            opacity-10
            right-[-400px]
            sm:right-[-200px]
            md:right-[-450px]
          "
        >
          <img
            src={bgLogo}
            alt="Background G Logo"
            className="h-full object-cover ml-auto"
          />
        </div>

        {/* =================================================
            MAIN TEXT
        ================================================= */}

        <motion.div
          className="relative z-10 max-w-2xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >

          <h1 className="text-3xl md:text-5xl mb-3 font-bold">
            Hi, I am Garv Jain
          </h1>

          <h2 className="text-lg md:text-2xl mb-4 text-gray-300 font-semibold">
            Motion Graphics Artist & Video Editor
          </h2>

          <p className="text-gray-400 text-sm md:text-base mt-2 leading-relaxed">
            I’m a motion designer and video editor with 5+ years of experience,
            specializing in social media, branding, and promotional content. I
            craft clean, design-driven motion graphics paired with sharp editing
            to create engaging visuals that turn ideas into impactful results.
          </p>

          <br />
          <br />

          {/* Location and Status */}
          <div className="flex flex-col gap-2 text-gray-400 mt-4 text-sm md:text-base">

            <span className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-lg" />
              Indore, India
            </span>

            <span className="flex items-center gap-2">
              <span className="w-2 h-2 ml-[4.5px] rounded-full bg-green-500 inline-block"></span>
              Available for new projects
            </span>

          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 mt-6">

            <p className="text-gray-300 text-md">
              Connect with Me:
            </p>

            <motion.a
              whileHover={{
                scale: 1.2,
                color: "#E1306C",
              }}
              href="https://www.instagram.com/garv_fx?igsh=aHIyb24wd3d4NW53"
              aria-label="Instagram"
            >
              <FaInstagram className="text-white text-2xl transition" />
            </motion.a>

            <motion.a
              whileHover={{
                scale: 1.2,
                color: "#0077B5",
              }}
              href="https://www.linkedin.com/in/garv-jain-3559b827a/"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="text-white text-2xl transition" />
            </motion.a>

          </div>

        </motion.div>

        {/* =================================================
            SEE WORK BUTTON
        ================================================= */}

        <div className="w-full flex justify-center px-4">

          <motion.a
            href="#work"
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.8,
            }}
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.97,
            }}
            className="
              inline-block
              px-5
              py-2
              text-sm
              md:text-base
              font-semibold
              tracking-wide
              text-white
              border
              border-white/30
              rounded-full
              bg-white/5
              backdrop-blur-sm
              hover:bg-white
              hover:text-[#121212]
              transition-colors
              duration-300
              text-center
            "
          >
            See Work
          </motion.a>

        </div>

      </main>

    </div>
  );
};

export default Portfolio;