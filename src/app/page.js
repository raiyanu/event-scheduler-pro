"use client"
import { ThemeProvider } from "@emotion/react";
import { Auth } from "./component/UserAuth";
import { Theme } from "./context/ThemeContext";

export default function BasicTabs() {
    return (
        <ThemeProvider theme={Theme}>
            <Auth />
        </ThemeProvider>
    );
}
