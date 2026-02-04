import React, { useState } from 'react';
import { Bike, Activity, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InputField } from '../components/InputField';

export const SportsMode: React.FC = () => {
    const [glucose, setGlucose] = useState('');

    const getSportAdvice = () => {
        const g = parseFloat(glucose);
        if (isNaN(g)) return null;

        if (g < 100) return { status: 'stop', color: 'red', msg: 'STOP ✋. Come 1-2 raciones de HC lentos (galleta, pan) y espera a subir de 100 antes de empezar.', icon: AlertTriangle };

        // New range: 100 - 120 (Optimal but close to limit)
        if (g >= 100 && g < 120) return { status: 'monitor', color: 'indigo', msg: 'OJO 🧐. Estás en rango pero algo justo. Si el entreno es largo, come una fruta o monitoriza cada 20 min.', icon: AlertCircle };

        if (g >= 120 && g <= 250) return { status: 'go', color: 'green', msg: 'ADELANTE 🟢. Rango óptimo para entrenar. ¡Disfruta!', icon: CheckCircle };

        if (g > 250) return { status: 'caution', color: 'orange', msg: 'PRECAUCIÓN ⚠️. Mide Cetonas. Si hay cetonas NO hagas deporte. Si no hay, bebe agua y corrige.', icon: AlertCircle };
        return null;
    };

    const sportResult = getSportAdvice();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
        >
            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-white/50">
                <div className="flex items-center mb-6">
                    <div className="bg-green-100 p-3 rounded-2xl mr-4 text-green-600">
                        <Bike className="h-8 w-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Asistente Deporte</h2>
                </div>

                <InputField label="Glucosa Actual" icon={Activity} value={glucose} setValue={setGlucose} placeholder="---" unit="mg/dL" />

                <AnimatePresence mode="wait">
                    {sportResult && (
                        <motion.div
                            key={sportResult.status}
                            initial={{ opacity: 0, scale: 0.9, height: 0 }}
                            animate={{ opacity: 1, scale: 1, height: 'auto' }}
                            exit={{ opacity: 0, scale: 0.9, height: 0 }}
                            transition={{ type: "spring", bounce: 0.4 }}
                            className={`mt-6 p-6 rounded-2xl border-2 shadow-sm ${sportResult.status === 'go' ? 'bg-green-50 border-green-200 text-green-900' :
                                sportResult.status === 'monitor' ? 'bg-indigo-50 border-indigo-200 text-indigo-900' :
                                    sportResult.status === 'caution' ? 'bg-orange-50 border-orange-200 text-orange-900' :
                                        'bg-red-50 border-red-200 text-red-900'
                                }`}
                        >
                            <div className="flex items-center mb-2">
                                <sportResult.icon className={`h-6 w-6 mr-2 ${sportResult.status === 'go' ? 'text-green-600' : sportResult.status === 'monitor' ? 'text-indigo-600' : sportResult.status === 'caution' ? 'text-orange-600' : 'text-red-600'}`} />
                                <p className="font-bold text-lg">{sportResult.status === 'go' ? '¡ADELANTE!' : sportResult.status === 'monitor' ? 'VIGILA' : sportResult.status === 'caution' ? 'PRECAUCIÓN' : 'STOP'}</p>
                            </div>
                            <p className="text-sm leading-relaxed font-medium opacity-90">{sportResult.msg}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-blue-50/50 p-6 rounded-2xl text-blue-900 text-sm border border-blue-100/50 backdrop-blur-sm shadow-sm"
            >
                <strong className="block mb-2 text-blue-700">💡 Tip de experto:</strong> Si es deporte aeróbico (correr, bici, nadar) la glucosa tiende a bajar. Si es anaeróbico (pesas, sprint, crossfit) puede subir temporalmente.
            </motion.div>
        </motion.div>
    );
};
