import axios from "axios";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import useCustomFetch from "../hooks/useCustomFetch";
import { MovieDetailResponse, CastMember } from "../types/movie";

export default function MovieDetailPage() {
  const { movieId } = useParams<{ movieId?: string }>();

  const urls = useMemo(() => [
    `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
    `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`,
  ], [movieId]);

  const { data, isPending, isError } = useCustomFetch<[MovieDetailResponse, { cast: CastMember[] }]>(urls);

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !data || !Array.isArray(data) || data.length < 2) {
    console.error("API 요청 실패 또는 데이터 구조 문제:", data);
    return (
      <div className="text-red-500 text-center mt-10 bg-black h-screen flex items-center justify-center">
        영화 정보를 불러오는 데 실패했습니다.
      </div>
    );
  }

  const [movie, credits] = data;
  const cast = credits.cast || [];

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="bg-gray-800 p-15">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-15">
          <img
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            alt={movie.title}
            className="rounded-lg shadow-lg w-64 md:w-100"
          />
          <div className="flex-1">
            <h1 className="text-7xl font-bold mb-5 mt-50">{movie.title}</h1>
            <p className="text-gray-300 text-2xl mb-4 mt-8">{movie.overview}</p>
            <p className="text-xl text-gray-400">개봉일: {movie.release_date}</p>
            <p className="text-xl text-gray-400">평점: {movie.vote_average} / 10</p>
            <p className="text-xl text-gray-400 mb-2">장르: {movie.genres?.map((genre) => genre.name).join(", ")}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white my-6"></div>

      <div className="bg-black- p-6 mt-5">
        <h2 className="text-3xl font-bold mb-15 ml-10">주요 출연진</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
          {cast.slice(0, 5).map((member) => (
            <div key={member.id} className="text-center">
              <img
                src={
                  member.profile_path
                    ? `https://image.tmdb.org/t/p/w200/${member.profile_path}`
                    : "https://via.placeholder.com/200x300?text=No+Image"
                }
                alt={member.name}
                className="rounded-lg shadow-lg mx-auto mb-2"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/200x300?text=No+Image";
                }}
              />
              <p className="text-2xl text-gray-200 font-semibold mt-10">{member.name}</p>
              <p className="text-xl text-gray-400 text-sm">{member.character}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}