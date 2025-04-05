import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Printer, FileText, MapPin, IndianRupee } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";

const services = [
  {
    title: "Black & White Printing",
    price: "₹2/page",
    icon: FileText,
  },
  {
    title: "Color Printing",
    price: "₹10/page",
    icon: Printer,
  },
  {
    title: "Browse Prices",
    price: "Know the stationary services prices",
    icon: IndianRupee,
  },
];

export default async function UserHome() {
  const session = await auth();
  console.log(session);

  return (
    <div>
      <main>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <section className="text-center py-20">
            <h1 className="text-4xl font-bold mb-6">
              Print Your Documents with Ease{" "}
              {session.user.name.split(" ")[0] || ""}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Upload your PDFs and get them printed at nearby college
              stationaries
            </p>
            <Link href={session ? "/user/upload" : "/signin"}>
              <Button size="lg">
                Start Printing
                <Printer className="ml-2 h-5 w-5" />
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
                <h3 className="text-xl font-semibold mb-2">1. Upload PDF</h3>
                <p className="text-muted-foreground">
                  Upload your documents and add printing instructions
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  2. Select Location
                </h3>
                <p className="text-muted-foreground">
                  Choose from nearby college stationaries
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Printer className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">3. Get Prints</h3>
                <p className="text-muted-foreground">
                  Collect your prints from the selected location
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
