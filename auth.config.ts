//auth.config.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { signInSchema } from "./lib/zod";
import prisma from "@/db/index";
import bcryptjs from "bcryptjs";

const publicRoutes = ["/auth/signin", "/auth/signup", "/"];
const authRoutes = ["/auth/signin", "/auth/signup"];

// const TOKEN_SALT = process.env.NEXTAUTH_SALT;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
      // pkce: true,
      // checks: ["none"],
    }),

    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },

      async authorize(credentials) {
        if (!credentials) return null;

        // Validate credentials
        const parsedCredentials = signInSchema.safeParse(credentials);
        if (!parsedCredentials.success) {
          console.error("Invalid credentials:", parsedCredentials.error.errors);
          return null;
        }

        // Get user from the database
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        });

        if (!user) {
          console.log("Invalid credentials");
          return null;
        }

        // if (!user.password) {
        //   console.log(
        //     "User has no password. They probably signed up with an OAuth provider."
        //   );
        //   return null;
        // }

        if (user.password) {
          const isPasswordValid = await bcryptjs.compare(
            credentials.password as string,
            user.password
          );
          if (!isPasswordValid) {
            console.log("Invalid password");
            return null;
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          emailVerified: user.emailVerified,
          userType: user.userType || "user",
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET || "secr3t",

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.userType = user.userType;
        token.name = user.name;
        token.email = user.email;
      }
      if (trigger === "update" && session) {
        token = { ...token, ...session };
      }
      // console.log(token);

      return { ...token, ...user };
    },

    async session({ session, token }) {
      if (session.user) {
        try {
          // const encodedToken = await encode({
          //   token,
          //   secret: process.env.AUTH_SECRET!,
          //   salt: TOKEN_SALT,
          // });

          session.user = token as any;
          // session.user.accessToken = encodedToken;
          session.user.id = token.id;
          session.user.userType = token.userType;
          session.user.name = token.name;
          session.user.email = token.email;

          // Debug logging
          // console.log("Updated Session:", session);
        } catch (error) {
          console.error("Error encoding token:", error);
          session.user = token as any;
        }
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },
};
