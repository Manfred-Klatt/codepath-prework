import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.homePage}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Space Travel</h1>
        <p className={styles.subtitle}>
          The future of interplanetary exploration and evacuation
        </p>
      </div>

      <div className={styles.container}>
        <section className={styles.featureSection}>
          <h2>Welcome to Space Travel</h2>
          <p className={styles.description}>
            In the not-so-distant future, where technology has evolved by leaps and bounds, 
            humanity has achieved the unimaginable: we have successfully transformed other planets 
            in the solar system into habitable environments. As Earth continues to face environmental challenges,
            our mission is to facilitate the safe transportation of humanity to these new homes.
          </p>
          
          <div className={styles.features}>
            <div className={styles.featureCard}>
              <h3>Manage Spacecraft</h3>
              <p>View, build, and decommission spacecraft to support your evacuation efforts.</p>
              <Link to="/spacecrafts" className={styles.featureLink}>View Fleet</Link>
            </div>
            
            <div className={styles.featureCard}>
              <h3>Explore Planets</h3>
              <p>Discover habitable planets and organize population transfers.</p>
              <Link to="/planets" className={styles.featureLink}>View Planets</Link>
            </div>
            
            <div className={styles.featureCard}>
              <h3>Build New Spacecraft</h3>
              <p>Design and construct new spacecraft to expand your evacuation capabilities.</p>
              <Link to="/construction" className={styles.featureLink}>Start Building</Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
