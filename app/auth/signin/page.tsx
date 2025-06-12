"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { FcGoogle } from "react-icons/fc";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { signInSchema } from "@/lib/zod";
import LoadingButton from "@/components/loading-button";
import { useState, useEffect, Suspense } from "react";
import ErrorMessage from "@/components/error-message";
import { Button } from "@/components/ui/button";

import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

import Link from "next/link";
// import Navbar from "@/components/navbar";

function SignInForm() {
  const params = useSearchParams();
  const error = params.get("error");
  const router = useRouter();

  const [globalError, setGlobalError] = useState<string>("");

  useEffect(() => {
    if (error) {
      switch (error) {
        case "OAuthAccountNotLinked":
          setGlobalError("Please use your email and password to sign in.");
          break;
        case "CredentialsSignin":
          setGlobalError("Invalid email or password.");
          break;
        default:
          setGlobalError("An unexpected error occurred. Please try again.");
      }
    }
    router.replace("/auth/signin");
  }, [error, router]);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setGlobalError("Invalid email or password.");
      } else if (result?.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log("An unexpected error occurred. Error: ", error);
      setGlobalError("Something went wrong. Please try again.");
    }
  };

  const handleGithubSignin = async () => {
    try {
      await signIn("github", { callbackUrl: "/" });
    } catch (error) {
      setGlobalError("Failed to sign in with GitHub.");
    }
  };

  const handleGoogleSignin = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      setGlobalError("Failed to sign in with Google.");
    }
  };

  return (
    <div className="pt-16 h-screen grow flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-bold-text">
            Welcome Back
          </CardTitle>
        </CardHeader>
        <CardContent>
          {globalError && <ErrorMessage error={globalError} />}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit button will go here */}
              <LoadingButton pending={form.formState.isSubmitting}>
                Sign in
              </LoadingButton>
            </form>
          </Form>

          <span className="text-sm text-gray-500 text-center block my-2">
            or
          </span>
          <Button
            variant="outline"
            className="w-full mb-2"
            type="button"
            onClick={() =>
              handleGithubSignin().catch((error) =>
                setGlobalError(error.message)
              )
            }
          >
            <GitHubLogoIcon className="h-4 w-4 mr-2" />
            Sign in with GitHub
          </Button>

          <Button
            variant="outline"
            className="w-full"
            type="button"
            onClick={() =>
              handleGoogleSignin().catch((error) =>
                setGlobalError(error.message)
              )
            }
            // onClick={() => signIn("github")}
          >
            <FcGoogle className="h-4 w-4 mr-2" />
            Sign in with Google
          </Button>

          <span className="text-sm text-gray-500 text-center block my-2 dark:text-white-muted mt-4">
            Dont have an account?
          </span>

          <Link href="/auth/signup">
            <Button variant="default" className="w-full">
              Sign Up
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
