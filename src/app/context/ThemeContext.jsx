import { colors } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createContext, useState } from "react";

export const Theme = createTheme({
    cssVariables: {
        colorSchemeSelector: "data-toolpad-color-scheme",
    },
    colorSchemes: { light: true, },
    palette: {
        primary: {
            main: '#FFB904', // Yellow
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
            paper: colors.common.white, // Light grey for surfaces
        },
        text: {
            primary: colors.common.black, // Black for primary text
            secondary: colors.grey[500], // Gray for secondary text
            disabled: colors.grey[300], // Light gray for disabled text
        },
        divider: colors.grey[300], // Divider color
    },
});



export const darkTheme = createTheme({
    cssVariables: {
        colorSchemeSelector: "data-toolpad-color-scheme",
    },
    colorSchemes: { dark: true },
    palette: {
        mode: 'dark',
        primary: {
            main: '#af99d7',
            contrastText: '#e9edfb',
        },
        secondary: {
            main: '#772e52',
            contrastText: '#e6def2',
        },
        background: {
            default: '#100a19',
            paper: '#100a19',
        },
        error: {
            main: '#d72638',
            contrastText: '#e6def2',
        },
        warning: {
            main: '#f49d37',
            contrastText: '#e6def2',
        },
        info: {
            main: '#4a62e8',
            contrastText: '#e6def2',
        },
        success: {
            main: '#76c893',
            contrastText: '#e6def2',
        },
        text: {
            primary: '#e7dff3',
            secondary: '#e7dff3',
            disabled: '#7b95ea',
        },
        divider: 'rgba(255, 255, 255, 0.08)',
    },
    shape: {
        borderRadius: 10,
    },
    components: {

    },
});




export const themeChangeContext = createContext();

export const MyThemeProvider = ({ children }) => {
    const [themeMode, setThemeMode] = useState('dark');
    const preferredTheme = themeMode === 'light' ? Theme : darkTheme;
    const toggleTheme = () => {
        setThemeMode((prevMode) => prevMode === 'light' ? 'dark' : 'light');
    }
    return (
        <themeChangeContext.Provider value={{ toggleTheme, themeMode }}>
            <ThemeProvider theme={preferredTheme}>
                {children}
            </ThemeProvider>
        </themeChangeContext.Provider>
    )
};