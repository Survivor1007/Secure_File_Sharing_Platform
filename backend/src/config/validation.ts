import z from "zod";

export const registerSchema = z.object({
      email: z
      .string()
      .email('Invalid  Email Address')
      .min(5, 'Email is too short')
      .max(100, 'Email is too long'),

      password: z
      .string()
      .min(8, 'Password must be atleast 8 characters')
      .max(100, 'Password too long')
      .regex(/[A-Z]/, 'Password must have atleast one uppercase character')
      .regex(/[a-z]/, 'Password must have atleast one lowercase character')
      .regex(/[0-9]/, 'Password must have atleast a numeric character')
      .regex(/[^A-Za-z0-9]/, 'Password must have atleast one special character'),

      name: z
      .string()
      .min(2, 'Name must have atleast 2 characters')
      .max(50, 'Name too long')
      .optional(),
});

export const loginSchema = z.object({
      email:z.string().email('Invalid email address'),
      password: z.string().min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;