import createHttpError from "http-errors";
import { deleteWaterInfo, getWaterPerDay, getWaterPerMonth, patchWaterInfo, postWaterInfo } from "../services/water.js";
import { drinkWaterProcent } from "../utils/drinkWaterProcent.js";

export const postWater = async (req, res) => {
   const { _id: userId } = req.user;
    const water = await postWaterInfo({ ...req.body, userId});
        res.status(201).json({ 
            status: 201, 
            message: "Successfully created a water record!", 
            data: water 
        });
   
}
export const patchWater = async (req, res) => {
    const { waterId } = req.params

  const { _id: userId } = req.user;
    const result = await patchWaterInfo({ _id: waterId, userId }, req.body)
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
    const { waterId } = req.body
     const { _id: userId } = req.user;
    const result = await deleteWaterInfo({ _id: waterId, userId})
    if (!result) {

        throw createHttpError(404, "Contact not found");
    }


    res.status(200).json({
        status: 204,
        message: "Successfully deleted a water!"
    });
}
export const getWaterPerDayInfo = async (req, res) => {
    const { date } = req.body
     const { _id: userId } = req.user;
    const parsedDate = new Date(date);
const results = await getWaterPerDay( parsedDate, userId)
     if (results.length === 0) {
    throw createHttpError(404, "Water info not found");
    }
   let Procent = drinkWaterProcent(results)
    console.log(results)
    
    res.status(200).json(
        {
            status: 200,
            WaterProcent: Procent,
         data: results,
        }
            
    )

}
export const getWaterPerMonthInfo = async (req, res) => {
    const { firstDate, lastDate } = req.body;
    const { _id: userId } = req.user;
   const date1 = new Date(firstDate)
    const date2 = new Date(lastDate)
   
    if (isNaN(date1) || isNaN(date2)) {
        throw createHttpError(400, "Invalid date format");
    }
    const results = await getWaterPerMonth(date1, date2, userId)
    res.status(200).json({
            status: 200,
            message: "Water data retrieved successfully",
            data: results,
        });
}