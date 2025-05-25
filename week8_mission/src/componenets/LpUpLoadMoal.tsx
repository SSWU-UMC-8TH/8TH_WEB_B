import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { postLp } from "../apis/lp";
import { useAuth } from "../context/AuthContext";

export const LpUploadModal = ({ onClose }: { onClose: () => void }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const { user } = useAuth();
  const userId = user?.id;

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).id === "modal-bg") {
      onClose();
    }
  };

  const { mutate: uploadLp } = useMutation({
    mutationFn: (formData: FormData) => postLp(userId!, formData),
    onSuccess: () => {
      alert("LP 등록 성공!");
      onClose();
    },
    onError: (err) => {
      alert("등록 실패");
      console.error(err);
    },
  });

  const handleSubmit = () => {
    if (!title || !content || !selectedFile) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tags", JSON.stringify(tags));
    formData.append("thumbnail", selectedFile);

    uploadLp(formData);
  };

  return (
    <div
      id="modal-bg"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      <div className="bg-[#2b2b2b] rounded-lg w-96 p-6 relative text-white">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-2 right-3 text-xl font-bold text-gray-300"
        >
          ✕
        </button>

        <div className="flex justify-center mb-6">
          <img
            src={selectedFile ? URL.createObjectURL(selectedFile) : "/lp-placeholder.png"}
            alt="LP"
            onClick={handleImageClick}
            className="w-40 h-40 object-contain cursor-pointer bg-gray-700 rounded"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectedFile(file);
              }
            }}
          />
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="LP Name"
          className="w-full mb-2 p-2 rounded bg-transparent border border-gray-500"
        />
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="LP Content"
          className="w-full mb-2 p-2 rounded bg-transparent border border-gray-500"
        />

        <div className="flex gap-2 mb-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
            placeholder="LP Tag"
            className="flex-1 p-2 rounded bg-transparent border border-gray-500"
          />
          <button
            onClick={handleAddTag}
            className="cursor-pointer bg-gray-400 px-4 py-1 rounded text-black"
          >
            Add
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <div
              key={tag}
              className="bg-gray-700 text-white rounded-full px-3 py-1 text-sm flex items-center gap-2"
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="cursor-pointer text-sm text-gray-300 hover:text-red-400"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-gray-400 py-2 rounded text-black"
        >
          Add LP
        </button>
      </div>
    </div>
  );
};