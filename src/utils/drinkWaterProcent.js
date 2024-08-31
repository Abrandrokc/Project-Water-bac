export const drinkWaterProcent = results => {
    const totalAmount = results.reduce((sum, item) => sum + item.waterVolume, 0)
    const Procent = parseFloat((totalAmount / 15000 * 100).toFixed(2));
    return Procent
}

