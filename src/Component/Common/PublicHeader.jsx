import React from 'react';

const PublicHeader = ({ headerTitle, formDescription, moduleIcon, moduleColor }) => {
    // Dynamic color styles
    const themeColor = moduleColor || '#2563EB'; // default blue-600
    const iconClass = moduleIcon ? (moduleIcon.startsWith('fa-') ? `fa-solid ${moduleIcon}` : moduleIcon) : 'fa-solid fa-file-lines';

    return (
        <div className="text-center pb-8 border-b border-gray-100 mb-8">
            {/* Dynamic Module Icon Banner */}
            <div 
                className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105 mb-4"
                style={{ 
                    backgroundColor: `${themeColor}15`, 
                    color: themeColor,
                    border: `1px solid ${themeColor}30`,
                    boxShadow: `0 10px 15px -3px ${themeColor}15`
                }}
            >
                <i className={`${iconClass} text-2xl`}></i>
            </div>
            
            {/* Main Title */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight capitalize">
                {headerTitle}
            </h1>
            
            {/* Description */}
            {formDescription && (
                <p className="mt-2 text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
                    {formDescription}
                </p>
            )}
            
            {/* Dynamic decorative accent divider */}
            <div className="mt-4 flex justify-center gap-1.5">
                <span className="w-8 h-1 rounded-full" style={{ backgroundColor: themeColor }}></span>
                <span className="w-2 h-1 rounded-full opacity-60" style={{ backgroundColor: themeColor }}></span>
                <span className="w-1 h-1 rounded-full opacity-30" style={{ backgroundColor: themeColor }}></span>
            </div>
        </div>
    );
};

export default PublicHeader;