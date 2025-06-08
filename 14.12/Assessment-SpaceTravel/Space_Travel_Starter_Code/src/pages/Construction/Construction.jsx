import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSpaceTravel } from '../../context/SpaceTravelContext';
import Loading from '../../components/Loading/Loading';
import styles from './Construction.module.css';

const Construction = () => {
  const navigate = useNavigate();
  const { buildSpacecraft, loading } = useSpaceTravel();
  
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    description: '',
    pictureUrl: ''
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.capacity) {
      newErrors.capacity = 'Capacity is required';
    } else if (isNaN(formData.capacity) || parseInt(formData.capacity) <= 0) {
      newErrors.capacity = 'Capacity must be a positive number';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    const spacecraftData = {
      name: formData.name,
      capacity: parseInt(formData.capacity),
      description: formData.description,
      pictureUrl: formData.pictureUrl || undefined
    };
    
    const success = await buildSpacecraft(spacecraftData);
    
    if (success) {
      alert('Spacecraft successfully built!');
      navigate('/spacecrafts');
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className={styles.constructionPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <Link to="/spacecrafts" className={styles.backLink}>
            &larr; Back to Fleet
          </Link>
          <h1 className="page-title">Build New Spacecraft</h1>
        </div>
        
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Spacecraft Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? styles.inputError : ''}
              />
              {errors.name && <div className="error">{errors.name}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="capacity">Capacity *</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="1"
                className={errors.capacity ? styles.inputError : ''}
              />
              {errors.capacity && <div className="error">{errors.capacity}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className={errors.description ? styles.inputError : ''}
              />
              {errors.description && <div className="error">{errors.description}</div>}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="pictureUrl">Picture URL (optional)</label>
              <input
                type="url"
                id="pictureUrl"
                name="pictureUrl"
                value={formData.pictureUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className={styles.formActions}>
              <button type="submit" className={styles.submitButton}>
                Build Spacecraft
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Construction;
