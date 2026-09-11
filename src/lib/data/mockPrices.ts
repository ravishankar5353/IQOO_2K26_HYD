import { PriceHistoryPoint } from '../types/trustcart';

export function generatePriceHistory(
  basePrice: number,
  historicalLow: number,
  historicalHigh: number,
  isCurrentlyInflated = false
): PriceHistoryPoint[] {
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
  const history: PriceHistoryPoint[] = [];

  for (let i = 0; i < months.length; i++) {
    const isSaleMonth = i === 5 || i === 9; // Festive months
    let price: number;

    if (isSaleMonth) {
      price = historicalLow;
    } else if (i === months.length - 1 && isCurrentlyInflated) {
      price = basePrice;
    } else {
      const variation = (Math.sin(i) * 0.15) * (historicalHigh - historicalLow);
      price = Math.round((historicalHigh + historicalLow) / 2 + variation);
    }

    history.push({
      date: `${months[i]} 2025`,
      price: Math.max(historicalLow, Math.min(historicalHigh, price)),
      isFestival: isSaleMonth,
      event: isSaleMonth ? 'Festival Super Sale' : undefined,
    });
  }

  return history;
}
