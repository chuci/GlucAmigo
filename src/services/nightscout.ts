
/**
 * Service to interact with Nightscout API
 */

export interface NightscoutGlucose {
    sgv: number;
    direction: string;
    date: number;
}

/**
 * Fetch the latest glucose entry from Nightscout
 */
export async function fetchLatestGlucose(url: string): Promise<NightscoutGlucose | null> {
    try {
        if (!url) return null;

        // Ensure URL doesn't end with slash and has protocol
        const baseUrl = url.replace(/\/$/, '');
        const apiUrl = `${baseUrl}/api/v1/entries/sgv.json?count=1`;

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Nightscout fetch failed');

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
        console.error('Error fetching from Nightscout:', error);
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

        const baseUrl = url.replace(/\/$/, '');
        const apiUrl = `${baseUrl}/api/v1/treatments`;

        // Nightscout uses SHA1 of the API SECRET for authorization
        // However, many modern Nightscout instances also accept the 'api-secret' header directly
        // or require specific auth. We'll start with the most common 'api-secret' header.

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
                'api-secret': secret // This is the common way
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
