export type Movie = {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  };
  
  export type MovieResponse = {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
  };
  
  export type MovieDetail = {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    backdrop_path: string;
    release_date: string;
    vote_average: number;
    runtime: number;
    tagline: string;
    genres: {
      id: number;
      name: string;
    }[];
    production_companies: {
      id: number;
      name: string;
      logo_path: string | null;
      origin_country: string;
    }[];
    production_countries: {
      iso_3166_1: string;
      name: string;
    }[];
    spoken_languages: {
      english_name: string;
      iso_639_1: string;
      name: string;
    }[];
    budget: number;
    revenue: number;
    status: string;
    homepage: string;
    imdb_id: string;
    original_language: string;
    original_title: string;
    popularity: number;
    vote_count: number;
    belongs_to_collection: null | {
      id: number;
      name: string;
      poster_path: string;
      backdrop_path: string;
    };
    adult: boolean;
    video: boolean;
  };
  