import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function ContactInfo() {
  const contactDetails = [
    {
      icon: Mail,
      title: "Email Us",
      details: "apsworks1212@gmail.com",
      description: "Send us an email anytime",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: "+91 6391909757",
      description: "Mon-Fri from 9am to 5pm IST",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "Maharaja Agrasen Institute of Technology, Delhi",
      description: "Our headquarters",
    },
    {
      icon: Clock,
      title: "Response Time",
      details: "Within 24 hours",
      description: "We're committed to quick responses",
    },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        We&apos;re Here to Help
      </h3>
      {contactDetails.map((item, index) => (
        <Card
          key={index}
          className="hover:shadow-lg transition-all duration-200 hover:scale-105 border-l-4 border-l-blue-500"
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <item.icon className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1 dark:text-gray-400">
                  {item.title}
                </h4>
                <p className="text-blue-600 font-medium mb-1 dark:text-gray-500">
                  {item.details}
                </p>
                <p className="text-gray-600 text-sm dark:text-gray-500">
                  {item.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
