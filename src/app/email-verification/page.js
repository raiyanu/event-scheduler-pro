"use client"
import { useEffect } from "react";
import { PublicLayout } from "../PrimaryLayout";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/config/firebase";
import { useRouter } from "next/navigation";

export default function page() {
    const router = useRouter();
    useEffect(() => {
        let interval;
        onAuthStateChanged(auth, (user) => {
            if (user) {
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
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3">
                        <div className="card">
                            <div className="card-body">
                                <h1>Email Verification</h1>
                                <p>Thank you for signing up. Please check your email to verify your account.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    )
}
