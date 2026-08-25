import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import CellTooltip from "./CellTooltip";

const getLightColorStyle = (color) => {
    if (!color) return {};
    let hex = color.trim();
    if (!hex.startsWith('#')) return { color: hex };
    let cleanHex = hex;
    if (hex.length > 7) {
        cleanHex = hex.substring(0, 7);
    }
    const bg = `${cleanHex}15`; // ~8% opacity
    return {
        backgroundColor: bg,
        color: cleanHex
    };
};

const InlineDropdown = ({
    field,
    recordId,
    currentValue,
    value,
    options = [],
    onUpdate,
    onChange,
    shouldTruncate = false,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [updating, setUpdating] = useState(false);
    const buttonRef = useRef(null);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    const val = value !== undefined ? value : currentValue;
    const selectedOpt = (options || []).find(o => String(o.value).trim() === String(val).trim());
    const displayValue = selectedOpt ? (selectedOpt.label || selectedOpt.value) : (val || "-");
    const buttonStyle = selectedOpt?.colour ? getLightColorStyle(selectedOpt.colour) : { backgroundColor: '#f3f4f6', color: '#1f2937' };

    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const updateCoords = () => {
                if (buttonRef.current) {
                    const rect = buttonRef.current.getBoundingClientRect();
                    setCoords({
                        top: rect.bottom + window.scrollY,
                        left: rect.left + window.scrollX,
                        width: rect.width
                    });
                }
            };

            updateCoords();
            
            // Recalculate on window resize or scroll to keep alignment perfect
            window.addEventListener("resize", updateCoords);
            window.addEventListener("scroll", updateCoords, true);

            return () => {
                window.removeEventListener("resize", updateCoords);
                window.removeEventListener("scroll", updateCoords, true);
            };
        }
    }, [isOpen]);

    const handleSelect = async (newValue) => {
        if (newValue === val) {
            setIsOpen(false);
            return;
        }
        setUpdating(true);
        try {
            if (onChange) {
                await onChange(newValue);
            } else if (onUpdate) {
                await onUpdate(recordId, field, newValue);
            }
        } finally {
            setUpdating(false);
            setIsOpen(false);
        }
    };

    const hasLongText = typeof displayValue === "string" && displayValue.length > 30;

    return (
        <div className="relative inline-block text-left w-full min-w-[120px]">
            <button
                ref={buttonRef}
                type="button"
                disabled={disabled || updating}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                style={buttonStyle}
                className={`w-full px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between border border-transparent shadow-sm transition-all duration-150 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-95 active:scale-95 cursor-pointer'}`}
            >
                <div className="min-w-0 flex-1 text-left mr-2">
                    <CellTooltip text={displayValue} forceShow={shouldTruncate && hasLongText}>
                        <span>{(shouldTruncate && hasLongText) ? displayValue.substring(0, 30) + "..." : displayValue}</span>
                    </CellTooltip>
                </div>
                {updating ? (
                    <svg className="animate-spin h-3.5 w-3.5 text-current flex-shrink-0" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                ) : (
                    <i className="fa-solid fa-chevron-down text-[10px] opacity-70 flex-shrink-0"></i>
                )}
            </button>

            {isOpen && createPortal(
                <>
                    {/* Background click overlay */}
                    <div 
                        className="fixed inset-0 z-40 bg-transparent cursor-default" 
                        onClick={() => setIsOpen(false)} 
                    />
                    
                    {/* Portal dropdown list container */}
                    <div
                        style={{
                            position: "absolute",
                            top: `${coords.top}px`,
                            left: `${coords.left}px`,
                            width: `${coords.width}px`,
                            minWidth: "140px",
                            zIndex: 9999
                        }}
                        className="mt-1 rounded-lg border border-gray-200 bg-white py-1 shadow-lg max-h-56 overflow-y-auto"
                    >
                        {(options || []).length === 0 ? (
                            <div className="px-3 py-2 text-xs text-gray-500 text-center">No options</div>
                        ) : (
                            (options || []).map(opt => {
                                const isSelected = String(opt.value).trim() === String(val).trim();
                                const optStyle = opt.colour ? getLightColorStyle(opt.colour) : {};
                                const displayLabel = opt.label || opt.value;
                                return (
                                    <div
                                        key={opt.id || opt.value}
                                        onClick={() => handleSelect(opt.value)}
                                        style={optStyle}
                                        className={`px-3 py-1.5 text-xs cursor-pointer transition-all m-1 rounded-md flex items-center justify-between ${isSelected ? 'ring-1 ring-blue-500 font-semibold' : 'hover:brightness-95'
                                            }`}
                                    >
                                        <span className="truncate">{displayLabel}</span>
                                        {isSelected && <i className="fa-solid fa-check text-[10px] ml-2"></i>}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </>,
                document.body
            )}
        </div>
    );
};

export default InlineDropdown;
