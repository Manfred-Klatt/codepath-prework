import React, { createContext, useState, useContext, useEffect } from 'react';
import SpaceTravelApi from '../services/SpaceTravelApi';

const SpaceTravelContext = createContext();

export const useSpaceTravel = () => useContext(SpaceTravelContext);

export const SpaceTravelProvider = ({ children }) => {
  const [planets, setPlanets] = useState([]);
  const [spacecrafts, setSpacecrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch planets and spacecrafts on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [planetsResponse, spacecraftsResponse] = await Promise.all([
          SpaceTravelApi.getPlanets(),
          SpaceTravelApi.getSpacecrafts()
        ]);

        if (planetsResponse.isError) {
          throw new Error('Failed to fetch planets');
        }
        
        if (spacecraftsResponse.isError) {
          throw new Error('Failed to fetch spacecrafts');
        }

        setPlanets(planetsResponse.data);
        setSpacecrafts(spacecraftsResponse.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get a specific spacecraft by ID
  const getSpacecraftById = React.useCallback(async (id) => {
    try {
      setLoading(true);
      
      // Make sure we have a valid ID
      if (!id) {
        throw new Error('Invalid spacecraft ID');
      }
      
      const response = await SpaceTravelApi.getSpacecraftById({ id });
      
      if (response.isError) {
        throw new Error('Failed to fetch spacecraft');
      }
      
      if (!response.data) {
        throw new Error('No spacecraft found with ID: ' + id);
      }
      
      return response.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Build a new spacecraft
  const buildSpacecraft = async (spacecraftData) => {
    try {
      setLoading(true);
      const response = await SpaceTravelApi.buildSpacecraft(spacecraftData);
      
      if (response.isError) {
        throw new Error('Failed to build spacecraft');
      }
      
      // Refresh spacecraft list
      const spacecraftsResponse = await SpaceTravelApi.getSpacecrafts();
      
      if (spacecraftsResponse.isError) {
        throw new Error('Failed to fetch spacecrafts');
      }
      
      setSpacecrafts(spacecraftsResponse.data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Destroy a spacecraft by ID
  const destroySpacecraft = async (id) => {
    try {
      setLoading(true);
      const response = await SpaceTravelApi.destroySpacecraftById({ id });
      
      if (response.isError) {
        throw new Error('Failed to destroy spacecraft');
      }
      
      // Update spacecraft list by removing the destroyed spacecraft
      setSpacecrafts(spacecrafts.filter(craft => craft.id !== id));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Send spacecraft to another planet
  const sendSpacecraftToPlanet = async (spacecraftId, targetPlanetId) => {
    try {
      setLoading(true);
      const response = await SpaceTravelApi.sendSpacecraftToPlanet({ 
        spacecraftId, 
        targetPlanetId 
      });
      
      if (response.isError) {
        throw new Error('Failed to send spacecraft to planet');
      }
      
      // Refresh spacecraft list and planets data
      const [planetsResponse, spacecraftsResponse] = await Promise.all([
        SpaceTravelApi.getPlanets(),
        SpaceTravelApi.getSpacecrafts()
      ]);
      
      if (planetsResponse.isError || spacecraftsResponse.isError) {
        throw new Error('Failed to refresh data');
      }
      
      setPlanets(planetsResponse.data);
      setSpacecrafts(spacecraftsResponse.data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear current error
  const clearError = () => {
    setError(null);
  };

  // Update spacecraft picture
  const updateSpacecraftPicture = React.useCallback(async (id, pictureUrl) => {
    try {
      setLoading(true);
      
      const response = await SpaceTravelApi.updateSpacecraftPicture({ id, pictureUrl });
      
      if (response.isError) {
        throw new Error('Failed to update spacecraft picture');
      }
      
      // Update the spacecraft in the local state
      setSpacecrafts(prevSpacecrafts => {
        return prevSpacecrafts.map(craft => {
          if (craft.id === id) {
            return { ...craft, pictureUrl: response.data.pictureUrl };
          }
          return craft;
        });
      });
      
      return response.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Value object to be provided to consumers
  const value = {
    planets,
    spacecrafts,
    loading,
    error,
    getSpacecraftById,
    buildSpacecraft,
    destroySpacecraft,
    sendSpacecraftToPlanet,
    updateSpacecraftPicture,
    clearError
  };

  return (
    <SpaceTravelContext.Provider value={value}>
      {children}
    </SpaceTravelContext.Provider>
  );
};
