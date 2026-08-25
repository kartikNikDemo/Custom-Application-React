import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../Component/BaseComponent/axiosInstance";
import toast from "react-hot-toast";
import { renderRecordValue } from "../List/renderRecordValue";

const ModuleRecordInfo = () => {
    const { moduleKey, moduleId, recordId } = useParams();
    const navigate = useNavigate();
    const [fields, setFields] = useState([]);
    const [recordData, setRecordData] = useState({});
    const [relationOptions, setRelationOptions] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (moduleId && recordId) {
            fetchPreviewDetails();
        }
    }, [moduleId, recordId]);

    const fetchPreviewDetails = async () => {
        setLoading(true);
        try {
            // 1. Fetch module fields and record data in parallel
            const [fieldsResponse, recordResponse] = await Promise.all([
                axiosInstance.get(`/field/getByModuleId/${moduleId}`),
                axiosInstance.get(`/recordFieldValue/getRecordDataForEdit/${recordId}`)
            ]);

            const fieldsData = fieldsResponse.data || [];
            const recordsData = recordResponse.data || [];

            // Filter fields visible in edit or list view to decide what to show
            const visibleFields = fieldsData.filter(f => f.visibleInEdit === true || f.visibleInList === true);
            setFields(visibleFields);

            // Align values
            const alignedData = {};
            fieldsData.forEach(field => {
                const matched = recordsData.find(r => r.fieldId === field.id);
                alignedData[field.fieldKey] = matched ? matched.fieldValue : (field.defaultValue ?? '');
            });
            setRecordData(alignedData);

            // 2. Fetch options for relation fields in parallel
            const relationFields = visibleFields.filter(f => f.relatedTo || f.releatedTo);
            const relationMap = {};

            await Promise.all(relationFields.map(async (field) => {
                try {
                    const res = await axiosInstance.get(
                        `/recordFieldValue/getRecordIdAndValue?moduleId=${field.relatedToModuleId}&fieldId=${field.relatedToModuleFieldId}`
                    );
                    relationMap[field.id] = res.data || [];
                } catch (err) {
                    console.error(`Error fetching relation for field ${field.id}:`, err);
                }
            }));

            setRelationOptions(relationMap);

        } catch (error) {
            console.error("Error loading record preview:", error);
            toast.error("Failed to load record details.");
            navigate(`/${moduleKey}/${moduleId}`);
        } finally {
            setLoading(false);
        }
    };

    // Helper to get relation display value
    const getRelationDisplayValue = (field, savedVal) => {
        if (!savedVal) return "-";
        const options = relationOptions[field.id] || [];
        const matched = options.find(opt => String(opt.recordId).trim() === String(savedVal).trim());
        return matched ? (matched.value || "(Empty)") : savedVal;
    };

    // Helper to format values for display
    const formatValue = (field) => {
        const rawValue = recordData[field.fieldKey];
        if (rawValue === undefined || rawValue === null || rawValue === '') {
            return "-";
        }

        if (field.relatedTo || field.releatedTo) {
            return getRelationDisplayValue(field, rawValue);
        }

        return renderRecordValue(rawValue, field.fieldType);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-transparent">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Loading details...</p>
            </div>
        );
    }

    if (fields.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                No preview fields configured for this module.
            </div>
        );
    }

    // Split fields for visual balance across two main grids
    const midIndex = Math.ceil(fields.length / 2);
    const leftFields = fields.slice(0, midIndex);
    const rightFields = fields.slice(midIndex);

    // Get a title for the record based on the first field's value
    const recordTitle = fields[0] ? formatValue(fields[0]) : "Record Detail";

    return (
        <div className="space-y-6 animate-fadeIn font-sans">
            {/* Unified Record Details Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs transition-all duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Left Column Fields */}
                    <div className="space-y-4">
                        {leftFields.map(field => (
                            <div key={field.id}>
                                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">{field.fieldName}</span>
                                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1 block">
                                    {formatValue(field)}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Right Column Fields */}
                    <div className="space-y-4">
                        {rightFields.map(field => (
                            <div key={field.id}>
                                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">{field.fieldName}</span>
                                <span className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1 block">
                                    {formatValue(field)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModuleRecordInfo;
