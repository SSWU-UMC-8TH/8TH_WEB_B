import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLpDetail, likeLp, unlikeLp } from "../apis/lp";
import {
  getComments,
  postComment,
  deleteComment,
  updateComment,
} from "../apis/comment";
import { Lp } from "../types/lp";
import { Comment } from "../types/comment";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";

export const LpDetailPage = () => {
  const { id } = useParams();
  const lpId = Number(id);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const currentUserId = user?.id;

  const [lp, setLp] = useState<Lp | null>(null);
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [editModeId, setEditModeId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (!lpId) return;

    getLpDetail(lpId)
      .then((data) => {
        setLp(data);
        setLikeCount(data.likes?.length ?? 0);
        const isLiked = data.likes?.some((likeUser: any) => likeUser.id === currentUserId);
        setLiked(isLiked ?? false);
      })
      .catch(console.error);

    getComments(lpId)
      .then((res) => {
        if (Array.isArray(res)) setComments(res);
        else setComments([]);
      })
      .catch(console.error);
  }, [lpId, currentUserId]);

  const likeMutation = useMutation({
    mutationFn: () => likeLp(lpId),
    onMutate: () => {
      setLikeCount((prev) => prev + 1);
      setLiked(true);
    },
    onError: () => {
      setLikeCount((prev) => prev - 1);
      setLiked(false);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpId] });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikeLp(lpId),
    onMutate: () => {
      setLikeCount((prev) => prev - 1);
      setLiked(false);
    },
    onError: () => {
      setLikeCount((prev) => prev + 1);
      setLiked(true);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["lp", lpId] });
    },
  });

  const handleToggleLike = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }
    liked ? unlikeMutation.mutate() : likeMutation.mutate();
  };

  const { mutate: submitComment } = useMutation({
    mutationFn: ({ lpId, content }: { lpId: number; content: string }) =>
      postComment({ lpId, content }),
    onSuccess: (newComment) => {
      setCommentInput("");
      setComments((prev) => Array.isArray(prev) ? [newComment, ...prev] : [newComment]);
      alert("등록 성공");
    },
  });

  const { mutate: removeComment } = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: (_, commentId) => {
      setComments((prev) => Array.isArray(prev) ? prev.filter((c) => c.id !== commentId) : []);
    },
  });

  const { mutate: editComment } = useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      updateComment({ commentId, content }),
    onSuccess: (updatedComment) => {
      setComments((prev) =>
        Array.isArray(prev)
          ? prev.map((c) => (c.id === updatedComment.id ? updatedComment : c))
          : []
      );
      setEditModeId(null);
      setEditContent("");
    },
  });

  const handleCommentSubmit = () => {
    if (!commentInput.trim()) return;
    submitComment({ lpId, content: commentInput });
  };

  const handleCommentEdit = (commentId: number) => {
    if (!editContent.trim()) return;
    editComment({ commentId, content: editContent });
  };

  if (!lp) return <div className="mt-20 text-center">로딩 중...</div>;

  return (
    <div className="mt-24 px-8 max-w-4xl mx-auto text-black">
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="w-full h-80 object-cover rounded shadow-lg"
      />
      <h1 className="mt-6 text-3xl font-bold">{lp.title}</h1>
      <p className="mt-4">{lp.content}</p>

      <div className="mt-6 flex gap-4">
        <button
          onClick={handleToggleLike}
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
        >
          {liked ? "❤️ 좋아요" : "🤍 좋아요"} ({likeCount})
        </button>
      </div>

      {/* 댓글 입력 */}
      <div className="mt-10">
        <textarea
          placeholder="댓글을 입력하세요"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          className="w-full border rounded p-3 resize-none h-24 text-sm"
        />
        <div className="flex justify-end mt-2">
          <button
            onClick={handleCommentSubmit}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
          >
            댓글 작성
          </button>
        </div>
      </div>

      {/* 댓글 목록 */}
      <div className="mt-6 space-y-4">
        {Array.isArray(comments) && comments.map((comment) => (
          <div
            key={comment.id}
            className="border p-3 rounded relative group"
          >
            {editModeId === comment.id ? (
              <>
                <textarea
                  className="w-full border p-2 text-sm"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div className="flex gap-2 mt-2 justify-end">
                  <button
                    className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => handleCommentEdit(comment.id)}
                  >
                    저장
                  </button>
                  <button
                    className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
                    onClick={() => {
                      setEditModeId(null);
                      setEditContent("");
                    }}
                  >
                    취소
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm">{comment.content}</p>
                {comment.userId === currentUserId && (
                  <div className="absolute right-2 top-2 space-x-2 text-xs text-gray-500">
                    <button
                      onClick={() => {
                        setEditModeId(comment.id);
                        setEditContent(comment.content);
                      }}
                    >
                      수정
                    </button>
                    <button
                      onClick={() => removeComment(comment.id)}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
