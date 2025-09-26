import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import ConditionRow from "../ConditionRow";
import { mockFields } from "../../mocks/fields";
import { mockOperators, mockRule } from "../../mocks/rule";

describe("ConditionRow", () => {
  const mockOnChange = vi.fn();
  const mockOnRemove = vi.fn();

  it("renders rule inputs with default value", () => {
    render(
      <ConditionRow
        fields={mockFields}
        operators={mockOperators}
        value={mockRule}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );

    expect(screen.getByPlaceholderText("Select field")).toHaveValue("Name");
    expect(screen.getByPlaceholderText("Select operator")).toHaveValue("eq");
    expect(
      screen.getByPlaceholderText("Separate multiple values with comma"),
    ).toHaveValue("test");
  });

  it("set operator to default fallback value", () => {
    render(
      <ConditionRow
        fields={mockFields}
        operators={{ text: ["eq", "neq"] }}
        value={mockRule}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );

    const fieldSelect = screen.getByPlaceholderText("Select field");
    fireEvent.change(fieldSelect, {
      target: { value: "amount" },
    });
    fireEvent.keyDown(fieldSelect, { key: "ArrowDown" });
    fireEvent.keyDown(fieldSelect, { key: "Enter" });

    expect(mockOnChange).toHaveBeenCalledWith({
      field: "amount",
      operator: "eq",
      value: undefined,
    });
  });

  it("calls onChange when field is changed", () => {
    render(
      <ConditionRow
        fields={mockFields}
        operators={mockOperators}
        value={mockRule}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );

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
    render(
      <ConditionRow
        fields={mockFields}
        operators={mockOperators}
        value={mockRule}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );

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
    render(
      <ConditionRow
        fields={mockFields}
        operators={mockOperators}
        value={mockRule}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );

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
    render(
      <ConditionRow
        fields={mockFields}
        operators={mockOperators}
        value={mockRule}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );

    fireEvent.click(screen.getByText("Remove"));
    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  it("handles field type appropriately", async () => {
    render(
      <ConditionRow
        fields={mockFields}
        operators={mockOperators}
        value={mockRule}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );

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

  it("handles field with select type appropriately", async () => {
    render(
      <ConditionRow
        fields={[{ ...mockFields[2] }]}
        operators={mockOperators}
        value={{ field: "country", operator: "eq", value: "nigeria" }}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );

    const fieldSelect = screen.getByPlaceholderText("Select Option");
    fireEvent.change(fieldSelect, {
      target: { value: "germany" },
    });
    fireEvent.keyDown(fieldSelect, { key: "ArrowDown" });
    fireEvent.keyDown(fieldSelect, { key: "Enter" });

    expect(mockOnChange).toHaveBeenCalled();

    expect(mockOnChange).toHaveBeenCalledWith({
      field: "country",
      operator: "eq",
      value: "germany",
    });
  });
});
