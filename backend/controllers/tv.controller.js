import { fetchFromTMDB } from "../services/tmdb.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getTrendingTv = asyncHandler(async (req, res) => {
    const data = await fetchFromTMDB("https://api.themoviedb.org/3/trending/tv/day?language=en-US");
    const randomTv = data.results[Math.floor(Math.random() * data.results?.length)];
    res.status(200).json(new ApiResponse(200, randomTv));
});

const getTvTrailers = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/videos?language=en-US`);
        res.status(200).json(new ApiResponse(200, data.results));
    } catch (error) {
        if (error.message.includes("404")) {
            return res.status(404).send(null);
        }
        throw new ApiError(500, "Internal Server Error", [error]);
    }
});

const getTvDetails = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}?language=en-US`);
        res.status(200).json(new ApiResponse(200, data));
    } catch (error) {
        if (error.message.includes("404")) {
            return res.status(404).send(null);
        }
        throw new ApiError(500, "Internal Server Error", [error]);
    }
});

const getSimilarTvs = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${id}/similar?language=en-US&page=1`);
    res.status(200).json(new ApiResponse(200, data.results));
});

const getTvsByCategory = asyncHandler(async (req, res) => {
    const { category } = req.params;
    const data = await fetchFromTMDB(`https://api.themoviedb.org/3/tv/${category}?language=en-US&page=1`);
    res.status(200).json(new ApiResponse(200, data.results));
});

export {
    getTrendingTv,
    getTvTrailers,
    getTvDetails,
    getSimilarTvs,
    getTvsByCategory
};
