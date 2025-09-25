import React from "react";
import type { Condition, Field, Group, Rule } from "../types";
import { ConditionRow } from "./ConditionRow";
import { emptyGroup } from "../utils/serializer";
import { Box, Button, Divider, Stack, Typography, Grid } from "@mui/material";

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

  const isGroupORConditioned = rootKey === "or";
  const isGroupANDConditioned = rootKey === "and";
  const showGroupCondition = ruleList?.length > 1;

  return (
    <Stack gap={1.5}>
      <Grid container spacing={{ xs: 2 }} alignItems="stretch">
        {showGroupCondition && (
          <Grid size={{ xs: 10 }}>
            <Stack direction="row" gap={1} alignItems="center">
              <Typography variant="body2">CONDITION:</Typography>
              <Button
                size="small"
                onClick={() => changeGroupType("or")}
                color={"info"}
                variant={isGroupORConditioned ? "contained" : "outlined"}
              >
                OR
              </Button>
              <Button
                size="small"
                onClick={() => changeGroupType("and")}
                color="info"
                variant={isGroupANDConditioned ? "contained" : "outlined"}
              >
                AND
              </Button>
            </Stack>
          </Grid>
        )}

        {onRemove && (
          <Grid size={{ xs: 2 }}>
            <Button
              size="small"
              onClick={onRemove}
              color="info"
              variant="outlined"
            >
              Remove group
            </Button>
          </Grid>
        )}
      </Grid>

      <Stack
        direction="row"
        spacing={2}
        alignItems="stretch"
        sx={{ pl: showGroupCondition ? 1 : 0 }}
      >
        {showGroupCondition && (
          <Box
            sx={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Divider
              orientation="vertical"
              flexItem
              sx={{
                borderRightWidth: 1,
                borderColor: "info.main",
                "&::before, &::after": {
                  content: '""',
                  position: "absolute",
                  width: "10px",
                  height: "1px",
                  backgroundColor: "info.main",
                  left: "0px",
                },
                "&::before": { top: 0 },
                "&::after": { bottom: 0 },
              }}
            />

            <Typography
              variant="body2"
              sx={{
                position: "absolute",
                top: "50%",
                left: "0",
                transform: "translate(-50%, -50%)",
                backgroundColor: "#FAFAFA",
                color: "info.main",
                px: 1,
                textTransform: "uppercase",
              }}
            >
              {rootKey}
            </Typography>
          </Box>
        )}

        <Stack gap={1.5} sx={{ flex: 1, pl: showGroupCondition ? 1 : 0 }}>
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
        </Stack>
      </Stack>

      <Stack direction="row" gap={2}>
        <Button
          size="small"
          onClick={addCondition}
          color="secondary"
          variant="contained"
        >
          Add Rule
        </Button>

        <Button
          size="small"
          onClick={addGroup}
          color="secondary"
          variant="contained"
        >
          Add Group
        </Button>
      </Stack>
    </Stack>
  );
};
