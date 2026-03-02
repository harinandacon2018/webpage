import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserNavbar from "../../../components/user/UserNavbar";
import Footer from "../../../components/user/Footer";
import "./Home.css";
import { FaHome, FaBuilding, FaPencilRuler, FaHammer } from "react-icons/fa";
import { useProjects } from "../../../context/ProjectContext";

const Home = () => {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [featuredProjects, setFeaturedProjects] = useState([]);

  useEffect(() => {
    const featured = projects
      .filter(p => p.featured)
      .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
      .slice(0, 5);
    setFeaturedProjects(featured);
  }, [projects]);

  return (
    <>
      <UserNavbar />
      
      {/* Hero Section with background image */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Build Your Dream Project with <span>HN Constructions</span></h1>
          <p>Professional Residential, Commercial & Interior Design Services</p>
          <button className="btn" onClick={() => navigate("/projects")}>
            Explore Projects
          </button>
        </div>
      </section>

      {/* Services Section */}
      <section className="services">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          <div className="services-grid">
            <div 
              className="service-card" 
              onClick={() => navigate('/projects?type=Residential')}
              role="button"
              tabIndex={0}
            >
              <FaHome className="service-icon" />
              <h3>Residential Construction</h3>
              <p>Modern and durable home constructions with premium finishes and smart designs.</p>
            </div>
            <div 
              className="service-card" 
              onClick={() => navigate('/projects?type=Commercial')}
              role="button"
              tabIndex={0}
            >
              <FaBuilding className="service-icon" />
              <h3>Commercial Projects</h3>
              <p>Office buildings, retail spaces, and industrial complexes built to perfection.</p>
            </div>
            <div 
              className="service-card" 
              onClick={() => navigate('/projects?type=Interior Design')}
              role="button"
              tabIndex={0}
            >
              <FaPencilRuler className="service-icon" />
              <h3>Interior Design</h3>
              <p>Creative and stylish interiors that transform spaces into experiences.</p>
            </div>
            <div 
              className="service-card" 
              onClick={() => navigate('/projects?type=Renovation')}
              role="button"
              tabIndex={0}
            >
              <FaHammer className="service-icon" />
              <h3>Renovation</h3>
              <p>Transform your existing space with our expert renovation services.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="featured-projects">
        <div className="container">
          <h2 className="section-title">Featured Projects</h2>
          <div className="projects-grid">
            {featuredProjects.map(project => (
              <div className="project-card" key={project.id}>
                <div className="project-image">
                  <img src={project.images[0]} alt={project.projectName} />
                </div>
                <div className="project-info">
                  <h3>{project.projectName}</h3>
                  <p className="project-location">
                    <i className="fas fa-map-marker-alt"></i> {project.address?.split(',')[0] || project.projectName}
                  </p>
                  <p className="project-budget">₹{(project.constructionBudget / 100000).toFixed(2)}L</p>
                  <button 
                    className="btn btn-outline"
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;