"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Video, Users, MessageSquare, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  function handleVideoCallClick() {
    router.push("/user/call");
  }

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="pt-12 sm:pt-12 lg:pt-12 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center space-y-6 sm:space-y-8">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-white/10 border border-blue-800/20 rounded-full mb-4 sm:mb-6  backdrop-blur-sm">
            <span className="text-xs sm:text-sm font-medium dark:text-blue-300 text-blue-900">
              🚀 Now with AI Chat Assistant
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-lime-400 dark:from-blue-400 dark:via-sky-300 dark:to-lime-300 bg-clip-text text-transparent">
              Connect
            </span>
            <br />
            <span className="bg-gradient-to-r from-lime-500 via-teal-500 to-indigo-500 dark:from-lime-300 dark:via-teal-300 dark:to-blue-300 bg-clip-text text-transparent">
              Without Limits
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
            Experience seamless video calling with friends or join public rooms.
            Chat with our intelligent AI assistant for instant support and
            guidance.
          </p>
        </div>

        <div
          className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          } px-4`}
        >
          <Button
            onClick={handleVideoCallClick}
            size="lg"
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full hover:scale-105 transition-all duration-300 group glow-blue"
          >
            Start Video Call
            <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full hover:scale-105 transition-all duration-300 border-2 border-gray-600 dark:text-gray-30 hover:text-white hover:bg-gray-800 text-indigo-700"
          >
            Watch Demo
          </Button>
        </div>

        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16 px-4 transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <FeatureCard
            icon={<Video className="h-6 w-6 sm:h-8 sm:w-8" />}
            title="HD Video Calls"
            description="Crystal clear video quality with WebRTC technology"
          />
          <FeatureCard
            icon={<Users className="h-6 w-6 sm:h-8 sm:w-8" />}
            title="Public & Private Rooms"
            description="Join public discussions or create private spaces"
          />
          <FeatureCard
            icon={<MessageSquare className="h-6 w-6 sm:h-8 sm:w-8" />}
            title="AI Chat Assistant"
            description="Get instant help from our intelligent AI voice chatbot"
          />
        </div>
      </div>
    </section>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <div className="group hover:scale-105 transition-all duration-300">
      <div className="bg-white/5 backdrop-blur-sm border border-gray-700 rounded-2xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="inline-flex p-2 sm:p-3 rounded-xl bg-gray-800 dark:bg-white text-white dark:text-gray-800 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-semibold text-gray-600 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-gray-500 text-sm sm:text-base">{description}</p>
      </div>
    </div>
  );
};
