import React from "react";
import type { Field, Rule } from "../types";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import { Box, Button, InputLabel, TextField } from "@mui/material";

type Props = {
  fields: Field[];
  operators: Record<string, string[]>;
  value: Rule;
  onChange: (c: Rule) => void;
  onRemove: () => void;
};

export const ConditionRow: React.FC<Props> = ({
  fields,
  operators,
  value,
  onChange,
  onRemove,
}) => {
  const field = fields.find((f) => f.name === value.field) || fields[0];
  const ops = field ? operators[field.type] || [] : [];

  React.useEffect(() => {
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

  return (
    <Grid container spacing={{ xs: 2 }} alignItems="stretch">
      <Grid size={{ xs: 3 }}>
        <InputLabel htmlFor="field">Name</InputLabel>
        <Autocomplete
          freeSolo={false}
          value={fields.find((f) => f.name === value.field)}
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
        <TextField
          fullWidth
          name="ruleName"
          size="small"
          placeholder="Values separated with comma"
          value={value.value ?? ""}
          onChange={(e) => onChange({ ...value, value: e.target.value })}
        />
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
