import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useEditProfile from "../hooks/mutations/useEditProfile";
import { useQueryClient } from "@tanstack/react-query";
import { useMyInfo } from "../hooks/queries/useMyInfo";

export const MyPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const queryClient = useQueryClient();

  const { data } = useMyInfo(); // 캐시에서 사용자 정보 가져오기(Optimistic Update)
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(data?.data?.name ?? "");
  const [bio, setBio] = useState(data?.data?.bio ?? "");
  const [profileImg, setProfileImg] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(
    data?.data?.profileImageUrl ?? null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editProfileMutation = useEditProfile();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImg(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <div className="flex flex-col items-center gap-4">
        {/* 프로필 이미지 */}
        <div
          className="w-32 h-32 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden cursor-pointer"
          onClick={() => editMode && fileInputRef.current?.click()}
        >
          {preview ? (
            <img
              src={preview}
              alt="profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-4xl"></span>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* 이름, bio */}
        {editMode ? (
          <div className="flex flex-col items-center gap-2 w-64">
            <input
              className="w-full px-3 py-2 rounded border border-gray-400 text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
            />
            <input
              className="w-full px-3 py-2 rounded border border-gray-400 text-white"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={30}
              placeholder="한 줄 소개"
            />
            <div className="flex gap-5">
              <button
                className="mt-2 px-4 py-2 bg-pink-400 text-white rounded hover:bg-pink-500"
                onClick={() =>
                  editProfileMutation.mutate(
                    { name, bio, profileImg },
                    {
                      onSuccess: (res) => {
                        queryClient.setQueryData(["myInfo"], (old: any) => ({
                          ...old,
                          data: {
                            ...old.data,
                            name,
                            bio,
                            profileImageUrl: res.data.profileImageUrl,
                          },
                        }));
                        setEditMode(false);
                      },
                    }
                  )
                }
                disabled={editProfileMutation.isPending}
              >
                저장
              </button>
              <button
                className="mt-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => setEditMode(false)}
              >
                취소
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 w-64">
            <div className="flex items-center gap-2">
              <span className="text-white text-xl font-bold">
                {data?.data?.name}
              </span>
              <button
                className="ml-2 text-white text-lg"
                onClick={() => setEditMode(true)}
                title="설정"
              >
                ⚙️
              </button>
            </div>
            <span className="text-white text-base">{data?.data?.bio}</span>
          </div>
        )}
        <span className="text-white text-base">{data?.data?.email}</span>
        <button
          className="bg-pink-300 text-white hover:bg-pink-200 rounded-sm p-3 mt-5 cursor-pointer"
          onClick={handleLogout}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
};
