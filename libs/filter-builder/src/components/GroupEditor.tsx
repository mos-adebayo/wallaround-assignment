import React from "react";
import type { Field, Group, Condition } from "../types";
import { ConditionRow } from "./ConditionRow";
import { emptyGroup } from "../utils/serializer";

type Props = {
  fields: Field[];
  operators: Record<string, string[]>;
  node: Group;
  onChange: (g: Group) => void;
  onRemove?: () => void;
};

export const GroupEditor: React.FC<Props> = ({
  fields,
  operators,
  node,
  onChange,
  onRemove,
}) => {
  function updateChild(i: number, child: Group | Condition) {
    const copy = { ...node, children: [...node.children] };
    copy.children[i] = child;
    onChange(copy);
  }
  function addCondition() {
    const cond: Condition = {
      field: fields[0].name,
      operator: operators[fields[0].type][0],
      value: undefined,
    };
    onChange({ ...node, children: [...node.children, cond] });
  }
  function addGroup() {
    onChange({ ...node, children: [...node.children, emptyGroup("and")] });
  }
  function removeAt(i: number) {
    const copy = { ...node, children: [...node.children] };
    copy.children.splice(i, 1);
    onChange(copy);
  }

  return (
    <fieldset
      className="border rounded-lg p-4 my-4 bg-gray-50"
      aria-label={`group-${node.type}`}
    >
      <legend className="font-semibold flex items-center gap-2">
        <select
          value={node.type}
          onChange={(e) =>
            onChange({ ...node, type: e.target.value as "and" | "or" })
          }
          aria-label="group-type"
          className="border rounded px-2 py-1"
        >
          <option value="and">AND</option>
          <option value="or">OR</option>
        </select>
        {onRemove && (
          <button
            aria-label="remove-group"
            onClick={onRemove}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Remove group
          </button>
        )}
      </legend>

      <div className="space-y-2 mt-2">
        {node.children.map((c, i) => (
          <div key={i}>
            {"children" in c ? (
              <GroupEditor
                fields={fields}
                operators={operators}
                node={c}
                onChange={(g) => updateChild(i, g)}
                onRemove={() => removeAt(i)}
              />
            ) : (
              <ConditionRow
                fields={fields}
                operators={operators}
                value={c}
                onChange={(cond) => updateChild(i, cond)}
                onRemove={() => removeAt(i)}
              />
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button
          onClick={addCondition}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + Condition
        </button>
        <button
          onClick={addGroup}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          + Group
        </button>
      </div>
    </fieldset>
  );
};

export default GroupEditor;
