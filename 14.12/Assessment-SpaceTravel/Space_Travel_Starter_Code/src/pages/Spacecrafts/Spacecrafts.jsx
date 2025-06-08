import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSpaceTravel } from '../../context/SpaceTravelContext';
import SpacecraftCard from '../../components/SpacecraftCard/SpacecraftCard';
import Loading from '../../components/Loading/Loading';
import styles from './Spacecrafts.module.css';

const Spacecrafts = () => {
  const { spacecrafts, loading, error, destroySpacecraft } = useSpaceTravel();

  const handleDestroySpacecraft = async (id) => {
    if (window.confirm('Are you sure you want to destroy this spacecraft? This action cannot be undone.')) {
      const success = await destroySpacecraft(id);
      if (success) {
        alert('Spacecraft successfully destroyed');
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.spacecraftsPage}>
      <div className={styles.header}>
        <h1 className="page-title">Spacecraft Fleet</h1>
        <Link to="/construction" className={styles.buildButton}>
          Build New Spacecraft
        </Link>
      </div>

      {spacecrafts.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>No Spacecraft Available</h2>
          <p>Start building your fleet to begin evacuation efforts.</p>
          <Link to="/construction" className={styles.buildButton}>
            Build Your First Spacecraft
          </Link>
        </div>
      ) : (
        <div className={styles.spacecraftGrid}>
          {spacecrafts.map((spacecraft) => (
            <SpacecraftCard
              key={spacecraft.id}
              spacecraft={spacecraft}
              onDestroy={handleDestroySpacecraft}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Spacecrafts;
