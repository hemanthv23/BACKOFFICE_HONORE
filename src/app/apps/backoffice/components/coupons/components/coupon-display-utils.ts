// ==========================================================
// src/app/apps/backoffice/components/coupons/components/coupon-display-utils.ts
// Provides utility methods for formatting and display logic.
// ==========================================================
export class CouponDisplayUtils {
    constructor() {}

    /**
     * Formats a date string into 'DD/MM/YYYY' format.
     * Compensates for potential timezone issues with `type="date"` inputs.
     * @param {string} dateString The date string to format.
     * @returns {string} The formatted date string.
     */
    formatDate(dateString: string): string {
        if (!dateString) return '';
        const date = new Date(dateString);
        // Add 1 day to the date to compensate for timezone issues if dates are stored asAPAC-MM-DD
        // This is a common workaround for `type="date"` inputs when dealing with UTC vs local time
        date.setDate(date.getDate());
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    /**
     * Returns the appropriate Tailwind CSS classes for a coupon status.
     * @param {string} status The status of the coupon ('Active', 'Expired', 'Inactive').
     * @returns {string} Tailwind CSS classes.
     */
    getCouponStatusClass(status: string): string {
        const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide';
        switch (status) {
            case 'Active':
                return `${baseClasses} bg-green-100 text-green-800`;
            case 'Expired':
                return `${baseClasses} bg-red-100 text-red-800`;
            case 'Inactive': // Representing 'Coupon Used'
                return `${baseClasses} bg-gray-100 text-gray-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    }

    /**
     * Returns the appropriate Tailwind CSS classes for a coupon type.
     * @param {string} type The type of the coupon ('Generate', 'Community').
     * @returns {string} Tailwind CSS classes.
     */
    getCouponTypeClass(type: string): string {
        const baseClasses = 'px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wide';
        switch (type) {
            case 'Generate':
                return `${baseClasses} bg-purple-100 text-purple-800`;
            case 'Community':
                return `${baseClasses} bg-teal-100 text-teal-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    }
}
