import { validateTask } from "./validateTask";

describe("validateTask", () => {
  it("returns false for an empty text", () => {
    expect(validateTask("")).toBe(false);
  });

  it("returns false for a text shorter than 3 characters", () => {
    expect(validateTask("ab")).toBe(false);
  });

  it("returns true for a valid text", () => {
    expect(validateTask("Buy milk")).toBe(true);
  });
});