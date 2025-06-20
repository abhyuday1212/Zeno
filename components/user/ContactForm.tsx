/* eslint-disable */

import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, User, Send, CheckCircle } from "lucide-react";
import { useActionState, useTransition } from "react";

const INITIAL_STATE = {
  success: null,
  message: "",
  errors: {} as Record<string, string[]>,
  data: {
    name: "",
    email: "",
    phoneNumber: "",
    subject: "",
    message: "",
  },
};

export default function ContactForm() {
  const [, startTransition] = useTransition();
  const [state, action, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      try {
        const response = await fetch("/api/contact-us", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
          return {
            success: false,
            message: result?.message || "Validation error",
            errors: result?.errors || {},
            data: {
              name: formData.get("name") as string,
              email: formData.get("email") as string,
              phoneNumber: formData.get("phoneNumber") as string | undefined,
              subject: formData.get("subject") as string,
              message: formData.get("message") as string,
            },
          };
        }

        return {
          success: true,
          message: result.message,
          errors: {},
          data: {
            name: "",
            email: "",
            phoneNumber: "",
            subject: "",
            message: "",
          },
        };
      } catch (error) {
        console.error("Error submitting contact form:", error);
        return {
          success: false,
          message: "An error occurred while submitting the form.",
          errors: {},
          data: {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            phoneNumber: formData.get("phoneNumber") as string | undefined,
            subject: formData.get("subject") as string,
            message: formData.get("message") as string,
          },
        };
      }
    },
    INITIAL_STATE
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling

    console.log("Contact form submission:");

    const formData = new FormData(e.currentTarget);

    startTransition(() => {
      action(formData);
    });
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Get In Touch
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Have questions? We'd love to hear from you. Send us a message and
          we'll respond as soon as possible.
        </p>
      </div>

      {state.success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                {state.message || "Message sent successfully!"}
              </p>
            </div>
          </div>
        </div>
      )}

      {state.message && !state.success && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {state.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* REMOVED action={action} from form - this was causing the conflict */}
      <form
        id="contact-form-unique"
        name="contact-form"
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label
              htmlFor="contact-name"
              className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Full Name *
            </Label>
            <Input
              id="contact-name"
              name="name"
              type="text"
              required
              disabled={isPending}
              defaultValue={state.data?.name}
              className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                state.errors?.name ? "border-red-500 focus:ring-red-500" : ""
              } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="Enter your full name"
              autoComplete="name"
            />
            {state.errors?.name && (
              <p className="text-red-500 text-sm animate-fade-in">
                {state.errors.name[0]}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="contact-email"
              className="text-sm font-medium text-gray-700 flex items-center gap-2 dark:text-gray-300"
            >
              <Mail className="w-4 h-4" />
              Email Address *
            </Label>
            <Input
              id="contact-email"
              name="email"
              type="email"
              required
              disabled={isPending}
              defaultValue={state.data?.email}
              className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
                state.errors?.email ? "border-red-500 focus:ring-red-500" : ""
              } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
              placeholder="Enter your email address"
              autoComplete="email"
            />
            {state.errors?.email && (
              <p className="text-red-500 text-sm animate-fade-in">
                {state.errors.email[0]}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="contact-phone"
            className="text-sm font-medium text-gray-700 flex items-center gap-2 dark:text-gray-300"
          >
            <Phone className="w-4 h-4" />
            Phone Number
          </Label>
          <Input
            id="contact-phone"
            name="phoneNumber"
            type="text"
            disabled={isPending}
            defaultValue={state.data?.phoneNumber}
            className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
              state.errors?.phone ? "border-red-500 focus:ring-red-500" : ""
            } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            placeholder="Enter your phone number"
            autoComplete="tel"
          />
          {state.errors?.phone && (
            <p className="text-red-500 text-sm animate-fade-in">
              {state.errors.phone[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="contact-subject"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Subject *
          </Label>
          <Input
            id="contact-subject"
            name="subject"
            type="text"
            required
            disabled={isPending}
            defaultValue={state.data?.subject}
            className={`transition-all duration-200 focus:ring-2 focus:ring-blue-500 ${
              state.errors?.subject ? "border-red-500 focus:ring-red-500" : ""
            } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            placeholder="What's this about?"
          />
          {state.errors?.subject && (
            <p className="text-red-500 text-sm animate-fade-in">
              {state.errors.subject[0]}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="contact-message"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Message *
          </Label>
          <Textarea
            id="contact-message"
            name="message"
            required
            disabled={isPending}
            defaultValue={state.data?.message}
            className={`min-h-32 transition-all duration-200 focus:ring-2 focus:ring-blue-500 resize-none ${
              state.errors?.message ? "border-red-500 focus:ring-red-500" : ""
            } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
            placeholder="Tell us more about your inquiry..."
          />
          {state.errors?.message && (
            <p className="text-red-500 text-sm animate-fade-in">
              {state.errors.message[0]}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Sending...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send Message
            </div>
          )}
        </Button>
      </form>
    </div>
  );
}
