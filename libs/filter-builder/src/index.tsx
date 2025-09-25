import { useState } from "react";
import type { FC } from "react";
import { ThemeProvider } from "@mui/material/styles";
import type { FilterBuilderProps, Group, Rule } from "./types";
import { GroupEditor } from "./components/GroupEditor";
import { serializeToQueryString, initialGroupData } from "./utils/serializer";
import theme from "./theme";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { getAction, postAction } from "./utils/api";
import { validateRule } from "./utils/rule";

export const FilterBuilder: FC<FilterBuilderProps> = ({
  schema,
  operators,
  initial,
  api,
  onSubmit,
}) => {
  const [root, setRoot] = useState<Group>(
    initial ?? initialGroupData(schema, operators, "and"),
  );

  function handleSubmit() {
    const qs = api.mode === "GET" ? serializeToQueryString(root) : undefined;

    if (api.mode === "GET") {
      void getAction(api.endpoint, root);
    } else if (api.mode === "POST") {
      void postAction(api.endpoint, root);
    }

    onSubmit(root, qs);
  }

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
      <Stack gap={2}>
        <GroupEditor
          fields={schema}
          operators={operators}
          node={root}
          onChange={updateRoot}
        />

        <Box>
          <Button
            size="small"
            disabled={!isValidRule}
            variant="contained"
            onClick={handleSubmit}
            sx={{ py: 1, px: 6 }}
          >
            Submit
          </Button>
        </Box>

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
