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

interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

interface Crew {
  id: number;
  name: string;
  job: string;
  profile_path: string | null;
}

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId?: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [director, setDirector] = useState<Crew | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieData = async () => {
      setIsPending(true);
      try {
        // 1. 영화 상세 정보
        const movieDetailPromise = axios.get<MovieDetail>(
          `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        // 2. 출연진 및 제작진 정보
        const creditsPromise = axios.get<{ cast: Cast[]; crew: Crew[] }>(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
            },
          }
        );

        const [movieRes, creditsRes] = await Promise.all([
          movieDetailPromise,
          creditsPromise,
        ]);

        setMovie(movieRes.data);
        setCast(creditsRes.data.cast.slice(0, 6)); // 상위 6명만 표시
        const directorData = creditsRes.data.crew.find(
          (crew) => crew.job === "Director"
        );
        setDirector(directorData || null);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsPending(false);
      }
    };

    fetchMovieData();
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>

      <img
        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
        alt={movie.title}
        className="rounded-lg shadow-lg mx-auto mb-6"
      />

      <p className="text-gray-600 text-lg mb-2">{movie.overview}</p>
      <p className="text-gray-500">📅 개봉일: {movie.release_date}</p>
      <p className="text-yellow-500 mb-4">⭐ 평점: {movie.vote_average} / 10</p>

      {director && (
        <div className="flex items-center gap-4 mb-8">
          {director.profile_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w185${director.profile_path}`}
              alt={director.name}
              className="w-16 h-16 rounded-full object-cover shadow-md"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-sm text-gray-600">
              No Image
            </div>
          )}
          <p className="text-lg font-semibold">🎬 감독: {director.name}</p>
        </div>
      )}

      {cast.length > 0 && (
        <div>
          <p className="text-lg font-semibold mb-4">🎭 출연진</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {cast.map((member) => (
              <div
                key={member.id}
                className="flex flex-col items-center text-center"
              >
                {member.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                    alt={member.name}
                    className="w-24 h-36 object-cover rounded-md shadow mb-2"
                  />
                ) : (
                  <div className="w-24 h-36 bg-gray-300 flex items-center justify-center rounded-md mb-2 text-sm text-gray-600">
                    No Image
                  </div>
                )}
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-gray-500">{member.character}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
