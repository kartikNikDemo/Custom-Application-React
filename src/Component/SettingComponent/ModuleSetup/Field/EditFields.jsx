import React, { useState, useEffect } from "react";
import FIELD_TYPE from "../../../../Enum/FIELD_TYPE";
import RESTRICTED_FIELDS from "../../../../Enum/RESTRICTED_FIELDS";
import axiosInstance from "../../../BaseComponent/axiosInstance";
import toast from "react-hot-toast";
import MultiFieldValues from "./MultiFieldValues";

const EditFields = ({ module, field, fetchModuleFields, onClose, modulesList = [] }) => {
    const [editingField, setEditingField] = useState({ ...field });
    const [updatingField, setUpdatingField] = useState(false);
    const [isMultiSelect, setIsMultiSelect] = useState(false);
    const [optionsList, setOptionsList] = useState([]);
    const [cancelOptions, setCancelOptions] = useState([]);
    const isAdvancedField = field?.fieldKey === "assignTo" || field?.releatedTo === true;

    const [relatedModuleName, setRelatedModuleName] = useState("");
    const [relatedFieldName, setRelatedFieldName] = useState("");

    useEffect(() => {
        if ((field?.fieldType === FIELD_TYPE.DROPDOWN || field?.fieldType === FIELD_TYPE.MULTISELECT) && !isAdvancedField) {
            setIsMultiSelect(true)
            fetchOptions(field.id)
        }
    }, [field, isAdvancedField]);

    useEffect(() => {
        if (field?.releatedTo && modulesList.length > 0) {
            const targetMod = modulesList.find(m => m.id === field.relatedToModuleId);
            setRelatedModuleName(targetMod?.name || "Unknown Module");

            if (field.relatedToModuleId && field.relatedToModuleFieldId) {
                axiosInstance.get(`/field/getByModuleId/${field.relatedToModuleId}`)
                    .then(res => {
                        const targetFld = (res.data || []).find(fld => fld.id === field.relatedToModuleFieldId);
                        setRelatedFieldName(targetFld?.fieldName || "Unknown Field");
                    })
                    .catch(err => console.error("Error fetching related field details:", err));
            }
        }
    }, [field, modulesList]);

    const handleClose = () => {
        setOptionsList([]);
        setIsMultiSelect(false);
        if (onClose) onClose();
    };

    const handleRemoveOption = (removedOption) => {
        if (removedOption && removedOption.id) {
            setCancelOptions(prev => [...prev, removedOption]);
        }
    };

    const handleEditChange = (key, value) => {
        setEditingField((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    const checkFieldType = (fieldType) => {
        setIsMultiSelect((fieldType === FIELD_TYPE.DROPDOWN || fieldType === FIELD_TYPE.MULTISELECT) && !isAdvancedField);
    };
    const fetchOptions = async (id) => {

        const response = await axiosInstance.get(`/multiFieldValue/getByFieldId/${id}`);

        setOptionsList(response.data)
    }

    const handleSaveEdit = async (e) => {
        e.preventDefault();

        const originalName = (field?.fieldName || "").trim().toLowerCase();
        const newName = (editingField.fieldName || "").trim().toLowerCase();

        if (newName !== originalName) {
            const isRestricted = RESTRICTED_FIELDS.some(
                restrictedField => restrictedField.trim().toLowerCase() === newName
            );

            if (isRestricted) {
                toast.error(`Field name "${editingField.fieldName}" is restricted.`);
                return;
            }
        }

        setUpdatingField(true);

        try {
            const response = await axiosInstance.put("/field/update", editingField);
            toast.success("Field updated successfully!");

            console.log("optionsList : " + optionsList)

            if (isMultiSelect) {

                const multiFieldValue = optionsList.map((option, index) => ({
                    id: option.id,
                    moduleId: module.id,
                    moduleFieldId: response.data.id, // ID returned from first API
                    value: option.value,
                    colour: option.colour,
                    companyId: response.data.companyId,
                    displayOrder: option.displayOrder ?? index + 1
                }));
                console.log("multiFieldValue : " + multiFieldValue)
                await axiosInstance.post("/multiFieldValue/bulkUpdate", multiFieldValue);

                // Delete removed options from database
                if (cancelOptions.length > 0) {
                    for (const option of cancelOptions) {
                        try {
                            await axiosInstance.delete(`/multiFieldValue/delete/${option.id}`);
                        } catch (delError) {
                            console.error(`Failed to delete option ID ${option.id}:`, delError);
                        }
                    }
                }
            }

            if (fetchModuleFields) {
                await fetchModuleFields(module.id);
            }
            handleClose();
        } catch (error) {
            console.error("Error updating field:", error);
            toast.error(error.response?.data?.message || "Failed to update field.");
        } finally {
            setUpdatingField(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto"
            onClick={handleClose}
        >
            <div
                className="bg-white w-full max-w-4xl rounded-2xl border border-gray-200 shadow-2xl flex flex-col overflow-hidden animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-bold text-gray-900">
                        Edit Custom Field
                    </h3>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Close Modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                {/* Form Body */}
                <form
                    onSubmit={handleSaveEdit}
                    className="p-6 flex flex-col gap-4 text-left"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Field Name</label>
                            <input
                                type="text"
                                className={`w-full text-sm border rounded-lg px-3 py-2 focus:outline-none ${
                                    isAdvancedField 
                                        ? "bg-gray-100 text-gray-500 border-gray-200 cursor-not-allowed" 
                                        : "bg-white text-gray-900 border-gray-300 focus:border-blue-500"
                                }`}
                                value={editingField.fieldName}
                                onChange={(e) => handleEditChange('fieldName', e.target.value)}
                                disabled={isAdvancedField}
                                required
                            />
                        </div>
                        {field?.releatedTo ? (
                            <div className="bg-blue-50/50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800 flex flex-col gap-1.5 justify-center">
                                <div className="font-semibold text-blue-900 text-sm flex items-center gap-1">
                                    <i className="fa-solid fa-link"></i> Relation Details
                                </div>
                                <div className="grid grid-cols-2 gap-1 text-xs">
                                    <div><strong>Module:</strong> {relatedModuleName}</div>
                                    <div><strong>Field:</strong> {relatedFieldName}</div>
                                </div>
                            </div>
                        ) : (
                            <div className={isAdvancedField ? 'hidden' : ''}>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Field Type</label>
                                <select
                                    className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                    value={editingField.fieldType}
                                    onChange={(e) => {
                                        handleEditChange('fieldType', e.target.value),
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
                        )}
                    </div>

                    {isMultiSelect && (
                        <MultiFieldValues
                            optionsList={optionsList}
                            setOptionsList={setOptionsList}
                            onRemoveOption={handleRemoveOption}
                        />
                    )}


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                        <div className={isAdvancedField ? 'hidden' : ''} >
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Default Value</label>
                            <input
                                type="text"
                                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                value={editingField.defaultValue || ""}
                                onChange={(e) => handleEditChange('defaultValue', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Display Order</label>
                            <input
                                type="number"
                                className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                value={editingField.displayOrder || 1}
                                onChange={(e) => handleEditChange('displayOrder', Number(e.target.value))}
                                min="1"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-6 items-center my-1.5">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                checked={editingField.required || false}
                                onChange={(e) => handleEditChange('required', e.target.checked)}
                            />
                            <span className="text-sm text-gray-600">Required</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                checked={editingField.uniqueField || false}
                                onChange={(e) => handleEditChange('uniqueField', e.target.checked)}
                            />
                            <span className="text-sm text-gray-600">Unique</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                checked={editingField.visibleInList || false}
                                onChange={(e) => handleEditChange('visibleInList', e.target.checked)}
                            />
                            <span className="text-sm text-gray-600">Visible In List</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                                checked={editingField.visibleInCreate}
                                onChange={(e) => handleEditChange('visibleInCreate', e.target.checked)}
                            />
                            <span className="text-sm text-gray-600">Visible In Create</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                                checked={editingField.visibleInEdit}
                                onChange={(e) => handleEditChange('visibleInEdit', e.target.checked)}
                            />
                            <span className="text-sm text-gray-600">Visible In Edit</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg cursor-pointer bg-transparent"
                            disabled={updatingField}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg border-0 cursor-pointer shadow-md transition-colors"
                            disabled={updatingField}
                        >
                            {updatingField ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default EditFields;
