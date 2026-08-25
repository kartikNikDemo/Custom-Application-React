import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const MultiFieldValues = ({ optionsList = [], setOptionsList, onRemoveOption }) => {
    const [multiFieldValue, setmultiFieldValue] = useState({
        value: "",
        fieldType: "DROPDOWN",
        required: false,
        uniqueField: false,
        defaultValue: "",
        displayOrder: 1,
        color: "#111112ff"
    });

    const [draggedIndex, setDraggedIndex] = useState(null);

    useEffect(() => {
        setmultiFieldValue(prev => ({
            ...prev,
            displayOrder: optionsList.length + 1
        }));
    }, [optionsList.length]);

    const handleAddOption = () => {
        if (!multiFieldValue.value.trim()) return;

        if (optionsList.some(opt => opt.value.toLowerCase() === multiFieldValue.value.trim().toLowerCase())) {
            toast.error("An option with this value already exists.");
            return;
        }

        setOptionsList(prev => [
            ...prev,
            {
                ...multiFieldValue,
                value: multiFieldValue.value.trim(),
                defaultValue: multiFieldValue.value.trim(),
                colour: multiFieldValue.color
            }
        ]);

        setmultiFieldValue(prev => ({
            ...prev,
            value: "",
            defaultValue: "",
            color: "#111112ff"
        }));
    };

    const handleRemoveOption = (indexToRemove) => {
        const removedItem = optionsList[indexToRemove];
        if (onRemoveOption) {
            onRemoveOption(removedItem);
        }
        setOptionsList(prev => {
            const filtered = prev.filter((_, index) => index !== indexToRemove);
            return filtered.map((opt, i) => ({
                ...opt,
                displayOrder: i + 1
            }));
        });
    };

    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
        e.currentTarget.style.opacity = "0.5";
    };

    const handleDragEnd = (e) => {
        e.currentTarget.style.opacity = "1";
        setDraggedIndex(null);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === targetIndex) return;

        const updatedList = [...optionsList];
        const [draggedItem] = updatedList.splice(draggedIndex, 1);
        updatedList.splice(targetIndex, 0, draggedItem);

        const reorderedList = updatedList.map((item, idx) => ({
            ...item,
            displayOrder: idx + 1
        }));

        setOptionsList(reorderedList);
    };

    return (
        <div className="border border-gray-200 bg-gray-60/50 p-5 rounded-2xl flex flex-col gap-4 w-full">
            <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <i className="fa-solid fa-list-ul text-blue-600"></i>
                Field Options Setup
            </h4>
            <p className="text-xs text-gray-500 -mt-2">Configure the selectable list options for this dropdown/multiselect field.</p>

            {/* Added Options List */}
            {optionsList.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-white border border-gray-200 rounded-xl max-h-36 overflow-y-auto w-full">
                    {optionsList.map((opt, index) => {
                        const optionColor = opt.colour || opt.color || "#111112ff";
                        return (
                            <div
                                key={index}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                                onDrop={(e) => handleDrop(e, index)}
                                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold border shadow-2xs transition hover:shadow-xs select-none"
                                style={{
                                    backgroundColor: `${optionColor}15`,
                                    borderColor: `${optionColor}40`,
                                    color: optionColor,
                                    cursor: "grab"
                                }}
                                title="Drag to reorder"
                            >
                                <i className="fa-solid fa-grip-vertical opacity-40 text-[9px] -ml-0.5 cursor-grab"></i>
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: optionColor }}></span>
                                <span>{opt.value}</span>
                                <span className="text-[10px] bg-black/5 text-gray-500 px-1 rounded-sm">Order: {opt.displayOrder}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveOption(index)}
                                    className="text-gray-400 hover:text-red-500 bg-transparent border-0 cursor-pointer p-0 text-sm leading-none flex items-center justify-center font-bold"
                                    title="Remove option"
                                >
                                    ×
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Inputs for adding new option */}
            <div className="grid grid-cols-12 gap-3 items-end bg-white border border-gray-100 p-4 rounded-xl shadow-2xs w-full">
                {/* Option Value */}
                <div className="col-span-5">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Option Value</label>
                    <input
                        type="text"
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        placeholder="e.g. In Progress"
                        value={multiFieldValue.value}
                        onChange={(e) => setmultiFieldValue({ ...multiFieldValue, value: e.target.value, defaultValue: e.target.value })}
                    />
                </div>

                {/* Option Color */}
                <div className="col-span-4">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Option Color</label>
                    <div className="flex gap-2 items-center">
                        <input
                            type="color"
                            className="w-10 h-9 p-0.5 bg-white border border-gray-300 rounded-lg cursor-pointer shrink-0"
                            value={multiFieldValue.color || '#111112ff'}
                            onChange={(e) => setmultiFieldValue({ ...multiFieldValue, color: e.target.value })}
                        />
                        <input
                            type="text"
                            className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 uppercase"
                            value={multiFieldValue.color || '#111112ff'}
                            onChange={(e) => setmultiFieldValue({ ...multiFieldValue, color: e.target.value })}
                        />
                    </div>
                </div>

                {/* Order */}
                <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Order</label>
                    <input
                        type="number"
                        className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                        value={multiFieldValue.displayOrder}
                        onChange={(e) => setmultiFieldValue({ ...multiFieldValue, displayOrder: parseInt(e.target.value, 10) || 1 })}
                        min="1"
                    />
                </div>

                {/* Add Button */}
                <div className="col-span-1">
                    <button
                        type="button"
                        onClick={handleAddOption}
                        className="w-full h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center cursor-pointer border-0 shadow-sm transition hover:scale-105 active:scale-95 text-xs font-bold"
                        title="Add to Options"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MultiFieldValues;
