import { createTheme } from "@mui/material/styles";
import * as Components from "./overrides";

const theme = createTheme({
  spacing: (factor: number) => `${0.5 * factor}rem`,
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: "Lexend Deca, sans-serif",
  },
  palette: {
    secondary: {
      main: "#C6D0D5",
      light: "#FFFFFF7F",
      dark: "#5d6771",
    },
  },
  components: {
    MuiButton: Components.Button,
  },
});

export default theme;
