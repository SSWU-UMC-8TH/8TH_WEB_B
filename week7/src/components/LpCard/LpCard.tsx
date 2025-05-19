import { Lp } from "../../types/lp";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

dayjs.extend(relativeTime);

interface LpCardProps {
  lp: Lp;
}

export const LpCard = ({ lp }: LpCardProps) => {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!accessToken) {
      alert("로그인이 필요한 서비스입니다. 로그인을 해주세요!");
      navigate("/login");
    } else {
      navigate(`/lp/${lp.id}`);
    }
  };
  return (
    <div
  onClick={handleClick}
  className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl group transition-shadow duration-300 cursor-pointer"
>
  <img
    src={lp.thumbnail}
    alt={lp.title}
    className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
  />

  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
    <h3 className="text-white text-sm font-semibold">{lp.title}</h3>
    <p className="text-white text-xs">{dayjs(lp.createdAt).fromNow()}</p>
    <p className="text-white text-xs">❤️ {lp.likes.length}</p>
  </div>
</div>
  );
};