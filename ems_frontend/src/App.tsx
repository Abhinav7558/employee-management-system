import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import FormBuilderPage from "./pages/FormBuilderPage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedLayout from "./components/ProtectedLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/form" element={<FormBuilderPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
