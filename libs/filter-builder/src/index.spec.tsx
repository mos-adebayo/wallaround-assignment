import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import { FilterBuilder } from "./index";
import { mockFields } from "./mocks/fields";
import {
  mockGroup,
  mockOperators,
  mockORGroup,
  mockRuleGroup,
  mockValidatedRuleGroup,
} from "./mocks/rule";
import * as serializer from "./utils/serializer";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch as unknown as typeof fetch;

describe("FilterBuilder", () => {
  beforeAll(() => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    vi.spyOn(serializer, "serializeToQueryString").mockReturnValue(
      "mockquerystring",
    );
  });

  it("renders default group rule value", () => {
    render(
      <FilterBuilder
        schema={mockFields}
        operators={mockOperators}
        api={{ mode: "GET", endpoint: "/api" }}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByText("Invalid")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  it("renders with invalid initial group and disabled submit button", () => {
    render(
      <FilterBuilder
        schema={mockFields}
        operators={mockOperators}
        initial={mockRuleGroup}
        api={{ mode: "GET", endpoint: "/api" }}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByText("Invalid")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  it("renders with validated initial group and enabled submit button", () => {
    render(
      <FilterBuilder
        schema={mockFields}
        operators={mockOperators}
        initial={mockValidatedRuleGroup}
        api={{ mode: "GET", endpoint: "/api" }}
        onSubmit={vi.fn()}
      />,
    );
    expect(screen.getByText("Valid")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).not.toBeDisabled();
  });

  it("calls onSubmit with correct arguments for GET mode", () => {
    const onSubmit = vi.fn();
    render(
      <FilterBuilder
        schema={mockFields}
        operators={mockOperators}
        initial={mockORGroup}
        api={{ mode: "GET", endpoint: "/api" }}
        onSubmit={onSubmit}
      />,
    );

    const valueField = screen.getByPlaceholderText(
      "Separate multiple values with comma",
    );
    fireEvent.change(valueField, {
      target: { value: "test value" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(onSubmit).toHaveBeenCalledWith(
      {
        or: [
          {
            field: "name",
            operator: "eq",
            value: "test value",
          },
        ],
      },
      "mockquerystring",
    );
  });

  it("calls onSubmit with correct arguments for POST mode", () => {
    const onSubmit = vi.fn();
    render(
      <FilterBuilder
        schema={mockFields}
        operators={mockOperators}
        initial={mockGroup}
        api={{ mode: "POST", endpoint: "/api" }}
        onSubmit={onSubmit}
      />,
    );

    const valueField = screen.getByPlaceholderText(
      "Separate multiple values with comma",
    );
    fireEvent.change(valueField, {
      target: { value: "test" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(onSubmit).toHaveBeenCalledWith(
      {
        and: [
          {
            field: "name",
            operator: "eq",
            value: "test",
          },
        ],
      },
      undefined,
    );
  });
});
