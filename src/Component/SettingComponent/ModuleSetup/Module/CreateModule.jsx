import React, { useState } from "react";
import TopBar from "../../../Common/TopBar";
import axiosInstance from "../../../BaseComponent/axiosInstance";

const PRESET_ICONS = [
    { class: "fa-user-plus", label: "Lead / User" },
    { class: "fa-briefcase", label: "Business" },
    { class: "fa-users", label: "Team / Contacts" },
    { class: "fa-chart-line", label: "Analytics" },
    { class: "fa-bullhorn", label: "Marketing" },
    { class: "fa-box", label: "Products" },
    { class: "fa-handshake", label: "Deals" },
    { class: "fa-file-invoice", label: "Invoices" },
    { class: "fa-cubes", label: "Cubes" },
    { class: "fa-gear", label: "System" }
];

const PRESET_COLORS = [
    "#2196F3", // Blue
    "#4CAF50", // Green
    "#FF9800", // Orange
    "#E91E63", // Pink
    "#9C27B0", // Purple
    "#00BCD4", // Cyan
    "#3F51B5", // Indigo
    "#EF4444", // Red
    "#10B981", // Emerald
    "#6366F1"  // Violet
];

const formatIconClass = (icon) => {
    if (!icon) return "fa-solid fa-cubes";
    const str = icon.trim();
    if (str.startsWith("fa-solid ") || str.startsWith("fa-regular ") || str.startsWith("fa-brands ") || str.startsWith("fas ") || str.startsWith("far ") || str.startsWith("fab ") || str.startsWith("fa ")) {
        return str;
    }
    if (str.startsWith("fa-")) {
        return `fa-solid ${str}`;
    }
    return `fa-solid fa-${str}`;
};

const CreateModule = ({ onModuleCreated }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        icon: "fa-user-plus",
        color: "#2196F3",
        displayOrder: 1
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    React.useEffect(() => {
        const fetchNextDisplayOrder = async () => {
            try {
                const response = await axiosInstance.get('/module/getAllModule');
                const modules = response.data || [];
                if (modules.length > 0) {
                    const maxOrder = Math.max(...modules.map(m => Number(m.displayOrder) || 0));
                    setFormData(prev => ({ ...prev, displayOrder: maxOrder + 1 }));
                } else {
                    setFormData(prev => ({ ...prev, displayOrder: 1 }));
                }
            } catch (err) {
                console.error("Error calculating next display order:", err);
            }
        };
        fetchNextDisplayOrder();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const submitModule = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (!formData.name.trim()) {
            setError("Module Name is required");
            setLoading(false);
            return;
        }

        try {
            const payload = {
                name: formData.name.trim(),
                description: formData.description.trim(),
                icon: formData.icon || "fa-cubes",
                color: formData.color || "#2196F3",
                displayOrder: Number(formData.displayOrder) || 1
            };

            const response = await axiosInstance.post("/module/create", payload);
            console.log("Module created:", response.data);
            setSuccess(`Module "${formData.name}" created successfully!`);

            // Reset form
            setFormData({
                name: "",
                description: "",
                icon: "fa-user-plus",
                color: "#2196F3",
                displayOrder: (Number(formData.displayOrder) || 1) + 1
            });

            // Trigger parent refresh callback
            if (onModuleCreated) {
                onModuleCreated(response.data);
            }
        } catch (err) {
            console.error("Error creating module:", err);
            setError(err.response?.data?.message || "Failed to create module. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const activePreviewIconClass = formatIconClass(formData.icon);

    return (
        <div className="w-full flex flex-col gap-6" style={{ animation: "fadeIn 0.25s ease-out" }}>
            {/* TopBar with Create Action Button */}
            <TopBar
                showButton={true}
                title="Create New Module"
                buttonText={loading ? "Creating..." : "Create"}
                buttonType="submit"
                form="create-module-form"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Section */}
                <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2">
                        <i className="fa-solid fa-plus-circle text-blue-600"></i>
                        Module Details
                    </h3>
                    <p className="text-gray-500 text-xs mb-6">
                        Define a new custom module for your CRM application.
                    </p>

                    {success && (
                        <div className="mb-5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fadeIn">
                            <i className="fa-solid fa-circle-check text-emerald-600 text-lg"></i>
                            <span>{success}</span>
                        </div>
                    )}

                    {error && (
                        <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-fadeIn">
                            <i className="fa-solid fa-triangle-exclamation text-rose-600 text-lg"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <form id="create-module-form" onSubmit={submitModule} className="flex flex-col gap-5">
                        {/* Module Name */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                Module Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Lead, Customer, Invoice"
                                className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                required
                            />
                        </div>

                        {/* Display Order */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                Display Order <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="displayOrder"
                                value={formData.displayOrder}
                                onChange={handleChange}
                                min="1"
                                placeholder="e.g. 1"
                                className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Describe the purpose of this module..."
                                className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none"
                            />
                        </div>

                        {/* Icon Selection */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                Choose Icon
                            </label>
                            <div className="flex items-center gap-3 mb-3">
                                <input
                                    type="text"
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleChange}
                                    placeholder="FontAwesome class (e.g. fa-user-plus)"
                                    className="grow bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                                />
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 shrink-0"
                                    style={{ backgroundColor: `${formData.color}15` }}
                                >
                                    <i
                                        className={activePreviewIconClass}
                                        style={{ color: formData.color, fontSize: "1.2rem" }}
                                    ></i>
                                </div>
                            </div>

                            {/* Preset Icon Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                                {PRESET_ICONS.map((item) => {
                                    const presetIconClass = formatIconClass(item.class);
                                    const isSelected = formData.icon === item.class;
                                    return (
                                        <button
                                            key={item.class}
                                            type="button"
                                            onClick={() => setFormData((prev) => ({ ...prev, icon: item.class }))}
                                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition ${isSelected
                                                ? "border-blue-500 bg-blue-50 text-blue-700 font-semibold"
                                                : "border-gray-200 hover:bg-gray-50 text-gray-600"
                                                }`}
                                        >
                                            <i className={presetIconClass} style={{ color: isSelected ? formData.color : undefined }}></i>
                                            <span className="truncate">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                                Theme Color
                            </label>
                            <div className="flex items-center gap-3 mb-3">
                                <input
                                    type="color"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    className="w-10 h-10 rounded-xl border border-gray-300 cursor-pointer p-0.5"
                                />
                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    className="grow bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 uppercase"
                                />
                            </div>

                            {/* Color Chips */}
                            <div className="flex flex-wrap gap-2">
                                {PRESET_COLORS.map((hex) => (
                                    <button
                                        key={hex}
                                        type="button"
                                        onClick={() => setFormData((prev) => ({ ...prev, color: hex }))}
                                        className={`w-8 h-8 rounded-full cursor-pointer transition border-2 ${formData.color.toLowerCase() === hex.toLowerCase()
                                            ? "border-gray-900 scale-110 shadow-sm"
                                            : "border-transparent hover:scale-105"
                                            }`}
                                        style={{ backgroundColor: hex }}
                                        title={hex}
                                    />
                                ))}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Sidebar Live Preview */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col h-fit">
                    <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <i className="fa-solid fa-eye text-blue-600"></i>
                        Sidebar Preview
                    </h4>
                    <p className="text-gray-500 text-xs mb-4">
                        How your module will appear in the navigation sidebar:
                    </p>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                        <div
                            className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white border shadow-xs"
                            style={{
                                backgroundColor: `${formData.color}10`,
                                borderColor: `${formData.color}30`
                            }}
                        >
                            <div className="flex items-center gap-3 overflow-hidden truncate">
                                <div
                                    className="flex items-center justify-center rounded-lg shrink-0"
                                    style={{
                                        width: "36px",
                                        height: "36px",
                                        backgroundColor: `${formData.color}20`,
                                        border: `1px solid ${formData.color}40`
                                    }}
                                >
                                    <i
                                        className={activePreviewIconClass}
                                        style={{ color: formData.color, fontSize: "1.1rem" }}
                                    />
                                </div>
                                <div className="truncate">
                                    <span
                                        className="block truncate font-semibold text-sm"
                                        style={{ color: formData.color }}
                                    >
                                        {formData.name || "Module Name"}
                                    </span>
                                    {formData.description && (
                                        <span className="block truncate text-gray-400 text-xs">
                                            {formData.description}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateModule;