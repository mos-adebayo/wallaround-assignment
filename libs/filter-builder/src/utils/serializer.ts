import type { Group, Condition, FilterJSON} from "../../types";

export function serializeToQueryString(json: FilterJSON) {
  // simple compact encoding: base64 of JSON
  const str = JSON.stringify(json);
  try {
    return `filter=${encodeURIComponent(btoa(unescape(encodeURIComponent(str))))}`;
  } catch (e) {
    // fallback
    return `filter=${encodeURIComponent(str)}`;
  }
}

export function deserializeFromQueryString(qs: string): FilterJSON | null {
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

export function emptyGroup(type: "and" | "or" = "and"): Group {
  return { type, children: [] };
}

// validation helper
export function validateCondition(cond: Condition): boolean {
  if (!cond.field || !cond.operator) return false;
  if (cond.operator === "between") {
    return Array.isArray(cond.value) && cond.value.length === 2;
  }
  if (cond.operator === "in") {
    return Array.isArray(cond.value) && cond.value.length >= 1;
  }
  if (cond.operator === "is null" || cond.operator === "is not null") {
    return cond.value === undefined || cond.value === null;
  }
  return cond.value !== undefined && cond.value !== null && cond.value !== "";
}
