import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import LionVideoScrollSection from "@/components/LionVideoScrollSection";
import MainContent from "@/components/MainContent";
import LandingPageEffects from "@/components/LandingPageEffects";

export default function Home() {
  return (
    <>
      <Preloader />
      <Cursor />
      <Navbar />
      <LionVideoScrollSection />
      <MainContent />
      <LandingPageEffects />
    </>
  );
}
