import { useEffect, useState, useRef } from "react";

// One-shot viewport detection: triggers once when element enters view, then disconnects observer
export const useInView = (options = {}) => {
  const ref = useRef(null);
  const optionsRef = useRef(options);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!ref.current) {return;}

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, optionsRef.current);

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
};
