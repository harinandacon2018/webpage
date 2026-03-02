import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserNavbar from "../../../components/user/UserNavbar";
import Footer from "../../../components/user/Footer";
import "./Projects.css";
import { FaMapMarkerAlt, FaDollarSign, FaRuler, FaExternalLinkAlt } from "react-icons/fa";
import { useProjects } from "../../../context/ProjectContext";

const Projects = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projects } = useProjects();
  const [sortedProjects, setSortedProjects] = useState([]);
  const [filter, setFilter] = useState('All');

  // Read query parameter on mount and when location changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');
    if (type) {
      setFilter(type);
    } else {
      setFilter('All');
    }
  }, [location.search]);

  // Sort projects by displayOrder
  useEffect(() => {
    const sorted = [...projects].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    setSortedProjects(sorted);
  }, [projects]);

  // Filter projects based on selected type
  const filteredProjects = filter === 'All' 
    ? sortedProjects 
    : sortedProjects.filter(p => p.projectType === filter);

  return (
    <>
      <UserNavbar />
      <div className="projects-page">
        <div className="container">
          <div className="projects-header">
            <h2 className="section-title"><u color="green">Our Projects</u></h2>
            <p>Discover our portfolio of exceptional residential and commercial constructions</p>
          </div>

          {/* Filter Buttons */}
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === 'All' ? 'active' : ''}`}
              onClick={() => {
                setFilter('All');
                navigate('/projects'); // remove query param
              }}
            >
              All
            </button>
            <button 
              className={`filter-btn ${filter === 'Residential' ? 'active' : ''}`}
              onClick={() => {
                setFilter('Residential');
                navigate('/projects?type=Residential');
              }}
            >
              Residential
            </button>
            <button 
              className={`filter-btn ${filter === 'Commercial' ? 'active' : ''}`}
              onClick={() => {
                setFilter('Commercial');
                navigate('/projects?type=Commercial');
              }}
            >
              Commercial
            </button>
            <button 
              className={`filter-btn ${filter === 'Interior Design' ? 'active' : ''}`}
              onClick={() => {
                setFilter('Interior Design');
                navigate('/projects?type=Interior Design');
              }}
            >
              Interior Design
            </button>
            <button 
              className={`filter-btn ${filter === 'Renovation' ? 'active' : ''}`}
              onClick={() => {
                setFilter('Renovation');
                navigate('/projects?type=Renovation');
              }}
            >
              Renovation
            </button>
          </div>

          {/* Projects Grid */}
          <div className="projects-grid">
            {filteredProjects.map(project => (
              <div className="project-card" key={project.id}>
                <span className="project-badge">{project.projectType}</span>
                <div className="project-image">
                  <img src={project.images[0]} alt={project.projectName} />
                </div>
                <div className="project-details">
                  <h3>{project.projectName}</h3>
                  <div className="project-meta">
                    <span><FaMapMarkerAlt /> {project.address?.split(',')[0] || 'Location'}</span>
                    <span><FaRuler /> {project.area || `${project.builtUpArea} sq.ft`}</span>
                  </div>
                  <div className="project-budget">
                    <FaDollarSign /> ₹{(project.constructionBudget / 100000).toFixed(2)}L
                  </div>

                  {project.googleMapsUrl && (
                    <a 
                      href={project.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline map-link-btn"
                      style={{ 
                        marginTop: "0.75rem", 
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px"
                      }}
                    >
                      <FaMapMarkerAlt /> View Location <FaExternalLinkAlt size={12} />
                    </a>
                  )}

                  <button 
                    className="btn btn-primary"
                    style={{ marginTop: "0.75rem", width: "100%" }}
                    onClick={() => navigate(`/project/${project.id}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Projects;