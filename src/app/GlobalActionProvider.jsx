import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react"
import { useDispatch } from "react-redux";
import { extractUserInfo, logout, updateUser } from "./redux/slice/userSlice";
import { auth, getUserFullInfo } from "@/config/firebase";

export default function GlobalActionProvider({ children }) {
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            onAuthStateChanged(auth, async (user) => {
                console.log("Auth/ChangeTriggered");
                if (user) {
                    if (user) {
                        console.log("User is signed in");
                        const fetchedUser = await getUserFullInfo();
                        const userFullInfo = fetchedUser.data();
                        setTimeout(async () => {
                            await dispatch(updateUser(extractUserInfo({ ...user, ...userFullInfo })));
                        }, 2000);
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
