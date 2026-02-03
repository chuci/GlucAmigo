import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputFieldProps {
    label: string;
    icon: LucideIcon;
    value: string | number;
    setValue: (value: string) => void;
    placeholder?: string;
    unit?: string;
    type?: string;
    readOnly?: boolean;
    onClick?: () => void;
}

export const InputField: React.FC<InputFieldProps> = ({
    label,
    icon: Icon,
    value,
    setValue,
    placeholder,
    unit,
    type = "number",
    readOnly = false,
    onClick
}) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-slate-600 mb-1 ml-1">{label}</label>
        <div className="relative" onClick={onClick}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-indigo-400" />
            </div>
            <input
                type={type}
                value={value}
                onChange={(e) => !readOnly && setValue(e.target.value)}
                readOnly={readOnly}
                className={`block w-full pl-10 pr-12 py-3 border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-lg shadow-sm ${readOnly ? 'bg-slate-100 cursor-pointer' : 'bg-white'}`}
                placeholder={placeholder}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-slate-400 text-sm">{unit}</span>
            </div>
        </div>
    </div>
);
