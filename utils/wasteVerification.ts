// utils/wasteVerification.ts
export const normalizeQuantity = (quantity: string | undefined): { value: number; unit: string } => {
    if (!quantity) {
      return { value: 0, unit: '' }; // Default fallback for undefined or invalid input
    }
  
    const cleaned = quantity.toLowerCase().replace(/\s+/g, '');
    const match = cleaned.match(/^([\d.]+)(\D+)$/);
    if (!match) return { value: 0, unit: '' };
  
    const [, valueStr, unit] = match;
    const value = parseFloat(valueStr);
    const standardUnit = standardizeUnit(unit);
  
    return { value, unit: standardUnit };
  };
  
  
  const standardizeUnit = (unit: string): string => {
    const unitMappings: { [key: string]: string } = {
      'kg': 'kg',
      'kgs': 'kg',
      'kilos': 'kg',
      'kilograms': 'kg',
      'g': 'g',
      'grams': 'g',
      'l': 'l',
      'liter': 'l',
      'liters': 'l',
      'litres': 'l',
      'lt': 'l',
      'lts': 'l',
    };
  
    return unitMappings[unit] || unit;
  };
  
  export const compareQuantities = (
    reported: { value: number; unit: string },
    collected: { value: number; unit: string }
  ): boolean => {
    if (reported.unit !== collected.unit) return false;
  
    // Allow for a 20% margin of error
    const tolerance = 0.2;
    const lowerBound = reported.value * (1 - tolerance);
    const upperBound = reported.value * (1 + tolerance);
  
    return collected.value >= lowerBound && collected.value <= upperBound;
  };
  