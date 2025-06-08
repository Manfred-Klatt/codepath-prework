import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSpaceTravel } from '../../context/SpaceTravelContext';
import Loading from '../../components/Loading/Loading';
import styles from './SpacecraftDetail.module.css';

const SpacecraftDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getSpacecraftById, destroySpacecraft, updateSpacecraftPicture, planets } = useSpaceTravel();
  const [spacecraft, setSpacecraft] = useState(null);
  const [currentPlanet, setCurrentPlanet] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [newPictureUrl, setNewPictureUrl] = useState('');

  useEffect(() => {
    // Only fetch if we have a valid ID
    if (!id) {
      console.error('No spacecraft ID provided');
      navigate('/spacecrafts');
      return;
    }
    
    const fetchSpacecraftDetails = async () => {
      setIsLoading(true);
      try {
        // Get spacecraft data from the context
        const spacecraftData = await getSpacecraftById(id);
        
        // Check if we got valid spacecraft data
        if (spacecraftData) {
          setSpacecraft(spacecraftData);
          
          // Find the current planet if available
          if (spacecraftData.currentLocation !== undefined && planets.length > 0) {
            const planet = planets.find(p => p.id === spacecraftData.currentLocation);
            setCurrentPlanet(planet);
          }
        } else {
          // If no spacecraft data was returned, navigate back to the fleet page
          console.error('No spacecraft data found for ID:', id);
          alert('Spacecraft not found');
          navigate('/spacecrafts');
          return;
        }
      } catch (error) {
        console.error('Error fetching spacecraft details:', error);
        alert('Error loading spacecraft details');
        navigate('/spacecrafts');
        return;
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpacecraftDetails();
    // Only depend on the ID, not on functions that might change references
  }, [id, navigate, planets]);

  const handleDestroySpacecraft = async () => {
    if (window.confirm('Are you sure you want to destroy this spacecraft? This action cannot be undone.')) {
      setIsLoading(true);
      const success = await destroySpacecraft(id);
      if (success) {
        alert('Spacecraft successfully destroyed');
        navigate('/spacecrafts');
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleEditPicture = () => {
    setIsEditing(true);
    setNewPictureUrl(spacecraft.pictureUrl || '');
  };

  const handleUpdatePicture = async () => {
    if (!newPictureUrl.trim()) {
      alert('Please enter a valid picture URL');
      return;
    }

    setIsLoading(true);
    try {
      const updatedSpacecraft = await updateSpacecraftPicture(id, newPictureUrl);
      if (updatedSpacecraft) {
        setSpacecraft(updatedSpacecraft);
        setIsEditing(false);
        alert('Spacecraft picture updated successfully!');
      } else {
        alert('Failed to update spacecraft picture');
      }
    } catch (error) {
      console.error('Error updating spacecraft picture:', error);
      alert('Error updating spacecraft picture');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewPictureUrl('');
  };

  // Show loading state while data is being fetched
  if (isLoading) {
    return <Loading />;
  }
  
  // Safety check - if no spacecraft data is available after loading
  if (!spacecraft) {
    console.error('No spacecraft data available after loading');
    return (
      <div className={styles.errorContainer}>
        <h2>Error Loading Spacecraft</h2>
        <p>Could not load spacecraft details.</p>
        <Link to="/spacecrafts" className={styles.backLink}>
          &larr; Back to Fleet
        </Link>
      </div>
    );
  }

  const { name, capacity, description, pictureUrl } = spacecraft;
  const defaultImage = '/src/assets/images/spacecraft-detail-placeholder.svg';

  return (
    <div className={styles.spacecraftDetailPage}>
      <div className={styles.container}>
        <div className={styles.backNavigation}>
          <Link to="/spacecrafts" className={styles.backLink}>
            &larr; Back to Fleet
          </Link>
        </div>

        <div className={styles.spacecraftCard}>
          <div className={styles.imageContainer}>
            <img 
              src={pictureUrl || defaultImage} 
              alt={name} 
              className={styles.spacecraftImage}
            />
            {!isEditing && (
              <button 
                onClick={handleEditPicture}
                className={`${styles.actionButton} ${styles.editButton}`}
              >
                Edit Picture
              </button>
            )}
            {isEditing && (
              <div className={styles.editForm}>
                <input
                  type="text"
                  value={newPictureUrl}
                  onChange={(e) => setNewPictureUrl(e.target.value)}
                  placeholder="Enter new picture URL"
                  className={styles.pictureInput}
                />
                <div className={styles.editActions}>
                  <button 
                    onClick={handleUpdatePicture}
                    className={`${styles.actionButton} ${styles.saveButton}`}
                  >
                    Save
                  </button>
                  <button 
                    onClick={handleCancelEdit}
                    className={`${styles.actionButton} ${styles.cancelButton}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className={styles.spacecraftInfo}>
            <h1 className={styles.spacecraftName}>{name}</h1>
            
            <div className={styles.infoRow}>
              <span className={styles.label}>Capacity:</span>
              <span className={styles.value}>{capacity} passengers</span>
            </div>
            
            <div className={styles.infoRow}>
              <span className={styles.label}>Current Location:</span>
              <span className={styles.value}>{currentPlanet ? currentPlanet.name : 'Unknown'}</span>
            </div>
            
            <div className={styles.description}>
              <h3>Description</h3>
              <p>{description}</p>
            </div>
            
            <div className={styles.actions}>
              <button 
                onClick={handleDestroySpacecraft} 
                className={`${styles.actionButton} ${styles.destroyButton}`}
              >
                Destroy Spacecraft
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpacecraftDetail;
