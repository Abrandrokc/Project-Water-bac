import createHttpError from "http-errors";
import { deleteWaterInfo, patchWaterInfo, postWaterInfo } from "../servises/water.js";

export const postWater = async (req, res) => {
   
        const water = await postWaterInfo(req.body);
        res.status(201).json({ 
            status: 201, 
            message: "Successfully created a water record!", 
            data: water 
        });
   
}
export const patchWater = async (req, res) => {
    const { date } = req.params
   
    const result = await patchWaterInfo({ date: date }, req.body)
    if (!result) {
        throw createHttpError(404, "Water info not found")

    }
    res.status(200).json(
        {status: 200,
	message: "Successfully patched a water info!",
            data: result.data
        }
    )
}
export const deleteWater = async (req, res) => {
    const { date } = req.params
    const result = await deleteWaterInfo({ date: date })
    if (!result) {

        throw createHttpError(404, "Contact not found");
    }


    res.status(200).json({
        status: 204,
        message: "Successfully deleted a water!"
    });
}