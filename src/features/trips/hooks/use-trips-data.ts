import { useState, useEffect } from "react";
import { TripsPageData, TripDetailsData } from "../types/trips-types";
import { fetchTripsData, fetchTripDetailsData } from "../api/trips-api";

export function useTripsData() {
  const [data, setData] = useState<TripsPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    fetchTripsData()
      .then((res) => {
        if (mounted) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setIsLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { data, isLoading, error };
}

export function useTripDetailsData(id: string) {
  const [data, setData] = useState<TripDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    fetchTripDetailsData(id)
      .then((res) => {
        if (mounted) {
          setData(res);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setIsLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  return { data, isLoading, error };
}
