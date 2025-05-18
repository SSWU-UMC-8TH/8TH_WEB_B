import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deletePost, getPostDetail, toggleLikePost } from "../apis/post";

export const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // 현재 로그인한 사용자
  const [post, setPost] = useState<any>(null); // 실제 타입에 맞게 수정

  useEffect(() => {
    if (id) {
      getPostDetail(id).then(setPost);
    }
  }, [id]);

  const handleDelete = async () => {
    const ok = confirm("정말 삭제하시겠습니까?");
    if (ok && id) {
      await deletePost(id);
      alert("삭제 완료!");
      navigate("/"); // 홈으로 이동
    }
  };

  const handleLike = async () => {
    if (!id) return;
    const updated = await toggleLikePost(id);
    setPost(updated); // 좋아요 수 반영
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      {post ? (
        <>
          <img src={post.image} alt="포스트 이미지" className="w-full mb-4 rounded" />
          <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
          <p className="mb-4">{post.content}</p>
          <div className="flex gap-4 items-center">
            <button onClick={handleLike}>
              {post.likedByUser ? "❤️" : "🤍"} 좋아요 ({post.likeCount})
            </button>
            {user?.id === post.authorId && (
              <>
                <button
                  onClick={() => navigate(`/edit/${post.id}`)}
                  className="bg-yellow-400 px-3 py-1 rounded"
                >
                  수정
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <p>불러오는 중...</p>
      )}
    </div>
  );
};
