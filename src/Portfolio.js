import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "tailwindcss/tailwind.css";
import { FaInstagram, FaLinkedin, FaMapMarkerAlt, FaBars, FaTimes } from "react-icons/fa";
import logo from "./Garv_logo_enhanched.png";
import bgLogo from "./Garv_logo_enhanched.png";

const Portfolio = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-[#121212] text-white font-sans overflow-x-hidden">
      {/* Header */}
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

        {/* Desktop Navigation */}
        <nav className="space-x-6 hidden md:flex">
          {["Work", "Skills", "Contact"].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-gray-300 hover:text-white"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              {item}
            </motion.a>
          ))}
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle Menu">
            {menuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ y: -200, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -200, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full left-0 w-full bg-[#1f1f1f] flex flex-col items-center gap-4 py-4 md:hidden z-50"
            >
              {["Work", "Skills", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white"
                >
                  {item}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="relative px-4 pt-16 pb-28 md:px-20 flex flex-col gap-6 max-w-8xl mx-auto overflow-hidden">
        {/* Background Logo - Hidden on mobile */}
<div className="absolute top-0 h-[490px] w-[150%] pointer-events-none opacity-10 
                right-[-380px] sm:right-[-200px] md:right-[-450px]">
  <img src={bgLogo} alt="Background G Logo" className="h-full object-cover ml-auto" />
</div>

        {/* Main Text */}
        <motion.div
          className="relative z-10 max-w-2xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-5xl mb-3 font-bold">Hi, I am Garv Jain</h1>
          <h2 className="text-lg md:text-2xl mb-4 text-gray-300 font-semibold">
            Video Editor & and Motion Graphics Artist
          </h2>
          <p className="text-gray-400 text-sm md:text-base mt-2 leading-relaxed">
            With 5+ years of professional experience, I specialize in high-impact video editing and motion design tailored for social media, branding, and promotional content. My work combines clean visual storytelling, sharp pacing, and design-driven motion graphics to boost engagement and communicate messages effectively. From fast-paced edits to polished corporate visuals, I turn creative ideas into compelling content that delivers results. Let's bring your idea to vision!
          </p>

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
            <motion.a
              whileHover={{ scale: 1.2, color: "#E1306C" }}
              href="https://www.instagram.com/garv_fx?igsh=aHIyb24wd3d4NW53"
              aria-label="Instagram"
            >
              <FaInstagram className="text-white text-2xl transition" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.2, color: "#0077B5" }}
              href="https://www.linkedin.com/in/garv-jain-3559b827a/"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="text-white text-2xl transition" />
            </motion.a>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Portfolio;
