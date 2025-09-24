import type { Group, Rule, Condition } from "../types";

export function serializeToQueryString(json: Group) {
  // simple compact encoding: base64 of JSON
  const str = JSON.stringify(json);
  try {
    return `filter=${encodeURIComponent(btoa(unescape(encodeURIComponent(str))))}`;
  } catch (e) {
    // fallback
    return `filter=${encodeURIComponent(str)}`;
  }
}

export function deserializeFromQueryString(qs: string): Group | null {
  const m = qs.match(/filter=([^&]+)/);
  if (!m) return null;
  try {
    const decoded = decodeURIComponent(m[1]);
    const jsonStr = atob(decoded);
    return JSON.parse(decodeURIComponent(escape(jsonStr)));
  } catch (e) {
    try {
      const decoded = decodeURIComponent(m[1]);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }
}

export function emptyGroup(type: Condition = "and"): Group {
  return type === "and" ? { and: [] } : { or: [] };
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
