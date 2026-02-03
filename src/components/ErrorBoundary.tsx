import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-red-50 flex items-center justify-center p-6 font-sans">
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full border border-red-100">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">Algo salió mal 😔</h1>
                        <p className="text-slate-600 mb-4">Ha ocurrido un error inesperado en la aplicación.</p>

                        <div className="bg-slate-100 p-4 rounded-lg text-xs font-mono text-slate-700 overflow-auto max-h-60 mb-6">
                            <strong className="block text-red-500 mb-2">{this.state.error?.toString()}</strong>
                            {this.state.errorInfo?.componentStack}
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition"
                        >
                            Recargar Página
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
