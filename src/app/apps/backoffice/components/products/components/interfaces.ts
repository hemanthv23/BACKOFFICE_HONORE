// ==========================================================
// src/app/apps/backoffice/components/products/components/interfaces.ts
// Defines the data structures used throughout the Products module.
// ==========================================================
export interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    subcategory?: string;
    price: number;
    stock: number;
    weight: number; // in grams
    enabledFor: string;
    displayEnabledFor?: string; // Temporary property for display default in table dropdown
    isFutureProduct?: boolean; // To mark products as future
    futurePrice?: number; // Price when product becomes future
    futureEffectiveDate?: string; // Date when product becomes future
}

export interface FuturePriceConfig {
    description: string;
    status: string;
    startDate: string;
    endDate: string;
}
