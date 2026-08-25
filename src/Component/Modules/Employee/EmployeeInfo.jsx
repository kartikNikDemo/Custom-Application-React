import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../BaseComponent/axiosInstance";
import toast from "react-hot-toast";

const EmployeeInfo = () => {
    const { employeeId } = useParams();
    const [employee, setEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (employeeId) {
            fetchEmployeeDetails(employeeId);
        }
    }, [employeeId]);

    const fetchEmployeeDetails = async (id) => {
        try {
            const response = await axiosInstance.get(`/employee/getByEmployeeId/${id}`);
            setEmployee(response.data || {});
        } catch (error) {
            console.error("Error fetching employee details:", error);
            toast.error("Failed to load employee details.");
        } finally {
            setLoading(false);
        }
    };

    // Helper to format dates cleanly
    const formatHireDate = (dateStr) => {
        if (!dateStr) return "Not Specified";
        try {
            const date = new Date(dateStr);
            return !isNaN(date.getTime()) ? date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : dateStr;
        } catch (e) {
            return dateStr;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xs">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Loading employee details...</p>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="text-center py-12 text-gray-500 bg-white border border-gray-200 rounded-xl p-6">
                No employee profile data found.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Primary Details Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-2.5 mb-6 pb-3 border-b border-gray-100 dark:border-gray-800">
                    <i className="fa-solid fa-id-card text-blue-500 text-lg"></i>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Personal & Work Profile</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Full Name</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1 block">
                            {employee.name} {employee.secondName || ""}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Email Address</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1 block">
                            {employee.email || "—"}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Phone Number</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1 block">
                            {employee.phone || "—"}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Gender</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1 block">
                            {employee.gender || "—"}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Department</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1 block">
                            {employee.department || "—"}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Work Title</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1 block">
                            {employee.work || "—"}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Shift Time</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1 block">
                            {employee.shiftTime || "—"}
                        </span>
                    </div>
                    <div>
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider block">Hire Date</span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-1 block">
                            {formatHireDate(employee.hiredate || employee.Hiredate)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Description Notes Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-xs hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
                    <i className="fa-solid fa-file-alt text-amber-500 text-lg"></i>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Additional Notes & Description</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                    {employee.description || "No description or notes provided for this employee."}
                </p>
            </div>
        </div>
    );
};

export default EmployeeInfo;
