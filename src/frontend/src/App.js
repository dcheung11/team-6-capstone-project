import React from 'react';
import routes from './routes';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} exact path={route.path} element={<route.component />} />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
