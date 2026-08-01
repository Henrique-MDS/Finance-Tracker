export const generateColor = (index: number, alpha = 1) => {
  return `hsl(${index * 47} 70% 55% / ${alpha})`;
};