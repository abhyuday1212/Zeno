import { NextResponse } from "next/server";
import { apiRouteWrapper } from "@/utils/apiRouteWrapper";
import { ApiResponse } from "@/utils/apiResponse";
import prisma from "@/db/index";
import { z } from "zod";
import { sendContactSubmissionEmail } from "@/utils/sendMail";

const contactSchema = z.object({
  name: z.string().min(4).max(50),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  subject: z.string().min(5).max(100),
  message: z.string().min(10).max(1000),
});

const handler = async (req: Request) => {
  const formData = await req.formData();

  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    phoneNumber: formData.get("phoneNumber") as string | undefined,
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const validated = contactSchema.safeParse(raw);

  if (!validated.success) {
    const flatErrors = validated.error.flatten().fieldErrors;

    const [firstField, messages] =
      Object.entries(flatErrors).find(([, msgs]) => msgs && msgs.length > 0) ||
      [];

    const firstMessage = messages?.[0] || "Validation failed";

    return NextResponse.json(
      {
        success: false,
        message: `Error in field "${firstField}": ${firstMessage}`,
        errors: flatErrors,
      },
      { status: 400 }
    );
  }

  await prisma.contactUs.create({
    data: {
      name: validated.data.name,
      email: validated.data.email,
      phoneNumber: validated.data.phoneNumber,
      subject: validated.data.subject,
      message: validated.data.message,
    },
  });

  await sendContactSubmissionEmail(validated.data);

  return NextResponse.json(
    new ApiResponse(
      200,
      null,
      "Thank you for your message! We'll get back to you soon."
    )
  );
};

export const POST = apiRouteWrapper(handler);
