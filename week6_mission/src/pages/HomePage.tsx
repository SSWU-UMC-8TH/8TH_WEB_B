import { useState, useEffect } from "react";
import { useGetInfiniteLpList } from "../hooks/queries/useGetInfiniteLpList";
import { PAGINATION_ORDER } from "../enums/common";
import { useInView } from "react-intersection-observer";
import { LpCard } from "../componenets/LpCard/LpCard";
import { LpCardSkeletonList } from "../componenets/LpCard/LpCardSkeletonList";

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc); // ✅ 정렬 상태

  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    fetchNextPage,
    isError,
  } = useGetInfiniteLpList(10, search, order); // ✅ order 적용

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  if (isPending) return <div className="mt-20">Loading...</div>;
  if (isError) return <div className="mt-20">Error...</div>;

  return (
    <div className="container mx-auto px-4 py-6">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {lps?.pages
          ?.map((page) => page.data.data)
          .flat()
          .map((lp) => <LpCard key={lp.id} lp={lp} />)}
        <LpCardSkeletonList count={20} />
      </div>

      {/* 무한스크롤 감지 요소 */}
      <div ref={ref}>{!isFetching && <div>Loading...</div>}</div>
    </div>
  );
};
