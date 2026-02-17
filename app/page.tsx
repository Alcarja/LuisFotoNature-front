import Hero from "./components/Hero";
import Posts from "./components/Posts";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="w-full bg-white">
      <Hero />
      <Posts />
      <Newsletter />
      <Footer />
    </main>
  );
}
