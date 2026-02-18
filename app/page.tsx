import Hero from "./components/Hero";
import ImageShowcase from "./components/ImageShowcase";
import PhotoGrid from "./components/PhotoGrid";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="w-full bg-white">
      <Hero />
      <ImageShowcase />
      <PhotoGrid />
      <Newsletter />
      <Footer />
    </main>
  );
}
