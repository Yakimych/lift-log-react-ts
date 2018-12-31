import { toValidSet } from "./liftUtils";

it("toValidSet should parse RPE value correctly", () => {
  const set = toValidSet("8@9.5");

  expect(set).toEqual({ reps: 8, rpe: 9.5 });
});
