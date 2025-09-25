import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import ConditionRow from "../ConditionRow";
import { mockFields } from "../../mocks/fields";
import { mockOperators, mockRule } from "../../mocks/rule";

describe("ConditionRow", () => {
  const mockOnChange = vi.fn();
  const mockOnRemove = vi.fn();

  beforeEach(() => {
    render(
      <ConditionRow
        fields={mockFields}
        operators={mockOperators}
        value={mockRule}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );
  });

  it("renders rule inputs with default value", () => {
    expect(screen.getByPlaceholderText("Select field")).toHaveValue("Name");
    expect(screen.getByPlaceholderText("Select operator")).toHaveValue("eq");
    expect(
      screen.getByPlaceholderText("Separate multiple values with comma"),
    ).toHaveValue("test");
  });

  it("calls onChange when field is changed", () => {
    const fieldSelect = screen.getByPlaceholderText("Select field");
    fireEvent.change(fieldSelect, {
      target: { value: "amount" },
    });
    fireEvent.keyDown(fieldSelect, { key: "ArrowDown" });
    fireEvent.keyDown(fieldSelect, { key: "Enter" });

    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith({
      field: "amount",
      operator: "gt",
      value: undefined,
    });
  });

  it("calls onChange when operator is changed", () => {
    const fieldSelect = screen.getByPlaceholderText("Select operator");
    fireEvent.change(fieldSelect, {
      target: { value: "gt" },
    });
    fireEvent.keyDown(fieldSelect, { key: "ArrowDown" });
    fireEvent.keyDown(fieldSelect, { key: "Enter" });

    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith({
      field: "name",
      operator: "contains",
      value: undefined,
    });
  });

  it("calls onChange when value is changed", () => {
    const valueField = screen.getByPlaceholderText(
      "Separate multiple values with comma",
    );
    fireEvent.change(valueField, {
      target: { value: "test value" },
    });

    expect(mockOnChange).toHaveBeenCalledWith({
      ...mockRule,
      value: "test value",
    });
  });

  it("calls onRemove when remove button is clicked", () => {
    fireEvent.click(screen.getByText("Remove"));
    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  it("handles field type appropriately", async () => {
    const fieldSelect = screen.getByPlaceholderText("Select field");
    fireEvent.change(fieldSelect, {
      target: { value: "amount" },
    });
    fireEvent.keyDown(fieldSelect, { key: "ArrowDown" });
    fireEvent.keyDown(fieldSelect, { key: "ArrowDown" });
    fireEvent.keyDown(fieldSelect, { key: "Enter" });

    expect(mockOnChange).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith({
      field: "country",
      operator: "eq",
      value: undefined,
    });
  });
});
