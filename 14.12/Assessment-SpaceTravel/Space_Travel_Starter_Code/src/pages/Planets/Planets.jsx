import React, { useState } from 'react';
import { useSpaceTravel } from '../../context/SpaceTravelContext';
import Loading from '../../components/Loading/Loading';
import styles from './Planets.module.css';

const Planets = () => {
  const { planets, spacecrafts, loading, error, sendSpacecraftToPlanet } = useSpaceTravel();
  const [selectedSpacecraft, setSelectedSpacecraft] = useState('');
  const [targetPlanet, setTargetPlanet] = useState('');
  const [transferError, setTransferError] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  const handleSpacecraftChange = (e) => {
    setSelectedSpacecraft(e.target.value);
    setTransferError('');
  };

  const handlePlanetChange = (e) => {
    setTargetPlanet(e.target.value);
    setTransferError('');
  };

  const handleSendSpacecraft = async () => {
    if (!selectedSpacecraft || !targetPlanet) {
      setTransferError('Please select both a spacecraft and a destination planet');
      return;
    }

    const spacecraft = spacecrafts.find(craft => craft.id === selectedSpacecraft);
    if (spacecraft.currentLocation === parseInt(targetPlanet)) {
      setTransferError('Cannot send spacecraft to its current location');
      return;
    }

    const success = await sendSpacecraftToPlanet(selectedSpacecraft, parseInt(targetPlanet));
    if (success) {
      setSelectedSpacecraft('');
      setTargetPlanet('');
      setShowDialog(false);
      alert('Spacecraft successfully dispatched!');
    }
  };

  const getStationedSpacecraft = (planetId) => {
    return spacecrafts.filter(spacecraft => spacecraft.currentLocation === planetId);
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
    <div className={styles.planetsPage}>
      <div className={styles.container}>
        <h1 className="page-title">Planets</h1>
        
        <div className={styles.planetsGrid}>
          {planets.map((planet) => {
            const stationedSpacecraft = getStationedSpacecraft(planet.id);
            return (
              <div key={planet.id} className={styles.planetCard}>
                <div className={styles.planetInfo}>
                  <h2 className={styles.planetName}>{planet.name}</h2>
                  <p className={styles.population}>
                    <strong>Population:</strong> {planet.currentPopulation.toLocaleString()}
                  </p>
                </div>
                
                <div className={styles.spacecraftSection}>
                  <h3>Stationed Spacecraft</h3>
                  {stationedSpacecraft.length === 0 ? (
                    <p className={styles.noSpacecraft}>No spacecraft stationed here.</p>
                  ) : (
                    <ul className={styles.spacecraftList}>
                      {stationedSpacecraft.map((craft) => (
                        <li key={craft.id} className={styles.spacecraftItem}>
                          <div>
                            <strong>{craft.name}</strong>
                            <p>Capacity: {craft.capacity}</p>
                          </div>
                          <button 
                            onClick={() => {
                              setSelectedSpacecraft(craft.id);
                              setShowDialog(true);
                            }}
                            className={styles.transferButton}
                          >
                            Transfer
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {showDialog && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2>Transfer Spacecraft</h2>
              
              <div className={styles.formGroup}>
                <label htmlFor="spacecraft">Select Spacecraft</label>
                <select
                  id="spacecraft"
                  value={selectedSpacecraft}
                  onChange={handleSpacecraftChange}
                >
                  <option value="">-- Select Spacecraft --</option>
                  {spacecrafts.map((craft) => (
                    <option key={craft.id} value={craft.id}>
                      {craft.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedSpacecraft && (
                <div className={styles.formGroup}>
                  <label htmlFor="planet">Destination Planet</label>
                  <select
                    id="planet"
                    value={targetPlanet}
                    onChange={handlePlanetChange}
                  >
                    <option value="">-- Select Destination --</option>
                    {planets
                      .filter(planet => {
                        const craft = spacecrafts.find(c => c.id === selectedSpacecraft);
                        return craft && planet.id !== craft.currentLocation;
                      })
                      .map((planet) => (
                        <option key={planet.id} value={planet.id}>
                          {planet.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
              
              {transferError && (
                <div className="error">{transferError}</div>
              )}
              
              <div className={styles.modalActions}>
                <button 
                  onClick={() => setShowDialog(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendSpacecraft}
                  className={styles.sendButton}
                  disabled={!selectedSpacecraft || !targetPlanet}
                >
                  Send Spacecraft
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Planets;
