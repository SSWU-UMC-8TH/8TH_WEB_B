import { useState } from "react";
import { useParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useFetchMovies } from "../hooks/useFetchMovies";

export default function MoviePage() {
  const [page, setPage] = useState(1);
  const { category } = useParams<{ category: string }>();
  const { movies, isLoading, isError } = useFetchMovies(category, page);

  if (isError) {
    return (
      <div>
        <span className="text-red-500">
          영화 정보를 불러오는 데 실패했습니다.
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center gap-6 mt-5">
        <button
          className="bg-[#f8c8dc] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#a67c52] transition-all duration-200 disabled:bg-gray-300 cursor-pointer disabled:cursor-not-allowed"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          {"<"}
        </button>
        <span>{page} 페이지</span>
        <button
          className="bg-[#f8c8dc] text-white px-6 py-3 rounded-lg shadow-md hover:bg-[#a67c52] transition-all duration-200 cursor-pointer"
          onClick={() => setPage((prev) => prev + 1)}
        >
          {">"}
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-dvh">
          <LoadingSpinner />
        </div>
      )}

      {!isLoading && (
        <div className="p-10 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </>
  );
}
