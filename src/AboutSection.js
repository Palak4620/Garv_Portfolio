import React from "react";
import { motion } from "framer-motion";

const AboutSection = () => {
  return (
    <section id="about" className="relative bg-[#1E1E1E] text-white px-8 py-20 md:px-20 lg:pl-32 overflow-hidden">
      {/* Background Shape */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[300px] h-[300px] opacity-10 z-0">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full fill-current text-black"
        >
          <polygon points="0,20 40,50 0,80 60,50" />
        </svg>
      </div>

      {/* Animated Content */}
      <motion.div
        className="relative z-10 max-w-4xl"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.4 }}
      >
        <span className="text-xs bg-[#3A3A3A] text-white px-3 py-1 rounded-full mb-4 inline-block">
          About me
        </span>
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Curious about me? Here you have it:
        </h2>
        <p className="text-gray-300 mb-4">
          My career began in the gaming industry, where I sharpened my skills in creating dynamic, immersive video experiences. Today, I apply that expertise to help brands and individuals elevate their video content, boosting engagement, reach, and results.
        </p>
        <p className="text-gray-300">
          Whether you're looking to create compelling social media content, corporate videos, or promotional material, I'm here to turn your vision into an engaging visual masterpiece. Let's create something exceptional together!
        </p>
      </motion.div>
    </section>
  );
};

export default AboutSection;
