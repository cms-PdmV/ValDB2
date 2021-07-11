import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { TodoPage } from "./pages/Todo"
import { ReportPage } from './pages/ReportPage';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { primaryColor } from './utils/css';
import { AdminPage } from './pages/AdminPage';
import { AllCampaignPage } from './pages/AllCampaignPage';
import { CampaignFormPage } from './pages/CampaignFormPage';
import { CampaignPage } from './pages/CampaignPage';
import { useEffect, useState } from "react";
import { User, UserRole } from "./types";
import { NavBar } from "./components/NavBar";
import { UserContext } from "./context/user";
import { UserPage } from "./pages/UserPage";
import { MyReportPage } from "./pages/MyReportPage";
import { AllUserAdminPage } from "./pages/AllUserAdminPage";
import { UserFormAdminPage } from "./pages/UserFormAdminPage";
import { UserAdminPage } from "./pages/UserAdminPage";
import { AuthPage } from "./pages/Auth";

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

const mockUser: User = {
  _id: 'yorkyork',
  fullname: 'Chanchana',
  role: UserRole.ADMIN,
  groups: ['Reconstruction.Data.Tracker', 'Reconstruction.Data.Ecal', 'Reconstruction.Data.HGcal', 'Reconstruction.Data.Hcal', 'Reconstruction.Data.CASTOR', 'Reconstruction.Data.DT', 'Reconstruction.Data.CSC', 'Reconstruction.Data.RPC', 'Reconstruction.Data.GEM', 'Reconstruction.Data.MTD', 'Reconstruction.Data.PPS', 'Reconstruction.Data.L1', 'Reconstruction.Data.Tracking', 'Reconstruction.Data.Electron', 'Reconstruction.Data.Photon', 'Reconstruction.Data.Muon', 'Reconstruction.Data.Jet', 'Reconstruction.Data.MET', 'Reconstruction.Data.bTag', 'Reconstruction.Data.Tau', 'Reconstruction.Data.PF', 'Reconstruction.Data.Info', 'Reconstruction.Data.RelMon', 'Reconstruction.FastSim.Tracker', 'Reconstruction.FastSim.Ecal', 'Reconstruction.FastSim.HGcal', 'Reconstruction.FastSim.Hcal', 'Reconstruction.FastSim.CASTOR', 'Reconstruction.FastSim.DT', 'Reconstruction.FastSim.CSC', 'Reconstruction.FastSim.RPC', 'Reconstruction.FastSim.GEM', 'Reconstruction.FastSim.MTD', 'Reconstruction.FastSim.PPS', 'Reconstruction.FastSim.L1', 'Reconstruction.FastSim.Tracking', 'Reconstruction.FastSim.Electron', 'Reconstruction.FastSim.Photon', 'Reconstruction.FastSim.Muon', 'Reconstruction.FastSim.Jet', 'Reconstruction.FastSim.MET', 'Reconstruction.FastSim.bTag', 'Reconstruction.FastSim.Tau', 'Reconstruction.FastSim.PF', 'Reconstruction.FastSim.Info', 'Reconstruction.FastSim.RelMon', 'Reconstruction.FullSim.Tracker', 'Reconstruction.FullSim.Ecal', 'Reconstruction.FullSim.HGcal', 'Reconstruction.FullSim.Hcal', 'Reconstruction.FullSim.CASTOR', 'Reconstruction.FullSim.DT', 'Reconstruction.FullSim.CSC', 'Reconstruction.FullSim.RPC', 'Reconstruction.FullSim.GEM', 'Reconstruction.FullSim.MTD', 'Reconstruction.FullSim.PPS', 'Reconstruction.FullSim.L1', 'Reconstruction.FullSim.Tracking', 'Reconstruction.FullSim.Electron', 'Reconstruction.FullSim.Photon', 'Reconstruction.FullSim.Muon', 'Reconstruction.FullSim.Jet', 'Reconstruction.FullSim.MET', 'Reconstruction.FullSim.bTag', 'Reconstruction.FullSim.Tau', 'Reconstruction.FullSim.PF', 'Reconstruction.FullSim.Info', 'Reconstruction.FullSim.RelMon', 'HLT.Data.Tracking', 'HLT.Data.Electron', 'HLT.Data.Photon', 'HLT.Data.Muon', 'HLT.Data.Jet', 'HLT.Data.MET', 'HLT.Data.bTag', 'HLT.Data.Tau', 'HLT.Data.SMP', 'HLT.Data.Higgs', 'HLT.Data.Top', 'HLT.Data.Susy', 'HLT.Data.Exotica', 'HLT.Data.B2G', 'HLT.Data.B', 'HLT.Data.Fwd', 'HLT.Data.HIN', 'HLT.Data.Info', 'HLT.Data.RelMon', 'HLT.FullSim.Tracking', 'HLT.FullSim.Electron', 'HLT.FullSim.Photon', 'HLT.FullSim.Muon', 'HLT.FullSim.Jet', 'HLT.FullSim.MET', 'HLT.FullSim.bTag', 'HLT.FullSim.Tau', 'HLT.FullSim.SMP', 'HLT.FullSim.Higgs', 'HLT.FullSim.Top', 'HLT.FullSim.Susy', 'HLT.FullSim.Exotica', 'HLT.FullSim.B2G', 'HLT.FullSim.B', 'HLT.FullSim.Fwd', 'HLT.FullSim.HIN', 'HLT.FullSim.Info', 'HLT.FullSim.RelMon', 'PAGs.Data.SMP', 'PAGs.Data.Higgs', 'PAGs.Data.Top', 'PAGs.Data.Susy', 'PAGs.Data.Exotica', 'PAGs.Data.B2G', 'PAGs.Data.B', 'PAGs.Data.Fwd', 'PAGs.Data.HIN', 'PAGs.Data.Info', 'PAGs.Data.RelMon', 'PAGs.FastSim.SMP', 'PAGs.FastSim.Higgs', 'PAGs.FastSim.Top', 'PAGs.FastSim.Susy', 'PAGs.FastSim.Exotica', 'PAGs.FastSim.B2G', 'PAGs.FastSim.B', 'PAGs.FastSim.Fwd', 'PAGs.FastSim.HIN', 'PAGs.FastSim.Info', 'PAGs.FastSim.RelMon', 'PAGs.FullSim.SMP', 'PAGs.FullSim.Higgs', 'PAGs.FullSim.Top', 'PAGs.FullSim.Susy', 'PAGs.FullSim.Exotica', 'PAGs.FullSim.B2G', 'PAGs.FullSim.B', 'PAGs.FullSim.Fwd', 'PAGs.FullSim.HIN', 'PAGs.FullSim.Info', 'PAGs.FullSim.RelMon', 'HIN.Data.Tracking', 'HIN.Data.Electron', 'HIN.Data.Photon', 'HIN.Data.Muon', 'HIN.Data.Jet', 'HIN.Data.Info', 'HIN.Data.RelMon', 'HIN.FullSim.Tracking', 'HIN.FullSim.Electron', 'HIN.FullSim.Photon', 'HIN.FullSim.Muon', 'HIN.FullSim.Jet', 'HIN.FullSim.Info', 'HIN.FullSim.RelMon', 'GEN.Gen.GEN', 'GEN.Gen.Info', 'GEN.Gen.RelMon'],
  email: 'chanchana.wicha@cern.ch'
}

function App() {

  const [user, setUser] = useState<User>()

  useEffect(() => {
    // TODO: check for logged in user token
  }, [])

  const require = (roles: UserRole[]) => user && roles.includes(user.role)

  return (
    <ThemeProvider theme={theme}>
      { !user && <AuthPage setUser={setUser} />}
      { user &&
        <UserContext.Provider value={user}>
          <Router>
            <NavBar user={user}/>
            <Switch>
              <Route path="/campaigns/new">
                { require([UserRole.ADMIN]) && <CampaignFormPage /> }
              </Route>
              <Route path="/campaigns/:campaign/report/:group">
                <ReportPage />
              </Route>
              <Route path="/campaigns/:id/edit">
                { require([UserRole.ADMIN]) && <CampaignFormPage /> }
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
              <Route path="/admin">
                { require([UserRole.ADMIN]) && <AdminPage /> }
              </Route>
              <Route path="/user">
                <UserPage />
              </Route>
              <Route path="/todo">
                <TodoPage />
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
