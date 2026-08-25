import React from "react";

export const renderRecordValue = (value, fieldType) => {
    if (value === undefined || value === null || value === '') return "-";

    if (fieldType === 'DATE') {
        const num = Number(value);
        if (!isNaN(num) && num > 0) {
            return new Date(num).toLocaleDateString();
        }
        return value;
    }

    if (fieldType === 'DATETIME') {
        const num = Number(value);
        if (!isNaN(num) && num > 0) {
            return new Date(num).toLocaleString(undefined, { hour12: true });
        }
        const strVal = String(value);
        if (strVal.includes('T')) {
            const parts = strVal.split('T');
            if (parts.length === 2) {
                const datePart = parts[0];
                const timePart = parts[1];
                const [hStr, mStr] = timePart.split(':');
                let h = parseInt(hStr, 10);
                const period = h >= 12 ? 'PM' : 'AM';
                h = h % 12;
                if (h === 0) h = 12;
                return `${datePart} ${String(h).padStart(2, '0')}:${mStr.substring(0, 2)} ${period}`;
            }
        }
        if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}/.test(strVal) && !strVal.toLowerCase().includes('am') && !strVal.toLowerCase().includes('pm')) {
            const parts = strVal.split(' ');
            const datePart = parts[0];
            const timePart = parts[1];
            const [hStr, mStr] = timePart.split(':');
            let h = parseInt(hStr, 10);
            const period = h >= 12 ? 'PM' : 'AM';
            h = h % 12;
            if (h === 0) h = 12;
            return `${datePart} ${String(h).padStart(2, '0')}:${mStr.substring(0, 2)} ${period}`;
        }
        return value;
    }

    if (fieldType === 'TIME') {
        const strVal = String(value);
        if (strVal.toLowerCase().includes('am') || strVal.toLowerCase().includes('pm')) {
            return value;
        }
        if (/^\d{2}:\d{2}/.test(strVal)) {
            const [hStr, mStr] = strVal.split(':');
            let h = parseInt(hStr, 10);
            const m = mStr.substring(0, 2);
            const period = h >= 12 ? 'PM' : 'AM';
            h = h % 12;
            if (h === 0) h = 12;
            return `${String(h).padStart(2, '0')}:${m} ${period}`;
        }
        return value;
    }

    return String(value);
};
