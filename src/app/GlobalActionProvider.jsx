import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { auth } from "@/lib/firebase.config";
import { extractUserInfo, logout, updateUser } from "./redux/slice/userSlice";

export default function GlobalActionProvider({ children }) {
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            onAuthStateChanged(auth, async (user) => {
                console.log("Auth state changed: ", user)
                if (user) {
                    if (user) {
                        await dispatch(updateUser(extractUserInfo(user)));
                    } else {
                        console.log("User is signed out");
                        dispatch(logout())
                    }
                }
            })
        })();
    }, []);
    return (<>{children}</>)
}
