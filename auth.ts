import NextAuth from "next-auth";
import prisma from "@/db/index";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";

// Check the use of SessionStrategy in the following import later
// import { SessionStrategy } from "next-auth";

import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  session: {
    strategy: "jwt",
    // strategy: "jwt" as SessionStrategy,
    // maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  ...authConfig,
});
