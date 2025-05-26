import React from 'react';
import Portfolio from './Portfolio';
import AboutSection from './AboutSection';
import FooterSection from './FooterSection';
import SkillsSection from './SkillsSection';
import WorkSection from "./WorkSection"; 
import VideoGallery from "./VideoGallery"; 

function App() {
  return (
    <div>
      <Portfolio />
      <WorkSection />
      <SkillsSection />
      <FooterSection />
    </div>
  );
}

export default App;
