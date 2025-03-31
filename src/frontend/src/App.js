// Author: Pitch Perfect
// Description: Main entry point for the React application.
// Last Modified: 2025-02-01

import React from "react";
import routes from "./routes";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthProvider from "./hooks/AuthProvider";
import PrivateRoute from "./utils/PrivateRoute";

// Central App component that contains the routing and authentication context
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {routes.map((route, index) =>
            route.private ? (
              <Route element={<PrivateRoute />}>
                <Route
                  key={index}
                  exact
                  path={route.path}
                  element={<route.component />}
                />
              </Route>
            ) : (
              <Route
                key={index}
                exact
                path={route.path}
                element={<route.component />}
              />
            )
          )}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
