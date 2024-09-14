import { UsersCollection } from "../db/models/users.js";
import Water from "../db/models/water.js";


export const getWaterPerDay = async (date, userId) => {

    const startDate = new Date(date);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1); 
    
    console.log(startDate)
     console.log(endDate)
    const results = await Water.find({
        createdAt: {
            $gte: startDate.toISOString(), 
            $lt: endDate.toISOString()

        },
        userId: userId

    });
console.log(results)
    return results;
};

const formatDate = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' });
  return `${day}, ${month}`;
};

export const getWaterPerMonth = async (firstDate, secondDate, userId) => {
  console.log(firstDate);
  console.log(secondDate);

  const startDate = new Date(firstDate);
  const endDate = new Date(secondDate);

 
  const user = await UsersCollection.findById(userId);
  const dailyNorma = user.waterAmount;

  
  const results = await Water.find({
    createdAt: {
      $gte: startDate.toISOString(),
      $lte: endDate.toISOString(),
    },
    userId: userId,
  });

  const daysMap = {};

  
  results.forEach(entry => {
    const dateObject = new Date(entry.createdAt);
    const formattedDate = formatDate(dateObject);

    if (!daysMap[formattedDate]) {
      daysMap[formattedDate] = {
        date: formattedDate,
        dailyTotal: 0,
        consumptionCount: 0,
        dailyNorm: dailyNorma,
      };
    }

    
    daysMap[formattedDate].dailyTotal += entry.waterVolume;
    daysMap[formattedDate].consumptionCount += 1;
  });

  
  const dailyInfo = Object.values(daysMap).map(dayInfo => {
    const waterPercent = ((dayInfo.dailyTotal / (dayInfo.dailyNorm * 1000)) * 100);
    return {
      ...dayInfo,
      waterPercent: waterPercent.toFixed(2) + '%',
    };
  });

  
  const dates = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(formatDate(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

 
  const existingDataMap = new Map(dailyInfo.map(item => [item.date, item]));
  const result = dates.map(date => {
    const entry = existingDataMap.get(date);
    if (entry) {
      return entry;
    }
    return {
      date: date,
      dailyTotal: 0,
      consumptionCount: 0,
      dailyNorm: dailyNorma, 
      waterPercent: "0%",
    };
  });

  return result;
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
