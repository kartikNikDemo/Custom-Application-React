import React, { useState, useEffect } from 'react';
import axiosInstance from '../BaseComponent/axiosInstance';
import CustomDropdown from './CustomDropdown';
import AssignTo from './AssignTo';


const Input = ({
    label,
    id,
    value,
    onChange,
    type = "text",
    required = false,
    className = "",
    labelLeftClass = "left-3",
    floating = true,
    children,
    disabled = false,
    ...props
}) => {
    const isTextarea = type === "textarea";
    const baseClass = floating
        ? `peer w-full rounded-xl border border-gray-300 px-3 pt-4 pb-1.5 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sl ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-800'} ${className}`
        : `w-full rounded-xl border border-gray-300 px-3 py-2 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sl ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-800'} ${className}`;

    return (
        <div className={floating ? "relative w-full" : "w-full"}>
            {!floating && label && (
                <label
                    htmlFor={id}
                    className={`block text-sm font-medium mb-1 capitalize ${disabled ? 'text-gray-400' : 'text-gray-900'}`}
                >
                    {label} {required && <span className="text-red-500 font-bold">*</span>}
                </label>
            )}

            <div className="relative w-full">
                {children}
                {isTextarea ? (
                    <textarea
                        id={id}
                        required={required}
                        value={value || ""}
                        onChange={onChange}
                        placeholder={floating ? " " : undefined}
                        className={`${baseClass} min-h-[100px]`}
                        disabled={disabled}
                        {...props}
                    />
                ) : (
                    <input
                        type={type}
                        id={id}
                        required={required}
                        value={type === "file" ? undefined : (value || "")}
                        onChange={onChange}
                        placeholder={floating ? " " : undefined}
                        className={baseClass}
                        disabled={disabled}
                        {...props}
                    />
                )}
            </div>

            {floating && label && (
                <label
                    htmlFor={id}
                    className={`absolute ${labelLeftClass} -top-2.5 px-1 text-sl font-medium transition-all pointer-events-none peer-focus:text-blue-600 ${disabled ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-900'}`}
                >
                    {label} {required && <span className="text-red-500 font-bold">*</span>}
                </label>
            )}
        </div>
    );
};



const formatDateValue = (val) => {
    if (!val) return '';
    return val.split(' ')[0].split('T')[0];
};

const parseTo24hDateTime = (val) => {
    if (!val) return '';
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(val)) return val;

    const match = String(val).match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{1,2}):(\d{2})\s+(AM|PM)$/i);
    if (match) {
        const [_, yyyy, mm, dd, hStr, mStr, period] = match;
        let h = parseInt(hStr, 10);
        if (period.toUpperCase() === 'PM' && h < 12) h += 12;
        if (period.toUpperCase() === 'AM' && h === 12) h = 0;
        return `${yyyy}-${mm}-${dd}T${String(h).padStart(2, '0')}:${mStr}`;
    }

    try {
        const normalized = String(val).replace(' ', 'T');
        const date = new Date(normalized);
        if (!isNaN(date.getTime())) {
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const hh = String(date.getHours()).padStart(2, '0');
            const min = String(date.getMinutes()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
        }
    } catch (e) { }

    return '';
};

const convertTo12hDateTime = (val) => {
    if (!val) return '';
    const parts = val.split('T');
    if (parts.length !== 2) return val;
    const datePart = parts[0];
    const timePart = parts[1];

    const [hStr, mStr] = timePart.split(':');
    let h = parseInt(hStr, 10);
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;

    return `${datePart} ${String(h).padStart(2, '0')}:${mStr} ${period}`;
};

const convertTo12hTime = (val) => {
    if (!val) return '';
    const parts = val.split(':');
    if (parts.length !== 2) return val;
    let h = parseInt(parts[0], 10);
    const m = parts[1];
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    if (h === 0) h = 12;
    return `${String(h).padStart(2, '0')}:${m} ${period}`;
};

const formatDateTimeValue = (val) => {
    return parseTo24hDateTime(val);
};

const formatTimeValue = (val) => {
    if (!val) return '';
    if (/^\d{2}:\d{2}$/.test(val)) return val;
    if (/^\d{2}:\d{2}:\d{2}/.test(val)) {
        return val.substring(0, 5);
    }
    if (String(val).toLowerCase().includes('am') || String(val).toLowerCase().includes('pm')) {
        try {
            const timePart = String(val).includes(' ') ? String(val).split(' ').slice(-2).join(' ') : String(val);
            const [time, modifier] = timePart.split(' ');
            let [hours, minutes] = time.split(':');
            hours = parseInt(hours, 10);
            if (modifier.toLowerCase() === 'pm' && hours < 12) {
                hours += 12;
            }
            if (modifier.toLowerCase() === 'am' && hours === 12) {
                hours = 0;
            }
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
        } catch (e) {
            console.error("Error parsing 12h time:", e);
        }
    }
    try {
        const normalized = String(val).includes('T') || String(val).includes('-') ? String(val).replace(' ', 'T') : `1970-01-01T${val}`;
        const date = new Date(normalized);
        if (!isNaN(date.getTime())) {
            const hh = String(date.getHours()).padStart(2, '0');
            const min = String(date.getMinutes()).padStart(2, '0');
            return `${hh}:${min}`;
        }
    } catch (e) {
        console.error("Error parsing time:", e);
    }
    return '';
};

const InputField = ({
    field,
    value,
    onChange,
    className = '',
    canEditAccess,
    disabled,
    options: propOptions,
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [localOptions, setLocalOptions] = useState([]);
    const { fieldType, fieldName, fieldKey, required } = field;
    const isRequired = !!required;
    const isDisabled = disabled || canEditAccess === false;

    const options = propOptions !== undefined ? propOptions : localOptions;

    useEffect(() => {
        if (!propOptions && (fieldType === 'DROPDOWN' || fieldType === 'MULTISELECT' || field.releatedTo || field.relatedTo) && field.id) {

            fetchOptions();
        }
    }, [fieldType, field.id, field.releatedTo, field.relatedTo, propOptions]);

    const fetchOptions = async () => {
        try {
            if (field.relatedTo) {
                const response = await axiosInstance.get(
                    `/recordFieldValue/getRecordIdAndValue?moduleId=${field.relatedToModuleId}&fieldId=${field.relatedToModuleFieldId}`
                );
                const mappedOptions = (response.data || []).map(opt => ({
                    value: opt.recordId,
                    label: opt.value || "(Empty)"
                }));
                setLocalOptions(mappedOptions);
            } else {
                const response = await axiosInstance.get(`/multiFieldValue/getByFieldId/${field.id}`);
                setLocalOptions(response.data || []);
            }
        } catch (error) {
            console.error("Error fetching field options:", error);
        }
    };

    if (field.relatedTo) {
        return (
            <CustomDropdown
                label={fieldName}
                id={fieldKey}
                value={value}
                onChange={(val) => onChange(fieldKey, val)}
                options={options}
                required={isRequired}
                multiple={false}
                disabled={isDisabled}
                {...props}
            />
        );
    }

    switch (fieldType) {
        case 'TEXTAREA':
            return (
                <Input
                    type="textarea"
                    label={fieldName}
                    id={fieldKey}
                    required={isRequired}
                    value={value}
                    onChange={(e) => onChange(fieldKey, e.target.value)}
                    className={className}
                    disabled={isDisabled}
                    {...props}
                />
            );

        case 'DROPDOWN':
            if (fieldKey === 'assignTo') {
                return (
                    <AssignTo
                        label={fieldName}
                        id={fieldKey}
                        value={value}
                        onChange={(val) => onChange(fieldKey, val)}
                        required={isRequired}
                        disabled={isDisabled}
                        {...props}
                    />
                );
            }
            return (
                <CustomDropdown
                    label={fieldName}
                    id={fieldKey}
                    value={value}
                    onChange={(val) => onChange(fieldKey, val)}
                    options={options}
                    required={isRequired}
                    multiple={false}
                    disabled={isDisabled}
                    {...props}
                />
            );

        case 'MULTISELECT':
            return (
                <CustomDropdown
                    label={fieldName}
                    id={fieldKey}
                    value={value}
                    onChange={(val) => onChange(fieldKey, val)}
                    options={options}
                    required={isRequired}
                    multiple={true}
                    disabled={isDisabled}
                    {...props}
                />
            );

        case 'RADIO':
        case 'BOOLEAN':
        case 'CHECKBOX':
            return (
                <div className={`flex items-center w-full min-h-[46px] px-3 border border-gray-300 rounded-xl transition-all duration-200 ${isDisabled ? 'bg-gray-50' : 'bg-white'} ${className}`}>
                    <input
                        type="checkbox"
                        id={fieldKey}
                        className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${isDisabled ? 'cursor-not-allowed text-gray-400' : 'cursor-pointer'}`}
                        checked={value === true || value === 'true'}
                        onChange={(e) => onChange(fieldKey, e.target.checked)}
                        disabled={isDisabled}
                        {...props}
                    />
                    <label htmlFor={fieldKey} className={`ml-2 text-sm font-medium capitalize ${isDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900 cursor-pointer'}`}>
                        {fieldName} {isRequired && <span className="text-red-500 font-bold">*</span>}
                    </label>
                </div>
            );
        case 'NUMBER':
            return (
                <Input
                    type="number"
                    label={fieldName}
                    id={fieldKey}
                    required={isRequired}
                    value={value}
                    onChange={(e) => onChange(fieldKey, e.target.value)}
                    className={className}
                    disabled={isDisabled}
                    {...props}
                />
            );
        case 'CURRENCY':
            return (
                <Input
                    type="number"
                    step="0.01"
                    label={fieldName}
                    id={fieldKey}
                    required={isRequired}
                    className={`pl-7 ${className}`}
                    labelLeftClass="left-6"
                    value={value}
                    onChange={(e) => onChange(fieldKey, e.target.value)}
                    disabled={isDisabled}
                    {...props}
                >
                    <div className="pointer-events-none absolute left-3 top-3">
                        <span className="text-gray-500 text-sm">$</span>
                    </div>
                </Input>
            );
        case 'DATE':
            return (
                <Input
                    type="date"
                    label={fieldName}
                    id={fieldKey}
                    required={isRequired}
                    value={formatDateValue(value)}
                    onChange={(e) => onChange(fieldKey, e.target.value)}
                    className={className}
                    disabled={isDisabled}
                    {...props}
                />
            );
        case 'DATETIME':
            return (
                <Input
                    type="datetime-local"
                    label={fieldName}
                    id={fieldKey}
                    required={isRequired}
                    value={formatDateTimeValue(value)}
                    onChange={(e) => onChange(fieldKey, convertTo12hDateTime(e.target.value))}
                    className={className}
                    disabled={isDisabled}
                    {...props}
                />
            );
        case 'TIME':
            return (
                <Input
                    type="time"
                    label={fieldName}
                    id={fieldKey}
                    required={isRequired}
                    value={formatTimeValue(value)}
                    onChange={(e) => onChange(fieldKey, convertTo12hTime(e.target.value))}
                    className={className}
                    disabled={isDisabled}
                    {...props}
                />
            );
        case 'EMAIL':
            return (
                <Input
                    type="email"
                    label={fieldName}
                    id={fieldKey}
                    required={isRequired}
                    value={value}
                    onChange={(e) => onChange(fieldKey, e.target.value)}
                    className={className}
                    disabled={isDisabled}
                    {...props}
                />
            );
        case 'PASSWORD':
            return (
                <Input
                    type={showPassword ? "text" : "password"}
                    label={fieldName}
                    id={fieldKey}
                    required={isRequired}
                    className={`pr-10 ${className}`}
                    value={value}
                    onChange={(e) => onChange(fieldKey, e.target.value)}
                    disabled={isDisabled}
                    {...props}
                >
                    <button
                        type="button"
                        onClick={() => !isDisabled && setShowPassword(prev => !prev)}
                        disabled={isDisabled}
                        className={`absolute right-3 top-3 text-gray-400 focus:outline-none bg-transparent border-0 transition-colors ${isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:text-gray-600 cursor-pointer'}`}
                        title={showPassword ? "Hide password" : "Show password"}
                    >
                        <i className={`fa-solid ${showPassword ? "fa-eye-slash" : "fa-eye"} text-sm`}></i>
                    </button>
                </Input>
            );
        case 'URL':
            return (
                <Input
                    type="url"
                    label={fieldName}
                    id={fieldKey}
                    required={isRequired}
                    value={value}
                    onChange={(e) => onChange(fieldKey, e.target.value)}
                    className={className}
                    disabled={isDisabled}
                    {...props}
                />
            );
        case 'PHONE':
            return (
                <Input
                    type="tel"
                    label={fieldName}
                    id={fieldKey}
                    required={isRequired}
                    value={value}
                    onChange={(e) => onChange(fieldKey, e.target.value)}
                    className={className}
                    disabled={isDisabled}
                    {...props}
                />
            );
        case 'FILE':
            return (
                <Input
                    type="file"
                    label={fieldName}
                    id={fieldKey}
                    required={isRequired && !value}
                    floating={false}
                    multiple
                    className={className}
                    onChange={(e) => onChange(fieldKey, Array.from(e.target.files))}
                    disabled={isDisabled}
                    {...props}
                />
            );
        case 'IMAGE':
            return (
                <Input
                    type="file"
                    accept="image/*"
                    label={fieldName}
                    id={fieldKey}
                    required={isRequired && !value}
                    floating={false}
                    multiple
                    className={className}
                    onChange={(e) => onChange(fieldKey, Array.from(e.target.files))}
                    disabled={isDisabled}
                    {...props}
                />
            );
        default:
            return (
                <Input
                    type="text"
                    label={fieldName}
                    id={fieldKey}
                    required={isRequired}
                    value={value}
                    onChange={(e) => onChange(fieldKey, e.target.value)}
                    className={className}
                    disabled={isDisabled}
                    {...props}
                />
            );
    }
};

export default InputField;
