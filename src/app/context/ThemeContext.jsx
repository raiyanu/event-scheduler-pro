import { colors } from "@mui/material";
import { createTheme } from "@mui/material/styles";

// export const Theme = createTheme({
//     cssVariables: {
//         colorSchemeSelector: "data-toolpad-color-scheme",
//     },
//     colorSchemes: { light: true, dark: true },
//     palette: {
//         text: {
//             primary: colors.grey[50],
//         },
//         common: {
//             black: "red",
//             white: "#fff"
//         },
//         primary: {
//             main: colors.yellow[500],
//             light: colors.yellow[500],
//             dark: colors.yellow[500],
//             contrastText: colors.yellow[500],
//         },
//         secondary: {
//             main: colors.yellow[500]
//         },
//     },
// });



export const Theme = createTheme({
    cssVariables: {
        colorSchemeSelector: "data-toolpad-color-scheme",
    },
    colorSchemes: { light: true, dark: true },
    palette: {
        primary: {
            main: "#000000", // Black
            contrastText: "#FFFFFF", // White for text on primary
        },
        secondary: {
            main: "#808080", // Gray
            contrastText: "#FFFFFF", // White for text on secondary
        },
        success: {
            main: "#4CAF50", // Green
        },
        warning: {
            main: "#FFC107", // Yellow
        },
        info: {
            main: "#2196F3", // Blue
        },
        error: {
            main: "#9C27B0", // Purple
        },
        background: {
            default: "#FFFFFF", // White background
            paper: "#F9F9F9", // Light grey for surfaces
        },
        text: {
            primary: "#000000", // Black for primary text
            secondary: "#808080", // Gray for secondary text
            disabled: "#D3D3D3", // Light gray for disabled text
        },
        divider: "#E0E0E0", // Divider color
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
                    backgroundColor: "#F9F9F9",
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
                    backgroundColor: "#000000", // Black AppBar
                    color: "#FFFFFF",
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: "#F9F9F9",
                },
            },
        },
    },
});
