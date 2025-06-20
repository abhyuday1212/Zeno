"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Video, Users, MessageSquare, ArrowDown } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <Video className="h-8 w-8" />,
      title: "Choose Your Mode",
      description: "Select between public rooms or private calls with friends",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Connect Instantly",
      description: "Join or create a room with just one click using WebRTC",
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Chat with AI",
      description: "Get real-time assistance from our intelligent chatbot",
    },
    {
      icon: <ArrowDown className="h-8 w-8" />,
      title: "Enjoy the Experience",
      description: "High-quality video calls with seamless user experience",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
          <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            How It Works?
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="relative group hover:scale-105 transition-all duration-300 animate-fade-in"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <Card className="h-full bg-white/5 backdrop-blur-sm border border-gray-700 p-2 sm:p-3 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-1 sm:p-4 text-center flex flex-col items-center text-gray-900 dark:text-white">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-black dark:bg-white text-white dark:text-black mb-6 group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>
                <span className="text-sm font-medium uppercase tracking-wider mb-2 text-indigo-700 dark:text-indigo-300">
                  Step : {index + 1}
                </span>
                <h2 className="text-xl font-bold mb-3">{step.title}</h2>
                <p className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </CardContent>
            </Card>

            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
