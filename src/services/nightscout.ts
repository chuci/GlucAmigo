
/**
 * Service to interact with Nightscout API
 */

export interface NightscoutGlucose {
    sgv: number;
    direction: string;
    date: number;
}

/**
 * Helper to normalize Nightscout URL
 */
function normalizeUrl(url: string): string {
    if (!url) return '';
    let normalized = url.trim();

    // Remove protocol for a moment to clean the path
    let protocol = 'https://';
    if (normalized.startsWith('http://')) {
        protocol = 'http://';
        normalized = normalized.substring(7);
    } else if (normalized.startsWith('https://')) {
        protocol = 'https://';
        normalized = normalized.substring(8);
    }

    // Remove any trailing slashes
    normalized = normalized.replace(/\/$/, '');

    // Aggressively remove /api/v1 if the user included it (even multiple times)
    let changed = true;
    while (changed) {
        let before = normalized;
        normalized = normalized.replace(/\/api\/v1$/, '');
        normalized = normalized.replace(/\/api$/, ''); // Also remove trailing /api
        if (before === normalized) changed = false;
    }

    const finalUrl = `${protocol}${normalized}`;

    // Mixed Content Check: If app is https and NS is http, it will fail
    if (window.location.protocol === 'https:' && protocol === 'http:') {
        console.error("⚠️ MIXED CONTENT: No puedes conectar una instancia HTTP desde una app HTTPS. Usa HTTPS en tu Nightscout.");
    }

    return finalUrl;
}

/**
 * Fetch the latest glucose entry from Nightscout
 */
export async function fetchLatestGlucose(url: string, secret?: string): Promise<NightscoutGlucose | null> {
    try {
        if (!url) return null;

        const baseUrl = normalizeUrl(url);
        const apiUrl = `${baseUrl}/api/v1/entries/sgv.json?count=1`;

        console.log(`🚀 NS Fetching: ${apiUrl}`);

        const headers: any = {
            'Accept': 'application/json'
        };
        if (secret) {
            headers['api-secret'] = secret;
        }

        const response = await fetch(apiUrl, { headers });

        if (!response.ok) {
            console.warn(`❌ NS Fetch failed: ${response.status} ${response.statusText}`);
            if (response.status === 401) console.error("🔑 Error de autorización (401): Revisa tu API Secret en Nightscout.");
            return null;
        }

        const data = await response.json();
        if (data && data.length > 0) {
            return {
                sgv: data[0].sgv,
                direction: data[0].direction || 'Flat',
                date: data[0].date
            };
        }
        return null;
    } catch (error) {
        console.error('❌ Error fetching from Nightscout:', error);
        return null;
    }
}

/**
 * Upload a treatment (bolus/carbs) to Nightscout
 */
export async function uploadTreatment(url: string, secret: string, treatment: {
    carbs?: number,
    insulin?: number,
    notes?: string,
    eventTime?: string
}) {
    try {
        if (!url || !secret) return;

        const baseUrl = normalizeUrl(url);
        const apiUrl = `${baseUrl}/api/v1/treatments`;

        const body = {
            enteredBy: "GlucAmigo",
            eventType: "Meal Bolus",
            carbs: treatment.carbs,
            insulin: treatment.insulin,
            notes: treatment.notes,
            created_at: treatment.eventTime || new Date().toISOString()
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'api-secret': secret
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Nightscout upload failed: ${response.status} ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error uploading to Nightscout:', error);
        throw error;
    }
}

/**
 * Fetch profiles from Nightscout and map them to GlucAmigo meal times
 */
export async function fetchNightscoutProfile(url: string, secret?: string) {
    try {
        if (!url) return null;
        const baseUrl = normalizeUrl(url);
        const apiUrl = `${baseUrl}/api/v1/profile.json`;

        console.log(`🚀 NS Profile Fetching: ${apiUrl}`);

        const headers: any = {
            'Accept': 'application/json'
        };
        if (secret) {
            headers['api-secret'] = secret;
        }

        const response = await fetch(apiUrl, { headers });
        if (!response.ok) throw new Error(`Nightscout profile fetch failed: ${response.status}`);

        const profiles = await response.json();
        if (!profiles || profiles.length === 0) return null;

        // Get the latest profile (usually first in array)
        const profileData = profiles[0];
        const activeProfileName = profileData.defaultProfile;
        const activeProfile = profileData.store[activeProfileName];

        if (!activeProfile) return null;

        const getValueAtTime = (arr: any[], targetTimeStr: string) => {
            if (!arr || arr.length === 0) return 0;
            // Convert targetTimeStr (HH:mm) to seconds since midnight
            const [h, m] = targetTimeStr.split(':').map(Number);
            const targetSeconds = h * 3600 + m * 60;

            // Sort by time just in case
            const sorted = [...arr].sort((a, b) => {
                const [ah, am] = a.time.split(':').map(Number);
                const [bh, bm] = b.time.split(':').map(Number);
                return (ah * 3600 + am * 60) - (bh * 3600 + bm * 60);
            });

            let latestValue = sorted[0].value;
            for (const entry of sorted) {
                const [eh, em] = entry.time.split(':').map(Number);
                const entrySeconds = eh * 3600 + em * 60;
                if (entrySeconds <= targetSeconds) {
                    latestValue = entry.value;
                } else {
                    break;
                }
            }
            return parseFloat(latestValue);
        };

        const meals = {
            breakfast: '08:00',
            lunch: '14:00',
            snack: '18:00',
            dinner: '21:00'
        };

        const result: any = {};
        for (const [meal, time] of Object.entries(meals)) {
            result[meal] = {
                carbRatio: getValueAtTime(activeProfile.carbratio, time),
                sensitivity: getValueAtTime(activeProfile.isf, time),
                target: getValueAtTime(activeProfile.target_low, time)
            };
        }

        return result;
    } catch (error) {
        console.error('Error fetching profile from Nightscout:', error);
        return null;
    }
}
