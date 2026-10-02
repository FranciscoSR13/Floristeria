import { useLayoutEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const page = document.querySelector(".route-screen-content");
    if (!page || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;

    const sections = Array.from(page.querySelectorAll("section"))
      .filter((section) => !section.closest(".home-screen-panel") && !section.classList.contains("work-screen-section"));

    sections.forEach((section, index) => {
      section.classList.add("scroll-reveal");
      section.style.setProperty("--scroll-reveal-delay", `${Math.min(index, 4) * 65}ms`);
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -28px 0px" });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <>
      <Navbar />

      <main>
        <div className="route-screen-content" key={pathname}>
          <Outlet />
        </div>
      </main>

      <Footer />
    </>
  );
}

export default MainLayout;
