import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { MovieDetail } from "../types/movie";

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

interface Credit {
  cast: Cast[];
  crew: Crew[];
}

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId?: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [credits, setCredits] = useState<Credit | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!movieId) return;

    const fetchMovieDetail = async () => {
      setIsPending(true);

      try {
        const [movieRes, creditRes] = await Promise.all([
          axios.get<MovieDetail>(
            `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
          axios.get<Credit>(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
            {
              headers: {
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
              },
            }
          ),
        ]);

        setMovie(movieRes.data);
        setCredits(creditRes.data);
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

  if (isError || !movie || !credits) {
    return (
      <div className="text-red-500 text-center mt-10">
        영화 정보를 불러오는 데 실패했습니다.
      </div>
    );
  }

  const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
  const directors = credits.crew.filter((person) => person.job === "Director");

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={`${IMAGE_BASE}${movie.backdrop_path}`}
            alt={movie.title}
            className="rounded-xl w-full md:w-1/2 object-cover"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <p className="text-lg text-gray-300 mb-1">평균 {movie.vote_average}</p>
            <p className="text-lg text-gray-300 mb-1">{movie.release_date.slice(0, 4)}</p>
            <p className="text-lg text-gray-300 mb-4">{movie.runtime}분</p>
            <p className="italic text-yellow-300 mb-4">{movie.tagline}</p>
            <p className="text-base text-gray-300 leading-relaxed whitespace-pre-line">
              {movie.overview}
            </p>
          </div>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-4 border-b border-gray-600 pb-2">감독/출연</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
          {directors.map((d) => (
            <div key={d.id} className="text-center">
              {d.profile_path && (
                <img
                  src={`${IMAGE_BASE}${d.profile_path}`}
                  alt={d.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover"
                />
              )}
              <p className="text-sm mt-2 font-medium">{d.name}</p>
              <p className="text-xs text-gray-400">감독</p>
            </div>
          ))}

          {credits.cast.slice(0, 12).map((actor) => (
            <div key={actor.id} className="text-center">
              {actor.profile_path && (
                <img
                  src={`${IMAGE_BASE}${actor.profile_path}`}
                  alt={actor.name}
                  className="w-20 h-20 rounded-full mx-auto object-cover"
                />
              )}
              <p className="text-sm mt-2 font-medium">{actor.name}</p>
              <p className="text-xs text-gray-400">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
