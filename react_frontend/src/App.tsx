import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { TodoPage } from "./pages/todo"
import { ReportPage } from './pages/report';

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
        <Route path="/todo">
          <TodoPage />
        </Route>
        <Route path="/report">
          <ReportPage />
        </Route>
        <Route path="/">
          home
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
