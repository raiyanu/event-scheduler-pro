import { styled } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export default function useOnScrollShowScrollbar() {
    const scrollContainerRef = useRef(null);
    const [isscrolling, setIsScrolling] = useState(false);
    const scrollTimeout = useRef(null); // Store timeout reference

    const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
            setIsScrolling(false);
        }, 1000);
    };

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        scrollContainer.addEventListener("scroll", handleScroll);

        return () => {
            scrollContainer.removeEventListener("scroll", handleScroll);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
    }, []);

    return [scrollContainerRef, isscrolling];
}