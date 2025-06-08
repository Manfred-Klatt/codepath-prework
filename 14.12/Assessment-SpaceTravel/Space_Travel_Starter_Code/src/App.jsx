import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import AppRoutes from './routes/AppRoutes';
import { SpaceTravelProvider } from './context/SpaceTravelContext';
import styles from './App.module.css';

function App() {
  return (
    <Router>
      <SpaceTravelProvider>
        <div className={styles.app}>
          <Navbar />
          <main className={styles.mainContent}>
            <AppRoutes />
          </main>
        </div>
      </SpaceTravelProvider>
    </Router>
  );
}

export default App;
