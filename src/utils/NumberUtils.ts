export const toValidPositiveInteger = (numericString: string) => {
  const validInt = Number(numericString.replace(/[^0-9]+/g, ""));
  return validInt < 1 ? 1 : validInt;
};

export const toValidRpe = (rpeString: string) => {
  const allowedRpeValues = [6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0];

  const rpeNumber = Number(rpeString);
  return allowedRpeValues.some(e => e === rpeNumber) ? rpeNumber : null;
};
