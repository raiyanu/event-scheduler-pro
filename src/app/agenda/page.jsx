"use client"
import { Typography } from "@mui/material";
import PrimaryLayout from "../PrimaryLayout";
import { ThemeProvider } from "@emotion/react";
import { Theme } from "../context/ThemeContext";

export default function page() {
    return (
        <PrimaryLayout>
            <Typography sx={{
                color: "primary.light",
            }}>Agenda</Typography>
        </PrimaryLayout>
    )
}
