import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useGetInfiniteComments } from "../hooks/queries/useGetInfiniteComments";
import { PAGINATION_ORDER } from "../enums/common";
import CommentSkeleton from "../components/LpCard/LPCommentSkeleton";

export const LpDetail = () => {
  const { id } = useParams(); // LPId → id로 변경
  console.log("id:", id);
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);

  const {
    data: comments,
    isFetching,
    hasNextPage,
    fetchNextPage,
  } = useGetInfiniteComments(id, 10, order);

  const { ref, inView } = useInView({ threshold: 0.5 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  return (
    <div className="flex flex-col items-center bg-black min-h-screen pt-20 px-4 py-6">
      {/* 댓글 헤더 */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">댓글</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setOrder(PAGINATION_ORDER.asc)}
            className={`px-3 py-1 rounded text-sm ${
              order === PAGINATION_ORDER.asc
                ? "bg-white text-black font-semibold"
                : "bg-gray-700 text-white"
            }`}
          >
            오래된순
          </button>
          <button
            onClick={() => setOrder(PAGINATION_ORDER.desc)}
            className={`px-3 py-1 rounded text-sm ${
              order === PAGINATION_ORDER.desc
                ? "bg-white text-black font-semibold"
                : "bg-gray-700 text-white"
            }`}
          >
            최신순
          </button>
        </div>
      </div>

      {/* 댓글 입력창 */}
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-4 flex items-center gap-3 mb-4">
        <div className="flex-1">
          <textarea
            className="w-full bg-gray-900 text-white p-3 rounded-lg focus:outline-none resize-none"
            placeholder="댓글을 입력해주세요"
            rows={2}
          />
        </div>
        <button className="ml-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-pink-500 transition">
          작성
        </button>
      </div>

      {/* 댓글 리스트 */}
      <div className="w-full max-w-2xl bg-gray-900 rounded-lg p-4 space-y-4">
        {isFetching &&
          Array.from({ length: 5 }).map((_, idx) => (
            <CommentSkeleton key={idx} />
          ))
        }
        {comments?.pages
          ?.map((page) => page?.data ?? [])
          .flat()
          .filter((comment) => comment)
          .map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <img
                src={comment.author.avatar}
                alt={comment.author.name}
                className="w-9 h-9 rounded-full object-cover bg-gray-700"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-sm">{comment.author.name}</span>
                  {/* 본인 댓글 표시 */}
                  {comment.author.name === "연진김" && (
                    <span className="ml-1 px-2 py-0.5 bg-pink-500 text-xs text-white rounded">내가 썼음!</span>
                  )}
                </div>
                <p className="text-gray-300 text-sm mt-1">{comment.content}</p>
              </div>
            </div>
          ))}
      </div>

      {/* 무한 스크롤 트리거 */}
      <div ref={ref} className="h-10"></div>
    </div>
  );
};