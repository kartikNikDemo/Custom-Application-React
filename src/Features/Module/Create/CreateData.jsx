import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../Component/BaseComponent/axiosInstance';
import CustomNavbar from '../../../Component/Layout/CustomNavbar';
import Button from '../../../Component/Common/Button';
import InputField from '../../../Component/Common/InputField';
import TopBar from '../../../Component/Common/TopBar';

const CreateData = () => {
    const { moduleKey, moduleId } = useParams();
    const navigate = useNavigate();
    const [fields, setFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [moduleName, setModuleName] = useState(moduleKey === "null" || !moduleKey ? "" : moduleKey);
    const [canCreateAccess, setCanCreateAccess] = useState(true)
    const [dropdownOptions, setDropdownOptions] = useState({});

    useEffect(() => {
        if (moduleId) {
            fetchFields();
            fetchModuleName(moduleId);
            checkModuleAccess(moduleId);
        }
    }, [moduleId]);

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

    const checkModuleAccess = async (moduleId) => {

        const moduleAccessData = localStorage.getItem('moduleAccess');
        const role = localStorage.getItem('role');
        console.log(moduleAccessData)
        const moduleAccessList = JSON.parse(moduleAccessData);

        const moduleAccess = moduleAccessList.find(
            (item) => item.moduleId === moduleId
        );

        if (role === "ROLE_EMPLOYEE") {

            setCanCreateAccess(moduleAccess.canCreate);

        }
    }


    const fetchFields = async () => {
        try {
            const response = await axiosInstance.get(`/field/getByModuleId/${moduleId}`);
            // Filter the response data to show only fields where visibleInCreate is true
            const visibleFields = (response.data || []).filter(field => field.visibleInCreate === true);

            setFields(visibleFields);

            // Initialize form data structure
            const initialData = {};
            response.data.forEach(field => {
                initialData[field.fieldKey] = field.defaultValue ?? '';
            });
            setFormData(initialData);
        } catch (error) {
            console.error("Error fetching module fields:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (fieldId, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                moduleId: moduleId,
                fieldAndValue: fields.map(field => ({
                    fieldId: field.id,
                    fieldValue: String(formData[field.fieldKey] ?? '')
                }))
            };

            console.log("Submitting record payload:", payload);
            await axiosInstance.post("/recordFieldValue/create", payload);

            // Redirect back to list after save
            navigate(`/${moduleKey}/${moduleId}`);
        } catch (error) {
            console.error("Error creating record:", error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <CustomNavbar />
            <div className="mx-auto ">
                <TopBar
                    showButton={canCreateAccess}
                    title={`Create ${moduleName || 'Record'}`}
                    buttonText={saving ? "Saving..." : "Save"}
                    buttonVariant="primary"
                    buttonType="submit"
                    form="create-data-form"
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
                        <div className="text-center py-6 text-gray-500">Loading fields...</div>
                    ) : fields.length === 0 ? (
                        <div className="text-center py-6 text-gray-500">No fields configured for this module.</div>
                    ) : (
                        <form id="create-data-form" onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {fields.map((field) => (
                                    <div key={field.id} className="w-full">
                                        <InputField
                                            field={field}
                                            value={formData[field.fieldKey]}
                                            onChange={handleInputChange}
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

export default CreateData;
