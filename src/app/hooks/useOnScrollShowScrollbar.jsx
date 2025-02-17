import { useEffect, useRef, useState } from "react";

export default function useOnScrollShowScrollbar(delay) {
    const scrollContainerRef = useRef(null);

    const [isscrolling, setIsScrolling] = useState(false);
    let scrollTimeout = useRef(null);

    const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
            setIsScrolling(false);
        }, delay);
    };

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;
        scrollContainer.addEventListener("scroll", handleScroll);

        return () => {
            scrollContainer.removeEventListener("scroll", handleScroll);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
    }, [scrollContainerRef]);

    return [isscrolling, scrollContainerRef, handleScroll];
}