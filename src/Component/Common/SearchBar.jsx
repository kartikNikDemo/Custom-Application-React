import React from 'react';

const SearchBar = ({ 
    value, 
    onChange, 
    placeholder = "Search...", 
    className = "",
    ...props 
}) => {
    return (
        <div className={`relative flex items-center w-full max-w-md ${className}`}>
            <span className="absolute left-3.5 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
            </span>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-11 pr-10 py-2 bg-gray-800/50 border border-gray-700/80 rounded-xl shadow-sm text-sm placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-200"
                {...props}
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onChange("")}
                    className="absolute right-3 text-gray-400 hover:text-gray-200 focus:outline-none transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            )}
        </div>
    );
};

export default SearchBar;
