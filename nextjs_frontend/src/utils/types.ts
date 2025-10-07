export type Role = "student" | "mentor" | "admin";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type Session = {
  id: string;
  title: string;
  updatedAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type StudentAnalytics = {
  sessions: number;
  questions: number;
  insights: number;
};

export type MentorDashboard = {
  trends: Array<{ date: string; value: number }>;
  distribution: Array<{ label: string; value: number }>;
  topStudents: Array<{ id: string; name: string; streak: number; sessions: number }>;
};

export type AdminDashboard = {
  users: number;
  departments: number;
  activeStreaks: number;
  ingestions: number;
};
