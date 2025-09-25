import { Group, Rule, Condition, Field, OperatorConfig } from "../types";

function base64Encode(str: string) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function serializeToQueryString(json: Group) {
  const str = JSON.stringify(json);
  return `filter=${encodeURIComponent(base64Encode(str))}`;
}

function base64Decode(b64: string) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function deserializeFromQueryString(qs: string): Group | null {
  const params = new URLSearchParams(qs);
  const filter = params.get("filter");
  if (!filter) return null;

  return JSON.parse(base64Decode(decodeURIComponent(filter)));
}

export function initialGroupData(
  fields: Field[],
  operators: OperatorConfig,
  type: Condition = "and",
): Group {
  const initialField = fields[0];
  const initialOperator = operators[initialField.type][0] || "";

  const initialRule = initialField
    ? [{ field: initialField.name, operator: initialOperator }]
    : [];
  return type === "and" ? { and: initialRule } : { or: initialRule };
}

// validation helper
export function validateRule(cond: Rule): boolean {
  if (!cond.field || !cond.operator) return false;
  if (cond.operator === "between") {
    const values = cond.value?.split(",");
    return Array.isArray(values) && values.length === 2;
  }
  if (cond.operator === "in") {
    const values = cond.value?.split(",");
    return Array.isArray(values) && values.length >= 1;
  }
  if (cond.operator === "is null" || cond.operator === "is not null") {
    return cond.value === undefined || cond.value === null;
  }
  return cond.value !== undefined && cond.value !== null && cond.value !== "";
}
