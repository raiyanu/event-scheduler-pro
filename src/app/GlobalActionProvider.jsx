import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { extractUserInfo, logout, updateUser } from "./redux/slice/userSlice";
import { auth, getUserFullInfo } from "@/config/firebase";
import { fetchTasks } from "./redux/slice/taskSlice";

export default function GlobalActionProvider({ children }) {
    const tasks = useSelector((state) => state.TASK.tasks);
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            onAuthStateChanged(auth, async (user) => {
                if (user) {
                    if (user) {
                        console.log("User is signed in");
                        const fetchedUser = await getUserFullInfo();
                        const userFullInfo = fetchedUser.data();
                        setTimeout(async () => {
                            await dispatch(updateUser(extractUserInfo({ ...user, ...userFullInfo })));
                        }, 500);
                        dispatch(fetchTasks());
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
