import createHttpError from "http-errors";
import { deleteWaterInfo, getWaterPerDay, getWaterPerMonth, patchWaterInfo, postWaterInfo } from "../servises/water.js";
import { drinkWaterProcent } from "../utils/drinkWaterProcent.js";

export const postWater = async (req, res) => {
   
        const water = await postWaterInfo(req.body);
        res.status(201).json({ 
            status: 201, 
            message: "Successfully created a water record!", 
            data: water 
        });
   
}
export const patchWater = async (req, res) => {
    const { id } = req.params
   
    const result = await patchWaterInfo({ id: id }, req.body)
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
    const { id } = req.body
    const result = await deleteWaterInfo({ id: id })
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
    const parsedDate = new Date(date);
    const results = await getWaterPerDay( parsedDate )
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
   
   const date1 = new Date(firstDate)
    const date2 = new Date(lastDate)
   
    if (isNaN(date1) || isNaN(date2)) {
        throw createHttpError(400, "Invalid date format");
    }
    const results = await getWaterPerMonth(date1, date2)
    res.status(200).json({
            status: 200,
            message: "Water data retrieved successfully",
            data: results,
        });
}