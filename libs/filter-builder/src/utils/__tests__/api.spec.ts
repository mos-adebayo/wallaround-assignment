import { getAction, postAction } from "../api";
import { vi, describe, it, expect, beforeAll } from "vitest";
import { mockGroup, mockRuleGroup } from "../../mocks/rule";
import * as serializer from "../serializer";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch as unknown as typeof fetch;

describe("postAction", () => {
  it("returns JSON response on success", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    const result = await postAction("/api", mockRuleGroup);
    expect(result).toEqual({ success: true });
    expect(fetch).toHaveBeenCalledWith(
      "/api",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("returns undefined on failed response", async () => {
    mockFetch.mockResolvedValue({ ok: false });
    const result = await postAction("/api", mockRuleGroup);
    expect(result).toBeUndefined();
  });
});

describe("getAction", () => {
  beforeAll(() => {
    vi.spyOn(serializer, "serializeToQueryString").mockReturnValue(
      "mockquerystring",
    );
  });

  it("returns JSON response on success", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ data: "value" }),
    });
    const result = await getAction("/api", mockGroup);

    expect(result).toEqual({ data: "value" });
    expect(mockFetch).toHaveBeenCalledWith(
      "/api?mockquerystring",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("returns undefined on failed response", async () => {
    mockFetch.mockResolvedValue({ ok: false });
    const result = await getAction("/api", mockGroup);
    expect(result).toBeUndefined();
  });

  it("handles empty query string", async () => {
    vi.stubGlobal("serializeToQueryString", vi.fn().mockReturnValue(""));
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({}) });
    await getAction("/api", mockGroup);
    expect(mockFetch).toHaveBeenCalledWith(
      "/api?mockquerystring",
      expect.any(Object),
    );
  });
});
