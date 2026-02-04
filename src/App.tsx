import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart, Home, AlertTriangle, Settings } from 'lucide-react';
import { useProfile, useDisclaimer } from './services/storage';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { HomeMode } from './pages/HomeMode';
import { EatingMode } from './pages/EatingMode';
import { SportsMode } from './pages/SportsMode';
import { CrisisMode } from './pages/CrisisMode';
import { SettingsMode } from './pages/SettingsMode';
import { initAuth } from './services/firebase';

const DisclaimerScreen = ({ onAccept }: { onAccept: () => void }) => (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Decorative Circles */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-[10%] right-[-10%] w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-white/50 relative z-10"
        >
            <div className="bg-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="h-10 w-10 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Aviso Importante</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
                Esta aplicación es una herramienta de ayuda. <br />
                <span className="font-semibold text-indigo-600">Consulta siempre a tu médico</span> antes de tomar decisiones sobre tu tratamiento.
            </p>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAccept}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-indigo-200 text-lg hover:shadow-indigo-300 transition-all"
            >
                Entendido, vamos allá
            </motion.button>
        </motion.div>
    </div>
);

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [profile] = useProfile();
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-20 relative overflow-x-hidden selection:bg-indigo-100">
            {/* Ambient Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-40"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-40"></div>
            </div>

            {/* Header Global */}
            <header className={`p-6 z-20 relative transition-all duration-300 ${isHome ? 'bg-transparent' : 'bg-white/80 backdrop-blur-md shadow-sm sticky top-0'}`}>
                <div className="flex justify-between items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center space-x-3"
                    >
                        <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-xl shadow-lg shadow-indigo-200">
                            <Heart className="h-5 w-5 text-white fill-current" />
                        </div>
                        {isHome && (
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Hola,</p>
                                <h1 className="text-xl font-bold text-slate-800 leading-none">{profile.name || 'GlucAmigo'}</h1>
                            </div>
                        )}
                        {!isHome && <h1 className="text-lg font-bold text-slate-700">GlucAmigo</h1>}
                    </motion.div>

                    <div className="flex items-center gap-2">
                        {!isHome && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => navigate('/')}
                                className="p-3 bg-white border border-slate-100 rounded-xl shadow-sm text-slate-500 hover:text-indigo-600 transition-colors"
                            >
                                <Home className="h-5 w-5" />
                            </motion.button>
                        )}
                        {isHome && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => navigate('/settings', { state: { from: location.pathname } })}
                                className="p-2 bg-white/50 rounded-full text-slate-400 hover:bg-white hover:text-indigo-600 transition-all"
                            >
                                <Settings className="h-6 w-6" />
                            </motion.button>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-md mx-auto p-4 z-10 relative">
                {children}
            </main>
        </div>
    );
};

// Wrapper to handle navigation for EatingMode
const EatingModeWithNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <EatingMode
            onBack={() => navigate('/')}
            onSettings={() => navigate('/settings', { state: { from: location.pathname } })}
        />
    );
};

const AnimatedRoutes = () => {
    const location = useLocation();
    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={
                    <ProtectedRoute>
                        <PageTransition>
                            <HomeMode />
                        </PageTransition>
                    </ProtectedRoute>
                } />
                <Route path="/eat" element={
                    <ProtectedRoute>
                        <PageTransition>
                            {/* Pass navigation handlers to EatingMode */}
                            <EatingModeWithNav />
                        </PageTransition>
                    </ProtectedRoute>
                } />
                <Route path="/sport" element={
                    <ProtectedRoute>
                        <PageTransition>
                            <SportsMode />
                        </PageTransition>
                    </ProtectedRoute>
                } />
                <Route path="/crisis" element={
                    <ProtectedRoute>
                        <PageTransition>
                            <CrisisMode />
                        </PageTransition>
                    </ProtectedRoute>
                } />
                <Route path="/settings" element={
                    <PageTransition>
                        {/* We pass a dummy onBack because now SettingsMode handles navigation with useLocation hook internally */}
                        <SettingsMode onBack={() => { }} />
                    </PageTransition>
                } />
            </Routes>
        </AnimatePresence>
    );
}

const PageTransition = ({ children }: { children: React.ReactNode }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
    >
        {children}
    </motion.div>
);

const AppRoutes = () => {
    return (
        <Layout>
            <AnimatedRoutes />
        </Layout>
    );
};

const App = () => {
    const [accepted, setAccepted] = useDisclaimer();

    React.useEffect(() => {
        initAuth();
    }, []);

    if (!accepted) {
        return <DisclaimerScreen onAccept={() => setAccepted(true)} />;
    }

    return (
        <Router>
            <AppRoutes />
        </Router>
    );
};

export default App;
