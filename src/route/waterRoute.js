import { Router } from "express";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { deleteWater, getWaterPerDayInfo, patchWater, postWater } from "../controlers/water.js";
import validateBody from "../middleware/validateBody.js";
import { WaterNotes, WaterPatchNotes } from "../validation/water.js";

const waterRouters = Router();

waterRouters.post("/",validateBody(WaterNotes) , ctrlWrapper(postWater) );
waterRouters.patch("/:date", validateBody(WaterPatchNotes), ctrlWrapper(patchWater));
waterRouters.delete("/:date", ctrlWrapper(deleteWater));
waterRouters.get("/perDay/:date", ctrlWrapper(getWaterPerDayInfo));
waterRouters.get("/perMonth/:firstDate/:secondDate", ctrlWrapper(deleteWater));

export default waterRouters;