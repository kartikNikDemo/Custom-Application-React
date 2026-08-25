import React from 'react';
import Pagination from '../../Features/Module/List/Pagination';

const Table = ({
    columns = [],
    data = [],
    loading = false,
    // Pagination parameters
    pageNumber = 0,
    pageSize = 25,
    totalElements = 0,
    totalPages = 0,
    first = true,
    last = true,
    onPageChange,
    onPageSizeChange,
    // Action column
    actions = null, // Can be a function: (row) => React.ReactNode
    actionColumnWidth = 'w-28',
    actionColumnLabel = 'Action'
}) => {
    return (
        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden max-w-full">
            <div className="flex-1 overflow-x-auto overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    scope="col"
                                    className="sticky top-0 z-20 bg-gray-50 px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200"
                                >
                                    {col.label}
                                </th>
                            ))}
                            {actions && (
                                <th
                                    scope="col"
                                    className={`sticky top-0 right-0 z-30 bg-gray-50 px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200 ${actionColumnWidth}`}
                                >
                                    {actionColumnLabel}
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-16 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-3"></div>
                                        <p className="text-gray-500 text-sm font-medium">Loading records...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : data.length > 0 ? (
                            data.map((row, rowIndex) => (
                                <tr 
                                    key={row.id || rowIndex} 
                                    className="hover:bg-gray-50/75 transition-colors group"
                                >
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className="px-6 py-3.5 whitespace-nowrap text-sm text-gray-900"
                                        >
                                            {col.render ? col.render(row) : (row[col.key] ?? <span className="text-gray-400 font-normal">—</span>)}
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="sticky right-0 z-10 bg-white group-hover:bg-gray-50/75 transition-colors px-6 py-3.5 whitespace-nowrap text-right">
                                            <div className="flex gap-2.5 items-center justify-end">
                                                {actions(row)}
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    className="px-6 py-16 text-center text-gray-500 text-sm"
                                >
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-gray-200/50 text-gray-400">
                                        <i className="fa-solid fa-folder-open text-xl"></i>
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-900">No records found</h3>
                                    <p className="mt-1 text-sm text-gray-400">There are no records to display in this list.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {!loading && totalPages > 0 && onPageChange && (
                <Pagination
                    pageNumber={pageNumber}
                    pageSize={pageSize}
                    totalElements={totalElements}
                    totalPages={totalPages}
                    first={first}
                    last={last}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                />
            )}
        </div>
    );
};

export default Table;
