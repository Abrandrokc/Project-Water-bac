export const drinkWaterProcent = (results, dailyNorm = 15000) => {
    const totalAmount = results.reduce((sum, item) => sum + item.waterVolume, 0);
    let Procent = parseFloat((totalAmount / dailyNorm * 100).toFixed(2));
    if (Procent > 100) {
        return 100;
    }
    
}
