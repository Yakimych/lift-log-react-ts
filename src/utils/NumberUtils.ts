export const toValidPositiveInteger = (numericString: string) => {
  const validInt = Number(numericString.replace(/[^0-9]+/g, ""));
  return validInt < 1 ? 1 : validInt > 30 ? 30 : validInt;
};
