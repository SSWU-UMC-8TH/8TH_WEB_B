import axios from "axios";
import { useEffect, useState } from "react";

interface ApiResponse<T> {
  data: T | null;
  isPending: boolean;
  isError: boolean;
}

function useCustomFetch<T>(urls: string | string[]): ApiResponse<T | T[]> {
  const [data, setData] = useState<T | T[] | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);

      try {
        if (typeof urls === "string") {
          // 단일 URL 처리
          const response = await axios.get<T>(urls, {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          });
          setData(response.data);
        } else {
          // 다중 URL 처리
          const responses = await Promise.all(
            urls.map((url) =>
              axios.get<T>(url, {
                headers: {
                  Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
                },
              })
            )
          );
          setData(responses.map((response) => response.data));
        }
      } catch (error) {
        console.error("API 요청 실패:", error);
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, [urls]);

  return { data, isPending, isError };
}

export default useCustomFetch;