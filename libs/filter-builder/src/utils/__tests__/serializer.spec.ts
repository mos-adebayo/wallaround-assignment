import { describe, it, expect } from "vitest";
import {
  deserializeFromQueryString,
  initialGroupData,
  serializeToQueryString,
} from "../serializer";
import { Field } from "../../types";

describe("serialization Util", () => {
  describe("serializeToQueryString", () => {
    it("returns a valid query string for a given group object", () => {
      const group = { and: [{ field: "name", operator: "eq", value: "John" }] };
      const result = serializeToQueryString(group);

      expect(result).toBe(
        "eyJhbmQiOlt7ImZpZWxkIjoibmFtZSIsIm9wZXJhdG9yIjoiZXEiLCJ2YWx1ZSI6IkpvaG4ifV19",
      );
    });

    it("handles an empty group object", () => {
      const group = { and: [] };
      const result = serializeToQueryString(group);
      expect(result).toBe("eyJhbmQiOltdfQ%3D%3D");
    });
  });

  describe("deSerializeToObject", () => {
    it("returns valid object of a serialized string", () => {
      const result = deserializeFromQueryString(
        "eyJhbmQiOlt7ImZpZWxkIjoibmFtZSIsIm9wZXJhdG9yIjoiZXEiLCJ2YWx1ZSI6IkpvaG4ifV19",
      );
      expect(result).toEqual({
        and: [{ field: "name", operator: "eq", value: "John" }],
      });
    });

    it("returns valid object of a serialized string for empty rule", () => {
      const result = deserializeFromQueryString("eyJhbmQiOltdfQ%3D%3D");
      expect(result).toEqual({ and: [] });
    });

    it("returns null for empty string", () => {
      const result = deserializeFromQueryString("");
      expect(result).toBeNull();
    });
  });

  describe("initial group data", () => {
    const fields: Field[] = [
      {
        value: "name",
        label: "Name",
        type: "text",
      },
    ];
    const operators = {
      text: ["in"],
    };

    it("returns valid initial group data", () => {
      const result = initialGroupData(fields, operators);
      expect(result).toEqual({
        and: [{ field: "name", operator: "in" }],
      });
    });

    it("sets appropriate default operator", () => {
      const result = initialGroupData(fields, {});
      expect(result).toEqual({
        and: [{ field: "name", operator: "eq" }],
      });
    });
  });
});
