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

    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  // it("calls onChange when rule is removed", () => {
  //   const { getByText } = render(
  //     <GroupEditor
  //       fields={mockFields}
  //       operators={mockOperators}
  //       node={initialGroup}
  //       onChange={mockOnChange}
  //     />,
  //   );
  //   fireEvent.click(getByText("Remove"));
  //   expect(onChange).toHaveBeenCalledWith({ and: [] });
  // });
  //
  // it("calls onRemove when remove group button is clicked", () => {
  //   const { getByText } = render(
  //     <GroupEditor
  //       fields={mockFields}
  //       operators={mockOperators}
  //       node={initialGroup}
  //       onChange={mockOnChange}
  //       onRemove={onRemove}
  //     />,
  //   );
  //   fireEvent.click(getByText("Remove group"));
  //   expect(onRemove).toHaveBeenCalled();
  // });
  //
  // it("adds a new rule when Add Rule is clicked", () => {
  //   const { getByText } = render(
  //     <GroupEditor
  //       fields={mockFields}
  //       operators={mockOperators}
  //       node={initialGroup}
  //       onChange={mockOnChange}
  //     />,
  //   );
  //   fireEvent.click(getByText("Add Rule"));
  //   expect(onChange).toHaveBeenCalledWith({
  //     and: [initialGroup.and[0], expect.objectContaining({ field: "status" })],
  //   });
  // });
  //
  // it("adds a new group when Add Group is clicked", () => {
  //   const { getByText } = render(
  //     <GroupEditor
  //       fields={mockFields}
  //       operators={mockOperators}
  //       node={initialGroup}
  //       onChange={mockOnChange}
  //     />,
  //   );
  //   fireEvent.click(getByText("Add Group"));
  //   expect(onChange.mock.calls[0][0].and.length).toBe(2);
  //   expect(typeof onChange.mock.calls[0][0].and[1]).toBe("object");
  //   expect("and" in onChange.mock.calls[0][0].and[1]).toBe(true);
  // });
  //
  // it("removes a rule from OR group", () => {
  //   const { getAllByText } = render(
  //     <GroupEditor
  //       fields={mockFields}
  //       operators={mockOperators}
  //       node={mockGroup}
  //       onChange={mockOnChange}
  //     />,
  //   );
  //   fireEvent.click(getAllByText("Remove")[1]);
  //   expect(onChange).toHaveBeenCalledWith({ or: [mockGroup.or[0]] });
  // });
  //
  // it("handles empty ruleList gracefully", () => {
  //   const emptyGroup = { and: [] };
  //   const { getByText } = render(
  //     <GroupEditor
  //       fields={mockFields}
  //       operators={mockOperators}
  //       node={emptyGroup}
  //       onChange={mockOnChange}
  //     />,
  //   );
  //   expect(getByText("Add Rule")).toBeTruthy();
  //   expect(getByText("Add Group")).toBeTruthy();
  // });
});
