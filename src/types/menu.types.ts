import {ReactNode} from "react";

export interface DropdownItem {
    name: string;
    href: string;
}

export interface MenuItem {
    name: string;
    href?: string;
    icon?: ReactNode;
    badge?: string;
    dropdownItems?: DropdownItem[];
}

export interface SelectOption {
    value: string;
    label: string;
}