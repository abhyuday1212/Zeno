"use client";

import ContactForm from "@/components/user/ContactForm";
import ContactInfo from "@/components/user/ContactInfo";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-800/20 dark:to-purple-800/20"></div> */}
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 animate-fade-in">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Connect seamlessly with crystal-clear video calls. Experience the
              future of communication with our cutting-edge platform.
            </p>
          </div>

          {/* Contact Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-1">
              <ContactInfo />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              Why Choose VideoCall Pro?
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Experience unparalleled video calling with our advanced features
              and reliable platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎥</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">HD Video Quality</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Crystal clear video calls with up to 4K resolution for the best
                experience.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                End-to-End Encryption
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Your conversations are secure with military-grade encryption
                technology.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-white dark:bg-gray-900 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect instantly with optimized servers worldwide for minimal
                latency.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
