import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Welcome to the EMS Dashboard
      </h1>

      <div className="flex gap-6 mb-6">
        <button
          onClick={() => navigate("/form")}
          className="w-48 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Go to Form Builder
        </button>
        <button
          onClick={() => navigate("/employees")}
          className="w-48 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Go to Employee Management
        </button>
      </div>

      <button
        onClick={handleLogout}
        className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
}

export default DashboardPage;
