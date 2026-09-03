import React, { useState } from "react";
import CustomNavbar from "../../Layout/CustomNavbar";
import ModuleSidebar from "./ModuleSidebar";
import FieldSetup from "./Field/FieldSetup";
import CreateModule from "./Module/CreateModule";
import EditModule from "./Module/EditModule";
import AdvanceFieldSetup from "./Field/AdvanceFieldSetup";
import TempalteList from "../../Templates/TempalteList";

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

const ModuleSetup = () => {
    const [selectedModule, setSelectedModule] = useState(null);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState("Fields");
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [topTab, setTopTab] = useState("Module");

    const handleSelectModule = (module) => {
        setSelectedModule(module);
        setActiveTab("Fields");
    };

    const handleCreateModuleClick = () => {
        setSelectedModule(null);
    };

    const handleModuleCreated = (newModule) => {
        // Increment trigger to refresh ModuleSidebar automatically
        setRefreshTrigger((prev) => prev + 1);
    };

    const handleModuleUpdated = (updatedModule) => {
        setRefreshTrigger((prev) => prev + 1);
        if (updatedModule) {
            setSelectedModule((prev) => ({ ...prev, ...updatedModule }));
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <CustomNavbar />

            {/* Top Bar Tabs */}
            <div className="bg-white border-b border-gray-200 px-6 pt-2 flex gap-2">
                <button
                    onClick={() => setTopTab("Module")}
                    className={`px-4 py-3 font-medium text-sm transition-colors border-0 border-b-2 outline-none cursor-pointer ${
                        topTab === "Module"
                            ? "border-blue-600 text-blue-600 bg-white"
                            : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300 bg-transparent"
                    }`}
                >
                    <i className="fa-solid fa-cubes mr-2"></i>
                    Module
                </button>
                <button
                    onClick={() => setTopTab("Template")}
                    className={`px-4 py-3 font-medium text-sm transition-colors border-0 border-b-2 outline-none cursor-pointer ${
                        topTab === "Template"
                            ? "border-blue-600 text-blue-600 bg-white"
                            : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300 bg-transparent"
                    }`}
                >
                    <i className="fa-solid fa-layer-group mr-2"></i>
                    Template
                </button>
            </div>

            <div className="flex grow">
                {topTab === "Module" ? (
                    <>
                        {/* Left Side (Sidebar Column) */}
                        <div
                    className="bg-white border-r shrink-0 flex flex-col"
                    style={{
                        width: isCollapsed ? "80px" : "300px",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: "4px 0 20px rgba(26, 13, 13, 0.01)",
                        zIndex: 10,
                        padding: isCollapsed ? "1.5rem 0.5rem" : "1.5rem 1rem"
                    }}
                >
                    <div className={`flex items-center mb-4 pb-2 border-b ${isCollapsed ? "justify-center" : "justify-between px-2"}`}>
                        {!isCollapsed && (
                            <h5 className="font-bold text-gray-900 mb-0 flex items-center gap-2" style={{ animation: "fadeIn 0.2s ease" }}>
                                <i className="fa-solid fa-sliders text-blue-600"></i>
                                Module Setup
                            </h5>
                        )}
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="bg-gray-100 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center border-0 hover:bg-gray-200 cursor-pointer"
                            style={{ padding: 0 }}
                            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                        >
                            <i className={`fa-solid ${isCollapsed ? "fa-angles-right text-blue-600" : "fa-angles-left text-gray-500"}`} style={{ fontSize: "0.85rem" }}></i>
                        </button>
                    </div>

                    <div className="overflow-y-auto grow pr-1" style={{ maxHeight: "calc(100vh - 150px)", overflowX: "hidden" }}>
                        <ModuleSidebar
                            onSelectModule={handleSelectModule}
                            onCreateModule={handleCreateModuleClick}
                            selectedModuleId={selectedModule?.id || null}
                            isCollapsed={isCollapsed}
                            refreshTrigger={refreshTrigger}
                        />
                    </div>
                </div>

                {/* Right Side (Content Column) */}
                <div className="grow flex flex-col bg-gray-50">
                    {selectedModule ? (
                        <>
                            {/* Module Tabs (Shown when a module is selected) */}
                            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 mb-6 gap-2">
                                <li>
                                    <button
                                        onClick={() => setActiveTab("Fields")}
                                        className={`inline-flex items-center gap-2 px-4 py-3 rounded-t-xl border-0 outline-none bg-transparent cursor-pointer transition ${activeTab === "Fields"
                                            ? "text-blue-600 bg-white border-b-2 border-blue-600 font-semibold shadow-xs"
                                            : "hover:text-gray-800 hover:bg-gray-100/70"
                                            }`}
                                    >
                                        <i
                                            className={formatIconClass(selectedModule.icon)}
                                            style={{ color: selectedModule.color || "#2196F3" }}
                                        ></i>
                                        <span>Fields</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab("Edit")}
                                        className={`inline-flex items-center gap-2 px-4 py-3 rounded-t-xl border-0 outline-none bg-transparent cursor-pointer transition ${activeTab === "Edit"
                                            ? "text-blue-600 bg-white border-b-2 border-blue-600 font-semibold shadow-xs"
                                            : "hover:text-gray-800 hover:bg-gray-100/70"
                                            }`}
                                    >
                                        <i
                                            className="fa-solid fa-pen-to-square"
                                            style={{ color: selectedModule.color || "#2196F3" }}
                                        ></i>
                                        <span>Edit Module</span>
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => setActiveTab("advanceFields")}
                                        className={`inline-flex items-center gap-2 px-4 py-3 rounded-t-xl border-0 outline-none bg-transparent cursor-pointer transition ${activeTab === "Advance Fields"
                                            ? "text-blue-600 bg-white border-b-2 border-blue-600 font-semibold shadow-xs"
                                            : "hover:text-gray-800 hover:bg-gray-100/70"
                                            }`}
                                    >
                                        <i
                                            className="fa-solid fa-sliders"
                                            style={{ color: selectedModule.color || "#2196F3" }}
                                        ></i>
                                        <span>Advance Fields</span>
                                    </button>
                                </li>
                            </ul>

                            {/* Main Workspace View for Selected Module */}
                            <div className="grow">
                                {activeTab === "Fields" && (
                                    <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm" style={{ animation: "fadeIn 0.2s ease" }}>
                                        <FieldSetup module={selectedModule} />
                                    </div>
                                )}
                                {activeTab === "Edit" && (
                                    <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm" style={{ animation: "fadeIn 0.2s ease" }}>
                                        <EditModule module={selectedModule} onModuleUpdated={handleModuleUpdated} />
                                    </div>
                                )}
                                {activeTab === "advanceFields" && (
                                    <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm" style={{ animation: "fadeIn 0.2s ease" }}>
                                        <AdvanceFieldSetup module={selectedModule} />
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        /* Create Module View (Default when selectedModule is null) */
                        <div style={{ animation: "fadeIn 0.2s ease" }}>
                            <CreateModule onModuleCreated={handleModuleCreated} />
                        </div>
                    )}
                </div>
                    </>
                ) : (
                    <div className="flex grow bg-white w-full h-full" style={{ animation: "fadeIn 0.3s ease" }}>
                        <TempalteList onTemplateImplemented={() => setRefreshTrigger((prev) => prev + 1)} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ModuleSetup;