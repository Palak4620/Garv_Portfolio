import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "./Garv_logo_enhanched.png";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = ["Contact"];

  return (
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
        {navItems.map((item, i) => (
          <motion.a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="text-gray-300 hover:text-white transition"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.2 + i * 0.1,
            }}
          >
            {item}
          </motion.a>
        ))}
      </nav>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? (
            <FaTimes className="text-2xl" />
          ) : (
            <FaBars className="text-2xl" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{
              y: -200,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -200,
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
            }}
            className="absolute top-full left-0 w-full bg-[#1f1f1f] flex flex-col items-center gap-4 py-4 md:hidden z-50"
          >
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="text-gray-300 hover:text-white"
              >
                {item}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;