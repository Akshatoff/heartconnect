import { z } from 'zod';

export const profileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .regex(/^[a-zA-Z\s'-]+$/, "Invalid name format"),

  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say'], {
    required_error: "Please select a gender",
  }),

  date_of_birth: z
    .string()
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      return age >= 18 && age <= 120;
    }, "You must be at least 18 years old"),

  city: z
    .string()
    .min(2, "City is required")
    .max(100, "City name is too long")
    .regex(/^[a-zA-Z\s-]+$/, "Invalid city name"),

  state: z
    .string()
    .min(2, "State is required")
    .max(100, "State name is too long")
    .regex(/^[a-zA-Z\s-]+$/, "Invalid state name"),

  about: z
    .string()
    .min(50, "Please write at least 50 characters about yourself")
    .max(5000, "About section is too long"),

  interests: z
    .array(z.string().max(50))
    .max(10, "You can add up to 10 interests"),

  disability_type: z.string().max(200).optional(),

  disability_description: z.string().max(1000).optional(),

  has_caregiver: z.boolean(),

  caregiver_name: z.string().max(100).optional(),

  caregiver_contact: z
    .string()
    .refine((val) => {
      if (!val) return true;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\+?[\d\s-()]{10,}$/;
      return emailRegex.test(val) || phoneRegex.test(val);
    }, "Must be a valid email or phone number")
    .optional(),

  caregiver_relationship: z.string().max(100).optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
