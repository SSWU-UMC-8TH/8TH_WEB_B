import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";

interface MovieDetail {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
}

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId?: string }>(); // ✅ movieId를 선택적 타입으로 변경
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!movieId) return; // ✅ movieId가 없으면 요청 안 함

    const fetchMovieDetail = async () => {
      setIsPending(true);

      try {
        const { data } = await axios.get<MovieDetail>(
          `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );
        setMovie(data);
      } catch {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovieDetail();
  }, [movieId]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="text-red-500 text-center mt-10">
        영화 정보를 불러오는 데 실패했습니다.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
      <img
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        alt={movie.title}
        className="rounded-lg shadow-lg mx-auto mb-4"
      />
      <p className="text-gray-600 text-lg mb-2">{movie.overview}</p>
      <p className="text-gray-500">📅 개봉일: {movie.release_date}</p>
      <p className="text-yellow-500">⭐ 평점: {movie.vote_average} / 10</p>
    </div>
  );
}
