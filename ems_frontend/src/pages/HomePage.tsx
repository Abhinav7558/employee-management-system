import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Employee Management System (EMS)
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome! Please log in or register to continue.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <button className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
