export const drinkWaterProcent = (results, dailyNorm = 1500) => {
    console.log("Results:", results); 
    const totalAmount = results.reduce((sum, item) => sum + item.waterVolume, 0);
    console.log("Total Amount of water:", totalAmount); 
    
    console.log("Daily Norm:", dailyNorm ); 

    let Procent = parseFloat((totalAmount / (dailyNorm * 1000)* 100).toFixed(2));
    console.log("Calculated Procent:", Procent);
    if (Procent > 100) {
        return 100;
    }

    return Procent;
};
