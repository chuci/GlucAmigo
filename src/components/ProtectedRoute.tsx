import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useProfile } from '../services/storage';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [profile] = useProfile();
    const location = useLocation();

    // If not configured and not already on settings page, redirect to settings
    if (!profile.isConfigured && location.pathname !== '/settings') {
        return <Navigate to="/settings" replace />;
    }

    return <>{children}</>;
};
