import { FC, useMemo } from "react";
import { useEffect } from "react";
import type { Field, Rule } from "../types";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import { Box, Button, InputLabel, MenuItem, TextField } from "@mui/material";

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
  const field = fields.find((f) => f.name === value.field) || fields[0];
  const ops = field ? operators[field.type] || [] : [];

  useEffect(() => {
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

  const valueType = useMemo(() => {
    const field = fields.find((f) => f.name === value.field);
    if (!field || value.operator === "between" || value.operator === "in") {
      return "text";
    }

    return field.type;
  }, [value.operator, value.field]);

  const selectedField = useMemo(() => {
    return fields.find((f) => f.name === value.field);
  }, [fields, value.field]);

  return (
    <Grid container spacing={{ xs: 2 }} alignItems="stretch">
      <Grid size={{ xs: 3 }}>
        <InputLabel htmlFor="field">Name</InputLabel>
        <Autocomplete
          freeSolo={false}
          value={selectedField}
          disableClearable
          size="small"
          options={fields}
          getOptionLabel={(option) => {
            if (!option) {
              return "";
            }
            return option.label;
          }}
          onChange={(_, val) => {
            setField(val.name);
          }}
          renderInput={(params) => <TextField {...params} variant="outlined" />}
        />
      </Grid>

      <Grid size={{ xs: 3 }}>
        <InputLabel htmlFor="field">Operator</InputLabel>
        <Autocomplete
          freeSolo={false}
          value={value.operator}
          disableClearable
          size="small"
          options={ops}
          getOptionLabel={(option) => {
            if (!option) {
              return "";
            }
            return option;
          }}
          onChange={(_, val) => {
            onChange({ ...value, operator: val, value: undefined });
          }}
          renderInput={(params) => <TextField {...params} variant="outlined" />}
        />
      </Grid>

      <Grid size={{ xs: 4 }}>
        <InputLabel htmlFor="field">Value(s)</InputLabel>
        {selectedField?.type === "select" ? (
          <TextField
            select
            name="documentType"
            value={value.value ?? ""}
            size="small"
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
        ) : (
          <TextField
            fullWidth
            name="ruleName"
            size="small"
            placeholder="Values separated with comma"
            value={value.value ?? ""}
            type={valueType}
            onChange={(e) => onChange({ ...value, value: e.target.value })}
          />
        )}
      </Grid>

      <Grid size={{ xs: 2 }}>
        <Box sx={{ height: "100%", display: "flex", alignItems: "center" }}>
          <Button
            onClick={onRemove}
            variant="text"
            size="small"
            color="secondary"
            startIcon={"X"}
          >
            &nbsp;Remove
          </Button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ConditionRow;
