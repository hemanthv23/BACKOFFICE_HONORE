// ==========================================================
// src/app/apps/backoffice/components/coupons/components/coupon-display-utils.ts
// Provides utility functions for formatting and displaying coupon data.
// ==========================================================

import { Injectable } from '@angular/core';
import { CouponStatusEnum, DiscountTypeEnum } from '../interfaces';

@Injectable({
    providedIn: 'root'
})
export class CouponDisplayUtils {
    constructor() {}

    /**
     * Formats a date string into a more readable 'DD-MM-YYYY' format.
     * @param dateString The date string (e.g., 'YYYY-MM-DD').
     * @returns Formatted date string or 'N/A' if invalid.
     */
    formatDate(dateString: string): string {
        if (!dateString) {
            return 'N/A';
        }
        try {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        } catch (e) {
            console.error('Error formatting date:', dateString, e);
            return 'Invalid Date';
        }
    }

    /**
     * Returns a human-readable string for the discount type.
     * @param type The DiscountTypeEnum value.
     * @returns 'Percentage' or 'Fixed Amount'.
     */
    getDiscountTypeString(type: DiscountTypeEnum): string {
        return type === DiscountTypeEnum.Percentage ? 'Percentage' : 'Fixed Amount';
    }

    /**
     * Returns a human-readable string for the coupon status.
     * @param status The CouponStatusEnum value.
     * @returns 'Active', 'Expired', or 'Used'.
     */
    getCouponStatusString(status: CouponStatusEnum): string {
        switch (status) {
            case CouponStatusEnum.Active:
                return 'Active';
            case CouponStatusEnum.Expired:
                return 'Expired';
            case CouponStatusEnum.Inactive:
                return 'Used'; // Renamed Inactive to Used for better UX
            default:
                return 'Unknown';
        }
    }

    /**
     * Returns Tailwind CSS classes for coupon status for visual styling.
     * @param status The CouponStatusEnum value.
     * @returns CSS classes string.
     */
    getCouponStatusClass(status: CouponStatusEnum): string {
        const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
        switch (status) {
            case CouponStatusEnum.Active:
                return `${baseClasses} bg-green-100 text-green-800`;
            case CouponStatusEnum.Expired:
                return `${baseClasses} bg-red-100 text-red-800`;
            case CouponStatusEnum.Inactive:
                return `${baseClasses} bg-gray-100 text-gray-800`; // Styling for 'Used' coupons
            default:
                return `${baseClasses} bg-purple-100 text-purple-800`; // Default/Unknown
        }
    }
}
