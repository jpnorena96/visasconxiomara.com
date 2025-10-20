import React from "react";
import HeroXiomara from "./HeroXiomara";
import WhyAdvisorSection from "../../components/WhyAdvisorSection";
import USVisaSection from "../../components/USVisaSection";
import CanadaVisaSection from "../../components/CanadaVisaSection";
import SpainVisaSection from "../../components/SpainVisaSection";
import RegisterSection from "../../components/RegisterSection";
import SnapSection from "../../components/SnapSection";
import Footer from "../../components/Footer";

export default function ScrollLanding() {
  return (
    <div
      className="
        h-screen overflow-y-scroll
        snap-y snap-proximity
        scroll-smooth
      "
    >
      <SnapSection><HeroXiomara /></SnapSection>
      <SnapSection><WhyAdvisorSection /></SnapSection>
      <SnapSection><USVisaSection /></SnapSection>
      <SnapSection><CanadaVisaSection /></SnapSection>
      <SnapSection><SpainVisaSection /></SnapSection>
      <SnapSection><RegisterSection /></SnapSection>
      <SnapSection><Footer/></SnapSection>
    </div>
  );
}
