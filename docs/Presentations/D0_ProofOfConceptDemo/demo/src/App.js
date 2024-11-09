import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeamHomePage from './containers/TeamHomePage';
import CalendarPage from './containers/CalendarPage';

import "./App.css";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/team" element={<TeamHomePage />} />
        </Routes>
      </Router>
  );
}

export default App;
