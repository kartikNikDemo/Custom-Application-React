import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../Component/BaseComponent/axiosInstance";
import CustomNavbar from "../../../Component/Layout/CustomNavbar";
import TopBar from "../../../Component/Common/TopBar";
import Button from "../../../Component/Common/Button";
import InputField from "../../../Component/Common/InputField";

const EditData = () => {
    const { moduleKey, moduleId, recordId } = useParams();
    const navigate = useNavigate();
    const [fields, setFields] = useState([]);
    const [records, setRecords] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [canEditAccess, setCanEditAccess] = useState(true);
    const [moduleName, setModuleName] = useState(moduleKey === "null" || !moduleKey ? "" : moduleKey);
    const [dropdownOptions, setDropdownOptions] = useState({});

    useEffect(() => {
        if (recordId && moduleId) {
            initializeForm();
            fetchModuleName(moduleId);
            checkModuleAccess(moduleId);
        }
    }, [recordId, moduleId]);

    useEffect(() => {
        if (fields.length > 0) {
            fetchAllDropdownOptions();
        }
    }, [fields]);

    const fetchAllDropdownOptions = async () => {
        const optionsMap = {};
        const dropdownFields = fields.filter(
            f => (f.fieldType === 'DROPDOWN' || f.relatedTo || f.releatedTo) && f.fieldKey !== 'assignTo'
        );

        await Promise.all(dropdownFields.map(async (field) => {
            try {
                if (field.relatedTo || field.releatedTo) {
                    const response = await axiosInstance.get(
                        `/recordFieldValue/getRecordIdAndValue?moduleId=${field.relatedToModuleId}&fieldId=${field.relatedToModuleFieldId}`
                    );
                    optionsMap[field.id] = (response.data || []).map(opt => ({
                        value: opt.recordId,
                        label: opt.value || "(Empty)"
                    }));
                } else {
                    const response = await axiosInstance.get(`/multiFieldValue/getByFieldId/${field.id}`);
                    optionsMap[field.id] = response.data || [];
                }
            } catch (error) {
                console.error(`Error fetching options for field ${field.id}:`, error);
            }
        }));

        setDropdownOptions(optionsMap);
    };

    const checkModuleAccess = async (moduleId) => {

        const moduleAccessData = localStorage.getItem('moduleAccess');
        const role = localStorage.getItem('role');
        console.log(moduleAccessData)
        const moduleAccessList = JSON.parse(moduleAccessData);

        const moduleAccess = moduleAccessList.find(
            (item) => item.moduleId === moduleId
        );

        if (role === "ROLE_EMPLOYEE") {

            setCanEditAccess(moduleAccess.canEdit);

        }
    }

    const fetchModuleName = async (mId) => {
        try {
            const response = await axiosInstance.get('/module/getAllModule');
            const found = (response.data || []).find(m => String(m.id) === String(mId));
            if (found) {
                setModuleName(found.name || found.moduleKey || moduleKey);
            }
        } catch (e) {
            console.error("Error fetching module name:", e);
        }
    };

    const initializeForm = async () => {
        setLoading(true);
        try {
            // Fetch fields and record data in parallel
            const [fieldsData, recordsData] = await Promise.all([
                fetchFields(),
                fetchRecords()
            ]);

            // Match fields with record values and build initialData state
            const initialData = {};
            fieldsData.forEach(field => {
                const matchedRecord = recordsData.find(r => r.fieldId === field.id);
                initialData[field.fieldKey] = matchedRecord ? matchedRecord.fieldValue : (field.defaultValue ?? '');
            });
            setFormData(initialData);
        } catch (error) {
            console.error("Error initializing edit form:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFields = async () => {
        try {
            const response = await axiosInstance.get(`/field/getByModuleId/${moduleId}`);

            const visibleFields = (response.data || []).filter(field => field.visibleInEdit === true);

            setFields(visibleFields);
            return visibleFields || [];
        } catch (error) {
            console.error("Error fetching module fields:", error);
            return [];
        }
    };

    const fetchRecords = async () => {
        try {
            const response = await axiosInstance.get(`/recordFieldValue/getRecordDataForEdit/${recordId}`);
            setRecords(response.data);
            return response.data || [];
        } catch (error) {
            console.error("Error fetching record values:", error);
            return [];
        }
    };

    const handleInputChange = (fieldKey, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldKey]: value
        }));
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                moduleId: moduleId,
                recordId: recordId,
                recordFieldValueIdandValue: fields.map(field => {
                    const matchedRecord = records.find(r => r.fieldId === field.id);
                    return {
                        recordFieldValueId: matchedRecord ? matchedRecord.recordFieldValueId : null,
                        fieldId: field.id,
                        fieldValue: String(formData[field.fieldKey] ?? '')
                    };
                })
            };

            console.log("Submitting update payload:", payload);
            await axiosInstance.put("/recordFieldValue/update", payload);

            // Redirect back to list after save
            navigate(`/${moduleKey}/${moduleId}`);
        } catch (error) {
            console.error("Error updating record:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <CustomNavbar />
            <div className="mx-auto ">
                <TopBar
                    showButton={canEditAccess}
                    title={`Edit ${moduleName || 'Record'}`}
                    buttonText={saving ? "Saving..." : "Save Changes"}
                    buttonVariant="primary"
                    buttonType="submit"
                    form="edit-data-form"
                    actions={
                        <Button
                            variant="secondary"
                            onClick={() => navigate(`/${moduleKey}/${moduleId}`)}
                            className="transition-all duration-200 hover:scale-105 active:scale-95 font-semibold"
                        >
                            Back to List
                        </Button>
                    }
                />

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    {loading ? (
                        <div className="text-center py-6 text-gray-500">Loading record data...</div>
                    ) : fields.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">No fields configured for this module.</div>
                    ) : (
                        <form id="edit-data-form" onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {fields.map((field) => (
                                    <div key={field.id} className="w-full">
                                        <InputField
                                            field={field}
                                            value={formData[field.fieldKey]}
                                            onChange={handleInputChange}
                                            canEditAccess={canEditAccess}
                                            options={dropdownOptions[field.id]}
                                        />
                                    </div>
                                ))}
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default EditData;