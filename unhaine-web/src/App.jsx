import { Route, Routes } from "react-router";
import SiteLayout from "./layouts/SiteLayout";
import Home from "./pages/Home";
import About from "./pages/about/About";
import Career from "./pages/about/Career";
import Education from "./pages/about/Education";
import Values from "./pages/about/Values";
import Portfolio from "./pages/portfolio/Portfolio";
import Billain from "./pages/portfolio/Billain";
import Kata from "./pages/portfolio/Kata";
import Blog from "./pages/blog/Blog";
import BlogPost from "./pages/blog/BlogPost";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="about/career" element={<Career />} />
        <Route path="about/education" element={<Education />} />
        <Route path="about/values" element={<Values />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="portfolio/billain" element={<Billain />} />
        <Route path="portfolio/kata" element={<Kata />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPost />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
