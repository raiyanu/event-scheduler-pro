"use client";
import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
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
    const [username, setUsername] = useState("");
    return (
        <>
            <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Button
                className="ml-4"
                variant="contained"
                color="primary"
                onClick={async () => {
                    run();
                }}
            >
                Check
            </Button>
        </>
    );
}

const run = async () => {
    console.log(await getTaskList());
}
const getTaskList = async () => {
    if (!auth.currentUser) {
        return [];
    };
    const taskListRef = collection(db, "users", auth.currentUser?.uid, "tasks");
    const taskList = await getDocs(taskListRef);
    return [...taskList.docs.map((doc) => doc.data())];
}

const addTask = (task) => {
    addDoc(collection(db, "users", auth.currentUser?.uid, "tasks"), task);
}



function generateTask() {
    const now = Date.now();
    const getRandomFutureTime = (offsetMinutes) => {
        const futureTime = now + offsetMinutes * 60 * 1000;
        return {
            seconds: Math.floor(futureTime / 1000),
            nanoseconds: (futureTime % 1000) * 1e6,
        };
    };

    const difficulties = ["easy", "medium", "hard"];
    const statuses = ["toStart", "inProgress", "completed"];
    const importanceLevels = ["casual", "important", "urgent"];
    const icons = ["🧹", "🛠", "📖", "🎯", "📝"];
    const repeatOptions = ["never", "daily", "weekly", "monthly"];
    const taskTitles = ["Vacuum the living room", "Fix the kitchen sink", "Read a book", "Practice archery", "Write a journal entry"];
    const descriptions = [
        "The floor is covered in dust and needs a good cleaning.",
        "The faucet keeps leaking, I should fix it soon.",
        "Time to read a few chapters of my book.",
        "I need to improve my accuracy with some practice.",
        "Journaling helps clear my mind, let's write something."
    ];
    const tagsList = [
        ["cleaning", "home"],
        ["repair", "home", "DIY"],
        ["reading", "learning"],
        ["hobby", "sports"],
        ["writing", "personal"]
    ];

    const index = Math.floor(Math.random() * taskTitles.length);

    return {
        startTime: getRandomFutureTime(30),
        isRepeated: repeatOptions[Math.floor(Math.random() * repeatOptions.length)],
        createdAt: getRandomFutureTime(-5),
        icon: icons[index],
        difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
        tags: tagsList[index],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        description: descriptions[index],
        removedAt: getRandomFutureTime(1000),
        endTime: getRandomFutureTime(120),
        title: taskTitles[index],
        importance: importanceLevels[Math.floor(Math.random() * importanceLevels.length)],
    };
}