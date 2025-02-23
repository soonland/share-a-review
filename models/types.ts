export interface UserType {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  active: boolean;
  last_login: string;
  created_at: string;
}

export interface CategoryFieldType {
  type: "select" | "text" | "number";
  options?: string[];
  required?: boolean;
}

export interface CategoryType {
  id: number;
  slug: string;
  description_template: Record<string, CategoryFieldType>;
}

export interface Change {
  version: string;
  date: string;
  description?: string;
  features?: string[];
  fixes?: string[];
  projectConfiguration?: string[];
}

export interface CurrentNotificationView {
  folder: string;
  type: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  status: string;
  folder: string;
  sent_at: string;
}

export interface NotificationFolder {
  id: number;
  name: string;
  type: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  image?: string;
  is_admin: boolean;
  active: boolean;
  last_login?: string;
  created_at: string;
}

// Extend next-auth session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      is_admin: boolean;
    };
  }
}
