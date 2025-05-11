import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getLpDetail } from "../apis/lp";
import { Lp } from "../types/lp";

export const LpDetailPage = () => {
  const { id } = useParams();
  const [lp, setLp] = useState<Lp | null>(null);

  useEffect(() => {
    if (id) {
      getLpDetail(Number(id))
        .then((data) => {
          console.log("LP 응답 데이터:", data);   // 여기서 응답 확인 가능
          setLp(data);
        })
        .catch((err) => {
          console.error("LP 가져오기 실패:", err); //  실패했을 때 에러 확인 가능
        });
    }
  }, [id]);

  if (!lp) return <div className="mt-20 text-center">로딩 중...</div>;

  return (
    <div className="mt-24 px-8 max-w-4xl mx-auto">
      <img
        src={lp.thumbnail}
        alt={lp.title}
        className="w-full h-80 object-cover rounded shadow-lg"
      />
      <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">{lp.title}</h1>
      <p className="mt-4 text-gray-700 dark:text-gray-300">{lp.content}</p>

      <div className="mt-6 flex gap-4">
        <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded">
          수정
        </button>
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          삭제
        </button>
        <button className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">
          ❤️ 좋아요 ({lp.likes?.length?? 0})
        </button>
      </div>
    </div>
  );
};
