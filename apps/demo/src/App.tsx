import { useState } from "react";
import { FilterBuilder } from "@wallaround/filter-builder";
import type { Field, OperatorConfig } from "@wallaround/filter-builder";

const userFields: Field[] = [
  { name: "name", label: "Name", type: "string" },
  { name: "age", label: "Age", type: "number" },
  {
    name: "role",
    label: "Role",
    type: "select",
    options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
    ],
  },
  { name: "isActive", label: "Active", type: "boolean" },
];

const productFields: Field[] = [
  { name: "title", label: "Title", type: "string" },
  { name: "price", label: "Price", type: "number" },
  {
    name: "category",
    label: "Category",
    type: "select",
    options: [
      { label: "Electronics", value: "electronics" },
      { label: "Clothing", value: "clothing" },
    ],
  },
  { name: "releasedAt", label: "Released", type: "date" },
];

const ops: OperatorConfig = {
  string: [
    "eq",
    "neq",
    "contains",
    "starts_with",
    "ends_with",
    "in",
    "is null",
    "is not null",
  ],
  number: ["eq", "neq", "gt", "lt", "between", "in"],
  boolean: ["eq", "neq", "is null", "is not null"],
  date: ["eq", "neq", "before", "after", "between"],
  select: ["eq", "neq", "in"],
};

function App() {
  const [last, setLast] = useState<string>("");

  return (
    <>
      <h1>Filter Builder</h1>

      <div className="max-w-5xl mx-auto p-6 space-y-10">
        <section>
          <h2 className="text-xl font-bold mb-4">Users</h2>
          <FilterBuilder
            schema={userFields}
            operators={ops}
            onChange={(json, qs) => setLast(JSON.stringify({ json, qs }))}
            api={{ mode: "GET" }}
          />
        </section>

        <section>
          <h2 className="text-xl font-bold mb-4">Products</h2>
          <FilterBuilder
            schema={productFields}
            operators={ops}
            onChange={(json, qs) => setLast(JSON.stringify({ json, qs }))}
            api={{ mode: "POST", endpoint: "/api/products/filter" }}
          />
        </section>

        <section>
          <h3 className="text-lg font-semibold">Last emitted</h3>
          <pre className="bg-gray-800 text-gray-100 text-xs p-3 rounded mt-2">
            {last}
          </pre>
        </section>
      </div>
    </>
  );
}

export default App;
