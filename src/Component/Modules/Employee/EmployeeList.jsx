import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../BaseComponent/axiosInstance";
import CustomNavbar from "../../Layout/CustomNavbar";
import TopBar from "../../Common/TopBar";
import Table from "../../Common/Table";
import { EditIcon, DeleteIcon, PreviewIcon } from "../../../Icon/Icon";
import toast from "react-hot-toast";

const EmployeeList = () => {
    const navigate = useNavigate();
    const [employeeList, setEmployeeList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(25);
    const [paginationData, setPaginationData] = useState({
        totalElements: 0,
        totalPages: 0,
        numberOfElements: 0,
        first: true,
        last: true
    });

    useEffect(() => {
        fetchEmployeeList(search, pageNumber, pageSize);
    }, [pageNumber, pageSize, search]);

    const fetchEmployeeList = async (query = search, pageNum = pageNumber, sizeNum = pageSize) => {
        setLoading(true);
        try {
            const response = await axiosInstance.put(
                "/employee/getEmployees",
                null,
                {
                    params: {
                        query: query || "",
                        page: pageNum,
                        size: sizeNum,
                        sort: "createdDate,desc"
                    }
                }
            );

            const pageData = response.data || {};
            setEmployeeList(pageData.content || []);
            setPaginationData({
                totalElements: pageData.totalElements || 0,
                totalPages: pageData.totalPages || 0,
                numberOfElements: pageData.numberOfElements || 0,
                first: pageData.first ?? true,
                last: pageData.last ?? true
            });
        } catch (error) {
            console.error("Error fetching employee list:", error);
            toast.error("Failed to load employee list.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (val) => {
        setSearch(val);
        setPageNumber(0);
    };

    const handleDeleteEmployee = async (id) => {
        if (!window.confirm("Are you sure you want to delete this employee?")) return;
        try {
            await axiosInstance.delete(`/employee/delete/${id}`);
            toast.success("Employee deleted successfully!");
            fetchEmployeeList();
        } catch (error) {
            console.error("Error deleting employee:", error);
            toast.error("Failed to delete employee.");
        }
    };

    const columns = [
        { label: "Name", key: "name", render: (row) => `${row.name} ${row.secondName || ""}` },
        { label: "Email Address", key: "email" },
        { label: "Phone Number", key: "phone" },
        { label: "Work Position", key: "work" },
        { label: "Department", key: "department" },
        { label: "Shift", key: "shiftTime" }
    ];

    const renderActions = (row) => (
        <div className="flex items-center gap-2">
            <button
                type="button"
                className="p-1.5 flex items-center justify-center rounded-lg bg-transparent hover:bg-emerald-50 text-emerald-500 border border-emerald-200 cursor-pointer w-7 h-7 transition-colors"
                onClick={() => navigate(`/employee/${row.id}/overview`)}
                title="View Profile"
            >
                <PreviewIcon size={14} />
            </button>
            <button
                type="button"
                className="p-1.5 flex items-center justify-center rounded-lg bg-transparent hover:bg-blue-50 text-blue-500 border border-blue-200 cursor-pointer w-7 h-7 transition-colors"
                onClick={() => navigate(`/employee/${row.id}/edit`)}
                title="Edit Employee"
            >
                <EditIcon size={14} />
            </button>
            <button
                type="button"
                className="p-1.5 flex items-center justify-center rounded-lg bg-transparent hover:bg-red-50 text-red-500 border border-red-200 cursor-pointer w-7 h-7 transition-colors"
                onClick={() => handleDeleteEmployee(row.id)}
                title="Delete Employee"
            >
                <DeleteIcon size={14} />
            </button>
        </div>
    );

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
            <CustomNavbar />
            <div className="flex-1 w-full mx-auto flex flex-col overflow-hidden ">
                <TopBar
                    title="Employee Management"
                    showButton={true}
                    buttonText="Create"
                    onButtonClick={() => navigate("/employee/create")}
                    showSearch={true}
                    onSearchChange={handleSearch}
                />

                <div className="flex-1 flex flex-col overflow-hidden ">
                    <Table
                        columns={columns}
                        data={employeeList}
                        loading={loading}
                        pageNumber={pageNumber}
                        pageSize={pageSize}
                        totalElements={paginationData.totalElements}
                        totalPages={paginationData.totalPages}
                        first={paginationData.first}
                        last={paginationData.last}
                        onPageChange={setPageNumber}
                        onPageSizeChange={(newSize) => {
                            setPageSize(newSize);
                            setPageNumber(0);
                        }}
                        actions={renderActions}
                    />
                </div>
            </div>
        </div>
    );
};

export default EmployeeList;
