import { useState, useEffect } from "react";
import { useGetInfiniteLpList } from "../hooks/queries/useGetinfiniteLPList";
import { PAGINATION_ORDER } from "../enums/common";
import { useInView } from "react-intersection-observer";
import { LpCard } from "../components/LpCard/LpCard";
import { LpCardSkeleton } from "../components/LpCard/LpCardSkeleton";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const navigate = useNavigate();

  const {
    data: lps,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useGetInfiniteLpList(10, search, order);

  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  return (
    <div className="container mx-auto bg-black min-h-screen px-4 py-6">
      {/* 정렬 버튼 */}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {lps?.pages
          ?.map((page) => page.data.data)
          .flat()
          .map((lp) => (
            <div
              key={lp.id}
              onClick={() => navigate(`/lp/${lp.id}`)}
              className="cursor-pointer bg-gray-800 shadow-md hover:bg-gray-700 hover:shadow-lg transition duration-300"
            >
              <LpCard lp={lp} />
            </div>
          ))}
        {/* 로딩 중일 때 스켈레톤 카드 5개 표시 */}
        {isFetching &&
          Array.from({ length: 5 }).map((_, idx) => (
            <LpCardSkeleton key={`skeleton-${idx}`} />
          ))}
      </div>

      {/* 무한 스크롤 트리거 */}
      <div ref={ref} className="h-10"></div>
    </div>
  );
};