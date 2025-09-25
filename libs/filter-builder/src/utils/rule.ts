import { Rule } from "../types";

export function validateRule(cond: Rule): boolean {
  if (cond.operator === "between") {
    const values = cond.value?.split(",");
    return Array.isArray(values) && values.length === 2;
  }
  if (cond.operator === "in") {
    if (!cond.value?.trim()) {
      return false;
    }
    const values = cond.value?.split(",");
    return Array.isArray(values) && values.length >= 1;
  }

  if (cond.operator === "is null" || cond.operator === "is not null") {
    return cond.value === undefined || cond.value === null;
  }

  return cond.value !== undefined && cond.value !== null && cond.value !== "";
}
