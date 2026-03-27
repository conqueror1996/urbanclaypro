/**
 * Utility to clean environment variables from potential literal quotes or whitespace.
 * Frequently needed when copying secrets from dashboards that might include hidden characters.
 */
export const cleanEnvVar = (val: string | undefined, fallback: string = ''): string => {
    if (!val) return fallback;
    return val.trim().replace(/^["'](.+)["']$/, '$1');
};
