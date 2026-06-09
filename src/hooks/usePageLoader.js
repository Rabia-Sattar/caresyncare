import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function usePageLoader(duration = 800) {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);            // show loader on route change
    const timer = setTimeout(() => {
      setLoading(false);         // hide loader after duration
      window.scrollTo(0, 0);     // scroll page to top
    }, duration);

    return () => clearTimeout(timer);
  }, [location.pathname, duration]);

  return loading;
}