import React from "react";
import { FilterBuilderProps, Group, Rule } from "./types";
import { GroupEditor } from "./components/GroupEditor";
import {
  emptyGroup,
  validateRule,
  serializeToQueryString,
} from "./utils/serializer";

export const FilterBuilder: React.FC<FilterBuilderProps> = ({
  schema,
  operators,
  initial,
  api,
  onChange,
}) => {
  const [root, setRoot] = React.useState<Group>(initial ?? emptyGroup("and"));

  React.useEffect(() => {
    const qs = api?.mode === "GET" ? serializeToQueryString(root) : undefined;
    onChange?.(root, qs);
  }, [root]);

  function updateRoot(g: Group) {
    setRoot(g);
  }

  function validateAll(node: Group | Rule): boolean {
    if ("and" in node) {
      for (const child of node.and) {
        if (!validateAll(child)) return false;
      }
    } else if ("or" in node) {
      for (const child of node.or) {
        if (!validateAll(child)) return false;
      }
    } else {
      if (!validateRule(node as Rule)) return false;
    }
    return true;
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
