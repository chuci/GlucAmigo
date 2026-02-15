import useLocalStorageState from 'use-local-storage-state';

export interface UserProfile {
    name: string;
    weight?: number;
    cloudConsent?: boolean; // New consent flag
    useRations?: boolean; // Toggle between Grams (false) and Rations (true)
    nightscout?: {
        enabled: boolean;
        url: string;
        secret: string;
        uploadTreatments: boolean;
    };
    ratios: {
        breakfast: { carbRatio: number; sensitivity: number; target: number };
        lunch: { carbRatio: number; sensitivity: number; target: number };
        snack: { carbRatio: number; sensitivity: number; target: number };
        dinner: { carbRatio: number; sensitivity: number; target: number };
    };
}
export interface SavedMenu {
    id: number;
    name: string;
    foods: any[];
}

export interface LogEntry {
    id: number;
    timestamp: string;
    glucose: number;
    carbs: number;
    foods: string[];
    insulin: {
        total: number;
        food: number;
        correction: number;
    };
    notes?: string;
}
export const useProfile = () => {
    return useLocalStorageState<UserProfile & { isConfigured?: boolean }>('diabuddy-profile-v3', {
        defaultValue: {
            name: 'Campeona',
            isConfigured: false,
            cloudConsent: false, // Default to false for privacy
            useRations: false, // Default: Grams
            nightscout: {
                enabled: false,
                url: '',
                secret: '',
                uploadTreatments: false
            },
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
