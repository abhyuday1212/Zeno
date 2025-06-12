import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth.config";
import type { NextAuthOptions } from "next-auth";

export const getServerAuthSession = () => getServerSession(authOptions);

// For server-side sign in/out (if needed)
export { signIn, signOut } from "next-auth/react";
