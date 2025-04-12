import { useEffect, useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

interface ApiResponse<T> {
  data: T | null;
  isPending: boolean;
  isError: boolean;
}

function useCustomFetch<T>(
  url: string,
  config?: AxiosRequestConfig,
  deps: any[] = []
): ApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsPending(true);
      try {
        const { data } = await axios.get<T>(url, config);
        setData(data);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchData();
  }, deps);

  return { data, isPending, isError };
}

export default useCustomFetch;
