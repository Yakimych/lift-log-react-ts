import { toValidPositiveInteger, toValidPositiveIntegerOrEmpty } from "./numberUtils";

describe("toValidPositiveInteger", () => {
  it("should handle empty string by returning 1", () => {
    expect(toValidPositiveInteger("")).toBe(1);
  });

  it("should handle whitespace by returning 1", () => {
    expect(toValidPositiveInteger("   ")).toBe(1);
  });

  it("should handle zero by returning 1", () => {
    expect(toValidPositiveInteger("0")).toBe(1);
  });

  it("should handle valid positive number", () => {
    expect(toValidPositiveInteger("5")).toBe(5);
  });

  it("should handle invalid characters by returning 1", () => {
    expect(toValidPositiveInteger("abc")).toBe(1);
  });

  it("should extract valid number from mixed input", () => {
    expect(toValidPositiveInteger("5abc")).toBe(5);
  });
});

describe("toValidPositiveIntegerOrEmpty", () => {
  it("should handle empty string by returning null", () => {
    expect(toValidPositiveIntegerOrEmpty("")).toBe(null);
  });

  it("should handle whitespace by returning null", () => {
    expect(toValidPositiveIntegerOrEmpty("   ")).toBe(null);
  });

  it("should handle zero by returning 1", () => {
    expect(toValidPositiveIntegerOrEmpty("0")).toBe(1);
  });

  it("should handle valid positive number", () => {
    expect(toValidPositiveIntegerOrEmpty("5")).toBe(5);
  });

  it("should handle invalid characters by returning 1", () => {
    expect(toValidPositiveIntegerOrEmpty("abc")).toBe(1);
  });

  it("should extract valid number from mixed input", () => {
    expect(toValidPositiveIntegerOrEmpty("5abc")).toBe(5);
  });
});