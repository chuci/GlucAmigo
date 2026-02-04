import useLocalStorageState from 'use-local-storage-state';

export interface UserProfile {
    name: string;
    weight?: number;
    cloudConsent?: boolean; // New consent flag
    ratios: {
        breakfast: { carbRatio: number; sensitivity: number; target: number };
        lunch: { carbRatio: number; sensitivity: number; target: number };
        snack: { carbRatio: number; sensitivity: number; target: number };
        dinner: { carbRatio: number; sensitivity: number; target: number };
    };
}
// ... existing code ...
export const useProfile = () => {
    return useLocalStorageState<UserProfile & { isConfigured?: boolean }>('diabuddy-profile-v3', {
        defaultValue: {
            name: 'Campeona',
            isConfigured: false,
            cloudConsent: false, // Default to false for privacy
            ratios: {
                breakfast: { carbRatio: 10, sensitivity: 50, target: 100 },
                lunch: { carbRatio: 12, sensitivity: 50, target: 100 },
                snack: { carbRatio: 12, sensitivity: 50, target: 100 },
                dinner: { carbRatio: 15, sensitivity: 50, target: 130 },
            },
        },
    });
};

// Placeholder for future database extension
export const useFoodDatabase = () => {
    return useLocalStorageState<any[]>('diabuddy-food-db', {
        defaultValue: [],
    });
};

export const useSavedMenus = () => {
    return useLocalStorageState<SavedMenu[]>('diabetesSavedMenus', {
        defaultValue: []
    });
};

export const useLogs = () => {
    return useLocalStorageState<LogEntry[]>('diabuddy-logs-v1', {
        defaultValue: []
    });
};

export const useDisclaimer = () => {
    return useLocalStorageState<boolean>('diabetesAppDisclaimer', {
        defaultValue: false
    });
};
