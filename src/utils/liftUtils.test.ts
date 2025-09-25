import { toValidNumberOfRepsOrEmpty, toValidSet } from "./liftUtils";

it("toValidSet should parse RPE value correctly", () => {
  const set = toValidSet("8@9.5");

  expect(set).toEqual({ reps: 8, rpe: 9.5 });
});

describe("toValidNumberOfRepsOrEmpty", () => {
  it("should handle empty string by returning null", () => {
    expect(toValidNumberOfRepsOrEmpty("")).toBe(null);
  });

  it("should handle whitespace by returning null", () => {
    expect(toValidNumberOfRepsOrEmpty("   ")).toBe(null);
  });

  it("should handle valid positive number", () => {
    expect(toValidNumberOfRepsOrEmpty("5")).toBe(5);
  });

  it("should cap at MAX_REP_SET_VALUE", () => {
    expect(toValidNumberOfRepsOrEmpty("50")).toBe(30); // MAX_REP_SET_VALUE is 30
  });
});
