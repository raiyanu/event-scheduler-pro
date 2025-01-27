"use client"
import { Auth } from "./component/UserAuth";
import SecondaryLayout from "./SecondaryLayout";

export default function BasicTabs() {
    return (
        <SecondaryLayout>
            <Auth />
        </SecondaryLayout>
    );
}
