import React from 'react';
import Button from './Button';

const TopBar = ({
    title,
    buttonText,
    onButtonClick,
    buttonVariant = 'primary',
    showSearch = false,
    onSearchChange,
    actions,
    buttonType = 'button',
    form,
    showButton = false
}) => {
    return (
        <div className="mb-2 flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-gray-900 via-slate-900 to-black text-white px-6 py-2.5 rounded-xl shadow-md border border-gray-800 transition-all duration-300 hover:shadow-lg gap-4">
            <h3 className="text-xl md:text-2xl font-extrabold tracking-tight capitalize bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent my-0">
                {title}
            </h3>

            <div className="flex items-center gap-3 flex-wrap justify-end">
                {showSearch && (
                    <input
                        type="text"
                        placeholder="Search..."
                        onChange={(e) => onSearchChange?.(e.target.value)}
                        className="w-64 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                )}
                {actions}
                {showButton && (
                    <Button
                        variant={buttonVariant}
                        onClick={buttonType === 'submit' ? undefined : onButtonClick}
                        type={buttonType}
                        form={form}
                        className="transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-black/30 font-semibold"
                    >
                        {buttonText}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default TopBar;
