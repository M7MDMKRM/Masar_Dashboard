import { useState, useEffect } from "react";
import { BookingsPageData, BookingDetailsData } from "../types/bookings-types";
import { fetchBookingsData, fetchBookingDetailsData } from "../api/bookings-api";

export function useBookingsData() {
  const [data, setData] = useState<BookingsPageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    fetchBookingsData()
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

export function useBookingDetailsData(id: string) {
  const [data, setData] = useState<BookingDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    fetchBookingDetailsData(id)
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
