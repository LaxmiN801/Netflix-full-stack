import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const searchPerson = asyncHandler(async (req, res) => {
	const { query } = req.params;
	const response = await fetchFromTMDB(
		`https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
	);

	if (response.results.length === 0) {
		throw new ApiError(404, "No person found");
	}

	await User.findByIdAndUpdate(req.user._id, {
		$push: {
			searchHistory: {
				id: response.results[0].id,
				image: response.results[0].profile_path,
				title: response.results[0].name,
				searchType: "person",
				createdAt: new Date(),
			},
		},
	});

	res.status(200).json(new ApiResponse(200, response.results));
});

const searchMovie = asyncHandler(async (req, res) => {
	const { query } = req.params;

	const response = await fetchFromTMDB(
		`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
	);

	if (response.results.length === 0) {
		throw new ApiError(404, "No movie found");
	}

	await User.findByIdAndUpdate(req.user._id, {
		$push: {
			searchHistory: {
				id: response.results[0].id,
				image: response.results[0].poster_path,
				title: response.results[0].title,
				searchType: "movie",
				createdAt: new Date(),
			},
		},
	});

	res.status(200).json(new ApiResponse(200, response.results));
});

const searchTv = asyncHandler(async (req, res) => {
	const { query } = req.params;

	const response = await fetchFromTMDB(
		`https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
	);

	if (response.results.length === 0) {
		throw new ApiError(404, "No TV show found");
	}

	await User.findByIdAndUpdate(req.user._id, {
		$push: {
			searchHistory: {
				id: response.results[0].id,
				image: response.results[0].poster_path,
				title: response.results[0].name,
				searchType: "tv",
				createdAt: new Date(),
			},
		},
	});

	res.status(200).json(new ApiResponse(200, response.results));
});

const getSearchHistory = asyncHandler(async (req, res) => {
	res.status(200).json(new ApiResponse(200, req.user.searchHistory));
});

const removeItemFromSearchHistory = asyncHandler(async (req, res) => {
	let { id } = req.params;
	id = parseInt(id);

	await User.findByIdAndUpdate(req.user._id, {
		$pull: {
			searchHistory: { id: id },
		},
	});

	res.status(200).json(new ApiResponse(200, null, "Item removed from search history"));
});

export {
	searchPerson,
	searchMovie,
	searchTv,
	getSearchHistory,
	removeItemFromSearchHistory
};
