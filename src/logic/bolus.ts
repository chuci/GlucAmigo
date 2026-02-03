export interface BolusInput {
    carbs: number; // in grams
    bg: number; // current blood glucose mg/dL
    target: number; // target BG mg/dL
    carbRatio: number; // g carb per 1 unit insulin
    sensitivity: number; // mg/dL drop per 1 unit insulin
    iob?: number; // insulin on board (optional)
    trendArrows?: number; // adjustment value based on trend (e.g. +1, -0.5)
}

export const calculateBolus = (input: BolusInput): number => {
    const { carbs, bg, target, carbRatio, sensitivity, iob = 0, trendArrows = 0 } = input;

    // 1. Carb Bolus
    const carbBolus = carbs / carbRatio;

    // 2. Correction Bolus (only if BG > target)
    const correctionBolus = bg > target ? (bg - target) / sensitivity : 0;

    // 3. Reverse Correction (if BG < target, subtract insulin to prevent hypo)
    // Some protocols subtract, others strictly treat hypo first. 
    // For safety, we will subtract if BG is lower than target but above hypo threshold.
    // If BG is dangerously low (<70), the app should warn 'EAT' instead of just calculating.
    // Assuming this function returns the raw calculation:
    const reverseCorrection = bg < target ? (bg - target) / sensitivity : 0;

    // Total raw
    let total = carbBolus + correctionBolus + reverseCorrection;

    // 4. Trend Adjustment
    total += trendArrows;

    // 5. IOB Subtraction
    total -= iob;

    // 6. Safety Floor
    if (total < 0) total = 0;

    // 7. Rounding to 0.5 steps
    return Math.round(total * 2) / 2;
};
