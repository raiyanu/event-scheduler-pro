"use client";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { extractUserInfo, logout, setAuthenticatingState, setPublicState, updateUser } from "./redux/slice/userSlice";
import { auth, db, getUserFullInfo } from "@/config/firebase";
import { fetchTasks, pushTasks } from "./redux/slice/taskSlice";
import { collection, onSnapshot } from "firebase/firestore";



export default function GlobalActionProvider({ children }) {
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            let unsub;
            try {
                if (await getAuth()?.currentUser) {
                    await dispatch(updateUser(extractUserInfo(auth.currentUser)));
                } else {
                    // await dispatch(setPublicState());
                    // dispatch(logout());
                    // dispatch(setAuthenticatingState("idle"));
                }
                onAuthStateChanged(auth, async (user) => {
                    if (user) {
                        console.log("User is signed in: ", user);
                        const fetchedUser = await getUserFullInfo();
                        const userFullInfo = fetchedUser.data();
                        await dispatch(updateUser(extractUserInfo({ ...user, ...userFullInfo, emailVerified: user.emailVerified })));
                        dispatch(fetchTasks());
                        unsub = onSnapshot(collection(db, "users", auth.currentUser?.uid, "tasks"), async (taskList) => {
                            const source = taskList.metadata.hasPendingWrites ? "Local" : "Server";
                            console.log("date: ", source, " ======>>>>>", [...taskList.docs.map((doc) => ({ ...doc.data(), id: doc.id }))]);
                            await dispatch(pushTasks([...taskList.docs.map((doc) => ({ ...doc.data(), id: doc.id }))]));
                        });
                    } else {
                        console.log("User is signed out");
                        dispatch(logout())
                        dispatch(setAuthenticatingState("idle"));
                    }
                })
            } catch (error) {
                console.log(error)
            }
            return () => {
                unsub();
            }
        })();
    }, []);
    return (
        <>
            <Suspense fallback={<div>Loading...</div>}>
                {children}
            </Suspense>
        </>
    )
}
