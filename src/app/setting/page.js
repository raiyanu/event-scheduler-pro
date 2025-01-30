"use client"
import { Typography } from "@mui/material";
import MainLayout from "../PrimaryLayout";
import { ThemeProvider } from "@emotion/react";
import { Theme } from "../context/ThemeContext";

export default function page() {
    return (
        <MainLayout>
            <Typography sx={{
                color: "primary.main",
            }}>Settings</Typography>
        </MainLayout>
    )
}
