import { useEffect, useState } from "react";
import axiosInstance from "../../BaseComponent/axiosInstance";
import { DeleteIcon } from "../../../Icon/Icon";

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

const ModuleSidebar = ({ onSelectModule, selectedModuleId, isCollapsed, onCreateModule, refreshTrigger }) => {
    const [moduleData, setModuleData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hoveredModuleId, setHoveredModuleId] = useState(null);

    useEffect(() => {
        fetchModules();
    }, [refreshTrigger]);

    const fetchModules = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/module/getAllModule');
            console.log("Fetched sidebar modules:", response.data);
            const sortedModules = (response.data || []).sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
            setModuleData(sortedModules);
        } catch (error) {
            console.error('Error fetching modules:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteModule = async (e, module) => {
        e.stopPropagation();

        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${module.name}"?`
        );

        if (!confirmDelete) return;

        try {
            await axiosInstance.delete(`/module/delete/${module.id}`);

            // Refresh the module list
            fetchModules();

            // If the deleted module was selected
            if (selectedModuleId === module.id) {
                onSelectModule(null);
            }
        } catch (error) {
            console.error("Error deleting module:", error);
        }
    };

    const isCreateActive = selectedModuleId === null;

    return (
        <div className="w-full flex flex-col gap-2">

            {/* Create Module Action Button */}
            <div className="mb-3">
                <button
                    onClick={onCreateModule}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${isCreateActive
                        ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-100"
                        : "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                        }`}
                    title={isCollapsed ? "Create Module" : ""}
                >
                    <i className="fa-solid fa-plus text-xs"></i>
                    {!isCollapsed && <span>Create Module</span>}
                </button>
            </div>

            {loading && moduleData.length === 0 ? (
                <div className="text-center py-6">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent mx-auto mb-2" role="status"></div>
                    {!isCollapsed && <p className="text-gray-500 text-xs">Loading modules...</p>}
                </div>
            ) : moduleData.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl px-2">
                    <i className="fa-solid fa-cubes text-gray-300 text-2xl mb-1 block"></i>
                    {!isCollapsed && <p className="text-gray-400 text-xs">No modules found</p>}
                </div>
            ) : (
                <div className="flex flex-col gap-1">
                    {moduleData.map((module) => {
                        const isSelected = selectedModuleId === module.id;
                        const iconClass = formatIconClass(module.icon);

                        return (
                            <div key={module.id} className="flex flex-col mb-1" style={{ transition: "all 0.2s ease" }}>
                                {/* Main Module Item */}
                                <div
                                    onClick={() => onSelectModule && onSelectModule(module)}
                                    className={`flex items-center ${isCollapsed ? "justify-center p-2" : "justify-between px-3 py-2.5"} rounded-xl`}
                                    style={{
                                        cursor: "pointer",
                                        transition: "all 0.25s ease",
                                        backgroundColor: isSelected ? "rgba(33, 150, 243, 0.08)" : "transparent",
                                        border: isSelected ? "1px solid rgba(33, 150, 243, 0.25)" : "1px solid transparent",
                                        boxShadow: isSelected ? "0 4px 12px rgba(33, 150, 243, 0.08)" : "none"
                                    }}
                                    title={isCollapsed ? module.name : ""}
                                    onMouseEnter={(e) => {
                                        setHoveredModuleId(module.id);
                                        if (!isSelected) {
                                            e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.03)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        setHoveredModuleId(null);
                                        if (!isSelected) {
                                            e.currentTarget.style.backgroundColor = "transparent";
                                        }
                                    }}
                                >
                                    <div className="flex items-center overflow-hidden truncate gap-2.5 min-w-0">
                                        <div
                                            className="flex items-center justify-center rounded-lg shrink-0"
                                            style={{
                                                width: "36px",
                                                height: "36px",
                                                backgroundColor: `${module.color || "#2196F3"}15`,
                                                border: `1px solid ${module.color || "#2196F3"}30`
                                            }}
                                        >
                                            <i
                                                className={iconClass}
                                                style={{ color: module.color || "#2196F3", fontSize: "1rem" }}
                                            />
                                        </div>
                                        {!isCollapsed && (
                                            <span
                                                className="truncate min-w-0"
                                                style={{
                                                    fontWeight: isSelected ? "600" : "500",
                                                    color: isSelected ? "#1976D2" : "#374151",
                                                    fontSize: "0.9rem"
                                                }}
                                            >
                                                {module.name}
                                            </span>
                                        )}
                                    </div>

                                    {!isCollapsed && hoveredModuleId === module.id && (
                                        <button
                                            type="button"
                                            onClick={(e) => handleDeleteModule(e, module)}
                                            className="p-1 flex items-center justify-center rounded-lg bg-white/80 hover:bg-rose-50 text-rose-600 border border-rose-200 cursor-pointer shrink-0 transition-all ml-2"
                                            style={{ width: "26px", height: "26px" }}
                                            title="Delete Module"
                                        >
                                            <DeleteIcon size={13} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ModuleSidebar;