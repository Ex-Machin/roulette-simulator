import Navbar from './components/navbar';
import About from './components/about';
import Projects from './components/projects';
import Skills from './components/skills';
import Testimonials from './components/testimonials';
import Contact from './components/contact';


export default function Home() {
  return (
    <main className="text-gray-400 bg-gray-900 body-font">
      <Navbar />
      <About />
      <Projects />
      <Skills />
      <Testimonials />
      <Contact />
    </main>
  )
}
