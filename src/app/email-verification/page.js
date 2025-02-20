"use client"
import { useEffect } from "react";
import { PublicLayout } from "../PrimaryLayout";
import { onAuthStateChanged } from "firebase/auth";
import { auth, validateUserEmail } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

export default function page() {
    const router = useRouter();
    useEffect(() => {
        let interval;
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                await validateUserEmail();
                interval = setInterval(() => {
                    user.reload().then(() => {
                        console.log("Refreshed user:", user.emailVerified);
                        if (user.emailVerified) {
                            clearInterval(interval);  // Stop checking once verified
                            router.push("/setting/update-user-info");  // Redirect to home page
                        }
                    }).catch((error) => {
                        console.error("Error refreshing user: ", error);
                    });
                }, 2000);
            } else {
                console.log("No user is signed in.");
            }
        });
        return () => clearInterval(interval);
    }, [])

    return (
        <PublicLayout>
            <Box sx={{ mt: 4, mx: 'auto', maxWidth: 600, textAlign: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom align="center">
                    Email Verification
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
                    Thank you for signing up. Please check your email to verify your account. Once verified, you will be redirected automatically.
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mt: 2, textAlign: 'center' }}>
                    If you did not receive the email, please check your spam folder or
                    <Typography component={"span"} color="primary">
                        {" "}
                        <a href="/email-verification">click here</a>
                        {" "}
                    </Typography>
                    to resend the verification email.
                </Typography>
            </Box>
        </PublicLayout>
    )
}
