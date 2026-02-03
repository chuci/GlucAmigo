import React from 'react';
import { Utensils, Bike, Flame, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

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
    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-6 mt-4"
        >
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

        </motion.div>
    );
};
