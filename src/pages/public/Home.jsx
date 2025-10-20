import React from "react";
import HeroXiomara from "./HeroXiomara";
import WhyAdvisorSection from "../../components/WhyAdvisorSection";
import Footer from "../../components/Footer";
import USVisaSection from "../../components/USVisaSection";
import CanadaVisaSection from "../../components/CanadaVisaSection";
import SpainVisaSection from "../../components/SpainVisaSection";
import RegisterSection from "../../components/RegisterSection";
export default function Home() {
  return (
    <main className="flex flex-col">
      <HeroXiomara />
      <WhyAdvisorSection />
     <USVisaSection/> 
     <CanadaVisaSection/>
     <SpainVisaSection/>
     <RegisterSection/>
      <Footer />
    </main>
  );
}
