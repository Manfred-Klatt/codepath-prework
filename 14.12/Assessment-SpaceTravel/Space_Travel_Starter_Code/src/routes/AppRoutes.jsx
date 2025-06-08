import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Home from '../pages/Home/Home';
import Spacecrafts from '../pages/Spacecrafts/Spacecrafts';
import SpacecraftDetail from '../pages/SpacecraftDetail/SpacecraftDetail';
import Construction from '../pages/Construction/Construction';
import Planets from '../pages/Planets/Planets';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/spacecrafts" element={<Spacecrafts />} />
      <Route path="/spacecraft/:id" element={<SpacecraftDetail />} />
      <Route path="/construction" element={<Construction />} />
      <Route path="/planets" element={<Planets />} />
      
      {/* Redirect all unmatched routes to the homepage */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
