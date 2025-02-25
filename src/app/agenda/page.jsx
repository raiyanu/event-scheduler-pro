"use client"
import { Typography } from "@mui/material";
import MainLayout, { PublicLayout } from "../PrimaryLayout";
import { ThemeProvider } from "@emotion/react";
import { Theme } from "../context/ThemeContext";
import { GridStack } from "../component/DMasonry/src/demo/demo";

export default function page() {
    return (
        <PublicLayout>
            <GridStack />
        </PublicLayout>
    )
}
