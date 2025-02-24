"use client";
import { PublicLayout } from "@/app/PrimaryLayout";
import { UserSettings } from "../page";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";

export default function page() {
    const router = useRouter();
    return (
        <PublicLayout>
            <Box sx={{
                p: 2,
                maxWidth: "max-content",
                marginInline: "auto"
            }}>
                <UserSettings editOpen onDateChange={() => {
                    router.push("/home");
                }} />
            </Box>
        </PublicLayout>
    );
}