"use server";

import { z } from "zod";
import prisma from "@/db/index";

const EmailSchema = z.object({
  subscribeMail: z.string().email({ message: "Please enter a valid email address" }),
});

export async function subscribeNewsLetter(
  previousState: unknown,
  subscribeMail: string
) {
  console.log("Form Data:", subscribeMail);

  const result = EmailSchema.safeParse({ subscribeMail });

  if (!result.success) {
    console.error("Validation Error:", result.error);
    return {
      success: false,
      data: { subscribeMail },
      message: "Invalid email address",
    };
  }

  // Check if email already exists
  const existingSubscription = await prisma.newsletterSubscription.findUnique({
    where: {
      email: subscribeMail,
    },
  });

  if (existingSubscription) {
    if (!existingSubscription.isSubscribed) {
      await prisma.newsletterSubscription.update({
        where: { email: subscribeMail },
        data: { isSubscribed: true },
      });

      console.log("User resubscribed successfully");
      return {
        success: true,
        data: { subscribeMail },
        message: "You have been resubscribed successfully!",
      };
    }

    console.log("This email is already subscribed");
    return {
      success: true,
      data: { subscribeMail },
      message: "This email is already subscribed",
    };
  }

  await prisma.newsletterSubscription.create({
    data: {
      email: subscribeMail,
      isSubscribed: true,
    },
  });

  console.log("Email subscription successful");
  return {
    success: true,
    data: { subscribeMail },
    message: "Email subscription successful!",
  };
}
