"use client";

import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { useTheme } from "next-themes";
import NewsLetter from "./user/NewsLetter";

export default function Footer() {
  const { resolvedTheme } = useTheme();

  const isDark = resolvedTheme !== "light";

  const themeClasses = isDark
    ? "bg-gray-900 text-white border-gray-700"
    : "bg-white text-gray-900 border-gray-200";

  const linkHoverClasses = isDark
    ? "hover:text-blue-400 transition-colors duration-200"
    : "hover:text-blue-600 transition-colors duration-200";

  return (
    <footer className={`${themeClasses} border-t transition-all duration-300`}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div
                className={`w-8 h-8 rounded-lg ${
                  isDark ? "bg-blue-600" : "bg-blue-500"
                } flex items-center justify-center mr-3`}
              >
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">ZENO</h3>
            </div>
            <p
              className={`text-sm mb-6 leading-relaxed ${
                isDark ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Creating beautiful digital experiences that inspire and connect
              people around the world. Building the future, one pixel at a time.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail
                  className={`w-4 h-4 mr-3 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  apsworks1212@gmail.com
                </span>
              </div>
              <div className="flex items-center">
                <Phone
                  className={`w-4 h-4 mr-3 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  +91 6391909757
                </span>
              </div>
              <div className="flex items-center">
                <MapPin
                  className={`w-4 h-4 mr-3 ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Delhi, India
                </span>
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Features</h4>
            <ul className="space-y-3">
              {[
                "Video Calls",
                "Ai Voice Chatbots",
                "Find Friends",
                // "Analytics",
                // "Marketing Tools",
                // "API Services",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    } ${linkHoverClasses}`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              {[
                "About Us",
                "Careers",
                // "Press",
                // "Blog",
                "Partners",
                "Investors",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    } ${linkHoverClasses}`}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <NewsLetter />
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className={`border-t bg-background ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="flex items-center text-sm">
              <span className={isDark ? "text-gray-300" : "text-gray-600"}>
                © 2025 ZENO. All rights reserved.
              </span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className={`text-sm ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    } ${linkHoverClasses}`}
                  >
                    {item}
                  </a>
                )
              )}

              {/* Theme Toggle */}
              {/* {onThemeToggle && (
                <button
                  onClick={onThemeToggle}
                  className={`ml-4 p-2 rounded-lg transition-all duration-200 ${
                    isDark
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                  }`}
                  title={`Switch to ${isDark ? "light" : "dark"} theme`}
                >
                  {isDark ? (
                    <Sun className="w-4 h-4" />
                  ) : (
                    <Moon className="w-4 h-4" />
                  )}
                </button>
              )} */}
              <ModeToggle />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
