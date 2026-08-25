import React, { useState } from "react";
import FIELD_TYPE from "../../../../Enum/FIELD_TYPE";
import RESTRICTED_FIELDS from "../../../../Enum/RESTRICTED_FIELDS";
import axiosInstance from "../../../BaseComponent/axiosInstance";
import MultiFieldValues from "./MultiFieldValues";
import toast from "react-hot-toast";

const CreateField = ({ module, existingFields = [], fetchModuleFields, onClose }) => {
    const getNextDisplayOrder = () => {
        if (!existingFields || existingFields.length === 0) return 1;
        const maxOrder = Math.max(...existingFields.map(f => Number(f.displayOrder) || 0));
        return maxOrder > 0 ? maxOrder + 1 : 1;
    };

    const [isMultiSelect, setIsMultiSelect] = useState(false);
    const [creatingField, setCreatingField] = useState(false);
    const [optionsList, setOptionsList] = useState([]);
    const [newField, setNewField] = useState({
        fieldName: "",
        fieldType: "TEXT",
        required: false,
        uniqueField: false,
        defaultValue: "",
        visibleInList: true,
        visibleInCreate: true,
        visibleInEdit: true,
        displayOrder: getNextDisplayOrder()
    });



    const handleClose = () => {
        setNewField({
            fieldName: "",
            fieldType: "TEXT",
            required: false,
            uniqueField: false,
            defaultValue: "",
            visibleInList: true,
            visibleInCreate: true,
            visibleInEdit: true,
            displayOrder: getNextDisplayOrder()
        });
        setOptionsList([]);
        setIsMultiSelect(false);
        if (onClose) onClose();
    };

    const handleCreateField = async (e) => {
        e.preventDefault();

        const trimmedName = (newField.fieldName || "").trim().toLowerCase();
        const isRestricted = RESTRICTED_FIELDS.some(
            restrictedField => restrictedField.trim().toLowerCase() === trimmedName
        );

        if (isRestricted) {
            toast.error(`Field name "${newField.fieldName}" is restricted.`);
            return;
        }

        setCreatingField(true);

        const payload = {
            ...newField,
            moduleId: module.id
        };

        try {
            const response = await axiosInstance.post("/field/create", payload);

            // If field type is Multi Select
            if (isMultiSelect) {

                const multiFieldValue = optionsList.map((option, index) => ({
                    moduleId: module.id,
                    moduleFieldId: response.data.id, // ID returned from first API
                    value: option.value,
                    colour: option.colour,
                    displayOrder: option.displayOrder ?? index + 1
                }));

                await axiosInstance.post("/multiFieldValue/create", multiFieldValue);
            }

            toast.success("Field created successfully!");
            if (fetchModuleFields) {
                await fetchModuleFields(module.id);
            }
            handleClose();
        } catch (error) {
            console.error("Error creating field:", error);
            toast.error(error.response?.data?.message || "Failed to create field.");
        } finally {
            setCreatingField(false);
        }
    };

    const checkFieldType = (fieldType) => {
        setIsMultiSelect(fieldType === FIELD_TYPE.DROPDOWN || fieldType === FIELD_TYPE.MULTISELECT);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
            {/* Modal Card */}
            <div
                className="bg-white w-full max-w-4xl rounded-2xl border border-gray-200 shadow-2xl flex flex-col overflow-hidden animate-fadeIn"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900">
                        Create Custom Field
                    </h3>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Close Modal"
                    >
                        <i className="fa-solid fa-xmark text-lg"></i>
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleCreateField} className="p-6 flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div >
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Field Name</label>
                            <input
                                type="text"
                                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                placeholder="e.g. Phone Number"
                                value={newField.fieldName}
                                onChange={(e) => setNewField({ ...newField, fieldName: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Field Type</label>
                            <select
                                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                value={newField.fieldType}
                                onChange={(e) => {
                                    setNewField({ ...newField, fieldType: e.target.value });
                                    checkFieldType(e.target.value);
                                }}
                            >
                                {Object.values(FIELD_TYPE).map((type) => (
                                    <option key={type} value={type} className="bg-white text-gray-900">
                                        {type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {isMultiSelect && (
                        <MultiFieldValues
                            optionsList={optionsList}
                            setOptionsList={setOptionsList}
                        />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Default Value</label>
                            <input
                                type="text"
                                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                placeholder="Optional default value"
                                value={newField.defaultValue}
                                onChange={(e) => setNewField({ ...newField, defaultValue: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Display Order</label>
                            <input
                                type="number"
                                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                value={newField.displayOrder}
                                onChange={(e) => setNewField({ ...newField, displayOrder: e.target.value })}
                                min="1"
                                required
                                disabled
                            />
                        </div>
                    </div>
                    <div className="flex gap-6 items-center my-1.5">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                                checked={newField.required}
                                onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                            />
                            <span className="text-sm text-gray-600">Required</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                                checked={newField.uniqueField}
                                onChange={(e) => setNewField({ ...newField, uniqueField: e.target.checked })}
                            />
                            <span className="text-sm text-gray-600">Unique</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                                checked={newField.visibleInList}
                                onChange={(e) => setNewField({ ...newField, visibleInList: e.target.checked })}
                            />
                            <span className="text-sm text-gray-600">Visible In List</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                                checked={newField.visibleInCreate}
                                onChange={(e) => setNewField({ ...newField, visibleInCreate: e.target.checked })}
                            />
                            <span className="text-sm text-gray-600">Visible In Create</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                                checked={newField.visibleInEdit}
                                onChange={(e) => setNewField({ ...newField, visibleInEdit: e.target.checked })}
                            />
                            <span className="text-sm text-gray-600">Visible In Edit</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg cursor-pointer bg-transparent"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg border-0 cursor-pointer shadow-md transition-colors"
                            disabled={creatingField}
                        >
                            {creatingField ? "Creating..." : "Create Field"}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default CreateField;