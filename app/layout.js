import { ThemeProvider } from "@mui/material/styles";
import "~/stylesheet/css/globals.css"
import theme from "~/theme";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}