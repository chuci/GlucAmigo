import React, { useState } from 'react';
import { Save, ChevronLeft, Heart, ToggleLeft, Info, X } from 'lucide-react';
import { useProfile } from '../services/storage';
import { saveProfileToCloud } from '../services/firebase';
import { fetchLatestGlucose, fetchNightscoutProfile } from '../services/nightscout';
import { InputField } from '../components/InputField';
import { motion, AnimatePresence } from 'framer-motion';

import { useNavigate, useLocation } from 'react-router-dom';

export const SettingsMode: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        // Prioritize returning to the specific route we came from
        if ((location.state as any)?.from) {
            navigate((location.state as any).from);
        } else {
            // Default fallback
            navigate('/');
        }
    };
    const [profile, setProfile] = useProfile();
    const [activeHelp, setActiveHelp] = useState<string | null>(null);
    const [connStatus, setConnStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    // Initial state allows string inputs for better UX
    const [localProfile, setLocalProfile] = useState<{
        name: string;
        cloudConsent: boolean;
        useRations: boolean;
        nightscout: {
            enabled: boolean;
            url: string;
            secret: string;
            uploadTreatments: boolean;
        };
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
        useRations: profile.useRations || false,
        nightscout: {
            enabled: profile.nightscout?.enabled || false,
            url: profile.nightscout?.url || '',
            secret: profile.nightscout?.secret || '',
            uploadTreatments: profile.nightscout?.uploadTreatments || false,
        },
        ratios: {
            breakfast: { ...profile.ratios.breakfast },
            lunch: { ...profile.ratios.lunch },
            snack: { ...profile.ratios.snack },
            dinner: { ...profile.ratios.dinner },
        }
    });

    const checkNSConnection = async () => {
        if (!localProfile.nightscout.url) return;
        setConnStatus('loading');
        try {
            const data = await fetchLatestGlucose(localProfile.nightscout.url, localProfile.nightscout.secret);
            setConnStatus(data ? 'success' : 'error');
        } catch (e) {
            setConnStatus('error');
        }
    };

    const syncProfiles = async () => {
        if (!localProfile.nightscout.url) return;
        setConnStatus('loading');
        try {
            const ratios = await fetchNightscoutProfile(localProfile.nightscout.url, localProfile.nightscout.secret);
            if (ratios) {
                setLocalProfile(prev => ({
                    ...prev,
                    ratios: ratios
                }));
                setConnStatus('success');
                alert('¡Ratios sincronizados desde Nightscout!');
            } else {
                setConnStatus('error');
                alert('No se pudo obtener el perfil de Nightscout.');
            }
        } catch (e) {
            setConnStatus('error');
            alert('Error al sincronizar: ' + (e as Error).message);
        }
    };

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
            cloudConsent: localProfile.cloudConsent,
            useRations: localProfile.useRations,
            nightscout: { ...localProfile.nightscout }
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

    const toggleRations = () => {
        setLocalProfile(prev => ({ ...prev, useRations: !prev.useRations }));
    };

    const definitions: any = {
        ratio: { title: "Ratio (I:CH)", text: "Son los gramos de hidratos de carbono que cubre 1 unidad de insulina.\n\nEjemplo: Ratio 10 significa que necesitas 1u de insulina por cada 10g de hidratos que comas.\n\nNúmero más BAJO = Necesitas MÁS insulina (eres más resistente).\nNúmero más ALTO = Necesitas MENOS insulina." },
        sensitivity: { title: "Sensibilidad (FSI)", text: "Es la cantidad de glucosa (mg/dL) que baja 1 unidad de insulina.\n\nEjemplo: 50 significa que 1u te baja 50 mg/dL.\n\nSe usa para calcular la dosis de corrección cuando estás alto." },
        target: { title: "Objetivo", text: "Es el valor de glucosa ideal al que quieres llegar después de la insulina activa (unas 3-4h).\n\nLo habitual es buscar 100-110 mg/dL." },
        nightscout: {
            title: "Configurar Nightscout",
            text: "Para que funcione en la web, DEBES habilitar CORS en tu Nightscout:\n\n1. Ve a los ajustes de tu servidor (Heroku/Vps).\n2. En variables de entorno, busca ENABLE y añade 'cors' (ej: 'careportal basal cors').\n3. Añade la variable CORS_ALLOW_ORIGIN con valor '*' (o el link de esta app).\n\nSin esto, el navegador bloqueará la conexión por seguridad."
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white rounded-2xl shadow-md p-6 pt-8 pb-20 relative">
            <div className="flex items-center mb-4">
                {profile.isConfigured && (
                    <button onClick={handleBack} className="mr-3 p-1 rounded-full hover:bg-slate-100">
                        <ChevronLeft className="h-6 w-6 text-slate-500" />
                    </button>
                )}
                <h2 className="text-lg font-bold text-slate-800">Configuración</h2>
            </div>

            <form onSubmit={handleSave}>
                <InputField label="Nombre" icon={Heart} type="text" value={localProfile.name} setValue={(val) => setLocalProfile(prev => ({ ...prev, name: val }))} placeholder="Nombre" unit="" />

                <div className="flex items-center justify-between bg-slate-100 p-3 rounded-xl border border-slate-200 mb-4">
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-700 text-sm">Usar Raciones (1R = 10g)</span>
                        <span className="text-xs text-slate-400">{localProfile.useRations ? 'Activado' : 'Desactivado (Usar gramos)'}</span>
                    </div>
                    <button type="button" onClick={toggleRations} className={`focus:outline-none transition-colors ${localProfile.useRations ? 'text-indigo-600' : 'text-slate-400'}`}>
                        <ToggleLeft className={`h-10 w-10 transition-transform ${localProfile.useRations ? 'rotate-180' : ''}`} />
                    </button>
                </div>

                {/* Nightscout Section */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-400 uppercase font-black">Carga de glucosa automática</span>
                                <button type="button" onClick={() => setActiveHelp('nightscout')} className="text-indigo-400 hover:text-indigo-600 transition">
                                    <Info className="h-3.5 w-3.5" />
                                </button>
                                {localProfile.nightscout.enabled && (
                                    <div className="flex items-center gap-1 ml-2">
                                        <div className={`w-2 h-2 rounded-full ${connStatus === 'success' ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]' : connStatus === 'error' ? 'bg-red-500' : 'bg-slate-300'}`}></div>
                                        <button type="button" onClick={checkNSConnection} className="text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-800 disabled:opacity-50" disabled={connStatus === 'loading'}>
                                            {connStatus === 'loading' ? '...' : 'Probar'}
                                        </button>
                                        <button type="button" onClick={syncProfiles} className="text-[10px] font-black uppercase text-purple-600 hover:text-purple-800 disabled:opacity-50 border-l border-slate-200 pl-2" disabled={connStatus === 'loading'}>
                                            Sincronizar Ratios
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setLocalProfile(p => ({ ...p, nightscout: { ...p.nightscout, enabled: !p.nightscout.enabled } }))}
                            className={`focus:outline-none transition-colors ${localProfile.nightscout.enabled ? 'text-green-600' : 'text-slate-400'}`}
                        >
                            <ToggleLeft className={`h-10 w-10 transition-transform ${localProfile.nightscout.enabled ? 'rotate-180' : ''}`} />
                        </button>
                    </div>

                    <AnimatePresence>
                        {localProfile.nightscout.enabled && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="space-y-4 overflow-hidden">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">URL de Nightscout</label>
                                    <input
                                        type="url"
                                        placeholder="https://tu-app.herokuapp.com"
                                        className="w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                                        value={localProfile.nightscout.url}
                                        onChange={(e) => setLocalProfile(p => ({ ...p, nightscout: { ...p.nightscout, url: e.target.value } }))}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-400 ml-1">API Secret (para subir datos)</label>
                                    <input
                                        type="password"
                                        placeholder="Tu password de Nightscout"
                                        className="w-full p-3 rounded-xl border bg-white focus:ring-2 focus:ring-indigo-200 outline-none text-sm"
                                        value={localProfile.nightscout.secret}
                                        onChange={(e) => setLocalProfile(p => ({ ...p, nightscout: { ...p.nightscout, secret: e.target.value } }))}
                                    />
                                </div>
                                <div className="flex items-center justify-between p-1">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-700 text-xs">Subir Insulina a Nightscout</span>
                                        <span className="text-[10px] text-slate-400">Registrar bolus automáticamente</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setLocalProfile(p => ({ ...p, nightscout: { ...p.nightscout, uploadTreatments: !p.nightscout.uploadTreatments } }))}
                                        className={`focus:outline-none transition-colors ${localProfile.nightscout.uploadTreatments ? 'text-indigo-600' : 'text-slate-400'}`}
                                    >
                                        <ToggleLeft className={`h-8 w-8 transition-transform ${localProfile.nightscout.uploadTreatments ? 'rotate-180' : ''}`} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
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
