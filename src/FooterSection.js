import React from 'react';
import { FaEnvelope, FaPhoneAlt, FaInstagram, FaLinkedin, FaCopy } from 'react-icons/fa';
import { motion } from 'framer-motion';

const FooterSection = () => {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert(`Copied: ${text}`);
  };

  return (
    <footer id="contact" className="bg-[#1E1E1E] text-white py-16 px-4 text-center">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-4"
      >
        <span className="text-xs text-gray-300 border border-gray-500 px-3 py-1 rounded-full backdrop-blur-sm bg-black/30">
          Get in touch
        </span>
      </motion.div>

      {/* Subtext */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="text-sm text-gray-400 max-w-xl mx-auto px-4"
      >
        What's next? Feel free to reach out to me if you're looking for a video editor, have a query, or simply want to connect.
      </motion.p>

      {/* Email */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        viewport={{ once: true }}
        className="flex justify-center items-center gap-2 mt-6 text-lg font-semibold text-white"
      >
        <FaEnvelope className="text-gray-300" />
        <span>garv2509@gmail.com</span>
        <FaCopy
          className="text-gray-400 cursor-pointer hover:text-white transition"
          onClick={() => handleCopy('garv2509@gmail.com')}
        />
      </motion.div>

      {/* Phone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        viewport={{ once: true }}
        className="flex justify-center items-center gap-2 mt-3 text-lg font-semibold text-white"
      >
        <FaPhoneAlt className="text-gray-300" />
        <span>+91 8989070783</span>
        <FaCopy
          className="text-gray-400 cursor-pointer hover:text-white transition"
          onClick={() => handleCopy('+91 8989070783')}
        />
      </motion.div>

      {/* Socials */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        viewport={{ once: true }}
        className="text-sm text-gray-500 mt-6"
      >
        You may also find me on these platforms!
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        viewport={{ once: true }}
        className="flex justify-center items-center gap-4 mt-2 text-white text-xl"
      >
        <motion.a
          whileHover={{ scale: 1.2 }}
          className="hover:text-pink-400 transition"
          href="https://www.instagram.com/garv_fx?igsh=aHIyb24wd3d4NW53"
          aria-label="Instagram"
        >
          <FaInstagram />
        </motion.a>
        <motion.a
          whileHover={{ scale: 1.2 }}
          className="hover:text-blue-400 transition"
          href="https://www.linkedin.com/in/garv-jain-3559b827a/"
          aria-label="LinkedIn"
        >
          <FaLinkedin />
        </motion.a>
      </motion.div>
    </footer>
  );
};

export default FooterSection;
