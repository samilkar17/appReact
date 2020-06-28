import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: "#165FE2",
    },
    common: {
      white: "white",
    },
    secondary: {
      main: "#FB2020",
    },
  },
  spacing: 10,
});

export default theme;
