import { describe, it, expect } from "vitest";
import { validateRule } from "../rule";

describe("rule validation", () => {
  describe("BETWEEN validation", () => {
    it("validate valid values", () => {
      const result = validateRule({
        field: "name",
        operator: "between",
        value: "first,second",
      });
      expect(result).toBeTruthy();
    });

    it("validate invalid values", () => {
      expect(
        validateRule({
          field: "name",
          operator: "between",
          value: "first,second,third",
        }),
      ).toBeFalsy();

      expect(validateRule({ field: "name", operator: "between" })).toBeFalsy();

      expect(
        validateRule({
          field: "name",
          operator: "between",
          value: "first,second,third",
        }),
      ).toBeFalsy();
    });
  });

  describe("IN validation", () => {
    const operator = "in";

    it("validate valid values", () => {
      expect(
        validateRule({
          field: "name",
          operator,
          value: "first,second",
        }),
      ).toBeTruthy();

      expect(
        validateRule({
          field: "name",
          operator,
          value: "first",
        }),
      ).toBeTruthy();

      expect(
        validateRule({
          field: "name",
          operator,
          value: "first,second,third",
        }),
      ).toBeTruthy();
    });

    it("validate invalid values", () => {
      expect(
        validateRule({
          field: "name",
          operator: "in",
        }),
      ).toBeFalsy();

      expect(
        validateRule({
          field: "name",
          operator,
          value: "",
        }),
      ).toBeFalsy();
    });
  });

  describe("IS NULL validation", () => {
    const operator = "is null";

    it("validate valid values", () => {
      expect(
        validateRule({
          field: "name",
          operator,
        }),
      ).toBeTruthy();

      expect(
        validateRule({
          field: "name",
          operator,
          value: null,
        }),
      ).toBeTruthy();
    });

    it("validate invalid values", () => {
      expect(
        validateRule({
          field: "name",
          operator,
          value: "null",
        }),
      ).toBeFalsy();

      expect(
        validateRule({
          field: "name",
          operator,
          value: "",
        }),
      ).toBeFalsy();
    });
  });

  describe("IS NOT NULL validation", () => {
    const operator = "is not null";

    it("validate valid values", () => {
      expect(
        validateRule({
          field: "name",
          operator,
        }),
      ).toBeTruthy();
    });

    it("validate invalid values", () => {
      expect(
        validateRule({
          field: "name",
          operator,
          value: "null",
        }),
      ).toBeFalsy();

      expect(
        validateRule({
          field: "name",
          operator,
          value: "",
        }),
      ).toBeFalsy();

      expect(
        validateRule({
          field: "name",
          operator,
          value: null,
        }),
      ).toBeTruthy();
    });
  });
});
