import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLpDetail } from "../apis/lp";
import { Lp } from "../types/lp";

export const LpDetailPage = () => {
  const { id } = useParams();
  const [lp, setLp] = useState<Lp | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  if (id) {
    getLpDetail(Number(id))
      .then((data) => setLp(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }
}, [id]);


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
      {lp ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white">{lp.artist}</h2>
            <span className="text-sm text-gray-400">{lp.releaseDate}</span>
          </div>
          <img
            src={lp.thumbnail}
            alt={lp.title}
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
          <h1 className="mt-4 text-2xl font-bold text-white">{lp.title}</h1>
          <p className="mt-2 text-gray-300 text-sm">{lp.content}</p>

          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            {lp.tags?.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
              >
                #{String(tag)}
              </span>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button className="text-pink-500 flex items-center gap-1 cursor-pointer">
              ❤️ {lp.likes?.length ?? 0}
            </button>
            <div className="flex gap-2">
              <button className="text-white px-4 py-2 rounded cursor-pointer">
                수정
              </button>
              <button className="text-white px-4 py-2 rounded cursor-pointer">
                삭제
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-white">로딩 중...</div>
      )}
    </div>
  );
};