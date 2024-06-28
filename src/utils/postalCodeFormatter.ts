export default (value: string): string => {
  const parsedValue = value.replace(/\D/g, '');

  const part1 = parsedValue.slice(0, 5);
  const part2 = parsedValue.slice(5, 8);

  if (parsedValue.length <= 5) return parsedValue;

  return `${part1}-${part2}`;
};
