import React, { useState } from 'react';

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

const CustomDropdown = ({
    label,
    id,
    value,
    onChange,
    options = [],
    required,
    multiple = false,
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Parse values
    const selectedValues = multiple
        ? (value ? String(value).split(',').map(s => s.trim()).filter(Boolean) : [])
        : (value ? [String(value).trim()] : []);

    const handleOptionToggle = (optValue) => {
        if (multiple) {
            let next;
            if (selectedValues.includes(optValue)) {
                next = selectedValues.filter(v => v !== optValue);
            } else {
                next = [...selectedValues, optValue];
            }
            onChange(next.join(','));
        } else {
            onChange(optValue);
            setIsOpen(false);
        }
    };

    const filteredOptions = (options || []).filter(opt => {
        const searchText = opt.label || opt.value || '';
        return String(searchText).toLowerCase().includes(searchQuery.toLowerCase());
    });

    const selectedOpt = !multiple && selectedValues[0] ? (options || []).find(o => String(o.value) === selectedValues[0]) : null;
    const selectTextStyle = selectedOpt?.colour ? { color: selectedOpt.colour, fontWeight: '600' } : {};

    return (
        <div className="relative w-full">
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(prev => !prev)}
                disabled={disabled}
                className={`peer w-full rounded-xl border border-gray-300 px-3 pt-4 pb-1.5 text-left text-sm outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 flex items-center justify-between ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-800 cursor-pointer'}`}
            >
                {multiple && selectedValues.length > 0 ? (
                    <div className="flex flex-wrap gap-1 max-w-[90%] overflow-hidden">
                        {selectedValues.map(val => {
                            const opt = (options || []).find(o => String(o.value) === val);
                            const style = opt?.colour ? getLightColorStyle(opt.colour) : { backgroundColor: '#f3f4f6', color: '#1f2937' };
                            const displayLabel = opt ? (opt.label || opt.value) : val;
                            return (
                                <span
                                    key={val}
                                    style={style}
                                    className="inline-flex items-center px-2 py-0.5 rounded-lg text-sm font-semibold shrink-0"
                                >
                                    {displayLabel}
                                </span>
                            );
                        })}
                    </div>
                ) : (
                    <span className="truncate" style={selectTextStyle}>
                        {selectedOpt ? (selectedOpt.label || selectedOpt.value) : ' '}
                    </span>
                )}
                <i className={`fa-solid fa-chevron-down transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-gray-400 text-xs ml-2`}></i>
            </button>

            <label
                htmlFor={id}
                className={`absolute left-3 -top-2.5 px-1 text-sl font-medium transition-all pointer-events-none peer-focus:text-blue-600 ${disabled ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-900'}`}
            >
                {label} {required && <span className="text-red-500 font-bold">*</span>}
            </label>

            <input
                type="text"
                id={id}
                required={required}
                value={value || ""}
                onChange={() => { }}
                disabled={disabled}
                className="opacity-0 absolute pointer-events-none h-px w-px -z-10"
                tabIndex={-1}
            />

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-transparent"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute left-0 mt-1 w-full rounded-xl border border-gray-200 bg-white py-1 shadow-2xl z-50 overflow-hidden flex flex-col">
                        <div className="px-2 py-1.5 border-b border-gray-100 bg-gray-50/50">
                            <input
                                type="text"
                                placeholder="Search options..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-gray-200 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 bg-white"
                            />
                        </div>
                        <div className="max-h-56 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                            {filteredOptions.length === 0 ? (
                                <div className="px-3 py-3 text-xs text-gray-500 text-center">No matches found</div>
                            ) : (
                                filteredOptions.map(opt => {
                                    const isSelected = selectedValues.includes(String(opt.value));
                                    const lightStyle = opt.colour ? getLightColorStyle(opt.colour) : {};
                                    const displayLabel = opt.label || opt.value;
                                    return (
                                        <div
                                            key={opt.id || opt.value}
                                            onClick={() => handleOptionToggle(String(opt.value))}
                                            className={`px-3 py-2 text-sm cursor-pointer transition-all m-1 rounded-lg flex items-center justify-between ${opt.colour ? 'hover:brightness-95 active:brightness-90' : 'hover:bg-blue-50 text-gray-800'
                                                } ${isSelected ? (opt.colour ? 'ring-2 ring-blue-500 font-semibold' : 'bg-blue-50/50 font-semibold') : ''}`}
                                            style={lightStyle}
                                        >
                                            <div className="flex items-center truncate">
                                                {multiple && (
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        readOnly
                                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3 cursor-pointer"
                                                    />
                                                )}
                                                <span className="truncate">{displayLabel}</span>
                                            </div>
                                            {!multiple && isSelected && (
                                                <i className="fa-solid fa-check text-xs ml-2"></i>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CustomDropdown;
export { getLightColorStyle };
