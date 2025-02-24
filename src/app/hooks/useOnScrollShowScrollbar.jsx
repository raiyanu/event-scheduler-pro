import { useEffect, useRef, useState } from "react";

export default function useOnScrollShowScrollbar(delay) {
    const scrollContainerRef = useRef(null);

    const [isscrolling, setIsScrolling] = useState(false);
    let scrollTimeout = useRef(null);
    const lastScrollTop = useRef(0);

    const handleScroll = () => {
        const scrollTop = scrollContainerRef.current?.scrollTop || 0;
        if (scrollTop === lastScrollTop.current) return; // Ignore if scroll position hasn't changed

        lastScrollTop.current = scrollTop;
        setIsScrolling(true);
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => {
            setIsScrolling(true); // TODO
        }, delay);
    };

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;
        scrollContainer.addEventListener("scroll", (event) => {
            if (event.isTrusted) {
                handleScroll(event)
                console.log("event is trusted");
            } else {
                console.log("event is not trusted");
            }
        });

        return () => {
            scrollContainer.removeEventListener("scroll", handleScroll);
            if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        };
    }, [scrollContainerRef]);

    return [isscrolling, scrollContainerRef, handleScroll];
}