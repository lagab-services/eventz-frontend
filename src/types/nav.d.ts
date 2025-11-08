import {Icon} from 'lucide-react';

export interface NavLink {
    title: string;
    url: string;
    icon?: JSX.Element | React.ElementType | Icon;
}

export interface SideLink extends NavLink {
    label?: string;
    sub?: SideLink[];
}