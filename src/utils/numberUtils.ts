const toInteger = (numericString: string) =>
  Number(numericString.replace(/[^0-9]+/g, ""));

export const toValidPositiveInteger = (numericString: string) =>
  Math.max(toInteger(numericString), 1);

export const toValidFloatOrNull = (numericString: string): number | null => {
  const parsedValue = parseFloat(numericString.replace(",", "."));
  return !isNaN(parsedValue) && isFinite(parsedValue) ? parsedValue : null;
};

// prettier-ignore
const allowedRpeValues: ReadonlyArray<number> = [
  6.5, 7.0, 7.5, 8.0, 8.5, 9.0, 9.5, 10.0
];

export const toValidRpe = (rpeString: string) => {
  const rpeNumber = Number(rpeString);
  return allowedRpeValues.some(e => e === rpeNumber) ? rpeNumber : null;
};
