import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import AccountDash from "./pages/account/AccDashboard";
import UDashboard from "./pages/user/UDashboard";
import URegister from "./pages/user/URegister";
import AccRegister from "./pages/account/AccRegister";
import ULogin from "./pages/user/ULogin";
import AdLogin from "./pages/admin/AdLogin";
import AdRegister from "./pages/admin/AdRegister";
import AdDashboard from "./pages/admin/AdDashboard";
import Container from "./components/layout/Container";
import Home from "./pages/Home";
import AuthContainer from "./components/layout/AuthContainer";
import AccLogin from "./pages/account/AccLogin";
import CreatePost from "./pages/user/CreatePost";
import Users from "./pages/admin/Users";
import MyClaims from "./pages/user/MyClaims";
import CreateClaim from "./pages/user/CreateClaim";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes with Container Layout */}
        <Route path="/auth" element={<AuthContainer />}>
          <Route path="user-login" element={<ULogin />} />
          <Route path="user-register" element={<URegister />} />
          <Route path="account-login" element={<AccLogin />} />
          <Route path="account-register" element={<AccRegister />} />
          <Route path="admin-login" element={<AdLogin />} />
          <Route path="admin-register" element={<AdRegister />} />
        </Route>

        {/* Protected Routes with Container Layout */}
        <Route path="/" element={<Container />}>
          <Route index element={<Home />} />
          <Route path="user-dash" element={<UDashboard />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="account-dash" element={<AccountDash />} />
          <Route path="admin-dash" element={<AdDashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="user/my-claims" element={<MyClaims />} />
          <Route path="user/create-claim" element={<CreateClaim />} />
        </Route>
      </Routes>
    </Router>
  );
}
