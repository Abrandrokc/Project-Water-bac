import createHttpError from "http-errors";
import { postWaterInfo } from "../servises/water.js";
export const postWater = async (req, res) => {
    water = await postWaterInfo(req.params)
}