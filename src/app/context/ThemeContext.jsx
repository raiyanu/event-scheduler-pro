"use client";
import { colors } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { createContext, useEffect, useState } from "react";

export const Theme = createTheme({
    cssVariables: {
        colorSchemeSelector: "data-toolpad-color-scheme",
    },
    colorSchemes: { light: true, },
    palette: {
        primary: {
            main: '#FFB904', // Yellow
            contrastText: colors.common.black, // White for text on primary
        },
        secondary: {
            main: colors.yellow[800], // Gray
            contrastText: colors.common.black, // White for text on secondary
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
            main: colors.red[500], // Purple
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
            p0: '#f1edf8',
            p1: '#e2daf1',
            p2: '#c5b6e2',
            p3: '#a891d4',
            p4: '#8c6cc6',
            p5: '#6f47b8',
            p6: '#593993',
            p7: '#422b6e',
            p8: '#2c1d49',
            p9: '#160e25',
            p9: '#0b0712',
        },
        secondary: {
            main: '#772e52',
            contrastText: '#e6def2',
            s0: '#f8edf2',
            s1: '#f1dae6',
            s2: '#e2b6cc',
            s3: '#d491b3',
            s4: '#c66c99',
            s5: '#b84780',
            s6: '#933966',
            s7: '#6e2b4d',
            s8: '#491d33',
            s9: '#250e1a',
            s9: '#12070d',
        },
        background: {
            default: '#100a19',
            paper: '#100a19',
            b0: '#f1edf8',
            b1: '#e3dbf0',
            b2: '#c8b6e2',
            b3: '#ac92d3',
            b4: '#906dc5',
            b5: '#7549b6',
            b6: '#5d3a92',
            b7: '#462c6d',
            b8: '#2f1d49',
            b9: '#170f24',
            b9: '#0c0712',
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
        accent: {
            main: '#c05d6a',
            contrastText: '#e6def2',
            a0: '#f8edee',
            a1: '#f1dadd',
            a2: '#e2b6bc',
            a3: '#d4919a',
            a4: '#c66c78',
            a5: '#b84756',
            a6: '#933945',
            a7: '#6e2b34',
            a8: '#491d23',
            a9: '#250e11',
            a9: '#120709',
        },
        text: {
            primary: '#e7dff3',
            secondary: '#e7dff3',
            disabled: '#7b95ea',
            t0: '#f1edf8',
            t1: '#e3daf1',
            t2: '#c7b5e3',
            t3: '#ac90d5',
            t4: '#906bc7',
            t5: '#7446b9',
            t6: '#5d3894',
            t7: '#462a6f',
            t8: '#2e1c4a',
            t9: '#170e25',
            t9: '#0c0712',
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
    const [themeMode, setThemeMode] = useState(() => {
        return 'dark';
    });

    useEffect(() => {
        setThemeMode(localStorage.getItem('themeMode') || 'dark');
    }, []);

    useEffect(() => {
        localStorage.setItem('themeMode', themeMode);
    }, [themeMode]);

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