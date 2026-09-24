import Hero from "../components/home/Hero";
import EventsSection from "../components/home/EventsSection";
import About from "../components/home/About";
import Courses from "../components/home/Courses";
import Contact from "../components/home/Contact";
import Footer from "../components/layout/Footer";

function App() {
  return (
    <>
      <main>
      <Hero />
      <EventsSection />
      <About/>
      <Courses />
      <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
