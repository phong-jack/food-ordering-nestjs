export const stringArrayToArray = (input: string, delimiter: string) => {
  if (!input.includes(delimiter)) {
    return [input];
  }

  return input.split(delimiter);
};
