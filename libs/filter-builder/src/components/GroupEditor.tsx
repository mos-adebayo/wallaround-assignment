import React from "react";
import type { Condition, Field, Group, Rule } from "../types";
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
  const rootKey = Object.keys(node)[0] as Condition;
  const ruleList: Array<Rule | Group> = "or" in node ? node.or : node.and;

  function updateChild(i: number, child: Group | Rule) {
    const newList = [...ruleList];
    newList[i] = child;

    if ("and" in node) {
      onChange({ and: newList });
    } else {
      onChange({ or: newList });
    }
  }
  function addCondition() {
    const newRule: Rule = {
      field: fields[0].name,
      operator: operators[fields[0].type][0],
      value: undefined,
    };

    if ("and" in node) {
      onChange({ and: [...node.and, newRule] });
    } else {
      onChange({ or: [...node.or, newRule] });
    }
  }
  function addGroup() {
    const newGroup = emptyGroup("and");
    if ("and" in node) {
      onChange({ and: [...node.and, newGroup] });
    } else {
      onChange({ or: [...node.or, newGroup] });
    }
  }
  function removeAt(i: number) {
    if ("and" in node) {
      const newList = [...node.and];
      newList.splice(i, 1);
      onChange({ and: newList });
    } else {
      const newList = [...node.or];
      newList.splice(i, 1);
      onChange({ or: newList });
    }
  }

  function changeGroupType(newType: "and" | "or") {
    if (newType === rootKey) return;

    if (newType === "and") {
      onChange({ and: ruleList });
    } else if (newType === "or") {
      onChange({ or: ruleList });
    }
  }

  return (
    <fieldset
      className="border rounded-lg p-4 my-4 bg-gray-50"
      aria-label={`group-${rootKey}`}
    >
      <legend className="font-semibold flex items-center gap-2">
        <select
          value={rootKey}
          onChange={(e) => changeGroupType(e.target.value as "and" | "or")}
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
        {ruleList.map((ruleGroup, i) => (
          <div key={i}>
            {"field" in ruleGroup ? (
              <ConditionRow
                fields={fields}
                operators={operators}
                value={ruleGroup}
                onChange={(cond) => updateChild(i, cond)}
                onRemove={() => removeAt(i)}
              />
            ) : (
              <GroupEditor
                fields={fields}
                operators={operators}
                node={ruleGroup}
                onChange={(g) => updateChild(i, g)}
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
