import { useEffect } from "react"

export default function GlobalActionProvider({ children }) {
    useEffect(() => {
        console.log("began running bg actions")
    }, []);
    return (<>{children}</>)
}
