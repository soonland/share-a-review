import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      is_admin: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    is_admin: boolean;
  }
}
