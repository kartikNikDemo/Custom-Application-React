import React from 'react';

const Pagination = ({
    pageNumber,
    pageSize,
    totalElements,
    totalPages,
    first,
    last,
    onPageChange,
    onPageSizeChange
}) => {
    const startElement = totalElements > 0 ? pageNumber * pageSize + 1 : 0;
    const endElement = Math.min((pageNumber + 1) * pageSize, totalElements);

    const pageSizeOptions = [25, 50, 100, 200];

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(0);

            let start = Math.max(1, pageNumber - 1);
            let end = Math.min(totalPages - 2, pageNumber + 1);

            if (pageNumber <= 2) {
                end = 3;
            } else if (pageNumber >= totalPages - 3) {
                start = totalPages - 4;
            }

            if (start > 1) {
                pages.push('ellipsis-start');
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages - 2) {
                pages.push('ellipsis-end');
            }

            pages.push(totalPages - 1);
        }
        return pages;
    };

    return (
        <div className="sticky bottom-0 left-0 z-40 bg-white border-t-2 border-gray-200 px-6 py-2 flex flex-col md:flex-row items-center justify-between gap-4 mt-auto w-[calc(100vw-32px)] sm:w-[calc(100vw-48px)] lg:w-[calc(100vw-64px)]">
            {/* Left: Capsule Info Label */}
            <div className="flex items-center">
                {totalElements > 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border-2 border-gray-200 text-xs font-bold text-gray-500 font-sans shadow-2xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Showing <strong className="text-gray-900 font-extrabold">{startElement}-{endElement}</strong> of <strong className="text-blue-600 font-extrabold">{totalElements}</strong> entries
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border-2 border-gray-200 text-xs font-bold text-gray-400 font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        No entries found
                    </span>
                )}
            </div>

            {/* Right: Controls & Page Pills */}
            <div className="flex items-center gap-6 flex-wrap justify-center">
                {/* Page Size Select */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider font-sans">Rows:</span>
                    <div className="relative">
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange(Number(e.target.value))}
                            className="appearance-none bg-none bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 text-xs font-extrabold rounded-xl pl-3.5 pr-8 py-1.5 cursor-pointer transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 shadow-2xs"
                        >
                            {pageSizeOptions.map(option => (
                                <option key={option} value={option}>{option} rows</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-gray-400 text-xs">
                            <i className="fa-solid fa-chevron-down"></i>
                        </div>
                    </div>
                </div>

                {/* Page Navigation Controls */}
                <div className="flex items-center gap-1.5">
                    {/* Previous Button */}
                    <button
                        type="button"
                        disabled={first}
                        onClick={() => onPageChange(pageNumber - 1)}
                        className="w-8.5 h-8.5 flex items-center justify-center rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-500 hover:text-gray-900 transition duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
                        title="Previous Page"
                    >
                        <i className="fa-solid fa-chevron-left text-xs"></i>
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {getPageNumbers().map((page, index) => {
                            if (page === 'ellipsis-start' || page === 'ellipsis-end') {
                                return (
                                    <span
                                        key={`ellipsis-${index}`}
                                        className="w-8.5 h-8.5 flex items-center justify-center text-gray-400 text-xs font-extrabold tracking-widest"
                                    >
                                        •••
                                    </span>
                                );
                            }

                            const isActive = page === pageNumber;
                            return (
                                <button
                                    key={page}
                                    type="button"
                                    onClick={() => onPageChange(page)}
                                    className={`w-8.5 h-8.5 flex items-center justify-center rounded-xl text-xs font-black border-2 transition duration-150 active:scale-90 cursor-pointer ${isActive
                                            ? "bg-gradient-to-tr from-blue-600 to-indigo-600 border-transparent text-white shadow-md shadow-blue-500/20"
                                            : "bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-600 hover:text-gray-900"
                                        }`}
                                >
                                    {page + 1}
                                </button>
                            );
                        })}
                    </div>

                    {/* Next Button */}
                    <button
                        type="button"
                        disabled={last}
                        onClick={() => onPageChange(pageNumber + 1)}
                        className="w-8.5 h-8.5 flex items-center justify-center rounded-xl border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-500 hover:text-gray-900 transition duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
                        title="Next Page"
                    >
                        <i className="fa-solid fa-chevron-right text-xs"></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
