export const PriceView = (value: string | number): string => {
  const num = typeof value === 'number' ? value : Number(value);

  if (Number.isNaN(num) || !Number.isFinite(num)) {
    return '0.00';
  }

  return num.toFixed(2);
};
