import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const CellTooltip = ({ children, text, delay = 200, forceShow = false }) => {
    const [show, setShow] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);
    const timeoutRef = useRef(null);
    const [isOverflowing, setIsOverflowing] = useState(false);

    useEffect(() => {
        const checkOverflow = () => {
            const el = triggerRef.current;
            if (el) {
                // Check if the scrollWidth is greater than clientWidth
                const overflowing = el.scrollWidth > el.clientWidth;
                setIsOverflowing(overflowing);
            }
        };

        checkOverflow();

        // Use ResizeObserver for more reliable layout change detection
        let resizeObserver;
        if (triggerRef.current && window.ResizeObserver) {
            resizeObserver = new ResizeObserver(() => {
                checkOverflow();
            });
            resizeObserver.observe(triggerRef.current);
        }

        window.addEventListener("resize", checkOverflow);
        return () => {
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
            window.removeEventListener("resize", checkOverflow);
        };
    }, [children, text]);

    const handleMouseEnter = () => {
        if ((!isOverflowing && !forceShow) || !triggerRef.current) return;

        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
            top: rect.top + window.scrollY - 8,
            left: rect.left + window.scrollX + rect.width / 2
        });

        timeoutRef.current = setTimeout(() => {
            setShow(true);
        }, delay);
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setShow(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // If the text is empty or matches the placeholder, don't show tooltip
    const displayTooltip = text && text !== "-";

    return (
        <>
            <div
                ref={triggerRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="truncate w-full block"
            >
                {children}
            </div>
            {show && (isOverflowing || forceShow) && displayTooltip && createPortal(
                <div
                    style={{
                        position: "absolute",
                        top: `${coords.top}px`,
                        left: `${coords.left}px`,
                        transform: "translate(-50%, -100%)",
                        zIndex: 9999,
                        pointerEvents: "none"
                    }}
                    className="bg-slate-900/95 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg shadow-xl max-w-xs break-words whitespace-normal border border-slate-700/50 transition-all duration-150 font-medium"
                >
                    {text}
                    {/* Tooltip Arrow */}
                    <div 
                        className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-full w-0 h-0 border-t-[5px] border-t-slate-900/95 border-x-[5px] border-x-transparent"
                    />
                </div>,
                document.body
            )}
        </>
    );
};

export default CellTooltip;
