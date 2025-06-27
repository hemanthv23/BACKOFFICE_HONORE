// ==========================================================
// src/app/apps/backoffice/components/coupons/components/interfaces.ts
// Defines the data structures used throughout the Coupons module.
// ==========================================================
export interface Coupon {
    id: string;
    code: string; // Corresponds to 'Coupon Code' and 'Coupon Number'
    description: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    status: 'Active' | 'Expired' | 'Inactive'; // Inactive for 'Coupon Used'
    startDate: string;
    endDate: string; // Corresponds to 'Expiry Date'
    usageCount: number;
    maxUsage?: number;
    customerName?: string; // For 'Generate' type coupons
    communityName?: string; // For 'Community' type coupons
    type: 'Generate' | 'Community';
    isSelected?: boolean; // For checkbox selection
}
