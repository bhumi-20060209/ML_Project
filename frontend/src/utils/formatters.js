export const formatPercent = (val) => {
  if (val === undefined || val === null) return '0%';
  return `${(val * 100).toFixed(1)}%`;
};

export const formatNumber = (val) => {
  if (val === undefined || val === null) return '0';
  return new Intl.NumberFormat().format(val);
};

export const getBpStatus = (apHi, apLo) => {
  if (apHi < 120 && apLo < 80) return { label: 'Normal BP', color: 'emerald' };
  if (apHi >= 120 && apHi <= 129 && apLo < 80) return { label: 'Elevated BP', color: 'amber' };
  if ((apHi >= 130 && apHi <= 139) || (apLo >= 80 && apLo <= 89)) return { label: 'Hypertension Stage 1', color: 'orange' };
  return { label: 'Hypertension Stage 2', color: 'rose' };
};

export const getBmiCategory = (bmi) => {
  if (bmi < 18.5) return { label: 'Underweight', color: 'blue' };
  if (bmi < 25) return { label: 'Normal Weight', color: 'emerald' };
  if (bmi < 30) return { label: 'Overweight', color: 'amber' };
  return { label: 'Obese', color: 'rose' };
};
