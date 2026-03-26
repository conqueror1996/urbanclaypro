'use server';

import { isValidAdminToken } from './auth-constants';

export async function verifyAdminPassword(password: string) {
    return isValidAdminToken(password);
}
