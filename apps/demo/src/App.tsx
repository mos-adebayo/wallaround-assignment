import { useState } from "react";
import { FilterBuilder } from "@wallaround/filter-builder";
import type { Field, OperatorConfig } from "@wallaround/filter-builder";
import { Container, Divider, Stack, Typography } from "@mui/material";

const userFields: Field[] = [
  { value: "name", label: "Name", type: "text" },
  { value: "age", label: "Age", type: "number" },
  {
    value: "role",
    label: "Role",
    type: "select",
    options: [
      { label: "Admin", value: "admin" },
      { label: "User", value: "user" },
    ],
  },
  { value: "isActive", label: "Active", type: "boolean" },
  { value: "DOB", label: "DOB", type: "date" },
];

const productFields: Field[] = [
  { value: "title", label: "Title", type: "text" },
  { value: "price", label: "Price", type: "number" },
  {
    value: "category",
    label: "Category",
    type: "select",
    options: [
      { label: "Electronics", value: "electronics" },
      { label: "Clothing", value: "clothing" },
    ],
  },
  { value: "releasedAt", label: "Released", type: "date" },
];

const ops: OperatorConfig = {
  text: [
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
  const [lastEmit, setLastEmit] = useState<string>("");

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" mb={2}>
        Wallaround: Filter Builder
      </Typography>
      <Stack gap={2}>
        <Stack gap={2} component="section">
          <Typography variant="h5">Users (GET Action)</Typography>
          <FilterBuilder
            schema={userFields}
            operators={ops}
            onSubmit={(json, qs) => setLastEmit(JSON.stringify({ json, qs }))}
            api={{ mode: "GET", endpoint: "https://api/user/filter" }}
          />
        </Stack>

        <Divider />

        <Stack gap={2} component="section">
          <Typography variant="h5">Products (POST Action)</Typography>
          <FilterBuilder
            schema={productFields}
            operators={ops}
            onSubmit={(json, qs) => setLastEmit(JSON.stringify({ json, qs }))}
            api={{ mode: "POST", endpoint: "https://api/products/filter" }}
          />
        </Stack>

        <Stack component="section" gap={1}>
          <Typography variant="h5">Last emitted</Typography>
          <Typography
            component="pre"
            sx={{
              fontFamily: "Monospace",
              backgroundColor: "#f5f5f5",
              padding: 2,
              borderRadius: 1,
              overflowX: "auto",
            }}
          >
            {lastEmit || "No emit yet!"}
          </Typography>
        </Stack>
      </Stack>
    </Container>
  );
}

export default App;
