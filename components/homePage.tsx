import Navbar from "@/components/navbar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/auth.config";
import HeroSection from "@/components/user/HeroSection";
import FeaturesSection from "@/components/user/FeatureSection";
import HowItWorksSection from "@/components/user/HowItWorksSection";
import ContactUsPage from "@/components/user/ContactUsPage";
import Footer from "@/components/Footer";

export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log(session);

  return (
    <div>
      <Navbar />
      <main>
        <div className="min-h-screen bg-background  relative overflow-hidden">
          <div className="relative z-10">
            <HeroSection />
            <FeaturesSection />
            <HowItWorksSection />
            <ContactUsPage />
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}
