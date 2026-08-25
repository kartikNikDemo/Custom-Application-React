import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../Component/BaseComponent/axiosInstance';
import InputField from '../../Component/Common/InputField';
import PublicHeader from '../../Component/Common/PublicHeader';

const PublicForm = () => {
    const { moduleKey, moduleId, companyId } = useParams();

    // Form & UI States
    const [fields, setFields] = useState([]);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');

    // Dynamic Module Branding States
    const [moduleName, setModuleName] = useState(moduleKey === "null" || !moduleKey ? "" : moduleKey);
    const [moduleDesc, setModuleDesc] = useState("");
    const [moduleColor, setModuleColor] = useState("");
    const [moduleIcon, setModuleIcon] = useState("");

    useEffect(() => {
        if (moduleId) {
            fetchFields();
            //     fetchModuleDetails(moduleId);
        }
    }, [moduleId]);

    const fetchModuleDetails = async (mId) => {
        try {
            const response = await axiosInstance.get(`/public/getByModuleId/${mId}`);
            const found = response.data;
            if (found) {
                setModuleName(found.name || found.moduleKey || moduleKey);
                setModuleDesc(found.description || "");
                setModuleColor(found.color || "");
                setModuleIcon(found.icon || "");
            }
        } catch (e) {
            console.error("Error fetching module details:", e);
        }
    };

    const fetchFields = async () => {
        try {
            const response = await axiosInstance.get(`/public/getByModuleId/${moduleId}`);
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
        setError('');

        try {
            const payload = {
                moduleId: moduleId,
                fieldAndValue: fields.map(field => ({
                    fieldId: field.id,
                    fieldValue: String(formData[field.fieldKey] ?? '')
                }))
            };

            console.log("Submitting record payload:", payload);
            await axiosInstance.post(`/public/create/${companyId}`, payload);
            setSubmitted(true);
        } catch (err) {
            console.error("Error creating record:", err);
            setError(err.response?.data?.message || "Failed to submit the form. Please check your inputs and try again.");
        } finally {
            setSaving(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
                <div className="bg-white border border-gray-100 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center transition-all duration-300" style={{ animation: "fadeIn 0.3s ease-out" }}>
                    <div
                        className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                        style={{
                            backgroundColor: `${moduleColor || '#10B981'}15`,
                            color: moduleColor || '#10B981',
                            border: `1px solid ${moduleColor || '#10B981'}30`
                        }}
                    >
                        <i className="fa-solid fa-circle-check text-3xl animate-bounce"></i>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Submitted Successfully!</h2>
                    <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                        Thank you for your response. Your data for <strong>{moduleName}</strong> has been successfully recorded.
                    </p>
                    <button
                        onClick={() => {
                            // Reset state
                            const initialData = {};
                            fields.forEach(field => {
                                initialData[field.fieldKey] = field.defaultValue ?? '';
                            });
                            setFormData(initialData);
                            setError('');
                            setSubmitted(false);
                        }}
                        style={{ backgroundColor: moduleColor || '#2563EB' }}
                        className="w-full py-3 text-white font-semibold rounded-2xl shadow-lg hover:brightness-95 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm"
                    >
                        <i className="fa-solid fa-rotate-right text-xs"></i>
                        Submit Another Response
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
            <div className="max-w-3xl w-full mx-auto">
                <div className="bg-white border border-gray-100 rounded-3xl p-8 sm:p-10 shadow-xl shadow-gray-100/50">
                    <PublicHeader
                        headerTitle={`Submit ${moduleName || 'Record'}`}
                        formDescription={moduleDesc || "Please fill out the form below to submit a record."}
                        moduleIcon={moduleIcon}
                        moduleColor={moduleColor}
                    />

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${moduleColor || '#2563EB'}`, borderTopColor: 'transparent' }}></div>
                            <p className="mt-4 text-sm font-medium text-gray-500">Loading form fields...</p>
                        </div>
                    ) : fields.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-gray-200/50 text-gray-400">
                                <i className="fa-solid fa-folder-open text-xl"></i>
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">No fields configured</h3>
                            <p className="mt-1 text-sm text-gray-500">This module does not have any visible fields for creation.</p>
                        </div>
                    ) : (
                        <form id="create-data-form" onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-2xl text-sm flex items-center gap-2.5 animate-fadeIn">
                                    <i className="fa-solid fa-triangle-exclamation text-rose-500 text-lg"></i>
                                    <span className="font-medium">{error}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {fields.map((field) => (
                                    <div key={field.id} className="w-full">
                                        <InputField
                                            field={field}
                                            value={formData[field.fieldKey]}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    style={{ backgroundColor: moduleColor || '#2563EB' }}
                                    className="w-full sm:w-auto px-8 py-3 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:brightness-95 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                >
                                    {saving ? (
                                        <>
                                            <i className="fa-solid fa-spinner animate-spin"></i>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fa-solid fa-paper-plane text-xs"></i>
                                            Submit Form
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicForm;