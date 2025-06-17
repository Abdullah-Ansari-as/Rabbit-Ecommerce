// ScrollToTopButton.jsx
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react"; // You can use any icon library

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollTop = window.scrollY;
      setVisible(scrollTop > 200);
      setScrolled(scrollTop > 400);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    visible && (
      <button
        onClick={scrollToTop}
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 p-3 rounded-full transition-all duration-500 shadow-lg bg-gray-700 text-white hover:bg-gray-800 cursor-pointer
         `}
      >
        <ArrowUp className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    )
  );
}
