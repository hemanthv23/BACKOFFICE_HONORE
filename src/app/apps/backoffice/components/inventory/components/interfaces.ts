// ==========================================================
// src/app/apps/backoffice/components/inventory/components/interfaces.ts
// Defines interfaces for InventoryItem data structure.
// ==========================================================

export interface InventoryItem {
    id: number;
    productName: string;
    category: string;
    subCategory?: string; // Re-added subCategory
    capacity: number;
    production: number;
    sample: number;
    damaged: number;
    cfQty: number;
    cfSold: number;
    totalInv: number; // calculated
    ordered: number;
    cfBal: number; // calculated
    freshBal: number; // calculated
    currentBal: number; // calculated
    status: 'In Stock' | 'Low Stock' | 'Out of Stock'; // calculated
    lastUpdated: Date;
}
