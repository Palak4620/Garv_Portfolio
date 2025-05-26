import React from 'react';
import { motion } from 'framer-motion';

import AfterEffects from './icons/After_Effects.png';
import PremierePro from './icons/PremierePro.png';
import Photoshop from './icons/Photoshop.png';
import Illustrator from './icons/Illustrator.png';
import About_BG from './icons/about.jpg';


const skills = [
  { name: 'After Effects', icon: AfterEffects },
  { name: 'Premiere Pro', icon: PremierePro },
  { name: 'Photoshop', icon: Photoshop },
  { name: 'Illustrator', icon: Illustrator },
];

const SkillsSection = () => {
  return (
    <div
      id="skills"
className="w-full py-16 text-center text-white bg-cover bg-left md:bg-[center_top_100%] bg-no-repeat"
      style={{
        backgroundImage: `url(${About_BG})`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mb-4"
      >
        <span className="text-xs text-gray-300 border border-gray-500 px-3 py-1 rounded-full backdrop-blur-sm bg-black/30">
          Skills
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        viewport={{ once: true }}
        className="text-lg text-gray-200 font-medium mb-10"
      >
        The skills, tools and technologies I am really good at:
      </motion.p>

      <div className="flex flex-wrap justify-center items-center gap-6 px-6">
        {skills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="flex flex-col items-center"
          >
            <img src={skill.icon} alt={skill.name} className="w-14 h-14" />
            <span className="mt-2 text-sm text-gray-300 font-medium">{skill.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SkillsSection;
