import React, { useState } from "react";
import axiosInstance from "../BaseComponent/axiosInstance";
import toast from "react-hot-toast";

const TEMPLATES = [
    {
        id: "lead-management",
        name: "Lead Management",
        subtitle: "Industry Standard CRM Suite",
        description: "Comprehensive CRM lead lifecycle suite with Lead, Contact, Company, Meeting, and Note modules.",
        icon: "fa-bullseye",
        color: "#E91E63",
        modules: [
            {
                name: "Lead",
                icon: "fa-user-plus",
                color: "#E91E63",
                description: "Prospect & lead tracking with source attribution, qualification, and stage progression.",
                fields: [
                    { fieldName: "Lead Name", fieldType: "TEXT", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "First Name", fieldType: "TEXT", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Last Name", fieldType: "TEXT", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Phone", fieldType: "PHONE", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Alternate Phone", fieldType: "PHONE", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Email", fieldType: "EMAIL", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Company", fieldType: "TEXT", required: false, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Designation", fieldType: "TEXT", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Website", fieldType: "URL", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Address", fieldType: "TEXTAREA", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "City", fieldType: "TEXT", required: false, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "State", fieldType: "TEXT", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Country", fieldType: "TEXT", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Industry", fieldType: "TEXT", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Lead Source", fieldType: "DROPDOWN", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true, options: ["Website", "Facebook", "Instagram", "LinkedIn", "Google Ads", "Google Search", "YouTube", "WhatsApp", "Email", "Phone Call", "Referral", "Walk-in", "Trade Show", "Partner", "Existing Customer", "Other"] },
                    { fieldName: "Lead Type", fieldType: "DROPDOWN", required: false, visibleInList: true, visibleInCreate: true, visibleInEdit: true, options: ["B2B", "B2C", "Enterprise", "SMB", "Individual", "Partner", "Other"] },
                    { fieldName: "Lead Status", fieldType: "DROPDOWN", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true, options: ["New", "Contacted", "Qualified", "Meeting", "Proposal", "Negotiation", "Won", "Lost"] },
                    { fieldName: "Lead Priority", fieldType: "DROPDOWN", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true, options: ["Low", "Medium", "High", "Urgent"] },
                    { fieldName: "Lead Rating", fieldType: "DROPDOWN", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true, options: ["Cold", "Warm", "Hot"] },
                    { fieldName: "Expected Purchase Date", fieldType: "DATE", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Next Follow-up Date", fieldType: "DATE", required: false, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Lost Reason", fieldType: "DROPDOWN", required: false, visibleInList: false, visibleInCreate: false, visibleInEdit: true, options: ["Price Too High", "Competitor", "No Requirement", "No Response", "Not Interested", "Budget Issue", "Timing Issue", "Duplicate", "Other"] }
                ]
            },
            {
                name: "Contact",
                icon: "fa-address-book",
                color: "#3F51B5",
                description: "Individual contacts, clients, and decision makers associated with leads and accounts.",
                fields: [
                    { fieldName: "First Name", fieldType: "TEXT", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Last Name", fieldType: "TEXT", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Email", fieldType: "EMAIL", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Phone", fieldType: "PHONE", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Mobile", fieldType: "PHONE", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Designation", fieldType: "TEXT", required: false, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Department", fieldType: "TEXT", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Company Name", fieldType: "TEXT", required: false, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Contact Type", fieldType: "DROPDOWN", required: false, visibleInList: true, visibleInCreate: true, visibleInEdit: true, options: ["Primary Contact", "Decision Maker", "Influencer", "Billing Contact", "Technical Contact", "Other"] },
                    { fieldName: "Address", fieldType: "TEXTAREA", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "City", fieldType: "TEXT", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true }
                ]
            },
            {
                name: "Company",
                icon: "fa-building",
                color: "#00BCD4",
                description: "Business accounts, organizations, and client company profiles.",
                fields: [
                    { fieldName: "Company Name", fieldType: "TEXT", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Industry", fieldType: "DROPDOWN", required: false, visibleInList: true, visibleInCreate: true, visibleInEdit: true, options: ["Information Technology", "Manufacturing", "Finance & Banking", "Healthcare", "Retail & E-commerce", "Real Estate", "Education", "Consulting", "Other"] },
                    { fieldName: "Website", fieldType: "URL", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Email", fieldType: "EMAIL", required: false, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Phone", fieldType: "PHONE", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Employee Count", fieldType: "NUMBER", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Annual Revenue", fieldType: "NUMBER", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Address", fieldType: "TEXTAREA", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "City", fieldType: "TEXT", required: false, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Country", fieldType: "TEXT", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true }
                ]
            },
            {
                name: "Meeting",
                icon: "fa-calendar-days",
                color: "#FF9800",
                description: "Appointments, discovery calls, demos, and client interactions.",
                fields: [
                    { fieldName: "Meeting Title", fieldType: "TEXT", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Meeting Type", fieldType: "DROPDOWN", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true, options: ["Discovery Call", "Product Demo", "Proposal Review", "Negotiation Meeting", "Follow-up", "Client Check-in"] },
                    { fieldName: "Date", fieldType: "DATE", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Time", fieldType: "TIME", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Duration (Minutes)", fieldType: "NUMBER", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Status", fieldType: "DROPDOWN", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true, options: ["Scheduled", "Completed", "Cancelled", "Rescheduled"] },
                    { fieldName: "Meeting Notes", fieldType: "TEXTAREA", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true }
                ]
            },
            {
                name: "Note",
                icon: "fa-note-sticky",
                color: "#10B981",
                description: "Call notes, client memos, and internal sales correspondence.",
                fields: [
                    { fieldName: "Note Title", fieldType: "TEXT", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Note Category", fieldType: "DROPDOWN", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true, options: ["Call Summary", "Meeting Minutes", "Customer Requirement", "Internal Note", "Follow-up Memo"] },
                    { fieldName: "Note Content", fieldType: "TEXTAREA", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Date", fieldType: "DATE", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true }
                ]
            }
        ]
    },
    {
        id: "task-management",
        name: "Task Management",
        subtitle: "Productivity & Operations",
        description: "Handle creating, assigning, tracking, prioritizing, and completing tasks.",
        icon: "fa-list-check",
        color: "#2196F3",
        modules: [
            {
                name: "Task",
                icon: "fa-list-check",
                color: "#2196F3",
                description: "Task tracking, due dates, priority management, and reminders.",
                fields: [
                    { fieldName: "Task Title", fieldType: "TEXT", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Task Description", fieldType: "TEXTAREA", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Task Status", fieldType: "DROPDOWN", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true, options: ["New", "Pending", "In Progress", "On Hold", "Completed", "Cancelled"] },
                    { fieldName: "Task Priority", fieldType: "DROPDOWN", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true, options: ["Low", "Medium", "High", "Urgent"] },
                    { fieldName: "Task Type", fieldType: "DROPDOWN", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true, options: ["Call", "Follow-up", "Meeting", "Email", "Demo", "Development", "Review", "Documentation", "Research", "Other"] },
                    { fieldName: "Start Date", fieldType: "DATE", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Due Date", fieldType: "DATE", required: true, visibleInList: true, visibleInCreate: true, visibleInEdit: true },
                    { fieldName: "Reminder", fieldType: "DROPDOWN", required: false, visibleInList: false, visibleInCreate: true, visibleInEdit: true, options: ["No Reminder", "At Due Time", "5 Minutes Before", "15 Minutes Before", "30 Minutes Before", "1 Hour Before", "1 Day Before", "Custom"] },
                    { fieldName: "Labels", fieldType: "MULTISELECT", required: false, visibleInList: true, visibleInCreate: true, visibleInEdit: true, options: ["Urgent", "Customer", "Internal", "Important", "Follow-up", "Finance", "Sales", "Development"] }
                ]
            }
        ]
    }
];

const PRESET_COLORS = [
    "#2196F3", "#4CAF50", "#FF9800", "#E91E63", "#9C27B0", "#00BCD4", "#3F51B5", "#EF4444", "#10B981", "#6366F1"
];

const TempalteList = ({ onTemplateImplemented }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
    const [selectedModuleIndex, setSelectedModuleIndex] = useState(0);
    const [isImplementing, setIsImplementing] = useState(false);

    // Active sub-module within the selected template
    const currentModule = selectedTemplate.modules[selectedModuleIndex] || selectedTemplate.modules[0];

    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template);
        setSelectedModuleIndex(0);
    };

    const handleImplement = async () => {
        if (!selectedTemplate || !selectedTemplate.modules.length) return;

        setIsImplementing(true);
        const loadingToast = toast.loading(`Checking & implementing ${selectedTemplate.name}...`);

        try {
            // 1. Fetch all existing modules to check for duplicates
            const response = await axiosInstance.get("/module/getAllModule");
            const existingModules = response.data || [];

            // Check if any module in this template already exists
            const duplicateModules = selectedTemplate.modules.filter((mod) => {
                const modName = mod.name.trim().toLowerCase();
                return existingModules.some((existing) => {
                    const existingName = (existing.name || "").trim().toLowerCase();
                    return (
                        existingName === modName ||
                        existingName === `${modName} management` ||
                        modName === `${existingName} management` ||
                        existingName === `${modName}s` ||
                        `${existingName}s` === modName
                    );
                });
            });

            if (duplicateModules.length > 0) {
                const names = duplicateModules.map((m) => m.name).join(", ");
                toast.error(`Template module "${names}" is already used. Cannot implement duplicate modules.`, {
                    id: loadingToast,
                    duration: 5000
                });
                setIsImplementing(false);
                return;
            }

            // 2. Sequentially create all modules in this template
            let currentDisplayOrder = existingModules.length;

            for (const mod of selectedTemplate.modules) {
                currentDisplayOrder += 1;

                // Create the parent module
                const modulePayload = {
                    name: mod.name,
                    description: mod.description,
                    icon: mod.icon,
                    color: mod.color,
                    displayOrder: currentDisplayOrder
                };

                const moduleResponse = await axiosInstance.post("/module/create", modulePayload);
                const moduleId = moduleResponse.data.id;

                // Create fields for this module
                for (let i = 0; i < mod.fields.length; i++) {
                    const field = mod.fields[i];

                    const fieldPayload = {
                        fieldName: field.fieldName,
                        fieldType: field.fieldType,
                        required: field.required,
                        uniqueField: false,
                        defaultValue: "",
                        visibleInList: field.visibleInList,
                        visibleInCreate: field.visibleInCreate,
                        visibleInEdit: field.visibleInEdit,
                        displayOrder: i + 1,
                        moduleId: moduleId
                    };

                    const fieldResponse = await axiosInstance.post("/field/create", fieldPayload);
                    const fieldId = fieldResponse.data.id;

                    // Create options for dropdowns/multiselects
                    if ((field.fieldType === "DROPDOWN" || field.fieldType === "MULTISELECT") && field.options) {
                        const multiValuesPayload = field.options.map((opt, idx) => ({
                            moduleId: moduleId,
                            moduleFieldId: fieldId,
                            value: opt,
                            colour: PRESET_COLORS[idx % PRESET_COLORS.length],
                            displayOrder: idx + 1
                        }));

                        await axiosInstance.post("/multiFieldValue/create", multiValuesPayload);
                    }
                }
            }

            const moduleNames = selectedTemplate.modules.map((m) => m.name).join(", ");
            toast.success(`${selectedTemplate.name} (${moduleNames}) successfully implemented!`, {
                id: loadingToast,
                duration: 5000
            });

            if (onTemplateImplemented) {
                onTemplateImplemented();
            }
        } catch (error) {
            console.error("Implementation error:", error);
            toast.error(error.response?.data?.message || error.message || "Failed to implement template.", {
                id: loadingToast
            });
        } finally {
            setIsImplementing(false);
        }
    };

    return (
        <div className="flex h-full w-full bg-gray-50 overflow-hidden" style={{ animation: "fadeIn 0.3s ease" }}>
            {/* LHS - Template List */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col shrink-0">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-gray-900 m-0 flex items-center gap-2">
                        <i className="fa-solid fa-layer-group text-blue-600"></i>
                        Template Library
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">Pre-built industry standard CRM modules</p>
                </div>
                <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                    {TEMPLATES.map((template) => {
                        const isSelected = selectedTemplate.id === template.id;
                        return (
                            <button
                                key={template.id}
                                onClick={() => handleSelectTemplate(template)}
                                className={`flex items-start gap-3 p-3.5 rounded-xl border-0 cursor-pointer text-left transition-all outline-none ${
                                    isSelected
                                        ? "bg-blue-50/70 ring-1 ring-blue-300 shadow-xs"
                                        : "bg-white hover:bg-gray-50"
                                }`}
                            >
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 mt-0.5 shadow-xs"
                                    style={{ backgroundColor: `${template.color}15`, color: template.color }}
                                >
                                    <i className={`fa-solid ${template.icon} text-lg`}></i>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-1 mb-0.5">
                                        <h4 className={`font-semibold text-sm truncate m-0 ${isSelected ? "text-blue-700" : "text-gray-900"}`}>
                                            {template.name}
                                        </h4>
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-600 shrink-0">
                                            {template.modules.length} {template.modules.length === 1 ? "Module" : "Modules"}
                                        </span>
                                    </div>
                                    <span className="block text-[11px] font-medium text-gray-400 mb-1">
                                        {template.subtitle}
                                    </span>
                                    <p className="text-xs text-gray-500 line-clamp-2 leading-tight m-0">
                                        {template.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* RHS - Template Preview & Implementation */}
            <div className="flex-1 flex flex-col bg-gray-50 overflow-y-auto">
                {selectedTemplate ? (
                    <div className="max-w-4xl w-full mx-auto p-8">
                        {/* Header Banner */}
                        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-inner"
                                    style={{ backgroundColor: `${selectedTemplate.color}15`, color: selectedTemplate.color }}
                                >
                                    <i className={`fa-solid ${selectedTemplate.icon} text-2xl`}></i>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-bold text-gray-900 m-0">{selectedTemplate.name}</h2>
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                            {selectedTemplate.modules.length} {selectedTemplate.modules.length === 1 ? "Module" : "Modules Suite"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1 mb-0">{selectedTemplate.description}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleImplement}
                                disabled={isImplementing}
                                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-sm rounded-xl border-0 shadow-md cursor-pointer transition-colors flex items-center justify-center gap-2 shrink-0 outline-none"
                            >
                                {isImplementing ? (
                                    <>
                                        <i className="fa-solid fa-spinner fa-spin"></i> Implementing...
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-bolt"></i> Implement Template ({selectedTemplate.modules.length} {selectedTemplate.modules.length === 1 ? "Module" : "Modules"})
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Modules Suite Bar (Tabs for each module in the template) */}
                        <div className="mb-4">
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                Included Modules in this Template (Select to Preview Fields):
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {selectedTemplate.modules.map((mod, index) => {
                                    const isActive = selectedModuleIndex === index;
                                    return (
                                        <button
                                            key={mod.name}
                                            onClick={() => setSelectedModuleIndex(index)}
                                            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer outline-none ${
                                                isActive
                                                    ? "bg-white border-blue-500 text-blue-600 shadow-xs ring-2 ring-blue-100"
                                                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                            }`}
                                        >
                                            <i className={`fa-solid ${mod.icon}`} style={{ color: mod.color }}></i>
                                            <span>{mod.name}</span>
                                            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"}`}>
                                                {mod.fields.length}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Active Module Details Card */}
                        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6">
                            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: `${currentModule.color}15`, color: currentModule.color }}
                                    >
                                        <i className={`fa-solid ${currentModule.icon}`}></i>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm m-0">
                                            {currentModule.name} Module Preview
                                        </h3>
                                        <p className="text-xs text-gray-500 m-0 mt-0.5">{currentModule.description}</p>
                                    </div>
                                </div>
                                <span className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full w-fit">
                                    {currentModule.fields.length} Custom Fields
                                </span>
                            </div>

                            {/* Fields List */}
                            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                                {currentModule.fields.map((field, idx) => (
                                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 text-xs text-gray-400 font-mono">{idx + 1}.</span>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                                                    {field.fieldName}
                                                    {field.required && (
                                                        <span className="text-rose-500 text-xs font-bold" title="Required Field">
                                                            *
                                                        </span>
                                                    )}
                                                </span>
                                                {field.options && (
                                                    <span className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                                                        <i className="fa-solid fa-list text-[10px]"></i>
                                                        {field.options.length} Options: {field.options.slice(0, 4).join(", ")}
                                                        {field.options.length > 4 && "..."}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-lg border border-gray-200">
                                                {field.fieldType}
                                            </span>
                                            {field.visibleInList && (
                                                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-medium px-2 py-0.5 rounded-md border border-emerald-200">
                                                    List Column
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Implementation Information Box */}
                        <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-800 flex items-start gap-3">
                            <i className="fa-solid fa-circle-info text-blue-600 text-base mt-0.5"></i>
                            <div>
                                <span className="font-bold block mb-0.5">Automated Creation:</span>
                                Clicking "Implement Template" will create the <strong>{selectedTemplate.modules.map((m) => m.name).join(", ")}</strong> modules with all their respective fields, configurations, and dropdown options in your CRM. If any of these modules already exist, creation will be aborted to prevent duplicate overwrites.
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center flex-col text-gray-400">
                        <i className="fa-solid fa-hand-pointer text-4xl mb-4 text-gray-300"></i>
                        <h2 className="text-xl font-medium text-gray-500">Select a Template</h2>
                        <p className="mt-2 text-sm text-gray-400">Choose a template from the sidebar to preview.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TempalteList;
