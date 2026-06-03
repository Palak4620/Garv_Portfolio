import React from 'react';
import Portfolio from './Portfolio';
import FooterSection from './FooterSection';
import SkillsSection from './SkillsSection';
import WorkSection from "./WorkSection"; 

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
