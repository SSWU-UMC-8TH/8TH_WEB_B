import { useState, useEffect, useRef, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "../hooks/useDebounce";
import { useGetInfiniteLpList } from "../hooks/queries/useGetInfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import { QUERY_KEY } from "../constants/key";
import { LpCard } from "../componenets/LpCard/LpCard";
import { LpCardSkeletonList } from "../componenets/LpCard/LpCardSkeletonList";

//  useThrottleCallback 커스텀 훅
const useThrottleCallback = (callback: () => void, delay: number) => {
  const lastCalled = useRef(0);
  return useCallback(() => {
    const now = Date.now();
    if (now - lastCalled.current >= delay) {
      callback();
      lastCalled.current = now;
    }
  }, [callback, delay]);
};

export const HomePage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearchKeyword = useDebounce(searchKeyword, 1000);

  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.removeQueries({ queryKey: [QUERY_KEY.lps], exact: false });
  }, [debouncedSearchKeyword, order]);

  const {
    data: lps,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useGetInfiniteLpList(10, debouncedSearchKeyword, order);

  const { ref, inView } = useInView({ threshold: 0 });

  //  LP 무한스크롤 3초마다 실행
  const intervalRef = useRef<number | null>(null);
  useEffect(() => {
    if (inView && hasNextPage) {
      if (!intervalRef.current) {
        intervalRef.current = window.setInterval(() => {
          if (!isFetchingNextPage) {
            console.log("🔥 3초마다 fetchNextPage 호출");
            fetchNextPage();
          }
        }, 3000);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 스크롤 이벤트 throttle 처리 (3초에 한 번만 로그)
  const throttledScrollLog = useThrottleCallback(() => {
    console.clear();
    console.log(
      "%c🌀 스크롤 이벤트 감지됨 (3초마다 출력)",
      "color: #4caf50; font-weight: bold;"
    );
  }, 3000);

  useEffect(() => {
    const handleScroll = () => {
      throttledScrollLog();
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [throttledScrollLog]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchKeyword(searchInput);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* 검색창 */}
      <div className="mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="검색어 입력 후 Enter를 눌러주세요"
          className="w-full px-4 py-2 border rounded"
        />
      </div>

      {/* 정렬 */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => setOrder(PAGINATION_ORDER.asc)}
          className={`px-4 py-2 rounded border ${
            order === PAGINATION_ORDER.asc
              ? "bg-white text-black font-semibold"
              : "bg-gray-800 text-white"
          }`}
        >
          오래된순
        </button>
        <button
          onClick={() => setOrder(PAGINATION_ORDER.desc)}
          className={`px-4 py-2 rounded border ${
            order === PAGINATION_ORDER.desc
              ? "bg-white text-black font-semibold"
              : "bg-gray-800 text-white"
          }`}
        >
          최신순
        </button>
      </div>

      {/* LP 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {lps?.pages
          .flatMap((page) => page.data.data)
          .map((lp) => <LpCard key={lp.id} lp={lp} />)}
        {isFetchingNextPage && <LpCardSkeletonList count={8} />}
      </div>

      <div ref={ref} className="mt-6 h-10 bg-transparent" />
    </div>
  );
};
