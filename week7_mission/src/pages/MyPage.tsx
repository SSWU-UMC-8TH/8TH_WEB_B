import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { LpUploadModal } from "../componenets/LpUpLoadMoal";
import { SettingsModal } from "../componenets/SettingModal";

export const MyPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [showLpModal, setShowLpModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-wite text-black">
      {/* 프로필 섹션 */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <img
          src={user?.avatar || "/user-placeholder.png"}
          className="w-32 h-32 rounded-full bg-gray-300 object-cover"
        />
        <input
          value={user?.name ?? ""}
          disabled
          className="bg-white border border-black text-black rounded px-3 py-2 w-64 text-center"
        />
        <input
          value={user?.bio ?? ""}
          disabled
          className="bg-white border border-black text-black rounded px-3 py-2 w-64 text-center"
        />
        <p className="text-sm text-black">{user?.email}</p>
        <button
          className="bg-yellow-300 text-black px-3 py-2 rounded hover:scale-90"
          onClick={() => setShowSettingsModal(true)}
        >
          ⚙ 설정
        </button>
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-4 mt-4">
        <button
          className="cursor-pointer bg-purple-300 text-black rounded-sm p-3 hover:scale-90"
          onClick={handleLogout}
        >
          로그아웃
        </button>
        <button
          className="cursor-pointer bg-green-300 text-black rounded-sm p-3 hover:scale-90"
          onClick={() => setShowLpModal(true)}
        >
          + LP 추가
        </button>
      </div>

      {showLpModal && <LpUploadModal onClose={() => setShowLpModal(false)} />}
      {showSettingsModal && user && (
        <SettingsModal
          currentName={user.name}
          currentBio={user.bio ?? ""}
          currentProfileImage={user.avatar ?? ""}
          onClose={() => setShowSettingsModal(false)}
          onUpdateSuccess={() => {}}
        />
      )}
    </div>
  );
};