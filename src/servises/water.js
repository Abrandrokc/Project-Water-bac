import Water from "../db/models/Water.js";

export const getWaterPerDay = date => Water.find(date)
export const getWaterPerMonth = async (firstDate, secondDate) => {
       
        const startDate = new Date(firstDate);
        const endDate = new Date(secondDate);
        const results = await Water.find({
            date: {
                $gte: startDate, 
                $lte: endDate   
            }
        });

        return results;
  
};
export const deleteWaterInfo = date => Water.findOneAndDelete(date)
export const postWaterInfo = data => Water.create(data)
export const patchWaterInfo = async (filter, data, options = {}) => {
    const result = await Water.findOneAndUpdate(filter, data, {
        new: true,
        includeResultMetadata: true,
        ...options

    })
    if (!result || !result.value) return null
    const isNew = Boolean(result?.lastErrorObject?.upserted)
    return {
        data: result.value,
        isNew
    }
}
