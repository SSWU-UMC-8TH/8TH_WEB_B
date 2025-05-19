import { useState, useEffect } from "react";
import { useGetInfiniteLpList } from "../hooks/queries/useGetinfiniteLPList";
import { PAGINATION_ORDER } from "../enums/common";
import { useInView } from "react-intersection-observer";
import { LpCard } from "../components/LpCard/LpCard";
import { LpCardSkeleton } from "../components/LpCard/LpCardSkeleton";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LpModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [lpName, setLpName] = useState("");
  const [lpContent, setLpContent] = useState("");
  const queryClient = useQueryClient();

  // LP 등록 useMutation
  const createLpMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("title", lpName);
      formData.append("content", lpContent);
      tags.forEach(tag => formData.append("tags", tag));
      if (image) formData.append("file", image);
      for (const pair of formData.entries()) {
        console.log(pair[0], pair[1]);}

      const accessToken = localStorage.getItem("accessToken");

      const res = await fetch(`api/v1/lps`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) throw new Error("LP 등록 실패");
    return res.json();
  },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lpList"] });
      onClose();
      // 입력값 초기화
      setLpName("");
      setLpContent("");
      setTags([]);
      setImage(null);
      setPreview(null);
    },
  });

  // 이미지 미리보기
  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(image);
    } else {
      setPreview(null);
    }
  }, [image]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="bg-gray-900 rounded-lg p-8 w-full max-w-md shadow-lg">
        <button
          className="float-right text-white hover:text-gray-400 font-bold"
          onClick={onClose}
          aria-label="닫기"
        >
          X
        </button>

        {/* 이미지 업로드 버튼 및 미리보기 */}
        <div className="flex items-center gap-3 mb-3">
          <button
            className="px-17 py-15 rounded text-white text-5xl cursor-pointer"
            onClick={() => document.getElementById("lp-image-input")?.click()}
            type="button"
          >
            +
          </button>
          <input
            id="lp-image-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              if (e.target.files && e.target.files[0]) {
                setImage(e.target.files[0]);
              }
            }}
          />
          {preview && (
            <img src={preview} alt="미리보기" className="w-40 h-40 object-cover rounded" />
          )}
        </div>

        <input
          className="mt-8 w-full text-white border-1 border-white rounded px-3 py-2 mb-3 placeholder-gray-400"
          placeholder="LP Name"
          value={lpName}
          onChange={e => setLpName(e.target.value)}
        />
        <input
          className="w-full border-1 text-white border-white rounded px-3 py-2 mb-3 placeholder-gray-400"
          placeholder="LP Content"
          value={lpContent}
          onChange={e => setLpContent(e.target.value)}
        />
        <div className="flex">
          <input
            className="w-full border border-white text-white rounded px-3 py-2 mb-3 bg-transparent placeholder-gray-400"
            placeholder="LP Tag"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          <button
            className="ml-3 w-20 h-12 rounded bg-gray-400 text-white hover:bg-gray-500"
            type="button"
            onClick={handleAddTag}
          >
            Add
          </button>
        </div>
        {/* 태그 리스트 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center bg-gray-400 text-white px-3 py-1 rounded-full text-sm"
            >
              #{tag}
              <button
                className="ml-2 text-xs hover:text-gray-200"
                onClick={() => handleRemoveTag(tag)}
                type="button"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <button
          className="mt-4 w-full p-2 rounded bg-pink-300 text-white hover:bg-pink-400 cursor-pointer"
          onClick={() => createLpMutation.mutate()}
          disabled={createLpMutation.isPending}
        >
          {createLpMutation.isPending ? "등록 중..." : "Add LP"}
        </button>
      </div>
    </div>
  );
};

export const HomePage = () => {
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState<PAGINATION_ORDER>(PAGINATION_ORDER.desc);
  const [modalOpen, setModalOpen] = useState(false);
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
    <div className="relative min-h-screen bg-black px-4 py-8">
      {/* + 버튼 */}
      <button
        className="fixed bottom-10 right-10 z-50 bg-pink-500 hover:bg-pink-600 text-white text-3xl rounded-full w-16 h-16 flex items-center justify-center cursor-pointer"
        onClick={() => setModalOpen(true)}
      >+
      </button>
      {/* LP 작성 모달 */}
      <LpModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {/* 오래된순 최신순 */}
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

      {/* 무한 스크롤 */}
      <div ref={ref} className="h-10"></div>
    </div>
  );
};