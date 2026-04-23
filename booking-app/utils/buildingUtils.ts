export function scoreLabel(v: number): string {
    if (v >= 9) return "Exceptional";
    if (v >= 8) return "Very good";
    if (v >= 7) return "Good";
    if (v >= 6) return "Pleasant";
    return "Reviewed";
}

export function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}
