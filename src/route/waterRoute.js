import { Router } from "express";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { postWater } from "../controlers/water.js";

const waterRouters = Router();

waterRouters.post("/", ctrlWrapper(postWater) );
waterRouters.patch("/", );
waterRouters.delete("/", );

export default waterRouters;