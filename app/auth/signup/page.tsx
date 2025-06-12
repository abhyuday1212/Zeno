"use client";

import { useState } from "react";
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
import LoadingButton from "@/components/loading-button";
import ErrorMessage from "@/components/error-message";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signUpSchema } from "@/lib/zod";

import { handleSignUp } from "@/app/actions/authActions";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignUp() {
  const [globalError, setGlobalError] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
    try {
      setGlobalError("");

      const result: ServerActionResponse = await handleSignUp({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      });

      if (result.success) {
        console.log("Account created successfully.");
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
      } else {
        setTimeout(() => {
          setGlobalError(result.message);
        }, 3000);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Error: ", error);
      setTimeout(() => {
        setGlobalError("An unexpected error occurred. Please try again.");
      }, 3000);
    }
  };

  return (
    <div className=" pt-16 h-screen grow flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-bold-text">
            Create Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          {globalError && <ErrorMessage error={globalError} />}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {["name", "email", "password", "confirmPassword"].map((field) => (
                <FormField
                  control={form.control}
                  key={field}
                  name={field as keyof z.infer<typeof signUpSchema>}
                  render={({ field: fieldProps }) => (
                    <FormItem>
                      <FormLabel>
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type={
                            field.includes("password")
                              ? "password"
                              : field === "email"
                              ? "email"
                              : "text"
                          }
                          placeholder={`Enter your ${field}`}
                          {...fieldProps}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <LoadingButton pending={form.formState.isSubmitting}>
                Sign up
              </LoadingButton>
            </form>
          </Form>

          <span className="text-sm text-gray-500 text-center block my-2">
            Already have an account!
          </span>

          <Link href="/auth/signin">
            <Button variant="default" className="w-full">
              Sign In
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
