import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3, "Username should be have more than 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password should be have more than 8 character"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
