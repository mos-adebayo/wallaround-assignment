import React from "react";
import type { Field, Condition } from "../types";

type Props = {
  fields: Field[];
  operators: Record<string, string[]>;
  value: Condition;
  onChange: (c: Condition) => void;
  onRemove: () => void;
};

export const ConditionRow: React.FC<Props> = ({
  fields,
  operators,
  value,
  onChange,
  onRemove,
}) => {
  const field = fields.find((f) => f.name === value.field) || fields[0];
  const ops = field ? operators[field.type] || [] : [];

  React.useEffect(() => {
    if (!value.field && fields[0])
      onChange({ ...value, field: fields[0].name });
  }, []);

  function setField(name: string) {
    const f = fields.find((ff) => ff.name === name)!;
    onChange({
      field: name,
      operator: (operators[f.type] && operators[f.type][0]) || "eq",
      value: undefined,
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-white shadow rounded-lg">
      <select
        aria-label="field"
        value={value.field}
        onChange={(e) => setField(e.target.value)}
        className="border rounded px-2 py-1"
      >
        {fields.map((f) => (
          <option key={f.name} value={f.name}>
            {f.label}
          </option>
        ))}
      </select>

      <select
        aria-label="operator"
        value={value.operator}
        onChange={(e) =>
          onChange({ ...value, operator: e.target.value, value: undefined })
        }
        className="border rounded px-2 py-1"
      >
        {ops.map((op) => (
          <option key={op} value={op}>
            {op}
          </option>
        ))}
      </select>

      <input
        aria-label="value"
        type="text"
        value={value.value ?? ""}
        onChange={(e) => onChange({ ...value, value: e.target.value })}
        className="border rounded px-2 py-1 flex-1"
      />

      <button
        aria-label="remove-condition"
        onClick={onRemove}
        className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
      >
        ✕
      </button>
    </div>
  );
};

export default ConditionRow;
