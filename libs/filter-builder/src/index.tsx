import React from "react";
import type { FilterBuilderProps, FilterJSON } from "./types";
import { GroupEditor } from "./components/GroupEditor";
import {
  emptyGroup,
  validateCondition,
  serializeToQueryString,
} from "./utils/serializer";

export const FilterBuilder: React.FC<FilterBuilderProps> = ({
  schema,
  operators,
  initial,
  api,
  onChange,
}) => {
  const [root, setRoot] = React.useState<FilterJSON>(
    initial ?? emptyGroup("and"),
  );

  React.useEffect(() => {
    const qs = api?.mode === "GET" ? serializeToQueryString(root) : undefined;
    onChange?.(root, qs);
  }, [root]);

  function updateRoot(g: FilterJSON) {
    setRoot(g);
  }

  function validateAll(g: FilterJSON): boolean {
    function walk(node: FilterJSON | any): boolean {
      for (const c of node.children) {
        if (c.children) {
          if (!walk(c)) return false;
        } else {
          if (!validateCondition(c)) return false;
        }
      }
      return true;
    }
    return walk(g);
  }

  return (
    <div className="border rounded-xl bg-white shadow-md p-4 space-y-4">
      <GroupEditor
        fields={schema}
        operators={operators}
        node={root}
        onChange={updateRoot}
      />
      <div className="text-sm text-gray-600">
        <strong>Valid:</strong> {String(validateAll(root))}
      </div>
      <pre
        aria-label="serialized"
        className="max-h-60 overflow-auto bg-gray-100 text-xs p-3 rounded"
      >
        {JSON.stringify(root, null, 2)}
      </pre>
    </div>
  );
};
