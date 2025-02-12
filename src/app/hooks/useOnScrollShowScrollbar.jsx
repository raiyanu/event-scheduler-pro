import { styled } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export default function useOnScrollShowScrollbar() {
    const scrollContainerRef = useRef(null);
    const [isscrolling, setIsScrolling] = useState(false);
    let scrollTimeout = useRef(null);

    const handleScroll = () => {
        console.log("handleScroll: ");
        setIsScrolling(true);
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            setIsScrolling(false);
        }, 1000);
    };

    useEffect(() => {
        console.log("useOnScrollShowScrollbar: ", scrollContainerRef);
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        scrollContainer.addEventListener("scroll", handleScroll);

        return () => {
            scrollContainer.removeEventListener("scroll", handleScroll);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
    }, [scrollContainerRef]);

    return [scrollContainerRef, isscrolling];
}