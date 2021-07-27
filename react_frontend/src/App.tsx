import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { ReportPage } from './pages/ReportPage';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { primaryColor } from './utils/css';
import { AdminPage } from './pages/AdminPage';
import { AllCampaignPage } from './pages/AllCampaignPage';
import { CampaignFormPage } from './pages/CampaignFormPage';
import { CampaignPage } from './pages/CampaignPage';
import { useState } from "react";
import { User, UserRole } from "./types";
import { NavBar } from "./components/NavBar";
import { UserContext } from "./context/user";
import { UserPage } from "./pages/UserPage";
import { MyReportPage } from "./pages/MyReportPage";
import { AllUserAdminPage } from "./pages/AllUserAdminPage";
import { UserFormAdminPage } from "./pages/UserFormAdminPage";
import { UserAdminPage } from "./pages/UserAdminPage";
import { AuthPage } from "./pages/Auth";
import { UserGroupAdminPage } from "./pages/UserGroupAdminPage";
import { ReactElement } from "react-markdown";

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

function App(): ReactElement {

  const [user, setUser] = useState<User>()


  const require = (roles: UserRole[]): boolean | undefined => user && roles.includes(user.role)

  return (
    <ThemeProvider theme={theme}>
      { !user && <AuthPage setUser={setUser} />}
      { user &&
        <UserContext.Provider value={user}>
          <Router basename={process.env.PUBLIC_URL}>
            <NavBar user={user}/>
            <Switch>
              <Route path="/campaigns/form/:mode/:id">
                { require([UserRole.ADMIN]) && <CampaignFormPage /> }
              </Route>
              <Route path="/campaigns/form/:mode">
                { require([UserRole.ADMIN]) && <CampaignFormPage /> }
              </Route>
              <Route path="/campaigns/search/:search">
                <AllCampaignPage />
              </Route>
              <Route path="/campaigns/:campaign/report/:group">
                <ReportPage />
              </Route>
              <Route path="/campaigns/:id">
                <CampaignPage />
              </Route>
              <Route path="/campaigns">
                <AllCampaignPage />
              </Route>
              <Route path="/reports">
                { require([UserRole.ADMIN, UserRole.VALIDATOR]) && <MyReportPage /> }
              </Route>
              <Route path="/admin/users/:id/edit">
                { require([UserRole.ADMIN]) && <UserFormAdminPage /> }
              </Route>
              <Route path="/admin/users/:id">
                { require([UserRole.ADMIN]) && <UserAdminPage /> }
              </Route>
              <Route path="/admin/users">
                { require([UserRole.ADMIN]) && <AllUserAdminPage /> }
              </Route>
              <Route path="/admin/usergroups">
                { require([UserRole.ADMIN]) && <UserGroupAdminPage /> }
              </Route>
              <Route path="/admin">
                { require([UserRole.ADMIN]) && <AdminPage /> }
              </Route>
              <Route path="/user">
                <UserPage />
              </Route>
              <Route path="/">
                <AllCampaignPage />
              </Route>
            </Switch>
          </Router>
        </UserContext.Provider>
      }
    </ThemeProvider>
  );
}

export default App;
