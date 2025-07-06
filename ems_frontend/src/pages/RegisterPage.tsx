import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validation/registerSchema";
import type { RegisterSchema } from "../validation/registerSchema";
import axios from "axios";
import { useState } from "react";

function RegisterPage() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    setError("");
    setSuccess("");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register/`, data);
      setSuccess("User registered successfully!");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message =
          err.response?.data?.detail ||
          err.response?.data?.message ||
          "Registration failed";
        setError(message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}

      <form onSubmit={handleSubmit(onSubmit)}>
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
            {...register("email")}
            placeholder="Email"
            className="w-full mb-2 p-2 border"
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
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

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;
