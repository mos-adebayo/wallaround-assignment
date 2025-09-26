import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { GroupEditor } from "../GroupEditor";
import { mockFields } from "../../mocks/fields";
import {
  mockOperators,
  mockGroup,
  mockORGroup,
  mockRuleGroup,
  mockRuleMultiGroup,
} from "../../mocks/rule";

describe("GroupEditor", () => {
  const mockOnChange = vi.fn();
  const mockOnRemove = vi.fn();

  it("renders with AND group and single rule", () => {
    const { getByRole, queryByRole } = render(
      <GroupEditor
        fields={mockFields}
        operators={mockOperators}
        node={mockGroup}
        onChange={mockOnChange}
      />,
    );
    expect(getByRole("button", { name: "Add Rule" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Add Group" })).toBeInTheDocument();
    expect(queryByRole("button", { name: "Remove Group" })).toBeNull();
  });

  it("renders with OR group and single rule", () => {
    const { getByRole, queryByRole } = render(
      <GroupEditor
        fields={mockFields}
        operators={mockOperators}
        node={mockORGroup}
        onChange={mockOnChange}
      />,
    );

    expect(getByRole("button", { name: "Add Rule" })).toBeInTheDocument();
    expect(getByRole("button", { name: "Add Group" })).toBeInTheDocument();
    expect(queryByRole("button", { name: "Remove Group" })).toBeNull();
  });

  it("renders remove group button", () => {
    const { getByRole } = render(
      <GroupEditor
        fields={mockFields}
        operators={mockOperators}
        node={mockORGroup}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );

    fireEvent.click(getByRole("button", { name: "Remove group" }));
    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  it("hides group condition option when rules is less or equal to 1", () => {
    const { queryByText } = render(
      <GroupEditor
        fields={mockFields}
        operators={mockOperators}
        node={mockORGroup}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );

    expect(queryByText("CONDITION:")).toBeNull();
  });

  it("shows group condition option rule list is greater than 1", () => {
    const { getByText, getByRole } = render(
      <GroupEditor
        fields={mockFields}
        operators={mockOperators}
        node={mockRuleGroup}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );

    expect(getByRole("button", { name: "OR" })).toBeInTheDocument();
    expect(getByRole("button", { name: "AND" })).toBeInTheDocument();
    expect(getByText("CONDITION:")).toBeInTheDocument();
  });

  it("renders multi group condition with multiple rules", () => {
    const { getAllByText, getAllByRole } = render(
      <GroupEditor
        fields={mockFields}
        operators={mockOperators}
        node={mockRuleMultiGroup}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );

    expect(getAllByRole("button", { name: "OR" })).toHaveLength(2);
    expect(getAllByRole("button", { name: "AND" })).toHaveLength(2);
    expect(getAllByText("CONDITION:")).toHaveLength(2);
  });

  it("calls onChange when group condition is changed", () => {
    const { getByRole } = render(
      <GroupEditor
        fields={mockFields}
        operators={mockOperators}
        node={mockRuleGroup}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );

    fireEvent.click(getByRole("button", { name: "OR" }));
    expect(mockOnChange).toHaveBeenCalledWith({
      or: [
        {
          field: "name",
          operator: "eq",
        },
        {
          field: "age",
          operator: "eq",
        },
        {
          field: "active",
          operator: "is not null",
        },
      ],
    });
  });

  it("calls onChange when rule is updated", () => {
    const { getAllByPlaceholderText } = render(
      <GroupEditor
        fields={mockFields}
        operators={mockOperators}
        node={mockRuleGroup}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );

    const fieldInputs = getAllByPlaceholderText("Select field");
    expect(fieldInputs).toHaveLength(3);

    fireEvent.change(fieldInputs[0], {
      target: { value: "amount" },
    });
    fireEvent.keyDown(fieldInputs[0], { key: "ArrowDown" });
    fireEvent.keyDown(fieldInputs[0], { key: "Enter" });

    expect(mockOnChange).toHaveBeenCalledWith({
      and: [
        {
          field: "amount",
          operator: "gt",
        },
        {
          field: "age",
          operator: "eq",
        },
        {
          field: "active",
          operator: "is not null",
        },
      ],
    });

    const valueInputs = getAllByPlaceholderText(
      "Separate multiple values with comma",
    );
    expect(valueInputs).toHaveLength(3);
    fireEvent.change(valueInputs[0], {
      target: { value: "test value" },
    });

    expect(mockOnChange).toHaveBeenCalledWith({
      and: [
        {
          field: "name",
          operator: "eq",
          value: "test value",
        },
        {
          field: "age",
          operator: "eq",
        },
        {
          field: "active",
          operator: "is not null",
        },
      ],
    });
  });

  it("calls onChange when rule is removed", () => {
    const { getAllByRole } = render(
      <GroupEditor
        fields={mockFields}
        operators={mockOperators}
        node={mockRuleGroup}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );

    const removeRuleButtons = getAllByRole("button", { name: "X Remove" });
    expect(removeRuleButtons).toHaveLength(3);

    fireEvent.click(removeRuleButtons[0]);

    expect(mockOnChange).toHaveBeenCalledWith({
      and: [
        {
          field: "age",
          operator: "eq",
        },
        {
          field: "active",
          operator: "is not null",
        },
      ],
    });
  });

  it("calls onRemove when remove group button is clicked", () => {
    const { getAllByRole } = render(
      <GroupEditor
        fields={mockFields}
        operators={mockOperators}
        node={mockRuleMultiGroup}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );

    const removeButtons = getAllByRole("button", { name: "Remove group" });
    expect(removeButtons).toHaveLength(2);

    fireEvent.click(removeButtons[0]);

    expect(mockOnRemove).toHaveBeenCalledTimes(1);
  });

  it("adds a new rule when Add Rule is clicked", () => {
    const { getByRole } = render(
      <GroupEditor
        fields={mockFields}
        operators={mockOperators}
        node={mockRuleGroup}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );
    fireEvent.click(getByRole("button", { name: "Add Rule" }));

    expect(mockOnChange).toHaveBeenCalledWith({
      and: [
        {
          field: "name",
          operator: "eq",
        },
        {
          field: "age",
          operator: "eq",
        },
        {
          field: "active",
          operator: "is not null",
        },
        {
          field: "name",
          operator: "eq",
        },
      ],
    });
  });

  it("adds a new AND group when Add Group is clicked", () => {
    const { getByRole } = render(
      <GroupEditor
        fields={mockFields}
        operators={mockOperators}
        node={mockRuleGroup}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );
    fireEvent.click(getByRole("button", { name: "Add Group" }));

    expect(mockOnChange).toHaveBeenCalledWith({
      and: [
        {
          field: "name",
          operator: "eq",
        },
        {
          field: "age",
          operator: "eq",
        },
        {
          field: "active",
          operator: "is not null",
        },
        {
          and: [
            {
              field: "name",
              operator: "eq",
            },
          ],
        },
      ],
    });
  });

  it("adds a new OR group when Add Group is clicked", () => {
    const { getByRole } = render(
      <GroupEditor
        fields={mockFields}
        operators={mockOperators}
        node={mockORGroup}
        onChange={mockOnChange}
        onRemove={mockOnRemove}
      />,
    );
    fireEvent.click(getByRole("button", { name: "Add Group" }));

    expect(mockOnChange).toHaveBeenCalledWith({
      or: [
        {
          field: "name",
          operator: "eq",
        },
        {
          or: [
            {
              field: "name",
              operator: "eq",
            },
          ],
        },
      ],
    });
  });

  it("handles empty ruleList gracefully", () => {
    const emptyGroup = { and: [] };
    const { getByText } = render(
      <GroupEditor
        fields={mockFields}
        operators={mockOperators}
        node={emptyGroup}
        onChange={mockOnChange}
      />,
    );
    expect(getByText("Add Rule")).toBeTruthy();
    expect(getByText("Add Group")).toBeTruthy();
  });
});
