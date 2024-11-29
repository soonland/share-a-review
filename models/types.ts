export interface Change {
  version: string;
  date: string;
  description?: string;
  features?: string[];
  fixes?: string[];
  projectConfiguration?: string[];
}

export interface NotificationFolder {
  id: number;
  name: string;
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

export interface CurrentNotificationView {
  folder: string;
  type: string;
}
