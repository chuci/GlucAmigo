import React, { useState } from 'react';
import { Save, ChevronLeft, Heart, ToggleLeft, Info, X } from 'lucide-react';
import { useProfile } from '../services/storage';
import { saveProfileToCloud } from '../services/firebase';
import { InputField } from '../components/InputField';
import { motion, AnimatePresence } from 'framer-motion';

import { useNavigate, useLocation } from 'react-router-dom';

interface SettingsModeProps {
    onBack: () => void;
}

export const SettingsMode: React.FC<SettingsModeProps> = ({ onBack }) => {
    const navigate = useNavigate();
    const location = useLocation();
    // Check if we have history state to go back to, otherwise default to home (handled by onBack if passed, or explicit nav)
    const from = (location.state as any)?.from || '/';

    const handleBack = () => {
        if ((location.state as any)?.from) {
            navigate((location.state as any).from);
        } else {
            onBack(); // Fallback to prop or Home
            if (!onBack.name) navigate('/');
        }
    };
    const [profile, setProfile] = useProfile();
    const [activeHelp, setActiveHelp] = useState<string | null>(null);

    // Initial state allows string inputs for better UX
    const [localProfile, setLocalProfile] = useState<{
        name: string;
        cloudConsent: boolean;
        ratios: {
            [key: string]: {
                carbRatio: string | number;
                sensitivity: string | number;
                target: string | number;
            }
        }
    }>({
        name: profile.name,
        cloudConsent: profile.cloudConsent || false,
        ratios: {
            breakfast: { ...profile.ratios.breakfast },
            lunch: { ...profile.ratios.lunch },
            snack: { ...profile.ratios.snack },
            dinner: { ...profile.ratios.dinner },
        }
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanRatios: any = {};
        (['breakfast', 'lunch', 'snack', 'dinner']).forEach((meal) => {
            const m = meal as keyof typeof localProfile.ratios;
            cleanRatios[m] = {
                carbRatio: parseFloat(String(localProfile.ratios[m].carbRatio)) || 0,
                sensitivity: parseFloat(String(localProfile.ratios[m].sensitivity)) || 0,
                target: parseFloat(String(localProfile.ratios[m].target)) || 0,
            };
        });

        const newProfile = {
            ...profile,
            name: localProfile.name,
            ratios: cleanRatios,
            isConfigured: true,
            cloudConsent: localProfile.cloudConsent
        };

        setProfile(newProfile);

        // Only sync to cloud if consent is given
        if (newProfile.cloudConsent) {
            saveProfileToCloud(newProfile); // ☁️ Sync to Firebase
        }

        handleBack();
    };

    const updateProfileRatio = (meal: string, field: string, value: string) => {
        setLocalProfile(prev => ({
            ...prev,
            ratios: {
                ...prev.ratios,
                [meal]: { ...prev.ratios[meal], [field]: value }
            }
        }));
    };

    const definitions: any = {
        ratio: { title: "Ratio (I:CH)", text: "Son los gramos de hidratos de carbono que cubre 1 unidad de insulina.\n\nEjemplo: Ratio 10 significa que necesitas 1u de insulina por cada 10g de hidratos que comas.\n\nNúmero más BAJO = Necesitas MÁS insulina (eres más resistente).\nNúmero más ALTO = Necesitas MENOS insulina." },
        sensitivity: { title: "Sensibilidad (FSI)", text: "Es la cantidad de glucosa (mg/dL) que baja 1 unidad de insulina.\n\nEjemplo: 50 significa que 1u te baja 50 mg/dL.\n\nSe usa para calcular la dosis de corrección cuando estás alto." },
        target: { title: "Objetivo", text: "Es el valor de glucosa ideal al que quieres llegar después de la insulina activa (unas 3-4h).\n\nLo habitual es buscar 100-110 mg/dL." }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-2xl shadow-md p-6 pt-8 pb-20 relative">
            <div className="flex items-center mb-4">
                <button onClick={handleBack} className="mr-3 p-1 rounded-full hover:bg-slate-100">
                    <ChevronLeft className="h-6 w-6 text-slate-500" />
                </button>
                <h2 className="text-lg font-bold text-slate-800">Configuración</h2>
            </div>

            <form onSubmit={handleSave}>
                <InputField label="Nombre" icon={Heart} type="text" value={localProfile.name} setValue={(val) => setLocalProfile(prev => ({ ...prev, name: val }))} placeholder="Nombre" unit="" />

                <div className="flex items-center justify-between bg-slate-100 p-3 rounded-xl border border-slate-200 mb-6">
                    <div className="flex flex-col"><span className="font-bold text-slate-700 text-sm">Usar Raciones (1R = 10g)</span></div>
                    <button type="button" className="text-indigo-600 focus:outline-none"><ToggleLeft className="h-10 w-10 text-slate-400" /></button>
                </div>

                {(['breakfast', 'lunch', 'snack', 'dinner'] as const).map((meal) => (
                    <div key={meal} className={`p-4 rounded-xl mb-4 border ${meal === 'breakfast' ? 'bg-orange-50 border-orange-100' : meal === 'lunch' ? 'bg-yellow-50 border-yellow-100' : meal === 'snack' ? 'bg-pink-50 border-pink-100' : 'bg-indigo-50 border-indigo-100'}`}>
                        <h3 className="text-sm font-bold mb-3 uppercase opacity-70">{meal === 'breakfast' ? 'Desayuno' : meal === 'lunch' ? 'Comida' : meal === 'snack' ? 'Merienda' : 'Cena'}</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { id: 'carbRatio', label: 'Ratio', help: 'ratio' },
                                { id: 'sensitivity', label: 'Sensib.', help: 'sensitivity' },
                                { id: 'target', label: 'Objetivo', help: 'target' }
                            ].map((field) => (
                                <div key={field.id}>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="text-[10px] uppercase font-bold text-slate-400">{field.label}</label>
                                        <button type="button" onClick={() => setActiveHelp(field.help)}><Info className="h-3 w-3 text-slate-400 hover:text-indigo-500" /></button>
                                    </div>
                                    <input
                                        type="number" step="0.1" inputMode="decimal"
                                        className="w-full p-2 rounded border bg-white focus:ring-2 focus:ring-indigo-200 outline-none"
                                        value={localProfile.ratios[meal][field.id as keyof typeof localProfile.ratios.breakfast]}
                                        onChange={(e) => updateProfileRatio(meal, field.id, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Privacy Section Hidden for Store Compliance
                <div className="bg-indigo-50 p-4 rounded-xl mb-6 border border-indigo-100">
                    <h3 className="font-bold text-indigo-900 mb-2 flex items-center">
                        <Info className="h-5 w-5 mr-2" /> Privacidad y Estudios
                    </h3>
                    ...
                </div>
                */}

                <button type="submit" className="w-full mt-2 bg-indigo-600 text-white py-3 rounded-xl font-bold flex items-center justify-center hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition">
                    <Save className="h-5 w-5 mr-2" /> Guardar Todo
                </button>
            </form>

            <AnimatePresence>
                {activeHelp && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 backdrop-blur-sm" onClick={() => setActiveHelp(null)}>
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
                            <button onClick={() => setActiveHelp(null)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X className="h-5 w-5 text-slate-500" /></button>
                            <h3 className="text-xl font-bold text-indigo-600 mb-4 flex items-center"><Info className="h-6 w-6 mr-2" /> {definitions[activeHelp].title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{definitions[activeHelp].text}</p>
                            <button onClick={() => setActiveHelp(null)} className="w-full mt-6 bg-slate-900 text-white py-3 rounded-xl font-bold">Entendido</button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};
