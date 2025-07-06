import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation/loginSchema";
import type { LoginSchema } from "../validation/loginSchema";
import axios from "axios";
import { useState } from "react";

function LoginPage() {
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      console.log("Sending login request with:", data);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login/`,
        data
      );
      const { access, refresh } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      console.log("Login successful. Tokens saved to localStorage.");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          "Login failed";
        setError(message);
        console.error("Login error:", err);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      {error && <div className="text-red-500">{error}</div>}

      <div className="mb-4">
        <input
          {...register("username")}
          placeholder="Username"
          className="w-full mb-2 p-2 border"
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>

      <div className="mb-4">
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="w-full mb-2 p-2 border"
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="mb-4">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 mt-2 rounded"
        >
          Login
        </button>
      </div>
    </form>
  );
}

export default LoginPage;
