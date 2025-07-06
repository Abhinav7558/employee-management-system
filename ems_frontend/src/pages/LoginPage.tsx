import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../validation/loginSchema";
import type { LoginSchema } from "../validation/loginSchema";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    setServerError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login/`,
        data
      );
      const { access, refresh } = response.data;

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);

      navigate("/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          "Login failed";
        setServerError(message);
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Login</h2>

      <div className="mb-4">
        <input
          {...register("username")}
          placeholder="Username"
          className="w-full mb-2 p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="w-full mb-2 p-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 mt-2 rounded w-full"
      >
        Login
      </button>

      <div className="mt-4 text-red-500 text-sm space-y-1">
        {errors.username && <p>{errors.username.message}</p>}
        {errors.password && <p>{errors.password.message}</p>}
        {serverError && <p>{serverError}</p>}
      </div>
    </form>
  );
}

export default LoginPage;
