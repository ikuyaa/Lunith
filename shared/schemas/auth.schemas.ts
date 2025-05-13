import { z } from "zod";

export const USERNAME_REGEX = /^[a-zA-Z0-9._-]+$/;

export const loginSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});
export type LoginFormValues = z.infer<typeof loginSchema>;
  
export const registerSchema = z.object({
    firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
    lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    username: z.string().min(3, { message: `Username must be at least ${3} characters` })
        .regex(USERNAME_REGEX, { message: 'Username can only contain letters, numbers and underscores' })
        .max(20, { message: `Username cannot exceed ${20} characters.` }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string(),
    dateOfBirth: z.date({
        required_error: "Please select a date of birth",
      }),
  }).superRefine((data, ctx) => {
    if(data.password !== data.confirmPassword || data.confirmPassword === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match",
        path: ["confirmPassword"],
      })
    }
  })
export type RegisterFormValues = z.infer<typeof registerSchema>;
  
export const passwordResetSchema = z.object({
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
});
export type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;
  
export const passwordSchema = z.string().min(8, { message: 'Password must be at least 8 characters' })
export const usernameSchema = z.string().regex(USERNAME_REGEX, {message: 'Username must only use letters, numbers, dots, underscores, and hyphens'}).min(3, { message: "Username must be at least 3 characters long" }).max(20, { message: "Username must be at most 20 characters long" });