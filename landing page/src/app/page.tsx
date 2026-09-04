import Preloader from "@/components/Preloader";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import MainContent from "@/components/MainContent";
import LandingPageEffects from "@/components/LandingPageEffects";

export default function Home() {
  return (
    <>
      <Preloader />
      <Cursor />
      <Navbar />
      <MainContent />
      <LandingPageEffects />
    </>
  );
}
