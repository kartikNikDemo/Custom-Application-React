import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../BaseComponent/axiosInstance";
import CustomNavbar from "../../Layout/CustomNavbar";
import TopBar from "../../Common/TopBar";
import InputField from "../../Common/InputField";
import Button from "../../Common/Button";
import toast from "react-hot-toast";

const UpdateEmployee = () => {
    const { employeeId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        secondName: "",
        work: "",
        email: "",
        phone: "",
        description: "",
        department: "",
        shiftTime: "",
        gender: "",
        Hiredate: ""
    });

    useEffect(() => {
        if (employeeId) {
            fetchEmployeeDetails(employeeId);
        }
    }, [employeeId]);

    const fetchEmployeeDetails = async (id) => {
        try {
            const response = await axiosInstance.get(`/employee/getByEmployeeId/${id}`);
            const emp = response.data || {};
            setFormData({
                id: emp.id || id,
                name: emp.name || "",
                secondName: emp.secondName || "",
                work: emp.work || "",
                email: emp.email || "",
                phone: emp.phone || "",
                description: emp.description || "",
                department: emp.department || "",
                shiftTime: emp.shiftTime || "",
                gender: emp.gender || "",
                Hiredate: emp.hiredate || emp.Hiredate || ""
            });
        } catch (error) {
            console.error("Error fetching employee details:", error);
            toast.error("Failed to load employee details.");
            navigate("/employee");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (fieldKey, value) => {
        setFormData(prev => ({
            ...prev,
            [fieldKey]: value
        }));
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (!formData.name) {
            toast.error("Employee Name is required.");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                id: formData.id,
                name: formData.name,
                secondName: formData.secondName,
                work: formData.work,
                email: formData.email,
                phone: formData.phone,
                description: formData.description,
                department: formData.department,
                shiftTime: formData.shiftTime,
                gender: formData.gender,
                hiredate: formData.Hiredate
            };

            await axiosInstance.put("/employee/updateEmployee", payload);
            toast.success("Employee updated successfully!");
            navigate("/employee");
        } catch (error) {
            console.error("Error updating employee:", error);
            toast.error(error.response?.data?.message || "Failed to update employee.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <CustomNavbar />
            <div className="mx-auto">
                <TopBar
                    title="Update Employee"
                    showButton={true}
                    buttonText={saving ? "Saving..." : "Save Changes"}
                    buttonType="submit"
                    form="update-employee-form"
                    actions={
                        <Button
                            variant="secondary"
                            onClick={() => navigate("/employee")}
                            className="transition-all duration-200 hover:scale-105 active:scale-95 font-semibold"
                        >
                            Back to List
                        </Button>
                    }
                />

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-200 rounded-xl shadow-sm">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-4"></div>
                        <p className="text-gray-500 text-sm font-medium">Fetching employee details...</p>
                    </div>
                ) : (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                        <form id="update-employee-form" onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    field={{ fieldType: "TEXT", fieldName: "First Name", fieldKey: "name", required: true }}
                                    value={formData.name}
                                    onChange={handleInputChange}
                                />
                                <InputField
                                    field={{ fieldType: "TEXT", fieldName: "Last Name", fieldKey: "secondName", required: false }}
                                    value={formData.secondName}
                                    onChange={handleInputChange}
                                />
                                <InputField
                                    field={{ fieldType: "EMAIL", fieldName: "Email Address", fieldKey: "email", required: false }}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled
                                />
                                <InputField
                                    field={{ fieldType: "PHONE", fieldName: "Phone Number", fieldKey: "phone", required: false }}
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                />
                                <InputField
                                    field={{ fieldType: "TEXT", fieldName: "Gender", fieldKey: "gender", required: false }}
                                    value={formData.gender}
                                    onChange={handleInputChange}
                                    placeholder="Male, Female, Other"
                                />
                                <InputField
                                    field={{ fieldType: "TEXT", fieldName: "Work Position / Title", fieldKey: "work", required: false }}
                                    value={formData.work}
                                    onChange={handleInputChange}
                                />
                                <InputField
                                    field={{ fieldType: "TEXT", fieldName: "Department", fieldKey: "department", required: false }}
                                    value={formData.department}
                                    onChange={handleInputChange}
                                />
                                <InputField
                                    field={{ fieldType: "TEXT", fieldName: "Shift Time", fieldKey: "shiftTime", required: false }}
                                    value={formData.shiftTime}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 9:00 AM - 5:00 PM"
                                />
                                <InputField
                                    field={{ fieldType: "DATE", fieldName: "Hire Date", fieldKey: "Hiredate", required: false }}
                                    value={formData.Hiredate}
                                    onChange={handleInputChange}
                                />
                                <div className="md:col-span-2 pt-4 border-t border-gray-100">
                                    <InputField
                                        field={{ fieldType: "TEXTAREA", fieldName: "Description / Notes", fieldKey: "description", required: false }}
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

export default UpdateEmployee;
