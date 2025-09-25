import { useState } from "react";
import { FilterBuilder } from "@wallaround/filter-builder";
import type { Field, OperatorConfig } from "@wallaround/filter-builder";
import {Container, Divider, Stack, Typography} from "@mui/material";

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
  { name: "DOB", label: "DOB", type: "date" },
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
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" mb={2}>Wallaround: Filter Builder</Typography>
      <Stack gap={2}>
        <Stack component="section">
          <Typography variant="h5">Users</Typography>
          <FilterBuilder
            schema={userFields}
            operators={ops}
            onChange={(json, qs) => setLast(JSON.stringify({ json, qs }))}
            api={{ mode: "GET" }}
          />
        </Stack>

        <Divider />

        <Stack component="section">
          <Typography variant="h5">Products</Typography>
          <FilterBuilder
            schema={productFields}
            operators={ops}
            onChange={(json, qs) => setLast(JSON.stringify({ json, qs }))}
            api={{ mode: "POST", endpoint: "/api/products/filter" }}
          />
        </Stack>

        <Stack component="section" gap={1}>
          <Typography variant="h5">Last emitted</Typography>
          <pre className="bg-gray-800 text-gray-100 text-xs p-3 rounded mt-2">
            {last}
          </pre>
        </Stack>
      </Stack>
    </Container>
  );
}

export default App;
