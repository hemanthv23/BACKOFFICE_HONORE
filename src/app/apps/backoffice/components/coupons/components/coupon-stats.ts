// ==========================================================
// src/app/apps/backoffice/components/coupons/components/coupon-stats.ts
// Provides methods for calculating coupon-related statistics.
// Depends on `CouponData` for access to coupon data.
// ==========================================================
import { CouponData } from './coupon-data';

export class CouponStats {
    constructor(private couponData: CouponData) {}

    /**
     * Returns the total count of all coupons.
     * @returns {number} The total number of coupons.
     */
    getTotalCoupons(): number {
        return this.couponData.allCoupons.length;
    }

    /**
     * Returns the number of active coupons.
     * @returns {number} The count of active coupons.
     */
    getActiveCoupons(): number {
        return this.couponData.allCoupons.filter((c) => c.status === 'Active').length;
    }

    /**
     * Returns the total usage count across all coupons.
     * @returns {number} The sum of usage counts.
     */
    getTotalUsage(): number {
        return this.couponData.allCoupons.reduce((total, coupon) => total + coupon.usageCount, 0);
    }

    /**
     * Calculates the total estimated savings across all coupons.
     * (Simplified calculation: assumes an average order value of 500 for percentage discounts).
     * @returns {number} The total estimated savings.
     */
    getTotalSavings(): number {
        return this.couponData.allCoupons.reduce((total, coupon) => {
            const savings = coupon.discountType === 'percentage' ? coupon.usageCount * (coupon.discountValue / 100) * 500 : coupon.usageCount * coupon.discountValue;
            return total + savings;
        }, 0);
    }
}
