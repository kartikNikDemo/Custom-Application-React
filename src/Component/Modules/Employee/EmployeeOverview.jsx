import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../BaseComponent/axiosInstance";
import CustomNavbar from "../../Layout/CustomNavbar";
import TopBar from "../../Common/TopBar";
import Button from "../../Common/Button";
import EmployeeInfo from "./EmployeeInfo";
import EmployeeModuleAccess from "./EmployeeModuleAccess";

const EmployeeOverview = () => {
    const { employeeId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("info");
    const [canEditAccess, setCanEditAccess] = useState(true);

    useEffect(() => {
        checkModuleAccess("EMPLOYEE_MANAGEMENT");
    }, []);

    const checkModuleAccess = async (moduleId) => {
        const moduleAccessData = localStorage.getItem('moduleAccess');
        const role = localStorage.getItem('role');
        if (!moduleAccessData) return;

        try {
            const moduleAccessList = JSON.parse(moduleAccessData) || [];
            const moduleAccess = moduleAccessList.find(
                (item) => item.moduleId === moduleId
            );

            if (role === "ROLE_EMPLOYEE") {
                setCanEditAccess(moduleAccess.canEdit);
            }
        } catch (e) {
            console.error("Error parsing moduleAccess in EmployeeOverview:", e);
        }
    }

    return (
        <div className="h-screen bg-gray-50 dark:bg-[#0b0f19] flex flex-col overflow-hidden">
            <CustomNavbar />
            <div className="flex-1 w-full mx-auto flex flex-col overflow-hidden">
                <TopBar
                    title="Employee Profile"
                    actions={
                        <div className="flex items-center gap-3">
                            {canEditAccess && (
                                <Button
                                    variant="edit"
                                    onClick={() => navigate(`/employee/${employeeId}/edit`)}
                                    className="transition-all duration-200 hover:scale-105 active:scale-95 font-semibold"
                                >
                                    <i className="fa-solid fa-pen-to-square"></i>
                                    <span>Edit Employee</span>
                                </Button>
                            )}
                            <Button
                                variant="secondary"
                                onClick={() => navigate("/employee")}
                                className="transition-all duration-200 hover:scale-105 active:scale-95 font-semibold"
                            >
                                Back
                            </Button>
                        </div>
                    }
                />

                <div className="bg-white border-b border-gray-200 dark:border-gray-800 px-6">
                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
                        <li className="mr-2">
                            <button
                                onClick={() => setActiveTab("info")}
                                className={`inline-flex items-center gap-2 px-4 py-3 rounded-t-xl border-0 outline-none bg-transparent cursor-pointer transition ${
                                    activeTab === "info"
                                        ? "text-blue-600 bg-white border-b border-blue-600 border-b-2 font-semibold shadow-xs"
                                        : "hover:text-gray-800 hover:bg-gray-100/70"
                                }`}
                            >
                                <i className="fa-solid fa-user-circle text-blue-500"></i>
                                <span>Employee Info</span>
                            </button>
                        </li>
                        <li className="mr-2">
                            <button
                                onClick={() => setActiveTab("access")}
                                className={`inline-flex items-center gap-2 px-4 py-3 rounded-t-xl border-0 outline-none bg-transparent cursor-pointer transition ${
                                    activeTab === "access"
                                        ? "text-blue-600 bg-white border-b border-blue-600 border-b-2 font-semibold shadow-xs"
                                        : "hover:text-gray-800 hover:bg-gray-100/70"
                                }`}
                            >
                                <i className="fa-solid fa-user-lock text-indigo-500"></i>
                                <span>Module Access</span>
                            </button>
                        </li>
                    </ul>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === "info" ? (
                        <EmployeeInfo />
                    ) : (
                        <EmployeeModuleAccess />
                    )}
                </div>
            </div>
        </div>
    );
};

export default EmployeeOverview;
