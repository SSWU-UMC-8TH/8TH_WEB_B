import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateProfile } from "../apis/user";
import { useAuth } from "../context/AuthContext";
import { ResponseMyInfoDto } from "../types/auth";


export interface SettingsModalProps {
  currentName: string;
  currentBio?: string;
  currentProfileImage?: string;
  onClose: () => void;
  onUpdateSuccess: (updated: ResponseMyInfoDto["data"]) => void;
}

export const SettingsModal = ({ currentName, currentBio, currentProfileImage, onClose, onUpdateSuccess }: SettingsModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(currentName);
  const [bio, setBio] = useState(currentBio ?? "");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState(currentProfileImage || "");

  const { user, setUser } = useAuth();

  const { mutate, isPending } = useMutation({
    mutationFn: updateProfile,
    onMutate: async (form) => {
      const optimisticName = form.get("name")?.toString() ?? "";
      const optimisticBio = form.get("bio")?.toString() ?? "";
      const file = form.get("profileImage") as File | null;
      const avatarUrl = file ? URL.createObjectURL(file) : user?.avatar;

      const previousUser = user;

      setUser({
        ...user!,
        name: optimisticName,
        bio: optimisticBio,
        avatar: avatarUrl ?? user!.avatar,
      });

      return { previousUser };
    },
    onSuccess: (response) => {
      alert("프로필이 수정되었습니다!");
      onUpdateSuccess(response);
      onClose();
    },
    onError: (_err, _var, context) => {
      if (context?.previousUser) {
        setUser(context.previousUser);
      }
      alert("업데이트 실패");
    },
  });



  const handleSubmit = () => {
    if (!name.trim()) {
      alert("닉네임은 필수입니다.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (selectedImage) {
      formData.append("profileImage", selectedImage);
    }

    mutate(formData);
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-3 text-xl text-gray-500">✕</button>

        {/* 프로필 사진 */}
        <div className="flex justify-center mb-4">
          <img
            src={selectedImage ? URL.createObjectURL(selectedImage) : preview || "/user-placeholder.png"}
            alt="프로필"
            className="w-24 h-24 rounded-full bg-gray-300 cursor-pointer object-cover"
            onClick={handleImageClick}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectedImage(file);
              }
            }}
          />
        </div>

        <label className="block mb-2">닉네임 *</label>
        <input
          className="w-full border p-2 mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="block mb-2">한 줄 소개</label>
        <textarea
          className="w-full border p-2 mb-4"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>취소</button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSubmit} disabled={isPending}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};
