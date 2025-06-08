import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SpacecraftCard.module.css';

const SpacecraftCard = ({ spacecraft, onDestroy }) => {
  const { id, name, capacity, description, pictureUrl } = spacecraft;
  
  const defaultImage = '/src/assets/images/spacecraft-placeholder.svg';
  
  return (
    <div className={styles.card}>
      <img 
        src={pictureUrl || defaultImage} 
        alt={name} 
        className={styles.image}
      />
      <div className={styles.content}>
        <h3 className={styles.title}>{name}</h3>
        <p className={styles.capacity}>Capacity: {capacity}</p>
        <p className={styles.description}>{description}</p>
        <div className={styles.actions}>
          <Link to={`/spacecraft/${id}`} className={styles.viewButton}>
            View Details
          </Link>
          <button 
            onClick={() => onDestroy(id)} 
            className={styles.destroyButton}
          >
            Destroy
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpacecraftCard;
