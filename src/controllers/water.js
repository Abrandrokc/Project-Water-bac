import createHttpError from "http-errors";
import { deleteWaterInfo, getWaterPerDay, getWaterPerMonth, patchWaterInfo, postWaterInfo } from "../services/water.js";
import { drinkWaterProcent } from "../utils/drinkWaterProcent.js";

import { UsersCollection } from "../db/models/users.js";

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
    const { id } = req.params;

  const { _id: userId } = req.user;
    const result = await patchWaterInfo({ _id: id, userId }, req.body)

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

    const {  id } = req.params;
     const { _id: userId } = req.user;
    const result = await deleteWaterInfo({ _id:  id, userId})
    if (!result) {

        throw createHttpError(404, "Contact not found");
    }



    res.status(204).json({

        status: 204,
        message: "Successfully deleted a water!"
    });
}
export const getWaterPerDayInfo = async (req, res) => {
    const { date } = req.query

     const { _id: userId } = req.user;
    const parsedDate = new Date(date);
    const user = await UsersCollection.findById(userId)
    const dailyNorm = user.waterAmount
const results = await getWaterPerDay( parsedDate, userId)
     if (results.length === 0) {
    throw createHttpError(404, "Water info not found");
    }
    console.log(results)
   let Procent = drinkWaterProcent(results,dailyNorm)

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
    try {
      console.log('Received query params:', req.query);
    const { firstDate, lastDate } = req.query;

    if (!firstDate || !lastDate) {
      throw createHttpError(400, "Missing required date parameters");
    }

    const { _id: userId } = req.user;

    const date1 = new Date(firstDate);
    const date2 = new Date(lastDate);

    if (isNaN(date1) || isNaN(date2)) {
      throw createHttpError(400, "Invalid date format");
    }

    const results = await getWaterPerMonth(date1, date2, userId);

    res.status(200).json({
      status: 200,
      message: "Water data retrieved successfully",
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      status: 400,
      message: error.message || "Unexpected error",
      data: error.toString(),
    });
  }
};
