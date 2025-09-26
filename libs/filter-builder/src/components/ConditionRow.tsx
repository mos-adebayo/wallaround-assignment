import { FC, useMemo } from "react";
import { useEffect } from "react";
import type { Field, Rule } from "../types";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import {
  Box,
  Button,
  InputLabel,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";

type Props = {
  fields: Field[];
  operators: Record<string, string[]>;
  value: Rule;
  onChange: (c: Rule) => void;
  onRemove: () => void;
};

export const ConditionRow: FC<Props> = ({
  fields,
  operators,
  value,
  onChange,
  onRemove,
}) => {
  const field = fields.find((f) => f.value === value.field) || fields[0];
  const ops = operators[field.type];

  const setField = (name: string) => {
    const f = fields.find((ff) => ff.value === name)!;
    onChange({
      field: name,
      operator: operators[f.type]?.[0] || "eq",
      value: undefined,
    });
  };

  const renderValueInput = () => {
    switch (selectedField?.type) {
      case "select":
        return (
          <TextField
            select
            name={selectedField?.value}
            value={value.value}
            size="small"
            placeholder="Select Option"
            slotProps={{
              htmlInput: {
                "aria-label": "Select option",
              },
            }}
            fullWidth
            sx={{ minWidth: { xs: 50, lg: 100 } }}
            onChange={(e) => onChange({ ...value, value: e.target.value })}
          >
            {selectedField?.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        );
      case "boolean":
        return (
          <Switch
            slotProps={{ input: { "aria-label": "Toggle" } }}
            checked={Boolean(value.value)}
            onChange={(e) => {
              onChange({ ...value, value: e.target.checked });
            }}
          />
        );
      default:
        return (
          <TextField
            fullWidth
            name="ruleName"
            size="small"
            placeholder="Separate multiple values with comma"
            value={value.value ?? ""}
            type={valueType}
            onChange={(e) =>
              onChange({
                ...value,
                value:
                  valueType === "number"
                    ? Number(e.target.value)
                    : e.target.value,
              })
            }
          />
        );
    }
  };

  const valueType = useMemo(() => {
    const field = fields.find((f) => f.value === value.field);
    if (!field || value.operator === "between" || value.operator === "in") {
      return "text";
    }

    return field.type;
  }, [value.operator, value.field]);

  const selectedField = useMemo(() => {
    return fields.find((f) => f.value === value.field);
  }, [fields, value.field]);

  return (
    <Grid container spacing={{ xs: 1, lg: 2 }} alignItems="stretch">
      <Grid size={{ xs: 6, lg: 3 }} order={{ xs: 2, lg: 1 }}>
        <InputLabel htmlFor="field">Field</InputLabel>
        <Autocomplete
          freeSolo={false}
          value={selectedField}
          disableClearable
          size="small"
          options={fields}
          getOptionLabel={(option) => {
            return option.label;
          }}
          onChange={(_, val) => {
            setField(val.value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select field"
              variant="outlined"
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 6, lg: 3 }} order={{ xs: 3, lg: 2 }}>
        <InputLabel htmlFor="field">Operator</InputLabel>
        <Autocomplete
          freeSolo={false}
          value={value.operator}
          disableClearable
          size="small"
          options={ops}
          getOptionLabel={(option) => {
            return option;
          }}
          onChange={(_, val) => {
            onChange({ ...value, operator: val, value: undefined });
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Select operator"
              variant="outlined"
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }} order={{ xs: 4, lg: 3 }}>
        <InputLabel htmlFor="field">Value(s)</InputLabel>
        {renderValueInput()}
      </Grid>

      <Grid size={{ xs: 12, lg: 2 }} order={{ xs: 1, lg: 4 }}>
        <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
          <Button
            onClick={onRemove}
            variant="text"
            size="small"
            color="secondary"
            startIcon={"X"}
            sx={{ p: 0 }}
          >
            &nbsp;Remove
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ConditionRow;
