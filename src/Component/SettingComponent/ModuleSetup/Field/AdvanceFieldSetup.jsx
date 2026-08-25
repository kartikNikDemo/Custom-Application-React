import React, { useState, useEffect } from "react";
import axiosInstance from "../../../BaseComponent/axiosInstance";
import TopBar from "../../../Common/TopBar";
import { DeleteIcon, EditIcon } from "../../../../Icon/Icon";
import EditFields from "./EditFields";
import toast from "react-hot-toast";

// Predefined Advanced Fields Constant
export const EMPLOYEE_ASSIGNMENT = {
    fieldName: "Assign To",
    fieldKey: "assignTo",
    fieldType: "DROPDOWN",
    required: false,
    uniqueField: false,
    defaultValue: "",
    visibleInList: true,
    visibleInCreate: true,
    visibleInEdit: true
};

const AdvanceFieldSetup = ({ module }) => {
    const [fields, setFields] = useState([]);
    const [modulesList, setModulesList] = useState([]);
    const [loadingFields, setLoadingFields] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    // Related Field Modal State
    const [showRelatedModal, setShowRelatedModal] = useState(false);
    const [selectedTargetModuleId, setSelectedTargetModuleId] = useState("");
    const [selectedTargetModuleFieldId, setSelectedTargetModuleFieldId] = useState("");
    const [targetFieldsList, setTargetFieldsList] = useState([]);
    const [fetchingTargetFields, setFetchingTargetFields] = useState(false);

    // Related Field Configuration State
    const [isRequired, setIsRequired] = useState(false);
    const [isUnique, setIsUnique] = useState(false);
    const [isVisibleInList, setIsVisibleInList] = useState(true);
    const [isVisibleInCreate, setIsVisibleInCreate] = useState(true);
    const [isVisibleInEdit, setIsVisibleInEdit] = useState(true);

    useEffect(() => {
        fetchModules();
    }, []);

    useEffect(() => {
        if (module?.id) {
            setEditingField(null);
            fetchModuleFields(module.id);
        }
    }, [module]);

    useEffect(() => {
        if (selectedTargetModuleId) {
            fetchTargetFields(selectedTargetModuleId);
        } else {
            setTargetFieldsList([]);
            setSelectedTargetModuleFieldId("");
        }
    }, [selectedTargetModuleId]);

    const fetchModules = async () => {
        try {
            const response = await axiosInstance.get("/module/getAllModule");
            setModulesList(response.data || []);
        } catch (error) {
            console.error("Error fetching modules:", error);
        }
    };

    const fetchTargetFields = async (targetId) => {
        setFetchingTargetFields(true);
        try {
            const response = await axiosInstance.get(`/field/getByModuleId/${targetId}`);
            setTargetFieldsList(response.data || []);
            if (response.data && response.data.length > 0) {
                setSelectedTargetModuleFieldId(response.data[0].id);
            } else {
                setSelectedTargetModuleFieldId("");
            }
        } catch (error) {
            console.error("Error fetching target module fields:", error);
            toast.error("Failed to load fields for the selected module.");
        } finally {
            setFetchingTargetFields(false);
        }
    };

    const fetchModuleFields = async (moduleId) => {
        setLoadingFields(true);
        try {
            const response = await axiosInstance.get(`/field/getByModuleId/${moduleId}`);
            // Filter fields to only show advanced/system fields (e.g. key is 'assignTo' or related fields)
            const advFields = (response.data || []).filter(
                (f) => f.fieldKey === EMPLOYEE_ASSIGNMENT.fieldKey || f.releatedTo === true
            );
            setFields(advFields);
        } catch (error) {
            console.error("Error fetching module fields:", error);
            toast.error("Failed to load module fields.");
        } finally {
            setLoadingFields(false);
        }
    };

    const handleStartEdit = (field) => {
        setEditingField(field);
    };

    const handleDelete = async (field) => {
        try {
            await axiosInstance.delete(`/field/delete/${field.id}`);
            toast.success("Field deleted successfully!");
            fetchModuleFields(module.id);
        } catch (error) {
            console.error("Error deleting field:", error);
            toast.error(error.response?.data?.message || "Failed to delete field.");
        }
    };

    const handleAddAdvancedField = async () => {
        if (!module?.id) {
            toast.error("No active module selected.");
            return;
        }

        setActionLoading(true);
        try {
            // Fetch all fields to compute display order
            const response = await axiosInstance.get(`/field/getByModuleId/${module.id}`);
            const allFields = response.data || [];
            const maxOrder = allFields.reduce((max, f) => Math.max(max, Number(f.displayOrder) || 0), 0);
            const nextDisplayOrder = maxOrder + 1;

            const payload = {
                ...EMPLOYEE_ASSIGNMENT,
                moduleId: module.id,
                displayOrder: nextDisplayOrder
            };

            // 1. Create the field
            await axiosInstance.post("/field/create", payload);

            toast.success("Assign To field added successfully!");
            fetchModuleFields(module.id);
        } catch (error) {
            console.error("Error adding advanced field:", error);
            toast.error(error.response?.data?.message || "Failed to add Assign To field.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreateRelatedField = async (e) => {
        e.preventDefault();
        if (!selectedTargetModuleId || !selectedTargetModuleFieldId) {
            toast.error("Please select a related module and field.");
            return;
        }

        setActionLoading(true);
        try {
            // Fetch all fields to compute display order
            const response = await axiosInstance.get(`/field/getByModuleId/${module.id}`);
            const allFields = response.data || [];
            const maxOrder = allFields.reduce((max, f) => Math.max(max, Number(f.displayOrder) || 0), 0);
            const nextDisplayOrder = maxOrder + 1;

            const selectedMod = modulesList.find(m => m.id === selectedTargetModuleId);

            const payload = {
                fieldName: selectedMod ? selectedMod.name : "Relation",
                fieldType: "DROPDOWN",
                required: isRequired,
                uniqueField: isUnique,
                defaultValue: "",
                visibleInList: isVisibleInList,
                visibleInCreate: isVisibleInCreate,
                visibleInEdit: isVisibleInEdit,
                releatedTo: true,
                relatedToModuleId: selectedTargetModuleId,
                relatedToModuleFieldId: selectedTargetModuleFieldId,
                moduleId: module.id,
                displayOrder: nextDisplayOrder
            };

            await axiosInstance.post("/field/create", payload);
            toast.success("Related field added successfully!");

            // Reset and close
            setShowRelatedModal(false);
            setSelectedTargetModuleId("");
            setSelectedTargetModuleFieldId("");
            setIsRequired(false);
            setIsUnique(false);
            setIsVisibleInList(true);
            setIsVisibleInCreate(true);
            setIsVisibleInEdit(true);

            fetchModuleFields(module.id);
        } catch (error) {
            console.error("Error creating related field:", error);
            toast.error(error.response?.data?.message || "Failed to add related field.");
        } finally {
            setActionLoading(false);
        }
    };

    if (!module) {
        return (
            <div className="text-center py-12 text-gray-500 text-sm">
                <i className="fa-solid fa-hand-pointer text-4xl text-blue-500 mb-3 block"></i>
                Please select a module from the left sidebar to configure advanced fields.
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col" style={{ animation: "fadeIn 0.25s ease-out" }}>
            <TopBar
                title={module.name + '  Advanced Field List'}
            />

            {editingField && (
                <EditFields
                    module={module}
                    field={editingField}
                    fetchModuleFields={fetchModuleFields}
                    onClose={() => setEditingField(null)}
                    modulesList={modulesList}
                />
            )}

            <div className="mt-6 w-full font-sans">
                {/* Actions Panel */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                    <div className="text-sm text-gray-500">
                        Configure relations between modules and specialized system assignments.
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        {!fields.some(f => f.fieldKey === "assignTo") && (
                            <button
                                type="button"
                                disabled={actionLoading}
                                onClick={handleAddAdvancedField}
                                className="flex-1 sm:flex-initial px-4 py-2 font-semibold text-xs rounded-lg text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 shadow-sm transition active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                            >
                                <i className="fa-solid fa-user-plus"></i> Enable Assign To
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => setShowRelatedModal(true)}
                            className="flex-1 sm:flex-initial px-4 py-2 font-semibold text-xs rounded-lg text-white bg-blue-600 hover:bg-blue-700 border-0 shadow-sm transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                        >
                            <i className="fa-solid fa-circle-plus"></i> Add Related Field
                        </button>
                    </div>
                </div>

                {loadingFields ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-gray-500 text-sm">Fetching advanced fields...</p>
                    </div>
                ) : fields.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                        <i className="fa-solid fa-circle-nodes text-4xl text-gray-300 mb-3 block"></i>
                        <h4 className="font-semibold text-gray-800 text-sm mb-1">No Advanced Fields</h4>
                        <p className="text-gray-500 text-xs max-w-sm mx-auto">
                            No advanced or related-to fields have been configured for this module. Use the buttons above to enable default features or link modules.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-xs">
                        <table className="min-w-full divide-y divide-gray-200 text-left bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Field Name</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Field Type</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Relation/Details</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Display Order</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Required</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unique</th>
                                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {fields.map((field) => (
                                    <tr
                                        key={field.id}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => handleStartEdit(field)}
                                        title="Click to edit field"
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="font-semibold text-gray-900">{field.fieldName}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="px-2 py-0.5 text-xs font-semibold rounded text-blue-700 border border-blue-300 bg-blue-50">
                                                {field.releatedTo ? "Related To" : field.fieldType}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                            {field.releatedTo ? (
                                                <span className="flex items-center gap-1">
                                                    <i className="fa-solid fa-link text-gray-400"></i>
                                                    Related to <strong>{modulesList.find(m => m.id === field.relatedToModuleId)?.name || "Loading..."}</strong>
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 font-medium">Employee Assignment</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                                            {field.displayOrder}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {field.required ? (
                                                <span className="text-emerald-600 font-bold">✓ Yes</span>
                                            ) : (
                                                <span className="text-rose-500 font-bold">✗ No</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            {field.uniqueField ? (
                                                <span className="text-blue-600 font-bold">✓ Yes</span>
                                            ) : (
                                                <span className="text-rose-500 font-bold">✗ No</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-end">
                                            <div className="flex gap-2 justify-end items-center" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    type="button"
                                                    className="p-1.5 flex items-center justify-center rounded-lg bg-transparent hover:bg-blue-50 text-blue-500 border border-blue-200 cursor-pointer w-7 h-7"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleStartEdit(field);
                                                    }}
                                                    title="Edit Field"
                                                >
                                                    <EditIcon size={14} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="p-1.5 flex items-center justify-center rounded-lg bg-transparent hover:bg-rose-50 text-rose-600 border border-rose-200 cursor-pointer w-7 h-7"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(field);
                                                    }}
                                                    title="Delete Field"
                                                >
                                                    <DeleteIcon size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Related Field Modal */}
            {showRelatedModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-lg rounded-2xl border border-gray-200 shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">
                                Add Related Field
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowRelatedModal(false)}
                                className="text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>

                        {/* Form Body */}
                        <form onSubmit={handleCreateRelatedField} className="p-6 flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Select Related Module</label>
                                <select
                                    className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                    value={selectedTargetModuleId}
                                    onChange={(e) => setSelectedTargetModuleId(e.target.value)}
                                    required
                                >
                                    <option value="">-- Choose Module --</option>
                                    {modulesList.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedTargetModuleId && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Select Display Field</label>
                                    {fetchingTargetFields ? (
                                        <div className="text-xs text-gray-400 py-2">Loading fields...</div>
                                    ) : (
                                        <select
                                            className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                                            value={selectedTargetModuleFieldId}
                                            onChange={(e) => setSelectedTargetModuleFieldId(e.target.value)}
                                            required
                                        >
                                            <option value="">-- Choose Field --</option>
                                            {targetFieldsList.map((fld) => (
                                                <option key={fld.id} value={fld.id}>
                                                    {fld.fieldName} ({fld.fieldType})
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-4 items-center my-1.5">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                                        checked={isRequired}
                                        onChange={(e) => setIsRequired(e.target.checked)}
                                    />
                                    <span className="text-sm text-gray-600">Required</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                                        checked={isUnique}
                                        onChange={(e) => setIsUnique(e.target.checked)}
                                    />
                                    <span className="text-sm text-gray-600">Unique</span>
                                </label>
                            </div>

                            <div className="flex gap-4 items-center mb-1.5">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                                        checked={isVisibleInList}
                                        onChange={(e) => setIsVisibleInList(e.target.checked)}
                                    />
                                    <span className="text-sm text-gray-600">Visible In List</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                                        checked={isVisibleInCreate}
                                        onChange={(e) => setIsVisibleInCreate(e.target.checked)}
                                    />
                                    <span className="text-sm text-gray-600">Visible In Create</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                                        checked={isVisibleInEdit}
                                        onChange={(e) => setIsVisibleInEdit(e.target.checked)}
                                    />
                                    <span className="text-sm text-gray-600">Visible In Edit</span>
                                </label>
                            </div>

                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => setShowRelatedModal(false)}
                                    className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg cursor-pointer bg-transparent"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg border-0 cursor-pointer shadow-md transition-colors"
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? "Creating..." : "Create Related Field"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdvanceFieldSetup;
