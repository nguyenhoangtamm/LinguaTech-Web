"use client";

import React, { forwardRef } from "react";
import cn from "@/utils/class-names";

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    checked?: boolean;
    defaultChecked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    className?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
    ({ checked, defaultChecked, onCheckedChange, className, disabled, ...rest }, ref) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onCheckedChange?.(e.target.checked);
            if (rest.onChange) rest.onChange(e as any);
        };

        return (
            <label
                className={cn(
                    "inline-flex items-center cursor-pointer",
                    disabled && "opacity-50 cursor-not-allowed",
                    className
                )}
            >
                <input
                    type="checkbox"
                    role="switch"
                    ref={ref}
                    checked={checked}
                    defaultChecked={defaultChecked}
                    onChange={handleChange}
                    disabled={disabled}
                    className="sr-only"
                    {...rest}
                />
                <span
                    className={cn(
                        "w-10 h-6 flex items-center bg-gray-200 rounded-full p-1 transition-colors duration-200",
                        (checked || defaultChecked) && "bg-indigo-600"
                    )}
                >
                    <span
                        className={cn(
                            "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200",
                            (checked || defaultChecked) && "translate-x-4"
                        )}
                    />
                </span>
            </label>
        );
    }
);

Switch.displayName = "Switch";

export default Switch;
