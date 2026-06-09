import { useEffect } from "react";

const useAutoRefresh = (callback, delay = 10000) => {
  useEffect(() => {
    if (!callback) return;

    callback(); // run immediately

    const interval = setInterval(() => {
      callback();
    }, delay);

    return () => clearInterval(interval);
  }, [callback, delay]);
};

export default useAutoRefresh;