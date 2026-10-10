import { useState, useEffect } from "react";
import { PassengerDetailsData } from "../types/passengers-types";
import { getPassengerDetailsData } from "../api/passengers-api";

export function usePassengerDetailsData(id: string) {
  const [data, setData] = useState<PassengerDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        setIsLoading(true);
        const result = await getPassengerDetailsData(id);
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "حدث خطأ أثناء تحميل تفاصيل الراكب");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (id) {
      load();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { data, isLoading, error };
}
