import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Settings from "./components/Settings";

function Layout() {
  const token = localStorage.getItem("authToken");
  const location = useLocation();

  return (
    <>
      <Routes>
      <Route path="/" element={token ? <Home /> : <Register />} />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Settings" element={<Settings />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
