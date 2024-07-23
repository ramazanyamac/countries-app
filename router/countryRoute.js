import express from "express";
import * as countryController from "../controllers/countryController.js";

const router = express.Router();

router.route("/").get(countryController.getAllCountries);

router.route('/:name').get(countryController.getCountry);

export default router;
