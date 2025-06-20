/* eslint-disable */

import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Send,
} from "lucide-react";
import { useActionState } from "react";
import { useTransition } from "react";
import { subscribeNewsLetter } from "@/app/actions/newsLetterActions";

export default function NewsLetter() {
  const [isPendingTransition, startTransition] = useTransition();
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const subscribeMail = formData.get("subscribeMail") as string;
      try {
        const result = await subscribeNewsLetter(prevState, subscribeMail);
        if (!result.success) {
          return {
            success: false,
            message: result.message,
            data: result.data,
          };
        }

        return {
          success: true,
          message: result.message,
          data: result.data,
        };
      } catch (error: any) {
        return {
          success: false,
          message: error.message || "Something went wrong.",
          data: {
            subscribeMail: subscribeMail,
          },
        };
      }
    },
    { success: null, message: "", data: { subscribeMail: "" } } // Initial state
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Create fresh FormData to avoid contamination
    const formData = new FormData();

    const emailInput = e.currentTarget.querySelector(
      'input[name="subscribeMail"]'
    ) as HTMLInputElement;

    // Only add the newsletter email - nothing else
    formData.append("subscribeMail", emailInput.value);

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <section className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg shadow-md">
      <h4 className="text-lg font-semibold mb-4">Stay Updated</h4>
      <p className="text-sm mb-6">
        Subscribe to our newsletter for the latest updates and insights.
      </p>

      <form
        id="newsletter-form-unique"
        name="newsletter-form"
        onSubmit={handleSubmit}
        className="mb-8"
        method="post"
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="newsletter-email"
            name="subscribeMail"
            type="email"
            defaultValue={state.data?.subscribeMail}
            placeholder="Enter your email"
            required
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       placeholder-gray-500 dark:placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            disabled={isPending}
            autoComplete="email"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg font-medium text-sm
                       bg-blue-500 hover:bg-blue-600 text-white
                       dark:bg-blue-700 dark:hover:bg-blue-800 transition flex items-center justify-center"
            disabled={isPending}
          >
            {isPending ? (
              <span className="animate-pulse">Submitting...</span>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2 inline-block" />
                Subscribe
              </>
            )}
          </button>
        </div>
      </form>

      {state.message && (
        <p
          className={`text-sm mb-6 ${
            state.success
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {state.message}
        </p>
      )}

      <div>
        <h5 className="text-sm font-medium mb-3">Follow Us</h5>
        <div className="flex space-x-3">
          {[
            { Icon: Facebook, href: "#" },
            { Icon: Twitter, href: "#" },
            { Icon: Instagram, href: "#" },
            { Icon: Linkedin, href: "#" },
            { Icon: Github, href: "#" },
          ].map(({ Icon, href }, i) => (
            <a
              key={i}
              href={href}
              className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800
                       flex items-center justify-center transition-transform transform
                       hover:scale-105"
            >
              <Icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
