import { Group } from "../types";

export const mockGroup: Group = {
  and: [
    {
      field: "name",
      operator: "eq",
    },
  ],
};

export const mockRuleGroup: Group = {
  and: [
    {
      field: "name",
      operator: "eq",
    },
    {
      or: [
        {
          field: "age",
          operator: "eq",
        },
        {
          field: "active",
          operator: "is not null",
        },
      ],
    },
  ],
};

export const mockRule = { field: "name", operator: "eq", value: "test" };

export const mockOperators = {
  select: ["eq", "ne"],
  number: ["gt", "lt"],
  text: ["contains", "eq"],
};
