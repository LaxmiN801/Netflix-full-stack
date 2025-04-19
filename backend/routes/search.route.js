import express from "express";
import {
	searchPerson,
	searchMovie,
	searchTv,
	getSearchHistory,
	removeItemFromSearchHistory,
} from "../controllers/search.controller.js";

const router = express.Router();

router.route("/person/:query").get(searchPerson);
router.route("/movie/:query").get(searchMovie);
router.route("/tv/:query").get(searchTv);
router.route("/history").get(getSearchHistory);
router.route("/history/:id").delete(removeItemFromSearchHistory);

export default router;
