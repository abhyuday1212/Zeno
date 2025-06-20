import HeroSection from "./HeroSection";
import FeaturesSection from "./FeatureSection";
import HowItWorksSection from "./HowItWorksSection";
import ContactUsPage from "./ContactUsPage";
import Footer from "../Footer";
// import { CTASection } from "./CTASection";

export default function UserHome() {
  // const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-background  relative overflow-hidden">
      <div className="relative z-10">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <ContactUsPage />
        {/* <CTASection /> */}
        <Footer />  
      </div>
    </div>
  );
}
