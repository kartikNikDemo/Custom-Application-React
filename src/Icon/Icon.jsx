import React from 'react';

/**
 * Edit SVG Icon Component with customizable stroke, size, and className
 */
export const EditIcon = ({
    size = 16,
    className = "",
    stroke = "currentColor",
    strokeWidth = 2,
    ...props
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
    >
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
);

/**
 * Delete / Trash SVG Icon Component with customizable stroke, size, and className
 */
export const DeleteIcon = ({
    size = 16,
    className = "",
    stroke = "currentColor",
    strokeWidth = 2,
    ...props
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
    >
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
);

/**
 * Preview / Eye SVG Icon Component with customizable stroke, size, and className
 */
export const PreviewIcon = ({
    size = 16,
    className = "",
    stroke = "currentColor",
    strokeWidth = 2,
    ...props
}) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
    >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

/**
 * Universal Icon Component supporting name="edit" | "delete" | "preview"
 */
const Icon = ({ name, size = 16, className = "", stroke = "currentColor", strokeWidth = 2, ...props }) => {
    switch (name) {
        case 'edit':
            return <EditIcon size={size} className={className} stroke={stroke} strokeWidth={strokeWidth} {...props} />;
        case 'delete':
            return <DeleteIcon size={size} className={className} stroke={stroke} strokeWidth={strokeWidth} {...props} />;
        case 'preview':
        case 'eye':
            return <PreviewIcon size={size} className={className} stroke={stroke} strokeWidth={strokeWidth} {...props} />;
        default:
            return null;
    }
};

export default Icon;
