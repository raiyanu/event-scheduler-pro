import { colors } from "@mui/material";
import { createTheme } from "@mui/material/styles";

export const Theme = createTheme({
    cssVariables: {
        colorSchemeSelector: "data-toolpad-color-scheme",
    },
    colorSchemes: { light: true, dark: true },
    palette: {
        primary: {
            main: '#FFB904', // Black
            contrastText: colors.common.white, // White for text on primary
        },
        secondary: {
            main: colors.yellow[500], // Gray
            contrastText: colors.common.white, // White for text on secondary
        },
        success: {
            main: colors.green[500], // Green
        },
        warning: {
            main: colors.amber[500], // Yellow
        },
        info: {
            main: colors.blue[500], // Blue
        },
        error: {
            main: colors.purple[500], // Purple
        },
        background: {
            default: colors.common.white, // White background
            paper: colors.grey[100], // Light grey for surfaces
        },
        text: {
            primary: colors.common.black, // Black for primary text
            secondary: colors.grey[500], // Gray for secondary text
            disabled: colors.grey[300], // Light gray for disabled text
        },
        divider: colors.grey[300], // Divider color
    },
    typography: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
        h1: {
            fontSize: "2.25rem",
            fontWeight: 700,
        },
        h2: {
            fontSize: "2rem",
            fontWeight: 600,
        },
        h3: {
            fontSize: "1.75rem",
            fontWeight: 500,
        },
        h4: {
            fontSize: "1.5rem",
            fontWeight: 500,
        },
        h5: {
            fontSize: "1.25rem",
            fontWeight: 500,
        },
        h6: {
            fontSize: "1rem",
            fontWeight: 500,
        },
        subtitle1: {
            fontSize: "0.875rem",
            fontWeight: 400,
        },
        subtitle2: {
            fontSize: "0.75rem",
            fontWeight: 400,
        },
        body1: {
            fontSize: "1rem",
            fontWeight: 400,
        },
        body2: {
            fontSize: "0.875rem",
            fontWeight: 400,
        },
        button: {
            textTransform: "none",
            fontWeight: 600,
        },
        caption: {
            fontSize: "0.75rem",
            fontWeight: 400,
        },
        overline: {
            fontSize: "0.625rem",
            fontWeight: 700,
        },
    },
    shape: {
        borderRadius: 8, // Rounded corners
    },
    shadows: [
        "none",
        "0px 1px 3px rgba(0, 0, 0, 0.2)",
        "0px 1px 5px rgba(0, 0, 0, 0.15)",
        "0px 1px 10px rgba(0, 0, 0, 0.12)",
        // Add additional custom shadows as needed
    ],
    breakpoints: {
        values: {
            xs: 0, // Mobile
            sm: 600, // Tablets
            md: 960, // Small laptops
            lg: 1280, // Large laptops
            xl: 1920, // Desktops
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: "8px", // Rounded buttons
                    padding: "8px 16px",
                    fontWeight: 600,
                    textTransform: "none", // Disable uppercase
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    borderRadius: "8px",
                    backgroundColor: colors.grey[100],
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: "12px", // Custom card design
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.common.black, // Black AppBar
                    color: colors.common.white,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.grey[100],
                },
            },
        },
    },
});
