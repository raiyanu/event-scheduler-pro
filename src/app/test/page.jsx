"use client";
import { Button, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import MainLayout from "../PrimaryLayout";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from "firebase/firestore";
import { auth, db, getUserFullInfo } from "@/config/firebase";
import { updateCurrentUser } from "firebase/auth";

export default function page() {
    return (
        <MainLayout>
            <Test />
        </MainLayout>
    );
}

const taskz = {
    startTime: {
        seconds: 1738221347,
        nanoseconds: 937000000,
    },
    isRepeated: "everyday",
    createdAt: {
        seconds: 1738232231,
        nanoseconds: 481000000,
    },
    icon: "🧡",
    difficulty: "easy",
    tags: ["chore", "house", "personal"],
    status: "toStart",
    description:
        "i gotta clean the bike as soon as possible, because it look like scrap metal from garage sale",
    removedAt: {
        seconds: 1739266119,
        nanoseconds: 378000000,
    },
    endTime: {
        seconds: 1738308070,
        nanoseconds: 114000000,
    },
    title: "Wash the bike",
    importance: "casual",
};


export function Test() {
    const reference = useRef(0);
    const [data, setData] = useTest(reference);
    console.log("render")
    return (
        <>
            <Typography variant="h1">{data}</Typography>
            <Button
                className="ml-4"
                variant="contained"
                color="primary"
                onClick={async () => {
                    reference.current += 1;
                }}
            >
                Check
            </Button>
            <Child />
        </>
    );
}


export function Child() {
    let sNum = 0;
    console.log("rendered");
    return (
        <Typography variant="h1">{sNum}</Typography>
    )
}

const useTest = ({ reference }) => {
    const [data, setData] = useState(0);
    useEffect(() => {
        setData(data + 1)
    }, [reference?.current])
    return [data, setData];
}
