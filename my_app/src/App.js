import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./styles/global.css";
import "./styles/admin-global.css";
import { AuthProvider } from "./context/AuthContext";
import { ProjectProvider } from "./context/ProjectContext"; // <-- import

import Home from "./pages/user/Home/Home";
import Projects from "./pages/user/Projects/Projects";
import ProjectDetails from "./pages/user/ProjectDetails/ProjectDetails";
import AdminLogin from "./pages/admin/AdminLogin/AdminLogin";
import AdminGallery from "./pages/admin/AdminGallery/AdminGallery";

const ProtectedRoute = ({ children }) => {
  const isAdmin = localStorage.getItem("adminAuth") === "true";
  return isAdmin ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <ProjectProvider> {/* <-- wrap */}
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/gallery"
              element={
                <ProtectedRoute>
                  <AdminGallery />
                </ProtectedRoute>
              }
            />
            <Route path="/admin" element={<Navigate to="/admin/gallery" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;