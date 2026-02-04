import React from 'react';
import { Utensils, Bike, Flame, ArrowRight, Activity, Droplet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLogs } from '../services/storage';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export const HomeMode: React.FC = () => {
    const [logs] = useLogs();

    // Calculate Average Glucose (Last 30 entries)
    const glucoseReadings = logs.filter(l => l.glucose > 0).slice(0, 30);
    const avgGlucose = glucoseReadings.length > 0
        ? Math.round(glucoseReadings.reduce((acc, curr) => acc + curr.glucose, 0) / glucoseReadings.length)
        : 0;

    // Calculate IOB (Insulin on Board) - Simple Linear Decay (4 hours)
    const calculateIOB = () => {
        const now = new Date().getTime();
        let totalIOB = 0;
        const duration = 4 * 60 * 60 * 1000; // 4 hours in ms

        logs.forEach(log => {
            const logTime = new Date(log.timestamp).getTime();
            const timeElapsed = now - logTime;

            if (timeElapsed < duration && log.insulin.total > 0) {
                const percentRemaining = 1 - (timeElapsed / duration);
                totalIOB += log.insulin.total * percentRemaining;
            }
        });
        return Math.max(0, totalIOB);
    };

    const iob = calculateIOB();

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6 mt-4"
        >
            {/* Quick Stats Widget (Real Data) */}
            {/* Quick Stats Widget (Hidden by user request) */}
            {/* 
            <motion.div variants={item} className="grid grid-cols-2 gap-4 mb-6">
                <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                    <div className="bg-indigo-50 p-2 rounded-full mb-2">
                        <Activity className="h-5 w-5 text-indigo-500" />
                    </div>
                    <span className="text-2xl font-bold text-slate-700">{avgGlucose > 0 ? avgGlucose : '--'}</span>
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">Media (mg/dL)</span>
                </div>
                <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                    <div className="bg-blue-50 p-2 rounded-full mb-2">
                        <Droplet className="h-5 w-5 text-blue-500" />
                    </div>
                    <span className="text-2xl font-bold text-slate-700">{iob > 0 ? iob.toFixed(1) + 'u' : '--'}</span>
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wide">IOB Activa</span>
                </div>
            </motion.div>
            */}

            <motion.div variants={item} className="text-left mb-6 px-2">
                <h2 className="text-lg font-bold text-slate-800">¿Qué necesitas ahora?</h2>
            </motion.div>

            <motion.div variants={item}>
                <Link to="/eat" className="group relative overflow-hidden w-full bg-white p-6 rounded-3xl shadow-xl shadow-indigo-100/50 border border-white/60 flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full translate-x-10 -translate-y-10 group-hover:bg-indigo-100 transition-colors"></div>
                    <div className="relative z-10 flex items-center space-x-5">
                        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-4 rounded-2xl shadow-lg shadow-indigo-300 text-white">
                            <Utensils className="h-8 w-8" />
                        </div>
                        <div className="text-left">
                            <span className="block text-xl font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">Comer</span>
                            <span className="text-sm text-slate-400 font-medium">Calcular insulina</span>
                        </div>
                    </div>
                    <div className="relative z-10 bg-slate-50 p-2 rounded-full group-hover:bg-indigo-50 transition-colors">
                        <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-500" />
                    </div>
                </Link>
            </motion.div>

            <motion.div variants={item}>
                <Link to="/sport" className="group relative overflow-hidden w-full bg-white p-6 rounded-3xl shadow-xl shadow-green-100/50 border border-white/60 flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-full translate-x-10 -translate-y-10 group-hover:bg-green-100 transition-colors"></div>
                    <div className="relative z-10 flex items-center space-x-5">
                        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-4 rounded-2xl shadow-lg shadow-emerald-200 text-white">
                            <Bike className="h-8 w-8" />
                        </div>
                        <div className="text-left">
                            <span className="block text-xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">Deporte</span>
                            <span className="text-sm text-slate-400 font-medium">¿Puedo entrenar?</span>
                        </div>
                    </div>
                    <div className="relative z-10 bg-slate-50 p-2 rounded-full group-hover:bg-emerald-50 transition-colors">
                        <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-emerald-500" />
                    </div>
                </Link>
            </motion.div>

            <motion.div variants={item}>
                <Link to="/crisis" className="group relative overflow-hidden w-full bg-white p-6 rounded-3xl shadow-xl shadow-red-100/50 border border-white/60 flex items-center justify-between transition-all hover:scale-[1.02] active:scale-[0.98]">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full translate-x-10 -translate-y-10 group-hover:bg-red-100 transition-colors"></div>
                    <div className="relative z-10 flex items-center space-x-5">
                        <div className="bg-gradient-to-br from-red-500 to-rose-600 p-4 rounded-2xl shadow-lg shadow-red-200 text-white">
                            <Flame className="h-8 w-8" />
                        </div>
                        <div className="text-left">
                            <span className="block text-xl font-bold text-slate-800 group-hover:text-red-700 transition-colors">SOS / Bajada</span>
                            <span className="text-sm text-slate-400 font-medium">Hipoglucemia</span>
                        </div>
                    </div>
                    <div className="relative z-10 bg-slate-50 p-2 rounded-full group-hover:bg-red-50 transition-colors">
                        <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-red-500" />
                    </div>
                </Link>
            </motion.div>

        </motion.div >
    );
};
