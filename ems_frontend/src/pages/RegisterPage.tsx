import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../validation/registerSchema";
import type { RegisterSchema } from "../validation/registerSchema";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [success, setSuccess] = useState("");
  const [serverErrors, setServerErrors] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterSchema) => {
    setSuccess("");
    setServerErrors([]);
    setCountdown(5);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register/`, data);
      setSuccess("User registered successfully! Redirecting to login...");
      reset();
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data;
        if (errorData && typeof errorData === "object") {
          const allMessages: string[] = [];
          Object.values(errorData).forEach((messages) => {
            if (Array.isArray(messages)) {
              allMessages.push(...messages);
            }
          });
          setServerErrors(allMessages);
        } else {
          setServerErrors(["Registration failed. Please try again."]);
        }
      } else {
        setServerErrors(["Unexpected error. Try again later."]);
      }
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/login");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [success, navigate]);

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      {success && (
        <div className="text-green-600 mb-4">
          {success} ({countdown})
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <input
            {...register("username")}
            placeholder="Username"
            className="w-full mb-2 p-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <input
            {...register("email")}
            placeholder="Email"
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Register
        </button>

        <div className="mt-4 text-red-500 text-sm space-y-1">
          {errors.username && <p>{errors.username.message}</p>}
          {errors.email && <p>{errors.email.message}</p>}
          {errors.password && <p>{errors.password.message}</p>}
          {serverErrors.map((err, idx) => (
            <p key={idx}>{err}</p>
          ))}
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
