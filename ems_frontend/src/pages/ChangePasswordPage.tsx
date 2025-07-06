import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { changePasswordSchema } from "../validation/changePasswordSchema";
import type { ChangePasswordSchema } from "../validation/changePasswordSchema";
import { useState } from "react";

function ChangePasswordPage() {
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordSchema) => {
    setMessage("");

    try {
      const token = localStorage.getItem("access");
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/change-password/`,
        {
          old_password: data.old_password,
          new_password: data.new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Password changed successfully!");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const res = err.response?.data;
        setMessage(res?.detail || "Error changing password");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Change Password</h2>
      {message && <p className="mb-2 text-sm text-red-500">{message}</p>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <input
            {...register("old_password")}
            type="password"
            placeholder="Old Password"
            className="w-full mb-2 p-2 border"
          />
          {errors.old_password && (
            <p className="text-red-500 text-sm">
              {errors.old_password.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <input
            {...register("new_password")}
            type="password"
            placeholder="New Password"
            className="w-full mb-2 p-2 border"
          />
          {errors.new_password && (
            <p className="text-red-500 text-sm">
              {errors.new_password.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <input
            {...register("confirm_password")}
            type="password"
            placeholder="Confirm New Password"
            className="w-full mb-2 p-2 border"
          />
          {errors.confirm_password && (
            <p className="text-red-500 text-sm">
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Change Password
        </button>
      </form>
    </div>
  );
}

export default ChangePasswordPage;
