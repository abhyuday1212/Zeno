import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import { Printer, FileText, Clock, MapPin, IndianRupee } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";

const services = [
  {
    title: "Free 10-Min Recognition",
    price: "Free for 10 minutes",
    icon: Clock,
  },
  {
    title: "Advanced Analysis",
    price: "₹0.50/min after free period",
    icon: IndianRupee,
  },
  {
    title: "Feature Explorer",
    price: "Discover all advanced features",
    icon: FileText,
  },
];

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log(session);

  return (
    <div>
      <Navbar />
      <main>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <section className="text-center py-20">
            <h1 className="text-4xl font-bold mb-6">
              Communicate Through Gestures{" "}
              {session ? session.user.name.split(" ")[0] : ""}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Capture your hand gestures and let our platform generate
              meaningful symbols to help you communicate effectively.
            </p>
            <Link href={session ? "/user/call" : "/signin"}>
              <Button size="lg">
                Start Communicating
                <Clock className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </section>

          <section className="py-12">
            <h2 className="text-3xl font-bold text-center mb-12">
              Our Services
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service) => (
                <Card key={service.title} className="p-6 text-center">
                  <service.icon className="mx-auto h-12 w-12 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground">{service.price}</p>
                </Card>
              ))}
            </div>
          </section>

          <section className="py-12">
            <h2 className="text-3xl font-bold text-center mb-12">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  1. Record Gesture
                </h3>
                <p className="text-muted-foreground">
                  Capture your hand gestures using our easy-to-use interface.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  2. Generate Symbols
                </h3>
                <p className="text-muted-foreground">
                  Our advanced recognition technology translates your gestures
                  into meaningful symbols.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Printer className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Communicate</h3>
                <p className="text-muted-foreground">
                  Use the generated symbols to communicate seamlessly.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
