import Water from "../db/models/water.js";

export const getWaterPerDay = async (date, userId) => {
    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1); 
    console.log(date)
    console.log(startDate)
     console.log(endDate)
    const results = await Water.find({
        createdAt: {
            $gte: startDate.toISOString(), 
            $lt: endDate.toISOString()
        },
        userId: userId
    });

    return results;
};
export const getWaterPerMonth = async (firstDate, secondDate,userId) => {
   console.log(firstDate)
    console.log(secondDate)
        const startDate = new Date(firstDate);
    const endDate = new Date(secondDate);
     const user =  await UsersCollection.findById(userId)
    const dailyNorma = user.waterAmount
        const results = await Water.find({
            createdAt: {
                $gte: startDate.toISOString(), 
                $lte: endDate.toISOString()   
            },
             userId: userId
        });

          const daysMap = {};

    results.forEach(entry => {
         const dateObject = new Date(entry.createdAt);
        const day = dateObject.getDate(); 
        const month = dateObject.toLocaleString('default', { month: 'long' }); 
        console.log(`Day: ${day}, Month: ${month}`);


        if (!daysMap[day]) {
            daysMap[day] = {
                date: `${day}, ${month}`,
                dailyTotal: 0,
                consumptionCount: 0,
                dailyNorm: dailyNorma,
            };
        }
       
    daysMap[day].dailyTotal += entry.waterVolume;
    daysMap[day].consumptionCount += 1;
});

    
  const dailyInfo = Object.values(daysMap).map(dayInfo => {
    let waterPercent = ((dayInfo.dailyTotal / (dayInfo.dailyNorm * 1000)) * 100);

    
    return {
        ...dayInfo,
        waterPercent: waterPercent.toFixed(2) + '%',
    };
});


    return dailyInfo;
};
  

export const deleteWaterInfo = id=> Water.findOneAndDelete(id)
export const postWaterInfo = id => Water.create(id)
export const patchWaterInfo = async (filter, id, options = {}) => {
    const result = await Water.findOneAndUpdate(filter, id, {
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
