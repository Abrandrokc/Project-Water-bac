import { Router } from "express";
import ctrlWrapper from "../utils/ctrlWrapper.js";
import { deleteWater, patchWater, postWater } from "../controlers/water.js";
import validateBody from "../middleware/validateBody.js";
import { WaterNotes, WaterPatchNotes } from "../validation/water.js";

const waterRouters = Router();

waterRouters.post("/",validateBody(WaterNotes) , ctrlWrapper(postWater) );
waterRouters.patch("/:date", validateBody(WaterPatchNotes), ctrlWrapper(patchWater));
waterRouters.delete("/:date", ctrlWrapper(deleteWater));

export default waterRouters;