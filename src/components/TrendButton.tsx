import React from 'react';
import { LucideIcon } from 'lucide-react';

interface TrendButtonProps {
    type: string;
    icon: LucideIcon;
    active: boolean;
    onClick: () => void;
    colorClass: string;
}

export const TrendButton: React.FC<TrendButtonProps> = ({ icon: Icon, active, onClick, colorClass }) => (
    <button
        onClick={onClick}
        className={`p-3 rounded-xl flex-1 flex justify-center items-center transition-all ${active ? `${colorClass} text-white shadow-md transform scale-105` : 'bg-white border border-slate-200 text-slate-400 hover:bg-slate-50'}`}
    >
        <Icon className="h-6 w-6" />
    </button>
);
