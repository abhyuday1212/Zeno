// authActions.ts
"use server";

import { signUpSchema } from "@/lib/zod";
import bcryptjs from "bcryptjs";
import prisma from "@/db/index";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";

// For credentials signin, we'll handle it differently since we can't use signIn from server actions

// For OAuth, we'll redirect to the auth API routes
export async function handleGithubSignin() {
  redirect("/api/auth/signin/github");
}

export async function handleGoogleSignin() {
  redirect("/api/auth/signin/google");
}

export async function handleSignOut() {
  redirect("/api/auth/signout");
}

export async function handleSignUp({
  name,
  email,
  password,
  confirmPassword,
}: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    const parsedCredentials = signUpSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!parsedCredentials.success) {
      return { success: false, message: "Invalid data." };
    }

    // check if the email is already taken
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Email already exists. Login to continue.",
      };
    }

    // hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true, message: "Account created successfully." };
  } catch (error) {
    console.error("Error creating account:", error);
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    };
  }
}

// Server-side function to get current session
export async function getCurrentSession() {
  return await getServerSession(authOptions);
}
