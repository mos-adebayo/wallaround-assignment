import type { Components, Theme } from "@mui/material/styles";

const InputLabel: Components<Theme>["MuiInputLabel"] = {
  styleOverrides: {
    root: {
      color: "#7F95A4",
      marginBottom: "5px",
      "@media (min-width: 1200px)": {
        fontSize: "0.85rem",
      },
    },
  },
};

export default InputLabel;
