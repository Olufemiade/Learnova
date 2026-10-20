export type Role = "User" | "Admin";
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}
export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  durationHours: number;
  thumbnailUrl?: string;
  lessons?: { title: string; durationMinutes: number; _id?: string }[];
  published: boolean;
  createdAt?: string;
}
export interface Enrollment {
  _id: string;
  progress: number;
  course: Course;
  enrolledAt?: string;
}
