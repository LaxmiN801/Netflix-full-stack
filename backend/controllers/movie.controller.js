import { fetchFromTMDB } from "../services/tmdb.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import axios from "axios";



// const getTrendingMovie = asyncHandler(async(req, res) => {
//     try {
//         const data = await fetchFromTMDB("https://api.themoviedb.org/3/trending/movie/day?language=en-US")
//         const randomMovie = data.results[Math.floor(Math.random() * data.results?.length)];
//         res
//         .status(200)
//         .json(new ApiResponse(200, randomMovie));
//     } catch (error) {
//         console.log(error)
//         throw new ApiError(500, "Internal Server Error", [error]);
//     }    
// })

// const getTrendingMovie = asyncHandler(async (req, res) => {
//     try {
//       console.log("TMDB_API_KEY:", process.env.TMDB_API_KEY); // 🔍 Check if this is undefined
//       const data = await fetchFromTMDB("https://api.themoviedb.org/3/trending/movie/day?language=en-US");
//       const randomMovie = data.results[Math.floor(Math.random() * data.results?.length)];
//       res.status(200).json(new ApiResponse(200, randomMovie));
//     } catch (error) {
//       console.error("🔥 ERROR in getTrendingMovie:", error);
//       throw new ApiError(500, "Internal Server Error", [error.message]);
//     }
//   });

const getTrendingMovie = asyncHandler(async (req, res) => {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/trending/movie/day?language=en-US', {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNmY0YTQ5MWJmNDMxNDM3ZjM5ODg2ZmU2NTVjYjFhOCIsIm5iZiI6MTc0NDI5MTM1Mi45MDEsInN1YiI6IjY3ZjdjNjE4Y2NlNzY5MDIzMGFkMWVkNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WCY-IdkS5uXN-f_lc4ewEbdZ-Sba8NPngzQU69NGmHc`,
      },
      timeout: 25000,
    });

    res.status(200).json(new ApiResponse(200, response.data, "Fetched trending movies successfully"));
  } catch (error) {
    console.error("🔥 ERROR in getTrendingDirect:", error.message);
    res.status(500).json(new ApiResponse(500, null, `Something went wrong: ${error.message}`));
  }
});

const getMovieTrailers = asyncHandler(async(req, res) => {
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/videos?language=en-US`);
        res
        .status(200)
        .json(new ApiResponse(200, data.results));
    } catch (error) {
        if (error.message.includes("404")) {
			return res.status(404).send(null);
		}
        throw new ApiError(500, "Internal Server Error", [error]);
    }
})

const getMovieDetails = asyncHandler(async (req, res) => {
	const { id } = req.params;
	try {
		const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}?language=en-US`);
		res.status(200).json(new ApiResponse(200, data));
	} catch (error) {
		if (error.message.includes("404")) {
			return res.status(404).send(null);
		}
		throw new ApiError(500, "Internal Server Error", [error]);
	}
});

const getSimilarMovies = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1`);
	res.status(200).json(new ApiResponse(200, data.results));
});

const getMoviesByCategory = asyncHandler(async (req, res) => {
	const { category } = req.params;
	const data = await fetchFromTMDB(`https://api.themoviedb.org/3/movie/${category}?language=en-US&page=1`);
	res.status(200).json(new ApiResponse(200, data.results));
});

export { 
         getTrendingMovie,
         getMovieTrailers,
         getMovieDetails, 
         getSimilarMovies, 
         getMoviesByCategory 
        };
 