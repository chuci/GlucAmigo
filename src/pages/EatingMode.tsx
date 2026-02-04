import React, { useState, useEffect } from 'react';
import { Settings, Apple, Activity, AlertTriangle, Save, ChevronLeft, Search, Utensils, PlusCircle, Trash2, TrendingUp, TrendingDown, ArrowRight, Sun, Moon, Coffee, Star, BookOpen, GraduationCap, CheckCircle, XCircle, Calculator, ChevronsUp, ChevronsDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile, useSavedMenus, useFoodDatabase, useLogs } from '../services/storage';
import { saveLogToCloud } from '../services/firebase';
import { calculateBolus } from '../logic/bolus';
import { FOOD_DATABASE } from '../data/foodDatabase';
import { InputField } from '../components/InputField';
import { TrendButton } from '../components/TrendButton';

interface EatingModeProps {
    onBack: () => void;
    onSettings: () => void;
}

export const EatingMode: React.FC<EatingModeProps> = ({ onBack, onSettings }) => {
    // State
    const [view, setView] = useState<'calculator' | 'foodList' | 'savedMenus'>('calculator');
    const [glucose, setGlucose] = useState('');
    const [trend, setTrend] = useState('flat');
    const [carbsInput, setCarbsInput] = useState('');
    const [selectedMealTime, setSelectedMealTime] = useState<'breakfast' | 'lunch' | 'snack' | 'dinner'>('lunch');

    // Educational State
    const [proposedDose, setProposedDose] = useState('');
    const [showResult, setShowResult] = useState(false);

    // Food State
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFood, setSelectedFood] = useState<any>(null);
    const [foodQuantity, setFoodQuantity] = useState('');
    const [addedFoods, setAddedFoods] = useState<any[]>([]);
    const [newMenuName, setNewMenuName] = useState('');

    // Storage Hooks
    const [profile] = useProfile();
    const [savedMenus, setSavedMenus] = useSavedMenus();
    const [logs, setLogs] = useLogs();

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) setSelectedMealTime('breakfast');
        else if (hour >= 12 && hour < 16) setSelectedMealTime('lunch');
        else if (hour >= 16 && hour < 20) setSelectedMealTime('snack');
        else setSelectedMealTime('dinner');
    }, []);

    // --- Logic ---
    const calculateInsulin = () => {
        const currentGlucose = parseFloat(glucose);
        const currentInput = parseFloat(carbsInput);

        if (isNaN(currentGlucose) && isNaN(currentInput)) return null;

        const currentProfile = profile.ratios[selectedMealTime];
        // If in Rations mode, convert input to grams (1R = 10g)
        const gramsOfCarbs = profile.useRations ? (currentInput * 10) : currentInput;

        let trendAdjustment = 0;
        if (trend === 'rising') trendAdjustment = 25;
        if (trend === 'rapidRising') trendAdjustment = 50;
        if (trend === 'falling') trendAdjustment = -25;
        if (trend === 'rapidFalling') trendAdjustment = -50;

        const result = calculateBolus({
            carbs: gramsOfCarbs, // Always pass grams to calculator
            bg: isNaN(currentGlucose) ? 0 : currentGlucose,
            target: currentProfile.target,
            carbRatio: currentProfile.carbRatio,
            sensitivity: currentProfile.sensitivity,
            trendArrows: trendAdjustment
        });

        const foodDose = gramsOfCarbs / currentProfile.carbRatio;
        const correctionDose = (!isNaN(currentGlucose) && currentGlucose > currentProfile.target)
            ? ((currentGlucose + trendAdjustment) - currentProfile.target) / currentProfile.sensitivity
            : 0;

        return {
            totalDose: result < 0 ? 0 : result, // Safety cap at 0
            foodDose: foodDose,
            correctionDose: correctionDose,
            isHypoRisk: !isNaN(currentGlucose) && currentGlucose < 70,
            trendAdjustment: trendAdjustment,
            gramsUsed: gramsOfCarbs // helper for display
        };
    };

    const insulinResult = calculateInsulin();
    const currentProfile = profile.ratios[selectedMealTime];

    // Reset result when inputs change
    useEffect(() => {
        setShowResult(false);
    }, [glucose, carbsInput, trend, selectedMealTime]);


    // Food Logic
    const filteredFoods = FOOD_DATABASE.filter((food: any) =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addFoodToMeal = () => {
        if (!selectedFood || !foodQuantity) return;

        let calculatedCarbs = 0;
        let quantityInGrams = 0;

        if (profile.useRations) {
            // Input is in Rations (e.g. 1.5 R)
            // 1 Ration = 10g Carbs
            const rationsInput = parseFloat(foodQuantity);
            calculatedCarbs = rationsInput * 10;

            // Calculate how many grams of food correspond to these rations
            // (TargetCarbs / CarbsPer100g) * 100
            if (selectedFood.carbs > 0) {
                quantityInGrams = (calculatedCarbs / selectedFood.carbs) * 100;
            }
        } else {
            // Input is in Grams of Weight
            quantityInGrams = parseFloat(foodQuantity);
            calculatedCarbs = (selectedFood.carbs * quantityInGrams) / 100;
        }

        const newItem = {
            id: Date.now(),
            name: selectedFood.name,
            quantity: Math.round(quantityInGrams), // Store weight for consistency
            calculatedCarbs: calculatedCarbs,
            absorption: selectedFood.absorption,
            fatProteinAlert: selectedFood.fatProteinAlert
        };
        const newFoods = [...addedFoods, newItem];
        setAddedFoods(newFoods);

        // Sum total grams
        const totalGrams = newFoods.reduce((acc, curr) => acc + curr.calculatedCarbs, 0);
        // Display in grams or rations
        setCarbsInput(profile.useRations ? (totalGrams / 10).toFixed(1) : totalGrams.toFixed(0));

        setSelectedFood(null);
        setFoodQuantity('');
        setSearchTerm('');
        setView('calculator');
    };

    const removeFoodItem = (id: number) => {
        const newFoods = addedFoods.filter(item => item.id !== id);
        setAddedFoods(newFoods);
        const totalGrams = newFoods.reduce((acc, curr) => acc + curr.calculatedCarbs, 0);
        setCarbsInput(profile.useRations ? (totalGrams / 10).toFixed(1) : totalGrams.toFixed(0));
    };

    const saveCurrentMenu = () => {
        if (!newMenuName || addedFoods.length === 0) return;
        const newMenu = {
            id: Date.now(),
            name: newMenuName,
            foods: addedFoods
        };
        setSavedMenus([...savedMenus, newMenu]);
        setNewMenuName('');
        alert('¡Menú guardado!');
    };

    const loadMenu = (menu: any) => {
        setAddedFoods(menu.foods);
        const totalGrams = menu.foods.reduce((acc: number, curr: any) => acc + curr.calculatedCarbs, 0);
        setCarbsInput(profile.useRations ? (totalGrams / 10).toFixed(1) : totalGrams.toFixed(0));
        setView('calculator');
    };

    const checkResult = () => {
        setShowResult(true);
    };

    const getFeedback = () => {
        if (!insulinResult) return null;
        const proposed = parseFloat(proposedDose);
        if (isNaN(proposed)) return null;

        const diff = Math.abs(proposed - insulinResult.totalDose);
        if (diff < 0.5) return { status: 'correct', msg: '¡Perfecto! Has acertado.', color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
        if (diff < 1.5) return { status: 'close', msg: 'Casi, casi... revisa los números.', color: 'text-orange-600', bg: 'bg-orange-100', icon: GraduationCap };
        return { status: 'wrong', msg: 'Ups, algo falla. Mira la explicación.', color: 'text-indigo-600', bg: 'bg-indigo-100', icon: Calculator };
    };

    const feedback = getFeedback();

    // Render
    return (
        <AnimatePresence mode="wait">
            {/* Header Calculadora */}
            {view === 'calculator' && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="flex justify-between items-center mb-4 px-2"
                >
                    <button onClick={onSettings} className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500 hover:text-indigo-600 transition"><Settings className="h-5 w-5" /></button>
                    <div className="flex space-x-2 bg-slate-100 p-1 rounded-xl">
                        {[
                            { id: 'breakfast', icon: Coffee, label: 'Des' },
                            { id: 'lunch', icon: Sun, label: 'Com' },
                            { id: 'snack', icon: Apple, label: 'Mer' },
                            { id: 'dinner', icon: Moon, label: 'Cen' }
                        ].map((meal: any) => (
                            <button
                                key={meal.id}
                                onClick={() => setSelectedMealTime(meal.id)}
                                className={`px-2 py-1.5 rounded-lg text-xs font-bold flex items-center transition-all ${selectedMealTime === meal.id ? 'bg-white text-indigo-600 shadow-sm scale-105' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                <meal.icon className="h-3 w-3 mr-1" /> {meal.label}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* VISTA: CALCULADORA PRINCIPAL */}
            {view === 'calculator' && (
                <motion.div
                    key="calculator"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 pb-20"
                >
                    <div className="bg-white rounded-3xl shadow-xl shadow-indigo-100/50 p-6 border border-slate-50">
                        {/* Glucosa */}
                        <div className="mb-6">
                            <InputField label="Glucosa Actual" icon={Activity} value={glucose} setValue={setGlucose} placeholder="---" unit="mg/dL" />
                            <div className="flex gap-1 justify-between mt-3 px-1">
                                <TrendButton type="rapidFalling" icon={ChevronsDown} active={trend === 'rapidFalling'} onClick={() => setTrend('rapidFalling')} colorClass="bg-red-500" />
                                <TrendButton type="falling" icon={TrendingDown} active={trend === 'falling'} onClick={() => setTrend('falling')} colorClass="bg-orange-400 rotate-[-45deg]" />
                                <TrendButton type="flat" icon={ArrowRight} active={trend === 'flat'} onClick={() => setTrend('flat')} colorClass="bg-green-500" />
                                <TrendButton type="rising" icon={TrendingUp} active={trend === 'rising'} onClick={() => setTrend('rising')} colorClass="bg-orange-400 rotate-[45deg]" />
                                <TrendButton type="rapidRising" icon={ChevronsUp} active={trend === 'rapidRising'} onClick={() => setTrend('rapidRising')} colorClass="bg-red-500" />
                            </div>
                        </div>

                        {/* Carbohidratos */}
                        <div className="flex items-end gap-3 mb-2">
                            <div className="flex-grow">
                                <InputField
                                    label={profile.useRations ? "Raciones (1R = 10g)" : "Carbohidratos"}
                                    icon={Apple}
                                    value={carbsInput}
                                    setValue={setCarbsInput}
                                    placeholder="0"
                                    unit={profile.useRations ? "R" : "g"}
                                />
                            </div>
                            <div className="flex flex-col gap-2 mb-4">
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setView('foodList')} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition shadow-sm border border-indigo-100" title="Buscar comida"><Utensils className="h-6 w-6" /></motion.button>
                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setView('savedMenus')} className="p-3 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition shadow-sm border border-amber-100" title="Mis Menús"><BookOpen className="h-6 w-6" /></motion.button>
                            </div>
                        </div>

                        {/* Lista de comidas añadidas + Botón Guardar Menú */}
                        <AnimatePresence>
                            {addedFoods.length > 0 && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="bg-slate-50 rounded-2xl p-4 text-sm border border-slate-100 mt-4 mb-4"
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="font-bold text-slate-500 text-xs uppercase tracking-wide">Plato Actual</span>
                                        <button onClick={() => { setAddedFoods([]); setCarbsInput(''); }} className="text-xs text-red-500 font-bold hover:text-red-600">BORRAR TODO</button>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        {addedFoods.map(item => (
                                            <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                                <span className="text-slate-700 font-medium">
                                                    {item.name}
                                                    <span className="text-slate-400 text-xs font-normal ml-1">
                                                        ({profile.useRations ? `${(item.calculatedCarbs / 10).toFixed(1)} R` : `${item.quantity}g`})
                                                    </span>
                                                </span>
                                                <button onClick={() => removeFoodItem(item.id)}><Trash2 className="h-4 w-4 text-slate-300 hover:text-red-500" /></button>
                                            </div>
                                        ))}
                                    </div>
                                    {addedFoods.some(f => f.fatProteinAlert) && (
                                        <div className="bg-amber-50 text-amber-900 p-3 rounded-xl text-xs flex items-start mb-4 border border-amber-200 shadow-sm">
                                            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 text-amber-500" />
                                            <span>
                                                <strong className="block mb-1">¡Ojo! Grasa/Proteína Detectada</strong>
                                                Alimentos como la pizza o fritos retrasan la subida. Valora un bolus dual.
                                            </span>
                                        </div>
                                    )}
                                    <div className="pt-3 border-t border-slate-200">
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="Nombre del menú..." className="flex-grow text-xs p-3 rounded-xl border border-slate-200 bg-white" value={newMenuName} onChange={(e) => setNewMenuName(e.target.value)} />
                                            <button onClick={saveCurrentMenu} className="bg-slate-800 text-white px-4 rounded-xl text-xs font-bold flex items-center hover:bg-slate-700 transition"><Save className="h-4 w-4 mr-1" /> Guardar</button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* --- ZONA EDUCATIVA: APUESTA DE INSULINA --- */}
                        {(glucose || carbsInput) && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-8 pt-6 border-t border-slate-100"
                            >
                                <div className="flex items-center mb-3">
                                    <GraduationCap className="h-6 w-6 text-indigo-500 mr-2" />
                                    <h3 className="font-bold text-slate-700">¿Cuánta rápida (Humalog) crees que necesitas?</h3>
                                </div>
                                <div className="flex gap-3">
                                    <input
                                        type="number" step="0.5"
                                        placeholder="Tu apuesta..."
                                        className="flex-grow p-4 bg-indigo-50 rounded-2xl border-2 border-indigo-100 text-xl font-bold text-indigo-900 text-center focus:outline-none focus:border-indigo-400 transition placeholder:text-indigo-200"
                                        value={proposedDose}
                                        onChange={(e) => setProposedDose(e.target.value)}
                                        onFocus={() => setShowResult(false)}
                                    />
                                    <button
                                        onClick={checkResult}
                                        disabled={!proposedDose}
                                        className="bg-indigo-600 text-white px-6 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition disabled:opacity-50 disabled:shadow-none"
                                    >
                                        Comprobar
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Tarjeta de Resultados (Oculta hasta comprobar) */}
                    <AnimatePresence>
                        {showResult && insulinResult && (
                            <motion.div
                                initial={{ y: 50, opacity: 0, scale: 0.9 }}
                                animate={{ y: 0, opacity: 1, scale: 1 }}
                                exit={{ y: 50, opacity: 0, scale: 0.9 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className={`rounded-3xl shadow-2xl p-6 relative overflow-hidden bg-white border-4 ${feedback?.status === 'correct' ? 'border-green-100' : feedback?.status === 'close' ? 'border-orange-100' : 'border-indigo-100'}`}
                            >
                                {/* Feedback Header */}
                                {feedback && (
                                    <motion.div
                                        initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                                        className={`flex items-center p-4 rounded-xl mb-6 ${feedback.bg} ${feedback.color}`}
                                    >
                                        <feedback.icon className="h-8 w-8 mr-3 flex-shrink-0" />
                                        <div>
                                            <div className="font-black text-lg uppercase tracking-wide">{feedback.status === 'correct' ? '¡ACERTASTE!' : feedback.status === 'close' ? '¡CASI!' : 'REPASEMOS'}</div>
                                            <div className="text-sm font-medium opacity-90">{feedback.msg}</div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Resultado */}
                                <div className="text-center mb-8 relative">
                                    <span className="text-indigo-400 text-xs uppercase tracking-[0.2em] font-bold">Insulina Rápida (Humalog)</span>
                                    <div className="flex items-baseline justify-center space-x-1 mt-2">
                                        <span className="text-6xl font-black text-slate-800">
                                            {insulinResult.totalDose.toFixed(1)}
                                        </span>
                                        <span className="text-2xl text-slate-400 font-bold">u</span>
                                    </div>
                                </div>

                                {/* EXPLICACIÓN EDUCATIVA */}
                                <div className="bg-slate-50 rounded-2xl p-5 space-y-4 text-sm border border-slate-200">
                                    <h4 className="font-bold text-slate-700 flex items-center border-b border-slate-200 pb-2">
                                        <BookOpen className="h-4 w-4 mr-2 text-indigo-500" /> La cuenta paso a paso:
                                    </h4>

                                    {/* Paso 1: Bolo Alimenticio */}
                                    <div className="flex justify-between items-center group">
                                        <div>
                                            <div className="font-bold text-slate-700">1. Bolo Alimenticio (Ratios)</div>
                                            <div className="text-xs text-slate-500 font-mono mt-1">
                                                <span className="bg-indigo-50 px-1 rounded text-indigo-600 font-bold">
                                                    {carbsInput}{profile.useRations ? 'R' : 'g'}
                                                </span> ÷ Ratio {currentProfile.carbRatio}
                                            </div>
                                        </div>
                                        <div className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                                            {insulinResult.foodDose.toFixed(1)} u
                                        </div>
                                    </div>

                                    {/* Paso 2: Corrección (si aplica) */}
                                    {/* Paso 2: Bolo Corrector */}
                                    {(insulinResult.correctionDose !== 0) && (
                                        <div className="flex justify-between items-center group">
                                            <div>
                                                <div className="font-bold text-slate-700">2. Bolo Corrector (Sensibilidad)</div>
                                                <div className="text-xs text-slate-500 font-mono mt-1">
                                                    (<span className={parseFloat(glucose) > currentProfile.target ? "text-red-500 font-bold" : "text-green-600 font-bold"}>{glucose}</span> - {currentProfile.target}) ÷ IS {currentProfile.sensitivity}
                                                    {insulinResult.trendAdjustment !== 0 && <span className="text-orange-500 block font-bold mt-1">⚡ Tendencia: {insulinResult.trendAdjustment > 0 ? '+' : ''}{insulinResult.trendAdjustment} mg/dl</span>}
                                                </div>
                                            </div>
                                            <div className={`font-mono font-bold px-2 py-1 rounded-lg ${insulinResult.correctionDose > 0 ? 'text-red-500 bg-red-50' : 'text-green-500 bg-green-50'}`}>
                                                {insulinResult.correctionDose > 0 ? '+' : ''}{insulinResult.correctionDose.toFixed(1)} u
                                            </div>
                                        </div>
                                    )}

                                    {/* Suma Total */}
                                    <div className="border-t border-slate-200 pt-3 flex justify-between items-center bg-white p-3 rounded-xl shadow-sm -mx-2">
                                        <div className="font-bold text-slate-800 uppercase text-xs">Total Rápida</div>
                                        <div className="font-black text-xl text-slate-900">{insulinResult.totalDose.toFixed(1)} u</div>
                                    </div>

                                    <button
                                        onClick={() => {
                                            const newLog = {
                                                id: Date.now(),
                                                timestamp: new Date().toISOString(),
                                                glucose: parseFloat(glucose) || 0,
                                                carbs: parseFloat(carbsInput) || 0,
                                                foods: addedFoods.map(f => f.name),
                                                insulin: {
                                                    total: insulinResult.totalDose,
                                                    food: insulinResult.foodDose,
                                                    correction: insulinResult.correctionDose
                                                },
                                                notes: feedback?.status === 'correct' ? 'Cálculo aceptado' : 'Cálculo revisado'
                                            };
                                            setLogs([newLog, ...logs]);

                                            // ☁️ Sync to Firebase ONLY if consent is given
                                            if (profile.cloudConsent) {
                                                saveLogToCloud(newLog);
                                                alert('¡Guardado en historial y nube!');
                                            } else {
                                                alert('¡Guardado en historial local!');
                                            }

                                            setShowResult(false);
                                            setAddedFoods([]);
                                            setCarbsInput('');
                                            setGlucose('');
                                            setProposedDose('');
                                            setView('calculator');
                                        }}
                                        className="w-full mt-4 bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center hover:bg-slate-800 transition"
                                    >
                                        <Save className="h-4 w-4 mr-2" /> Guardar en Historial
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* VISTA: MENÚS GUARDADOS */}
            {view === 'savedMenus' && (
                <motion.div
                    key="savedMenus"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-3xl shadow-xl p-6 min-h-[50vh] max-h-[80vh] overflow-y-auto"
                >
                    <div className="flex items-center mb-6">
                        <button onClick={() => setView('calculator')} className="mr-4 p-2 rounded-full hover:bg-slate-100 transition"><ChevronLeft className="h-6 w-6 text-slate-500" /></button>
                        <h2 className="text-xl font-bold text-slate-800 flex items-center"><Star className="h-6 w-6 text-amber-400 fill-current mr-2" /> Mis Menús</h2>
                    </div>

                    {savedMenus.length === 0 ? (
                        <div className="text-center py-10">
                            <div className="bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Star className="h-8 w-8 text-amber-300" />
                            </div>
                            <p className="text-slate-400">No tienes menús guardados.</p>
                            <p className="text-xs text-slate-400 mt-2">Añade comidas en la calculadora y pulsa "Guardar".</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {savedMenus.map(menu => (
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    key={menu.id}
                                    className="border border-amber-100 rounded-2xl p-4 transition bg-gradient-to-br from-amber-50/50 to-white shadow-sm"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-slate-800 text-lg">{menu.name}</h3>
                                        <button onClick={() => setSavedMenus(savedMenus.filter(m => m.id !== menu.id))} className="text-slate-300 hover:text-red-500 transition"><Trash2 className="h-5 w-5" /></button>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                                        {menu.foods.map((f: any) => f.name).join(', ')}
                                    </p>
                                    <button onClick={() => loadMenu(menu)} className="w-full bg-indigo-600 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 active:scale-95 transition">
                                        Cargar Menú
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}

            {/* VISTA: BUSCADOR */}
            {view === 'foodList' && (
                <motion.div
                    key="foodList"
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                    className="bg-white rounded-3xl shadow-xl p-6 h-[80vh] max-h-[800px] flex flex-col"
                >
                    <div className="relative mb-4 flex items-center gap-3">
                        <button onClick={() => setView('calculator')} className="p-2 rounded-full hover:bg-slate-100 transition"><ChevronLeft className="h-6 w-6 text-slate-500" /></button>
                        <div className="relative flex-grow">
                            <Search className="absolute left-4 top-3.5 h-5 w-5 text-indigo-300" />
                            <input autoFocus type="text" placeholder="Buscar alimento..." className="w-full pl-12 p-3 bg-indigo-50/50 border-none rounded-2xl text-lg focus:ring-2 focus:ring-indigo-200 transition text-slate-700 placeholder:text-indigo-200" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                    </div>
                    <div className="flex-grow overflow-y-auto space-y-2 mb-4 pr-1 scrollbar-hide">
                        {filteredFoods.map((food: any, index: number) => (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                key={food.id}
                                onClick={() => { setSelectedFood(food); setFoodQuantity(''); }}
                                className={`w-full text-left p-4 rounded-2xl transition flex justify-between items-center ${selectedFood?.id === food.id ? 'bg-indigo-600 shadow-lg shadow-indigo-300 transform scale-[1.02]' : 'hover:bg-slate-50 border border-transparent'}`}
                            >
                                <div>
                                    <span className={`font-bold block text-lg ${selectedFood?.id === food.id ? 'text-white' : 'text-slate-700'}`}>{food.name}</span>
                                    <span className={`text-xs ${selectedFood?.id === food.id ? 'text-indigo-200' : 'text-slate-400'}`}>{food.carbs}g HC / 100g</span>
                                </div>
                                {selectedFood?.id === food.id && <div className="bg-white/20 p-1 rounded-full"><PlusCircle className="h-5 w-5 text-white" /></div>}
                            </motion.button>
                        ))}
                    </div>
                    <AnimatePresence>
                        {selectedFood && (
                            <motion.div
                                initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                                className="bg-white border-t border-slate-100 pt-4 mt-auto flex gap-3"
                            >
                                <div className="relative flex-grow">
                                    <input autoFocus type="number" step={profile.useRations ? "0.5" : "1"} placeholder="0" className="w-full p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-100 text-2xl font-black text-indigo-900 focus:outline-none focus:border-indigo-400 text-center" value={foodQuantity} onChange={(e) => setFoodQuantity(e.target.value)} />
                                    <span className="absolute right-4 top-5 text-indigo-300 font-bold text-xs uppercase">{profile.useRations ? "Raciones" : "Gramos"}</span>
                                </div>
                                <button onClick={addFoodToMeal} disabled={!foodQuantity} className="bg-indigo-600 text-white px-6 rounded-2xl font-bold flex items-center shadow-xl shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition disabled:opacity-50 disabled:shadow-none">
                                    <PlusCircle className="h-8 w-8" />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
