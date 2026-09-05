import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Portfolio from "./Portfolio";
import FooterSection from "./FooterSection";
import SkillsSection from "./SkillsSection";
import WorkSection from "./WorkSection";

import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";

function Home() {
  return (
    <div>
      <Portfolio />
      <WorkSection />
      <SkillsSection />
      <FooterSection />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/admin" element={<AdminLogin />} />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
