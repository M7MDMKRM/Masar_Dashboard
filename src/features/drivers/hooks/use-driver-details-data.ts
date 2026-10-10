"use client";

import { useEffect, useState } from "react";
import { DriverDetailsData } from "../types/drivers-types";
import { getDriverDetailsData } from "../api/drivers-api";

export function useDriverDetailsData(id: string) {
  const [data, setData] = useState<DriverDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getDriverDetailsData(id)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error("Unknown error"));
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { data, isLoading, error };
}
