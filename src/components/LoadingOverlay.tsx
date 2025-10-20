import React from "react";

// @ts-ignore
const LoadingOverlay = ({ active, children }) => {
    return (
        <div className="relative">
            <div className={active ? "pointer-events-none opacity-50" : ""}>
                {children}
            </div>

            {active && (
                <div className="absolute inset-0 flex items-center justify-center  z-10">
                    <div className="w-6 h-6 border-4 border-gray-200 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};

export default LoadingOverlay;