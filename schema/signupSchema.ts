import { z } from "zod";

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(4, { message: "Name must be at least 6 characters long" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .refine(
        (password) => {
          const hasUppercase = /[A-Z]/.test(password);
          const hasLowercase = /[a-z]/.test(password);
          const hasNumber = /\d/.test(password);
          const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(
            password
          );

          return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
        },
        {
          message:
            "Password must contain at least one uppercase letter, lowercase letter, number, and special character",
        }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;
