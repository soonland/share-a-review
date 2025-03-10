import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { Provider } from "next-auth/providers/index";
import SpotifyProvider from "next-auth/providers/spotify";

import pool from "@/db";
import SarAdapter from "@/lib/sarAdapter";

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  // return await bcrypt.compare(plainPassword, hashedPassword);
  return plainPassword === hashedPassword;
}

export async function findUserByUsername(email: string) {
  const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]).then((res) => res.rows[0]);

  return user;
}
const credentialsProvider = CredentialsProvider({
  name: "Credentials",
  credentials: {
    username: { label: "Username", type: "text" },
    password: { label: "Password", type: "password" },
  },
  authorize: async (credentials) => {
    if (!credentials) {
      return null;
    }

    const user = await findUserByUsername(credentials.username);

    if (!user) {
      return null;
    }

    const isValid = await verifyPassword(credentials.password, user.password);

    if (!isValid) {
      return null;
    }

    return { id: user.id, name: user.name, email: user.email, image: user.image, is_admin: user.is_admin };
  },
});

const providersList = (): Provider[] => {
  const providers: Provider[] = [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      profile: (profile) => {
        return {
          id: profile.id,
          name: profile.display_name,
          email: profile.email,
          image: profile.images?.[0]?.url,
          is_admin: false,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile: (profile) => {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          is_admin: false,
        };
      },
    }),
  ];

  if (process.env.VERCEL_ENV !== "production") {
    providers.push(credentialsProvider);
  }

  return providers;
};

export const authOptions: NextAuthOptions = {
  adapter: SarAdapter(),
  providers: providersList(),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Initial sign in
        token.is_admin = user.is_admin;
      } else if (token?.sub) {
        // Subsequent token refreshes
        const dbUser = await pool.query("SELECT is_admin FROM users WHERE id = $1", [token.sub]);
        if (dbUser.rows[0]) {
          token.is_admin = dbUser.rows[0].is_admin;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub) {
        session.user.id = token.sub;
      }
      session.user.is_admin = token.is_admin as boolean;
      return session;
    },
  },
};

export default NextAuth(authOptions);
