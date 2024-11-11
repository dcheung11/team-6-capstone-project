import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TeamHomePage from './containers/TeamHomePage';
import CalendarPage from './containers/CalendarPage';
import SchedulePage from './containers/SchedulePage';

import "./App.css";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<CalendarPage />} />
          <Route path="/team" element={<TeamHomePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
        </Routes>
      </Router>
  );
}

export default App;
