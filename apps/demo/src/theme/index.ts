import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  spacing: (factor: number) => `${0.5 * factor}rem`,
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: "Lexend Deca, sans-serif",
  },
});

export default theme;
