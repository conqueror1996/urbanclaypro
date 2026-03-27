
import { cleanEnvVar } from './env-utils';

export const ADMIN_PASSWORDS = ['clay2025', 'admin'];

export function isValidAdminToken(token?: string) {
    if (!token) return false;
    
    // Add custom password from environment if available
    const envPassword = cleanEnvVar(process.env.ADMIN_PASSWORD);
    const validPasswords = [...ADMIN_PASSWORDS];
    if (envPassword) validPasswords.push(envPassword);
    
    return validPasswords.includes(token);
}
