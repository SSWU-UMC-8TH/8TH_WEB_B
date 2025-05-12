import { useState, useEffect } from "react";
import { useGetInfiniteLpList } from "../hooks/queries/useGetinfiniteLPList";
import { PAGINATION_ORDER } from "../enums/common";
import { useInView } from "react-intersection-observer";
import { LpCard } from "../components/LpCard/LpCard";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const navigate = useNavigate();

  const {
    data: lps,
    isFetching,
    hasNextPage,
    isPending,
    fetchNextPage,
    isError,
  } = useGetInfiniteLpList(30, search, order);

  const { ref, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  if (isPending) return <div className="mt-20">Loading...</div>;
  if (isError) return <div className="mt-20">Error...</div>;

  return (
    <div className="container mx-auto bg-black min-h-screen px-4 py-6">
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => setOrder(PAGINATION_ORDER.asc)}
          className={`px-4 py-2 rounded border ${
            order === PAGINATION_ORDER.asc
              ? "bg-white text-black font-semibold"
              : "bg-gray-500 text-white"
          }`}
        >
          오래된순
        </button>
        <button
          onClick={() => setOrder(PAGINATION_ORDER.desc)}
          className={`px-4 py-2 rounded border ${
            order === PAGINATION_ORDER.desc
              ? "bg-white text-black font-semibold"
              : "bg-gray-500 text-white"
          }`}
        >
          최신순
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {lps?.pages
          ?.map((page) => page.data.data)
          .flat()
          .map((lp) => (
            <div
              key={lp.id}
              onClick={() => navigate(`/lp/${lp.id}`)}
              className="cursor-pointer"
            >
              <LpCard lp={lp} />
            </div>
          ))}
      </div>
    </div>
  );
};