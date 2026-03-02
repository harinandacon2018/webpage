import React, { useState } from 'react';
import AdminSidebar from '../../../components/Admin/AdminSidebar';
import AdminNavbar from '../../../components/Admin/AdminNavbar';
import AdminFooter from '../../../components/Admin/AdminFooter';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaGripVertical, FaDollarSign, FaCouch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useProjects } from '../../../context/ProjectContext';

// Drag & Drop imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import './AdminGallery.css';

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

// Sortable row component (unchanged except for budget display)
const SortableRow = ({ project, onEdit, onDelete, onToggleFeatured }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: isDragging ? '#f0f0f0' : 'white',
  };

  const totalBudget = (Number(project.constructionBudget) || 0) + (Number(project.furnitureBudget) || 0);

  return (
    <tr ref={setNodeRef} style={style} className={isDragging ? 'dragging' : ''}>
      <td className="drag-handle" {...attributes} {...listeners}>
        <FaGripVertical />
      </td>
      <td>{project.projectName}</td>
      <td>{project.projectType}</td>
      <td className="short-desc">{project.shortDescription?.length > 80 ? project.shortDescription.slice(0,80) + '...' : project.shortDescription || '-'}</td>
      <td>{project.timelineMonths ? `${project.timelineMonths} mo` : '-'}</td>
      <td>{project.furnishedStatus || '-'}</td>
      <td>{project.builtUpArea || '-'}</td>
      <td>
        <div>Const: ₹{(Number(project.constructionBudget) / 100000).toFixed(2)}L</div>
        {Number(project.furnitureBudget) > 0 && <div>Furn: ₹{(Number(project.furnitureBudget) / 100000).toFixed(2)}L</div>}
        <div><strong>Total: ₹{(totalBudget / 100000).toFixed(2)}L</strong></div>
      </td>
      <td>
        <input
          type="checkbox"
          checked={project.featured || false}
          onChange={() => onToggleFeatured(project.id)}
          title="Show on home page"
        />
      </td>
      <td>{project.uploadedBy}</td>
      <td>{project.images.length} images</td>
      <td>
        <button className="icon-btn" onClick={() => onEdit(project)}><FaEdit /></button>
        <button className="icon-btn" onClick={() => onDelete(project.id)}><FaTrash /></button>
      </td>
    </tr>
  );
};

const AdminGallery = () => {
  const { projects, addProject, updateProject, deleteProject, toggleFeatured, reorderProjects } = useProjects();
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    projectName: '',
    projectType: 'Residential',
    shortDescription: '',
    constructionBudget: '',
    furnitureBudget: '',
    builtUpArea: '',
    timelineMonths: '',
    furnishedStatus: 'Unfurnished',
    siteDetails: '',
    googleMapsUrl: '',
    uploadedBy: 'Admin',
    images: [],
    featured: false,
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = projects.findIndex((i) => i.id === active.id);
      const newIndex = projects.findIndex((i) => i.id === over.id);
      const reordered = arrayMove(projects, oldIndex, newIndex);
      reorderProjects(reordered);
    }
  };

  const handleToggleFeatured = (id) => {
    toggleFeatured(id);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Convert uploaded files to base64 and store in formData.images
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Check if adding these files would exceed max 100
    if (formData.images.length + files.length > 100) {
      alert(`You can only upload up to 100 images. You currently have ${formData.images.length} and are trying to add ${files.length}.`);
      return;
    }

    const newPreviews = [];
    const newImages = [];

    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target.result;
        newImages.push(base64);
        newPreviews.push(base64);

        // Update state after each file is processed (or batch at the end)
        if (newImages.length === files.length) {
          setImagePreviews(prev => [...prev, ...newPreviews]);
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Open lightbox for a specific image
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const prevImage = () => {
    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : imagePreviews.length - 1));
  };

  const nextImage = () => {
    setLightboxIndex((prev) => (prev < imagePreviews.length - 1 ? prev + 1 : 0));
  };

  const resetForm = () => {
    setFormData({
      projectName: '',
      projectType: 'Residential',
      shortDescription: '',
      constructionBudget: '',
      furnitureBudget: '',
      builtUpArea: '',
      timelineMonths: '',
      furnishedStatus: 'Unfurnished',
      siteDetails: '',
      googleMapsUrl: '',
      uploadedBy: 'Admin',
      images: [],
      featured: false,
    });
    setImagePreviews([]);
    setEditingProject(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.images.length < 5) {
      alert('Please upload at least 5 images');
      return;
    }

    const construction = Number(formData.constructionBudget) || 0;
    const furniture = formData.furnishedStatus === 'Unfurnished' ? 0 : (Number(formData.furnitureBudget) || 0);

    const projectData = {
      ...formData,
      constructionBudget: construction,
      furnitureBudget: furniture,
    };

    if (editingProject) {
      updateProject(editingProject.id, projectData);
    } else {
      addProject(projectData);
    }
    resetForm();
    setShowModal(false);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      projectName: project.projectName,
      projectType: project.projectType,
      shortDescription: project.shortDescription || '',
      constructionBudget: project.constructionBudget,
      furnitureBudget: project.furnitureBudget || 0,
      builtUpArea: project.builtUpArea || '',
      timelineMonths: project.timelineMonths || '',
      furnishedStatus: project.furnishedStatus || 'Unfurnished',
      siteDetails: project.siteDetails,
      googleMapsUrl: project.googleMapsUrl || '',
      uploadedBy: project.uploadedBy,
      images: project.images || [],
      featured: project.featured || false,
    });
    setImagePreviews(project.images || []);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  const showFurnitureBudget = formData.furnishedStatus !== 'Unfurnished';

  return (
    <div className="admin-dashboard">
      <AdminSidebar />
      <div className="admin-main">
        <AdminNavbar />
        <div className="gallery-content">
          <div className="gallery-header">
            <h2 className="page-title">Project Gallery Management</h2>
            <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
              <FaPlus /> Add New Project
            </button>
          </div>

          <div className="projects-table-container">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
                <table className="projects-table">
                  <thead>
                    <tr>
                      <th style={{ width: '30px' }}>#</th>
                      <th>Project Name</th>
                      <th>Type</th>
                      <th>Short Description</th>
                      <th>Timeline</th>
                      <th>Furnished</th>
                      <th>Area (sqft)</th>
                      <th>Budget</th>
                      <th>Featured</th>
                      <th>Uploaded By</th>
                      <th>Images</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <SortableRow
                        key={project.id}
                        project={project}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleFeatured={handleToggleFeatured}
                      />
                    ))}
                  </tbody>
                </table>
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal">
            <div className="modal-content modal-large">
              <div className="modal-header">
                <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
                <button className="close-btn" onClick={() => { resetForm(); setShowModal(false); }}>
                  <FaTimes />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  {/* Basic Info */}
                  <div className="form-group full-width">
                    <label>Project Name *</label>
                    <input type="text" name="projectName" value={formData.projectName} onChange={handleInputChange} required placeholder="e.g., Luxury Waterfront Villa" />
                  </div>

                  <div className="form-group">
                    <label>Project Type *</label>
                    <select name="projectType" value={formData.projectType} onChange={handleInputChange} required>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Interior Design">Interior Design</option>
                      <option value="Renovation">Renovation</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Furnished Status *</label>
                    <select name="furnishedStatus" value={formData.furnishedStatus} onChange={handleInputChange}>
                      <option value="Unfurnished">Unfurnished</option>
                      <option value="Semi-furnished">Semi-furnished</option>
                      <option value="Furnished">Furnished</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Short Description</label>
                    <input type="text" name="shortDescription" value={formData.shortDescription} onChange={handleInputChange} placeholder="One-line summary for listing" />
                  </div>

                  <div className="form-group">
                    <label><FaDollarSign /> Construction Budget (₹) *</label>
                    <input type="number" name="constructionBudget" value={formData.constructionBudget} onChange={handleInputChange} required placeholder="e.g., 8000000" />
                  </div>

                  {showFurnitureBudget && (
                    <div className="form-group">
                      <label><FaCouch /> Furniture Budget (₹)</label>
                      <input type="number" name="furnitureBudget" value={formData.furnitureBudget} onChange={handleInputChange} placeholder="e.g., 500000" />
                      <small>Required for furnished/semi-furnished</small>
                    </div>
                  )}

                  <div className="form-group">
                    <label>Built-up Area (sqft)</label>
                    <input type="number" name="builtUpArea" value={formData.builtUpArea} onChange={handleInputChange} placeholder="e.g., 4200" />
                  </div>

                  <div className="form-group">
                    <label>Timeline (months)</label>
                    <input type="number" name="timelineMonths" value={formData.timelineMonths} onChange={handleInputChange} placeholder="e.g., 18" />
                  </div>

                  <div className="form-group full-width">
                    <label>Site Details *</label>
                    <textarea name="siteDetails" value={formData.siteDetails} onChange={handleInputChange} rows="3" required placeholder="Full description of the project..."></textarea>
                  </div>

                  <div className="form-group full-width">
                    <label>Google Maps Link</label>
                    <input type="url" name="googleMapsUrl" value={formData.googleMapsUrl} onChange={handleInputChange} placeholder="https://maps.app.goo.gl/..." />
                  </div>

                  <div className="form-group full-width">
                    <label className="checkbox-label">
                      <input type="checkbox" name="featured" checked={formData.featured} onChange={handleInputChange} />
                      Show on Home Page
                    </label>
                  </div>

                  <div className="form-group">
                    <label>Uploaded By (Admin) *</label>
                    <input type="text" name="uploadedBy" value={formData.uploadedBy} onChange={handleInputChange} required />
                  </div>

                  {/* Image upload section with improved UI */}
                  <div className="form-group full-width image-upload-section">
                    <label>Images * (minimum 5, maximum 100)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple 
                      onChange={handleImageUpload}
                      className="file-input"
                    />
                    <div className="image-previews-grid">
                      {imagePreviews.map((src, idx) => (
                        <div key={idx} className="preview-item" onClick={() => openLightbox(idx)}>
                          <img src={src} alt={`preview-${idx}`} />
                          <button 
                            type="button" 
                            className="remove-img" 
                            onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                            title="Remove image"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="image-counter">
                      {imagePreviews.length} / 5 minimum • {imagePreviews.length} / 100 maximum
                    </div>
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary" disabled={imagePreviews.length < 5}>
                    {editingProject ? 'Update' : 'Save'} Project
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => { resetForm(); setShowModal(false); }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lightbox */}
        {lightboxOpen && (
          <Lightbox
            images={imagePreviews}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}

        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminGallery;