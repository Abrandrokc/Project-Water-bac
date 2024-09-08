export const drinkWaterProcent = (results, dailyNorm = 1500) => {
    console.log("Results:", results); // Перевіряємо, що передаємо
    const totalAmount = results.reduce((sum, item) => sum + item.waterVolume, 0);
    console.log("Total Amount of water:", totalAmount); // Лог для загальної кількості води
    
    console.log("Daily Norm:", dailyNorm ); // Лог для перевірки норми

    let Procent = parseFloat((totalAmount / (dailyNorm * 1000)* 100).toFixed(2));
    console.log("Calculated Procent:", Procent); // Лог для перевірки відсотка
    
    if (Procent > 100) {
        return 100;
    }

    return Procent;
};
