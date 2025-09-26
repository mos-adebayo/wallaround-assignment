import type { Components, Theme } from "@mui/material/styles";

const InputLabel: Components<Theme>["MuiInputLabel"] = {
  styleOverrides: {
    root: {
      color: "rgba(0,0,0)",
      marginBottom: "5px",
    },
  },
};

export default InputLabel;
