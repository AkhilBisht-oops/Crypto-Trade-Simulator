function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

function roundToDecimals(value, decimals = 8) {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

function calculatePnl(currentPrice, avgBuyPrice, quantity) {
  const currentValue = currentPrice * quantity;
  const costBasis = avgBuyPrice * quantity;
  const pnl = currentValue - costBasis;
  const pnlPercentage = costBasis > 0 ? ((currentValue - costBasis) / costBasis) * 100 : 0;
  return { pnl, pnlPercentage, currentValue };
}

module.exports = { formatCurrency, roundToDecimals, calculatePnl };
