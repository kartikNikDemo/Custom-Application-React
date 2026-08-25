import React, { useEffect, useState } from "react";
import axiosInstance from "../BaseComponent/axiosInstance";
import CustomDropdown from "./CustomDropdown";
import InlineDropdown from "./InlineDropdown";

let employeePromise = null;

const fetchEmployeesCached = () => {
    if (!employeePromise) {
        employeePromise = axiosInstance.get("/employee/getAllEmployeeIdAndName")
            .then(res => (res.data || []).map(emp => ({
                label: emp.employeeName,
                value: String(emp.employeeId)
            })))
            .catch(err => {
                employeePromise = null;
                throw err;
            });
    }
    return employeePromise;
};

const AssignTo = ({ label, id, value, onChange, required, variant, ...props }) => {
    const [employeeList, setEmployeeList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        fetchEmployeesCached()
            .then(data => {
                if (isMounted) setEmployeeList(data);
            })
            .catch(error => {
                console.error("Error fetching employees for assignment:", error);
            })
            .finally(() => {
                if (isMounted) setLoading(false);
            });
        return () => { isMounted = false; };
    }, []);

    if (variant === "inline") {
        return (
            <InlineDropdown
                value={value}
                onChange={onChange}
                options={employeeList}
                {...props}
            />
        );
    }

    return (
        <CustomDropdown
            label={label}
            id={id}
            value={value}
            onChange={onChange}
            options={employeeList}
            required={required}
            multiple={false}
            {...props}
        />
    );
};

export default AssignTo;