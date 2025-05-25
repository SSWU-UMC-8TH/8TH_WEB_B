import { useRef, useState } from "react";

export const WritePage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const [submittedTitle, setSubmittedTitle] = useState("");
  const [submittedContent, setSubmittedContent] = useState("");
  const [submittedImageUrl, setSubmittedImageUrl] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (!title || !content || !image) {
      alert("모든 내용을 입력해주세요!");
      return;
    }

    setSubmittedTitle(title);
    setSubmittedContent(content);
    setSubmittedImageUrl(URL.createObjectURL(image));
    setLiked(false); // 초기화
  };

  const handleDelete = () => {
    if (confirm("정말 삭제하시겠습니까?")) {
      setSubmittedTitle("");
      setSubmittedContent("");
      setSubmittedImageUrl(null);
      setLiked(false);
      alert("삭제되었습니다.");
    }
  };

  const handleEdit = () => {
    setTitle(submittedTitle);
    setContent(submittedContent);
    setImage(null); // 이미지 수정은 새로 선택해야 함
    setSubmittedTitle("");
    setSubmittedContent("");
    setSubmittedImageUrl(null);
  };

  const toggleLike = () => {
    setLiked((prev) => !prev);
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">글 작성</h1>

      <input
        type="text"
        placeholder="제목"
        className="w-full border p-2 mb-4"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="내용"
        className="w-full border p-2 mb-4"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={5}
      />

      <div className="mb-4">
        <button
          onClick={handleImageClick}
          className="px-3 py-2 bg-gray-300 rounded"
        >
          이미지 업로드
        </button>
        <input
          type="file"
          hidden
          accept="image/*"
          ref={fileInputRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setImage(file);
          }}
        />
        {image && <p className="mt-2 text-sm">{image.name}</p>}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded"
      >
        작성 완료
      </button>

      {/*  제출된 정보 출력 및 기능 버튼 */}
      {submittedTitle && (
        <div className="mt-8 border-t pt-4">
          <h2 className="text-xl font-semibold mb-2">📌 내가 작성한 글</h2>
          <p className="mb-1"><strong>제목:</strong> {submittedTitle}</p>
          <p className="mb-2"><strong>내용:</strong> {submittedContent}</p>
          {submittedImageUrl && (
            <img
              src={submittedImageUrl}
              alt="업로드한 이미지"
              className="w-full max-h-80 object-contain rounded border mb-4"
            />
          )}

          {/* 버튼 기능들 */}
          <div className="flex gap-4">
            <button
              onClick={toggleLike}
              className="px-3 py-1 rounded bg-pink-100 text-pink-600"
            >
              {liked ? "❤️ 좋아요 취소" : "🤍 좋아요"}
            </button>

            <button
              onClick={handleEdit}
              className="px-3 py-1 rounded bg-yellow-300"
            >
              ✏️ 수정
            </button>

            <button
              onClick={handleDelete}
              className="px-3 py-1 rounded bg-red-500 text-white"
            >
              🗑️ 삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
