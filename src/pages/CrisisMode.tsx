import React from 'react';
import { AlertTriangle, Flame, Clock, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export const CrisisMode: React.FC = () => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-red-50 to-white rounded-[2.5rem] p-6 border-4 border-red-100 shadow-2xl relative overflow-hidden"
        >
            <motion.div
                animate={{ opacity: [0.5, 0.2, 0.5], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-red-200 rounded-full blur-3xl opacity-20"
            />

            <div className="flex flex-col items-center justify-center mb-8 relative z-10">
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="bg-red-100 p-6 rounded-full shadow-inner mb-4"
                >
                    <AlertTriangle className="h-12 w-12 text-red-600" />
                </motion.div>
                <h2 className="text-3xl font-black text-center text-red-600 tracking-tight">HIPOGLUCEMIA</h2>
                <p className="text-red-400 font-bold tracking-widest text-sm mt-1">PROTOCOLO EMERGENCIA</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-sm space-y-6 text-left border border-white/50 relative z-10">
                {[
                    { id: 1, icon: Flame, title: "Azúcar Rápido", text: "Toma 15g de azúcar rápido (1 zumo pequeño, 2 sobres de azúcar o 1 gel).", color: "text-red-500", bg: "bg-red-100" },
                    { id: 2, icon: Clock, title: "Espera", text: "Espera 15 minutos en reposo absoluto. No comas nada más.", color: "text-orange-500", bg: "bg-orange-100" },
                    { id: 3, icon: RefreshCw, title: "Mide y Repite", text: "Mídete otra vez. Si sigues < 70, repite el paso 1.", color: "text-indigo-500", bg: "bg-indigo-100" }
                ].map((step, index) => (
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.2 + 0.3 }}
                        key={step.id}
                        className="flex items-start group"
                    >
                        <div className={`${step.bg} ${step.color} font-bold rounded-2xl w-12 h-12 flex items-center justify-center mr-4 flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform`}>
                            <step.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">{step.title}</h3>
                            <p className="text-slate-500 text-sm leading-snug">{step.text}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 text-center relative z-10">
                <div className="bg-red-600 text-white inline-block px-4 py-1 rounded-full text-xs font-black shadow-lg shadow-red-200 tracking-widest">REGLA DEL 15x15</div>
            </div>
        </motion.div>
    );
};
