import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useGetInfiniteComments } from "../hooks/queries/useFetInfiniteComments";
import { PAGINATION_ORDER } from "../enums/common";

export const LpDetail = () => {
  const { LPId } = useParams();
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);

  const {
    data: comments,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useGetInfiniteComments(LPId, 10, order);

  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  return (
    <div className="flex flex-col items-center justify-center bg-black min-h-screen px-4 py-6">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold text-white">댓글</h1>
      </div>

      {/* 댓글 작성란 */}
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6 w-full max-w-2xl">
        <textarea
          className="w-full bg-gray-700 text-white p-3 rounded-lg focus:outline-none"
          placeholder="댓글을 입력하세요..."
          rows={3}
        ></textarea>
        <button className="mt-2 cursor-pointer bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded">
          댓글 작성
        </button>
      </div>

      {/* 정렬 버튼 */}
      <div className="flex justify-end gap-2 mb-4 w-full max-w-2xl">
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

      {/* 댓글 목록 */}
      <div className="space-y-4 w-full max-w-2xl">
        {comments?.pages
          ?.map((page) => page.data) // 댓글 데이터 배열로 변환
          .flat()
          .map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-800 p-4 rounded-lg shadow-md"
            >
              <p className="text-white font-semibold">{comment.author}</p>
              <p className="text-gray-300 mt-2">{comment.content}</p>
            </div>
          ))}
        {isFetching && (
          <div className="text-gray-400 text-center">댓글을 불러오는 중...</div>
        )}
      </div>

      {/* 무한 스크롤 트리거 */}
      <div ref={ref} className="h-10"></div>
    </div>
  );
};