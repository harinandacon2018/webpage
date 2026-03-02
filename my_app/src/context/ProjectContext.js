import React, { createContext, useState, useContext, useEffect } from 'react';
import { openDB } from 'idb';

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

const DB_NAME = 'hn-projects-db';
const STORE_NAME = 'projects';

async function initDB() {
  const db = await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
  return db;
}

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load from IndexedDB on mount
  useEffect(() => {
    const loadFromDB = async () => {
      try {
        const db = await initDB();
        const allProjects = await db.getAll(STORE_NAME);
        if (allProjects.length > 0) {
          setProjects(allProjects);
        } else {
          // Load sample data
          const sample = [
            {
              id: 1,
              projectName: 'Luxury Waterfront Villa',
              projectType: 'Residential',
              shortDescription: 'Seaside luxury villa with modern finish.',
              constructionBudget: 8000000,
              furnitureBudget: 500000,
              builtUpArea: 4200,
              timelineMonths: 18,
              furnishedStatus: 'Furnished',
              siteDetails: 'A stunning 4-bedroom luxury villa with modern architecture...',
              googleMapsUrl: 'https://maps.app.goo.gl/example1',
              uploadedBy: 'Admin',
              images: ['/assets/images/project1.jpg', '/assets/images/project1-1.jpg'],
              featured: true,
              displayOrder: 1,
              address: '123 Beach Road, ECR, Chennai, Tamil Nadu 600001',
              status: 'Approved',
              area: '3500 sq.ft',
              timeline: '8 months',
              progress: 60,
            },
            // ... other sample projects (shortened for brevity)
          ];
          setProjects(sample);
          // Save sample to DB
          const db = await initDB();
          const tx = db.transaction(STORE_NAME, 'readwrite');
          await Promise.all(sample.map(p => tx.store.put(p)));
          await tx.done;
        }
      } catch (error) {
        console.error('Failed to load projects from IndexedDB', error);
      } finally {
        setLoading(false);
      }
    };
    loadFromDB();
  }, []);

  // Save to IndexedDB whenever projects change
  useEffect(() => {
    const saveToDB = async () => {
      if (loading) return;
      try {
        const db = await initDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        // Clear existing and add all
        await tx.store.clear();
        await Promise.all(projects.map(p => tx.store.put(p)));
        await tx.done;
      } catch (error) {
        console.error('Failed to save projects to IndexedDB', error);
      }
    };
    saveToDB();
  }, [projects, loading]);

  const addProject = (project) => {
    const newProject = {
      ...project,
      id: Date.now(),
      displayOrder: projects.length + 1,
    };
    setProjects(prev => [...prev, newProject]);
  };

  const updateProject = (id, updatedProject) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...updatedProject, id } : p));
  };

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const toggleFeatured = (id) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, featured: !p.featured } : p));
  };

  const reorderProjects = (newOrder) => {
    const withOrder = newOrder.map((item, idx) => ({ ...item, displayOrder: idx + 1 }));
    setProjects(withOrder);
  };

  if (loading) {
    return <div>Loading projects...</div>; // or a spinner
  }

  return (
    <ProjectContext.Provider value={{
      projects,
      addProject,
      updateProject,
      deleteProject,
      toggleFeatured,
      reorderProjects
    }}>
      {children}
    </ProjectContext.Provider>
  );
};