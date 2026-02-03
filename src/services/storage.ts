import useLocalStorageState from 'use-local-storage-state';

export interface UserProfile {
    name: string;
    weight?: number;
    ratios: {
        breakfast: { carbRatio: number; sensitivity: number; target: number };
        lunch: { carbRatio: number; sensitivity: number; target: number };
        snack: { carbRatio: number; sensitivity: number; target: number };
        dinner: { carbRatio: number; sensitivity: number; target: number };
    };
}

export interface FoodItem {
    id: number;
    name: string;
    calculatedCarbs: number;
    quantity: number;
    absorption: 'rapida' | 'media' | 'lenta';
    fatProteinAlert?: boolean;
}

export interface SavedMenu {
    id: number;
    name: string;
    foods: FoodItem[];
}

export const useProfile = () => {
    return useLocalStorageState<UserProfile>('diabuddy-profile-v2', {
        defaultValue: {
            name: 'Campeona',
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

export const useDisclaimer = () => {
    return useLocalStorageState<boolean>('diabetesAppDisclaimer', {
        defaultValue: false
    });
};
