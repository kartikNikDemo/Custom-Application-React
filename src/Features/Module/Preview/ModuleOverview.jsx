import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../../Component/BaseComponent/axiosInstance";
import CustomNavbar from "../../../Component/Layout/CustomNavbar";
import TopBar from "../../../Component/Common/TopBar";
import Button from "../../../Component/Common/Button";
import ModuleRecordInfo from "./ModuleRecordInfo";

const ModuleOverview = () => {
    const { moduleKey, moduleId, recordId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("info"); // Default tab: "info"
    const [moduleName, setModuleName] = useState(moduleKey === "null" || !moduleKey ? "" : moduleKey);

    useEffect(() => {
        if (moduleId) {
            fetchModuleName(moduleId);
        }
    }, [moduleId]);

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

    return (
        <div className="h-screen bg-gray-50 dark:bg-[#0b0f19] flex flex-col overflow-hidden">
            <CustomNavbar />
            
            <div className="flex-1 w-full mx-auto flex flex-col overflow-hidden">
                <TopBar
                    title={moduleName || "Record Profile"}
                    actions={
                        <div className="flex items-center gap-3">
                            <Button
                                variant="edit"
                                onClick={() => navigate(`/${moduleKey}/${moduleId}/${recordId}/edit`)}
                                className="transition-all duration-200 hover:scale-105 active:scale-95 font-semibold"
                            >
                                <i className="fa-solid fa-pen-to-square"></i>
                                <span>Edit Record</span>
                            </Button>
                            <Button
                                variant="secondary"
                                onClick={() => navigate(`/${moduleKey}/${moduleId}`)}
                                className="transition-all duration-200 hover:scale-105 active:scale-95 font-semibold"
                            >
                                Back to List
                            </Button>
                        </div>
                    }
                />

                <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 overflow-y-auto w-full">
                    <div className="space-y-6">
                        {/* Tab Headers */}
                        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 mb-6 gap-2">
                            <li>
                                <button
                                    onClick={() => setActiveTab("info")}
                                    className={`inline-flex items-center gap-2 px-4 py-3 rounded-t-xl border-0 outline-none bg-transparent cursor-pointer transition ${
                                        activeTab === "info"
                                            ? "text-blue-600 bg-white border-b border-blue-600 border-b-2 font-semibold shadow-xs"
                                            : "hover:text-gray-800 hover:bg-gray-100/70"
                                    }`}
                                >
                                    <i className="fa-solid fa-circle-info text-blue-500"></i>
                                    <span>Record Info</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    disabled
                                    className="inline-flex items-center gap-2 px-4 py-3 rounded-t-xl border-0 outline-none bg-transparent opacity-50 cursor-not-allowed text-gray-400"
                                    title="Coming Soon"
                                >
                                    <i className="fa-solid fa-lock text-gray-400"></i>
                                    <span>Next Feature (Coming Soon)</span>
                                </button>
                            </li>
                        </ul>

                        {/* Active Tab Panel Rendering */}
                        <div className="bg-transparent rounded-2xl">
                            {activeTab === "info" && (
                                <ModuleRecordInfo />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModuleOverview;
