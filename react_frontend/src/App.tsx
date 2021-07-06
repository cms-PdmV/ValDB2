import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { TodoPage } from "./pages/todo"
import { ReportPage } from './pages/ReportPage';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { primaryColor } from './utils/css';
import { AdministratorPage } from './pages/AdministratorPage';
import { AllCampaignPage } from './pages/campaign/AllCampaignPage';
import { CampaignFormPage } from './pages/campaign/CampaignFormPage';
import { CampaignPage } from './pages/campaign/CampaignPage';
import { ReportCreatePage } from './pages/ReportCreatePage';

const originalTheme = createMuiTheme();

const theme = createMuiTheme({      
  typography: {
    fontSize: 14,
    button: {
      textTransform: 'none',
      fontWeight: 'bold',
    }
  },
  palette: {
    primary: {
      main: primaryColor,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
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
          <Route path="/campaigns/new">
            <CampaignFormPage />
          </Route>
          <Route path="/campaigns/:campaign/report/:group">
            <ReportPage />
          </Route>
          <Route path="/campaigns/:id/edit">
            <CampaignFormPage />
          </Route>
          <Route path="/campaigns/:id">
            <CampaignPage />
          </Route>
          <Route path="/campaigns">
            <AllCampaignPage />
          </Route>
          {/* <Route path="/reports/new">
            <ReportCreatePage />
          </Route> */}
          <Route path="/admin">
            <AdministratorPage />
          </Route>
          <Route path="/">
            home
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
