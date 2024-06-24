export const stringArrayToArray = (input: string, delimiter: string) => {
  if (!input.includes(delimiter)) {
    return [input];
  }

  return input.split(delimiter);
};

export const categoryIdsToArray = (input: string, delimiter: string) => {
  if (!input || 'all') {
    return [];
  }
  return stringArrayToArray(input, delimiter);
};
