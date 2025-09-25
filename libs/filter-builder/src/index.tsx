import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import type { FilterBuilderProps, Group, Rule } from "./types";
import { GroupEditor } from "./components/GroupEditor";
import {
  validateRule,
  serializeToQueryString,
  initialGroupData,
} from "./utils/serializer";
import theme from "./theme";
import { Chip, Stack, Typography } from "@mui/material";

export const FilterBuilder: React.FC<FilterBuilderProps> = ({
  schema,
  operators,
  initial,
  api,
  onChange,
}) => {
  const [root, setRoot] = React.useState<Group>(
    initial ?? initialGroupData(schema, operators, "and"),
  );

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

  const isValidRule = validateAll(root);

  return (
    <ThemeProvider theme={theme}>
      <Stack gap={1.5}>
        <GroupEditor
          fields={schema}
          operators={operators}
          node={root}
          onChange={updateRoot}
        />

        <Stack direction="row" alignItems="center" gap={1}>
          <Typography variant="subtitle1" fontWeight="bold">
            Validity:
          </Typography>

          {isValidRule ? (
            <Chip label="Valid" size="small" color="success" />
          ) : (
            <Chip label="Invalid" size="small" color="error" />
          )}
        </Stack>

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
          {JSON.stringify(root, null, 2)}
        </Typography>
      </Stack>
    </ThemeProvider>
  );
};
