import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../BaseComponent/axiosInstance";
import toast from "react-hot-toast";

// Helper to format FontAwesome classes
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

const EmployeeModuleAccess = () => {
    const { employeeId } = useParams();
    const [userId, setUserId] = useState(null);
    const [modules, setModules] = useState([]);
    const [accessMap, setAccessMap] = useState({}); // Key: moduleId, Value: Access Record
    const [loading, setLoading] = useState(true);
    const [updatingModuleId, setUpdatingModuleId] = useState(null);
    const [fixedModuleAccessId, setFixedModuleAccessId] = useState([]);
    const [systemModules, setSystemModules] = useState(["EMPLOYEE_MANAGEMENT"]);

    const permissionsConfig = [
        { key: "canView", label: "View", description: "Allow viewing the module list and details" },
        { key: "canCreate", label: "Create", description: "Allow creating new records" },
        { key: "canEdit", label: "Edit", description: "Allow editing existing records" },
        { key: "canDelete", label: "Delete", description: "Allow deleting records" },
        { key: "canViewAll", label: "View All", description: "Allow viewing all records (including assigned to others)" }
    ];

    useEffect(() => {
        if (employeeId) {
            fetchModuleAccessData();
        }
    }, [employeeId]);

    const fetchModuleAccessData = async () => {
        setLoading(true);
        try {
            // 1. Fetch employee details to retrieve their user account UUID
            const empRes = await axiosInstance.get(`/employee/getByEmployeeId/${employeeId}`);
            const empData = empRes.data || {};

            // Safe traversal to guard against undefined properties
            const actualUserId = empData.user.id;
            setUserId(actualUserId);

            // 2. Fetch all modules
            const modulesRes = await axiosInstance.get("/module/getAllModule");
            const allModules = modulesRes.data || [];

            // Add system modules to allModules if not already present in database
            systemModules.forEach(id => {
                if (!allModules.some(mod => mod.id === id)) {
                    allModules.push({
                        id: id,
                        name: id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' '),
                        moduleKey: id.toLowerCase().replace(/_management/g, ''),
                        icon: "fa-users-gear",
                        color: "#6366f1",
                        displayOrder: -1 // Place at the top
                    });
                }
            });

            // 3. Fetch module access (handled inside a local try-catch to tolerate 404/no record states)
            let userAccessRecords = [];
            try {
                const accessRes = await axiosInstance.get(`/moduleAccess/getByUserId/${actualUserId}`);
                userAccessRecords = accessRes.data || [];
            } catch (accessErr) {
                // If it is a 404, it simply means no records exist yet for this user.
                // We rethrow other errors (like 500 or authentication issues).
                if (accessErr.response?.status !== 404) {
                    throw accessErr;
                }
            }

            // Sort modules by display order (same as navbar)
            const sortedModules = [...allModules].sort((a, b) => (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0));
            setModules(sortedModules);

            // Map access records by moduleId for instant lookup
            const mappedAccess = {};
            userAccessRecords.forEach(record => {
                if (record.moduleId) {
                    mappedAccess[record.moduleId] = record;
                }
            });

            // Set default permission records for modules that don't have records yet
            sortedModules.forEach(mod => {
                const isFixed = fixedModuleAccessId.includes(mod.id);
                if (!mappedAccess[mod.id]) {
                    mappedAccess[mod.id] = {
                        id: null,
                        moduleId: mod.id,
                        userId: actualUserId,
                        canView: isFixed ? true : false,
                        canEdit: isFixed ? true : false,
                        canCreate: isFixed ? true : false,
                        canDelete: isFixed ? true : false,
                        canViewAll: isFixed ? true : false
                    };
                } else if (isFixed) {
                    // For fixed modules, force all permissions to be true
                    mappedAccess[mod.id] = {
                        ...mappedAccess[mod.id],
                        canView: false,
                        canEdit: false,
                        canCreate: false,
                        canDelete: false,
                        canViewAll: false
                    };
                }
            });

            setAccessMap(mappedAccess);
        } catch (error) {
            console.error("Error loading module access data:", error);
            toast.error("Failed to load module access configurations.");
        } finally {
            setLoading(false);
        }
    };

    const handleTogglePermission = async (moduleId, permissionKey) => {
        if (fixedModuleAccessId.includes(moduleId)) return;

        const currentRecord = accessMap[moduleId];
        if (!currentRecord) return;

        const updatedValue = !currentRecord[permissionKey];
        const updatedRecord = {
            ...currentRecord,
            [permissionKey]: updatedValue
        };

        // Optimistically update the UI state
        setAccessMap(prev => ({
            ...prev,
            [moduleId]: updatedRecord
        }));

        setUpdatingModuleId(moduleId);
        try {
            const payload = {
                id: updatedRecord.id || null,
                moduleId: updatedRecord.moduleId,
                userId: updatedRecord.userId,
                canView: updatedRecord.canView,
                canEdit: updatedRecord.canEdit,
                canCreate: updatedRecord.canCreate,
                canDelete: updatedRecord.canDelete,
                canViewAll: updatedRecord.canViewAll
            };

            // Attempt to update utilizing PUT with a fallback to POST
            let response;
            try {
                response = await axiosInstance.put("/moduleAccess/update", payload);
            } catch (putErr) {
                if (putErr.response?.status === 405 || putErr.response?.status === 404) {
                    response = await axiosInstance.post("/moduleAccess/update", payload);
                } else {
                    throw putErr;
                }
            }

            // Update the local state with the saved record (which contains the ID if it was newly created)
            const savedRecord = response.data || updatedRecord;
            setAccessMap(prev => ({
                ...prev,
                [moduleId]: savedRecord
            }));

            toast.success("Permission updated successfully!");
        } catch (error) {
            console.error("Error saving permission updates:", error);
            toast.error("Failed to save changes. Reverting update.");

            // Revert changes on error
            setAccessMap(prev => ({
                ...prev,
                [moduleId]: currentRecord
            }));
        } finally {
            setUpdatingModuleId(null);
        }
    };

    const isGlobalAllAccessEnabled = () => {
        if (modules.length === 0) return false;
        const keys = ["canView", "canCreate", "canEdit", "canDelete", "canViewAll"];
        const nonFixedModules = modules.filter(module => !fixedModuleAccessId.includes(module.id));
        if (nonFixedModules.length === 0) return true;
        return nonFixedModules.every(module => {
            const record = accessMap[module.id];
            if (!record) return false;
            return keys.every(k => record[k]);
        });
    };

    const handleToggleGlobalAllPermissions = async () => {
        if (modules.length === 0) return;

        const keys = ["canView", "canCreate", "canEdit", "canDelete", "canViewAll"];
        const allEnabled = isGlobalAllAccessEnabled();
        const newValue = !allEnabled;

        // Save current map in case we need to revert
        const previousAccessMap = { ...accessMap };

        // Create the updated access map
        const updatedAccessMap = { ...accessMap };
        modules.forEach(module => {
            if (fixedModuleAccessId.includes(module.id)) return; // Skip fixed modules

            const currentRecord = accessMap[module.id];
            if (currentRecord) {
                updatedAccessMap[module.id] = {
                    ...currentRecord,
                    canView: newValue,
                    canCreate: newValue,
                    canEdit: newValue,
                    canDelete: newValue,
                    canViewAll: newValue
                };
            }
        });

        // Optimistically update the UI state
        setAccessMap(updatedAccessMap);
        setUpdatingModuleId("all");

        try {
            // Run all API calls in parallel for non-fixed modules
            await Promise.all(
                modules
                    .filter(module => !fixedModuleAccessId.includes(module.id))
                    .map(async (module) => {
                        const updatedRecord = updatedAccessMap[module.id];
                        if (!updatedRecord) return;

                        const payload = {
                            id: updatedRecord.id || null,
                            moduleId: updatedRecord.moduleId,
                            userId: updatedRecord.userId,
                            canView: updatedRecord.canView,
                            canEdit: updatedRecord.canEdit,
                            canCreate: updatedRecord.canCreate,
                            canDelete: updatedRecord.canDelete,
                            canViewAll: updatedRecord.canViewAll
                        };

                        let response;
                        try {
                            response = await axiosInstance.put("/moduleAccess/update", payload);
                        } catch (putErr) {
                            if (putErr.response?.status === 405 || putErr.response?.status === 404) {
                                response = await axiosInstance.post("/moduleAccess/update", payload);
                            } else {
                                throw putErr;
                            }
                        }

                        const savedRecord = response.data || updatedRecord;
                        setAccessMap(prev => ({
                            ...prev,
                            [module.id]: savedRecord
                        }));
                    })
            );

            toast.success(newValue ? "All modules access turned ON" : "All modules access turned OFF");
        } catch (error) {
            console.error("Error saving global permission updates:", error);
            toast.error("Failed to save changes. Reverting update.");

            // Revert changes on error
            setAccessMap(previousAccessMap);
        } finally {
            setUpdatingModuleId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-transparent">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Fetching module access records...</p>
            </div>
        );
    }

    if (modules.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                <i className="fa-solid fa-folder-open text-3xl text-gray-300 dark:text-gray-700 mb-3 block"></i>
                No custom modules have been set up in this system yet. Create modules under "Module Setup".
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header info */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-250/80 dark:border-gray-800/80">
                <div>
                    <h3 className="text-base font-bold !text-gray-900 dark:!text-white">Module Access Permissions</h3>
                    <p className="text-xs !text-gray-500 dark:!text-gray-400 mt-0.5">Toggle what functions the employee is allowed to perform for each system module.</p>
                </div>

                {/* Global switch on the RHS */}
                <div className="flex items-center gap-2.5 bg-gray-50 dark:bg-gray-850/40 px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-gray-800/50">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        Toggle All Access
                    </span>
                    <button
                        type="button"
                        disabled={updatingModuleId === "all"}
                        onClick={handleToggleGlobalAllPermissions}
                        className={`relative inline-flex h-5.5 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none border-0 ${isGlobalAllAccessEnabled() ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-800"
                            } ${updatingModuleId === "all" ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                        <span
                            className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition duration-250 ease-in-out ${isGlobalAllAccessEnabled() ? "translate-x-5.5" : "translate-x-0"
                                }`}
                        />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module) => {
                    const record = accessMap[module.id];
                    return (
                        <div
                            key={module.id}
                            className="!bg-white dark:!bg-gray-900 border border-gray-200/90 dark:border-gray-800/80 rounded-2xl shadow-2xs overflow-hidden hover:shadow-xs transition-shadow duration-200 flex flex-col"
                        >
                            <div className="px-5 py-4 bg-gray-50/50 dark:bg-gray-900/40 border-b border-gray-150/80 dark:border-gray-800/60 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                        <i className={`text-sm ${formatIconClass(module.icon)}`}></i>
                                    </div>
                                    <h4 className="text-sm font-bold !text-gray-800 dark:!text-gray-100 truncate">{module.name}</h4>
                                </div>
                            </div>

                            <div className="p-4 grid grid-cols-1 gap-3.5 flex-1 content-start">
                                {permissionsConfig.map((perm) => {
                                    const val = record ? record[perm.key] : false;
                                    return (
                                        <div
                                            key={perm.key}
                                            className="flex items-center justify-between p-3.5 !bg-gray-50/50 dark:!bg-gray-900/30 rounded-xl border border-gray-150/50 dark:border-gray-800/40 hover:border-gray-250/50 dark:hover:border-gray-700/50 transition-colors"
                                        >
                                            <div className="flex flex-col pr-4">
                                                <span className="text-xs font-bold !text-gray-800 dark:!text-gray-200">
                                                    {perm.label}
                                                </span>
                                                <span className="text-[10px] !text-gray-500 dark:!text-gray-400 mt-0.5 leading-tight">
                                                    {perm.description}
                                                </span>
                                            </div>

                                            {/* iOS style premium Toggle switch */}
                                            <button
                                                type="button"
                                                onClick={() => handleTogglePermission(module.id, perm.key)}
                                                className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-250 ease-in-out focus:outline-none border-0 ${val ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-800"
                                                    }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-xs transition duration-250 ease-in-out ${val ? "translate-x-5" : "translate-x-0"
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default EmployeeModuleAccess;
