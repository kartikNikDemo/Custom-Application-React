import React, { useState, useEffect } from "react";
import axiosInstance from '../../../BaseComponent/axiosInstance';
import CreateField from "./CreateField";
import EditFields from "./EditFields";
import TopBar from "../../../Common/TopBar";
import { EditIcon, DeleteIcon } from "../../../../Icon/Icon";
import toast from "react-hot-toast";

const FieldSetup = ({ module }) => {
    const [fields, setFields] = useState([]);
    const [loadingFields, setLoadingFields] = useState(false);
    const [editingField, setEditingField] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));

    useEffect(() => {
        if (module?.id) {
            setEditingField(null);
            fetchModuleFields(module.id);
        }
    }, [module]);

    const fetchModuleFields = async (moduleId) => {
        setLoadingFields(true);
        setFields([]);
        try {
            const response = await axiosInstance.get(`/field/getByModuleId/${moduleId}`);
            console.log("Fetched fields:", response.data);
            const sortedFields = [...response.data].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
            const nonAdvSortFields = sortedFields.filter(
                (f) => f.fieldKey !== "assignTo"
            );

            setFields(nonAdvSortFields);
        } catch (error) {
            console.error("Error fetching module fields:", error);
        } finally {
            setLoadingFields(false);
        }
    };

    const handleShareLink = () => {
        if (!module || !companyId) {
            toast.error("Module or Company ID not found!");
            return;
        }
        const publicLink = `${window.location.origin}/${module.moduleKey || module.name}/${module.id}/${companyId}/publicForm`;
        navigator.clipboard.writeText(publicLink)
            .then(() => {
                toast.success("Public Form Link copied to clipboard!");
            })
            .catch((err) => {
                console.error("Could not copy text: ", err);
                toast.error("Failed to copy link.");
            });
    };

    const handleStartEdit = (field) => {
        setEditingField(field);
    };

    const handleDelete = async (field) => {
        try {
            const response = await axiosInstance.delete(`/field/delete/${field.id}`);
            toast.success("Field deleted successfully!");
            fetchModuleFields(module.id);
        } catch (error) {
            console.error("Error deleting field:", error);
            toast.error(error.response?.data?.message || "Failed to delete field.");
        }
    };

    if (!module) {
        return (
            <div className="text-center py-12 text-gray-500 text-sm">
                <i className="fa-solid fa-hand-pointer text-4xl text-blue-500 mb-3 block"></i>
                Please select a module from the left sidebar to configure its fields.
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col" style={{ animation: "fadeIn 0.25s ease-out" }} >
            <TopBar
                showButton={true}
                title={module.name + '  Field Schema List'}
                buttonText="Create"
                onButtonClick={() => setShowCreateModal(true)}
                actions={
                    <button
                        type="button"
                        onClick={handleShareLink}
                        className="px-4 py-2 font-medium rounded-lg shadow-sm transition duration-150 ease-in-out text-sm flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-semibold cursor-pointer active:scale-95 transform duration-200 border-0"
                    >
                        <i className="fa-solid fa-share-nodes"></i>
                        Share Form Link
                    </button>
                }
            />

            {showCreateModal && (
                <CreateField
                    module={module}
                    existingFields={fields}
                    fetchModuleFields={fetchModuleFields}
                    onClose={() => setShowCreateModal(false)}
                />
            )}

            {editingField && (
                <EditFields
                    module={module}
                    field={editingField}
                    fetchModuleFields={fetchModuleFields}
                    onClose={() => setEditingField(null)}
                />
            )}

            <div className="mt-6 w-full">
                <div>
                    {loadingFields ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                            <p className="text-gray-500 text-sm">Fetching custom fields...</p>
                        </div>
                    ) : fields.length === 0 ? (
                        <p className="text-gray-500 text-center py-12 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                            No custom fields found for this module.
                        </p>
                    ) : (
                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                            <table className="min-w-full divide-y divide-gray-200 text-left bg-white">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Field Name</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Field Type</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider ">Default Value</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Display Order</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Required</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unique</th>
                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-end">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {fields.map((field) => {
                                        return (
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
                                                    <span className="px-2 py-0.5 text-xs font-semibold rounded  text-gray-700 border border-gray-300">
                                                        {field.fieldType}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                                                    {field.defaultValue || <span className="text-gray-400 text-sm">None</span>}
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
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FieldSetup;
