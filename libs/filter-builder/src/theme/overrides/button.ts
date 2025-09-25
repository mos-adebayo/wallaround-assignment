import type { Components, Theme } from "@mui/material/styles";

const Button: Components<Theme>["MuiButton"] = {
  defaultProps: {
    size: "medium",
    disableElevation: false,
  },
  variants: [
    {
      props: { color: "secondary" },
      style: {
        background: "#5d6771",
        "&:hover": {
          color: "white",
          background: "#44505b",
        },
      },
    },
    {
      props: { variant: "outlined", color: "secondary" },
      style: {
        color: "white",
        "&:hover": {
          color: "white",
        },
      },
    },
    {
      props: { variant: "contained" },
      style: {
        color: "white",
        "&:hover": {
          color: "white",
        },
      },
    },
    {
      props: { variant: "text" },
      style: {
        border: "none",
        background: "white",
        color: "inherit",
      },
    },
    {
      props: { size: "large" },
      style: {
        padding: "1.2rem 4rem",
        borderRadius: "40px",
        "& .MuiButton-iconSizeLarge": {
          svg: {
            fontSize: "1.3rem",
          },
        },
      },
    },
    {
      props: { size: "small" },
      style: {
        padding: "0.25rem 1rem",
        "& .MuiButton-iconSizeSmall": {
          svg: {
            fontSize: "0.80rem",
          },
        },
      },
    },
    {
      props: { size: "medium" },
      style: {
        padding: "1rem 2.5rem",
        borderRadius: "30px",
        "& .MuiButton-iconSizeLarge": {
          svg: {
            fontSize: "1rem",
          },
        },
      },
    },
  ],
  styleOverrides: {
    root: {
      fontWeight: 400,
      padding: "0.6rem 2rem",
      borderRadius: "20px",
      textTransform: "capitalize",
      lineHeight: "1.5rem",
      boxShadow: "none",
      ".MuiButton-startIcon": {
        marginRight: "0",
      },
    },
  },
};

export default Button;
