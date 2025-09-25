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
  return `${encodeURIComponent(base64Encode(str))}`;
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
  if (!qs) return null;

  return JSON.parse(base64Decode(decodeURIComponent(qs)));
}

export function initialGroupData(
  fields: Field[],
  operators: OperatorConfig,
  type: Condition = "and",
): Group {
  const initialField = fields[0];
  const initialOperator = operators[initialField?.type]?.[0] || "eq";

  const initialRule = initialField
    ? [{ field: initialField.value, operator: initialOperator }]
    : [];
  return type === "and" ? { and: initialRule } : { or: initialRule };
}
