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
