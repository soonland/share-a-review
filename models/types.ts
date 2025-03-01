/**
 * Represents a user in the system with their basic information and status.
 * @interface UserType
 */
export interface UserType {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  active: boolean;
  last_login: string;
  created_at: string;
}

/**
 * Defines the structure and validation rules for a category's custom fields.
 * @interface CategoryFieldType
 */
export interface CategoryFieldType {
  type: "select" | "text" | "number";
  options?: string[];
  required?: boolean;
}

/**
 * Represents a category with its properties and field definitions.
 * @interface CategoryType
 */
export interface CategoryType {
  id: number;
  name: string;
  slug: string;
  description_template: Record<string, CategoryFieldType>;
}

/**
 * Represents a changelog entry documenting changes in a version.
 * @interface Change
 */
export interface Change {
  version: string;
  date: string;
  description?: string;
  features?: string[];
  fixes?: string[];
  projectConfiguration?: string[];
}

/**
 * Defines the current notification view state.
 * @interface CurrentNotificationView
 */
export interface CurrentNotificationView {
  folder: string;
  type: string;
}

/**
 * Represents a notification message with its metadata.
 * @interface Notification
 */
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  status: string;
  folder: string;
  sent_at: string;
}

/**
 * Represents a folder for organizing notifications.
 * @interface NotificationFolder
 */
export interface NotificationFolder {
  id: number;
  name: string;
  type: string;
}

/**
 * Extended user interface with additional profile information.
 * Similar to UserType but includes optional image field.
 * @interface User
 * @see UserType
 */
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

/**
 * Extends the next-auth Session type to include custom user properties.
 * This type augmentation ensures type safety when accessing session user data.
 * @example
 * ```typescript
 * const { user } = useSession();
 * if (user.is_admin) {
 *   // Handle admin-only functionality
 * }
 * ```
 */
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
