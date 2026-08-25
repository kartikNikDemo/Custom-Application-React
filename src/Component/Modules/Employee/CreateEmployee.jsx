import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../BaseComponent/axiosInstance";
import CustomNavbar from "../../Layout/CustomNavbar";
import TopBar from "../../Common/TopBar";
import InputField from "../../Common/InputField";
import Button from "../../Common/Button";
import toast from "react-hot-toast";

const CreateEmployee = () => {
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        secondName: "",
        work: "",
        email: "",
        phone: "",
        description: "",
        department: "",
        shiftTime: "",
        gender: "Male",
        Hiredate: "",
        username: "",
        password: ""
    });

    const handleInputChange = (fieldKey, value) => {
        setFormData(prev => {
            const next = { ...prev, [fieldKey]: value };
            if (fieldKey === "email" && (prev.username === "" || prev.username === prev.email)) {
                next.username = value;
            }
            return next;
        });
    };

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) e.preventDefault();

        if (!formData.name || !formData.email || !formData.username || !formData.password) {
            toast.error("Please fill in all required fields (Name, Email, Login Username, and Password).");
            return;
        }

        setSaving(true);
        try {
            const payload = {
                name: formData.name,
                secondName: formData.secondName,
                work: formData.work,
                email: formData.email,
                phone: formData.phone,
                description: formData.description,
                department: formData.department,
                shiftTime: formData.shiftTime,
                gender: formData.gender,
                hiredate: formData.Hiredate,
                username: formData.username,
                password: formData.password
            };

            await axiosInstance.post("/employee/create", payload);
            toast.success("Employee created successfully!");
            navigate("/employee");
        } catch (error) {
            console.error("Error creating employee:", error);
            toast.error(
                error.response?.data?.stackTrace ||
                error.response?.data?.message ||
                "Failed to create employee."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <CustomNavbar />
            <div className="mx-auto">
                <TopBar
                    showButton={true}
                    title="Create New Employee"
                    buttonText={saving ? "Saving..." : "Save"}
                    buttonType="submit"
                    form="create-employee-form"
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

                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                    <form id="create-employee-form" onSubmit={handleSubmit} className="space-y-6">
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
                                field={{ fieldType: "EMAIL", fieldName: "Email Address", fieldKey: "email", required: true }}
                                value={formData.email}
                                onChange={handleInputChange}
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
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                                <InputField
                                    field={{ fieldType: "TEXT", fieldName: "Login Username", fieldKey: "username", required: true }}
                                    value={formData.username}
                                    onChange={handleInputChange}
                                />
                                <InputField
                                    field={{ fieldType: "PASSWORD", fieldName: "Login Password", fieldKey: "password", required: true }}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
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
            </div>
        </>
    );
};

export default CreateEmployee;
