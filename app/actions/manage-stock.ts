'use server';

import { writeClient } from '@/sanity/lib/write-client';
import { revalidatePath } from 'next/cache';

export async function updateStockQuantity(stockId: string, newQuantity: number, reason: string, changeType: 'Add' | 'Subtract' | 'Correction') {
    try {
        const stock = await writeClient.getDocument(stockId);
        if (!stock) throw new Error("Stock record not found");

        const difference = newQuantity - (stock.quantity || 0);

        await writeClient
            .patch(stockId)
            .set({
                quantity: newQuantity,
                lastUpdated: new Date().toISOString()
            })
            .setIfMissing({ history: [] })
            .append('history', [{
                change: difference,
                type: changeType,
                reason: reason,
                timestamp: new Date().toISOString()
            }])
            .commit();

        revalidatePath('/dashboard/stocks');
        return { success: true };
    } catch (error) {
        console.error('Failed to update stock:', error);
        return { success: false, error: 'Failed to update stock' };
    }
}

export async function createStockRecord(productId: string, quantity: number, location: string) {
    try {
        await writeClient.create({
            _type: 'stock',
            product: {
                _type: 'reference',
                _ref: productId
            },
            quantity,
            location,
            unit: 'sqft',
            minStockLevel: 100,
            lastUpdated: new Date().toISOString(),
            history: [{
                change: quantity,
                type: 'Add',
                reason: 'Initial Stock',
                timestamp: new Date().toISOString()
            }]
        });

        revalidatePath('/dashboard/stocks');
        return { success: true };
    } catch (error) {
        console.error('Failed to create stock:', error);
        return { success: false, error: 'Failed to create stock' };
    }
}
