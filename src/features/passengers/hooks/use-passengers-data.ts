import { useState, useEffect } from "react";
import { PassengersPageData } from "../types/passengers-types";
import { getPassengersData } from "../api/passengers-api";

export function usePassengersData() {
  const [data, setData] = useState<PassengersPageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setIsLoading(true);
        const result = await getPassengersData();
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "حدث خطأ أثناء تحميل بيانات الركاب");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading, error };
}
