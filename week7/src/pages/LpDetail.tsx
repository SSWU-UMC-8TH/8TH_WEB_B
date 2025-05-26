import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useGetInfiniteComments } from "../hooks/queries/useGetInfiniteComments";
import { PAGINATION_ORDER } from "../enums/common";
import CommentSkeleton from "../components/LpCard/LPCommentSkeleton";
import usePostComment from "../hooks/mutations/usePostComment";
import useEditComment from "../hooks/mutations/useEditComment";
import useDeleteComment from "../hooks/mutations/useDeleteComment";
import { getMyInfo } from "../apis/auth";
import { useQuery } from "@tanstack/react-query";
import useLikeLp from "../hooks/mutations/useLikeLp";

export const LpDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const [commentInput, setCommentInput] = useState("");
  const postCommentMutation = usePostComment();
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editInput, setEditInput] = useState("");
  const editCommentMutation = useEditComment();
  const deleteCommentMutation = useDeleteComment();
  const { data: me } = useQuery({
    queryKey: ["me"],
    queryFn: getMyInfo,
  });

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const likeLpMutation = useLikeLp();

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
      {/* LP 상세 헤더 */}
      <div className="w-full max-w-2xl flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between">
        </div>
        {/* 좋아요 버튼 */}
        <div className="flex items-center gap-2 mt-2">
          <button
            className={`px-3 py-1 rounded ${
              liked ? "bg-pink-500" : "bg-gray-700"
            } text-white`}
            onClick={() => {
              likeLpMutation.mutate(
                { lpId: Number(id) },
                {
                  onSuccess: () => {
                    setLiked((prev) => !prev);
                    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
                  },
                }
              );
            }}
          >
            {liked ? "❤️" : "🤍"} 좋아요 {likeCount}
          </button>
        </div>
      </div>

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
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
          />
        </div>
        <button
          className="ml-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-pink-500 transition"
          onClick={() => {
            if (!commentInput.trim()) return;
            postCommentMutation.mutate({
              lpId: Number(id),
              content: commentInput,
              order,
            });
            setCommentInput("");
          }}
          disabled={postCommentMutation.isPending}
        >
          {postCommentMutation.isPending ? "작성 중..." : "작성"}
        </button>
      </div>

      {/* 댓글 리스트 */}
      <div className="w-full max-w-2xl bg-gray-900 rounded-lg p-4 space-y-4">
        {isFetching &&
          Array.from({ length: 5 }).map((_, idx) => (
            <CommentSkeleton key={idx} />
          ))}
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
                  <span className="text-white font-semibold text-sm">
                    {comment.author.name}
                  </span>
                </div>
                {/* 수정 모드 */}
                {editingCommentId === comment.id ? (
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      className="flex-1 px-2 py-1 rounded bg-gray-700 text-white"
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                    />
                    <button
                      className="px-3 py-1 rounded bg-pink-500 text-white"
                      onClick={() => {
                        editCommentMutation.mutate({
                          commentId: comment.id,
                          content: editInput,
                          lpId: Number(id),
                          order,
                        });
                        setEditingCommentId(null);
                        setEditInput("");
                      }}
                      disabled={editCommentMutation.isPending}
                    >
                      저장
                    </button>
                    <button
                      className="px-3 py-1 rounded bg-gray-500 text-white"
                      onClick={() => setEditingCommentId(null)}
                    >
                      취소
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-300 text-sm mt-1">{comment.content}</p>
                    {/* 본인 댓글에만 수정/삭제 버튼 노출 */}
                    {comment.author.name === me?.data?.name && (
                      <>
                        <button
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditInput(comment.content);
                          }}
                          className="text-xs text-gray-400 hover:underline"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => {
                            deleteCommentMutation.mutate({
                              commentId: comment.id,
                              lpId: Number(id),
                              order,
                            });
                          }}
                          className="ml-2 text-xs text-red-400 hover:underline"
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
      </div>

      {/* 무한 스크롤 트리거 */}
      <div ref={ref} className="h-10"></div>
    </div>
  );
};