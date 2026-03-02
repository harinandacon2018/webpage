import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import UserNavbar from "../../../components/user/UserNavbar";
import Footer from "../../../components/user/Footer";
import "./ProjectDetails.css";
import { FaArrowLeft, FaMapMarkerAlt, FaDollarSign, FaRuler, FaCalendar, FaHome, FaExternalLinkAlt, FaCouch, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useProjects } from "../../../context/ProjectContext";

// Lightbox component
const Lightbox = ({ images, currentIndex, onClose, onPrev, onNext }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}><FaTimes /></button>
        <button className="lightbox-nav lightbox-prev" onClick={onPrev}><FaChevronLeft /></button>
        <img src={images[currentIndex]} alt={`lightbox-${currentIndex}`} />
        <button className="lightbox-nav lightbox-next" onClick={onNext}><FaChevronRight /></button>
        <div className="lightbox-counter">{currentIndex + 1} / {images.length}</div>
      </div>
    </div>
  );
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const found = projects.find(p => p.id === parseInt(id));
    setProject(found || null);
    setLoading(false);
  }, [id, projects]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const prevImage = () => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : project.images.length - 1));
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev < project.images.length - 1 ? prev + 1 : 0));
  };

  if (loading) {
    return (
      <>
        <UserNavbar />
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Loading project details...</h2>
        </div>
        <Footer />
      </>
    );
  }

  if (!project) {
    return (
      <>
        <UserNavbar />
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Project not found</h2>
          <button className="btn" onClick={() => navigate('/projects')}>
            Back to Projects
          </button>
        </div>
        <Footer />
      </>
    );
  }

  const formatBudget = (budget) => {
    const num = Number(budget) || 0;
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num}`;
  };

  const construction = Number(project.constructionBudget) || 0;
  const furniture = Number(project.furnitureBudget) || 0;
  const totalBudget = construction + furniture;

  return (
    <>
      <UserNavbar />
      <div className="project-details-page">
        <div className="container">
          <button className="btn btn-outline back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Back
          </button>

          <div className="project-header">
            <h1 className="project-title">{project.projectName}</h1>
            <div className="project-tags">
              <span className={`type-badge type-${project.projectType?.toLowerCase().replace(/\s+/g, '-')}`}>
                {project.projectType}
              </span>
              <span className={`furnished-badge furnished-${project.furnishedStatus?.toLowerCase()}`}>
                {project.furnishedStatus}
              </span>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="project-gallery">
            <div className="main-image" onClick={() => openLightbox(0)}>
              <img src={project.images[0]} alt={project.projectName} />
            </div>
            <div className="gallery-grid">
              {project.images.slice(1, 5).map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt={`${project.projectName}-${idx + 1}`} 
                  onClick={() => openLightbox(idx + 1)}
                />
              ))}
            </div>
          </div>

          {/* Project Info Grid */}
          <div className="project-info-grid">
            <div className="info-card">
              <h3>Project Details</h3>
              <p style={{ marginBottom: '1.5rem', lineHeight: '1.8' }}>{project.siteDetails}</p>
              
              <div className="info-item">
                <span className="info-label"><FaMapMarkerAlt /> Address</span>
                <span className="info-value">
                  {project.googleMapsUrl ? (
                    <a href={project.googleMapsUrl} target="_blank" rel="noopener noreferrer">
                      {project.address || "View on map"} <FaExternalLinkAlt size={12} />
                    </a>
                  ) : (
                    project.address || "Address not provided"
                  )}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label"><FaDollarSign /> Construction Budget</span>
                <span className="info-value">{formatBudget(construction)}</span>
              </div>
              {furniture > 0 && (
                <div className="info-item">
                  <span className="info-label"><FaCouch /> Furniture Budget</span>
                  <span className="info-value">{formatBudget(furniture)}</span>
                </div>
              )}
              <div className="info-item">
                <span className="info-label"><FaDollarSign /> Total Budget</span>
                <span className="info-value">{formatBudget(totalBudget)}</span>
              </div>
              <div className="info-item">
                <span className="info-label"><FaRuler /> Area</span>
                <span className="info-value">{project.area || `${project.builtUpArea} sq.ft`}</span>
              </div>
              <div className="info-item">
                <span className="info-label"><FaHome /> Type</span>
                <span className="info-value">{project.projectType}</span>
              </div>
              <div className="info-item">
                <span className="info-label"><FaCalendar /> Timeline</span>
                <span className="info-value">{project.timeline || `${project.timelineMonths} months`}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Progress</span>
                <span className="info-value">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '100px', height: '6px', background: '#ecf0f1', borderRadius: '3px' }}>
                      <div style={{ width: `${project.progress}%`, height: '100%', background: '#27ae60', borderRadius: '3px' }} />
                    </div>
                    {project.progress}%
                  </div>
                </span>
              </div>
            </div>
          </div>

          {/* Google Maps Link Section */}
          <div className="project-map">
            <h3>Location</h3>
            {project.googleMapsUrl ? (
              <div className="map-link-container">
                <a 
                  href={project.googleMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-primary map-button"
                >
                  <FaMapMarkerAlt /> View on Google Maps <FaExternalLinkAlt />
                </a>
                <p className="address-text">{project.address || "Click the button to open location"}</p>
              </div>
            ) : (
              <div className="map-placeholder">
                <p>No map link available for this project.</p>
                <p className="address-text">{project.address || "Address not provided"}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={project.images}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}

      <Footer />
    </>
  );
};

export default ProjectDetails;