import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/about">
          about
        </Route>
        <Route path="/users">
          users
        </Route>
        <Route path="/">
          home
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
