"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";

const useFetch = (cb) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

//   fn wrapped in useCallback
// const fn = useCallback(...)

// ✔ Prevents unnecessary re-renders
// ✔ Stable dependency for useEffect
  const fn = useCallback(
    async (...args) => {
      console.log("USE_FETCH_FN_CALLED", args);
      setLoading(true);
      setError(null);

      try {
        const response = await cb(...args);
        setData(response);
        return response; // ✅ important for await
      } catch (err) {
        const message = err?.message || "Something went wrong";
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [cb]
  );

  return { data, loading, error, fn, setData };
};

export default useFetch;