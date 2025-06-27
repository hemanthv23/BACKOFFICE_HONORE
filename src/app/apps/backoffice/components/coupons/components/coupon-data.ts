// ==========================================================
// src/app/apps/backoffice/components/coupons/components/coupon-data.ts
// Manages the core coupon data, including initial loading,
// and methods for adding, updating, and deleting coupons.
// ==========================================================
import { Coupon } from './interfaces';

export class CouponData {
    private _allCoupons: Coupon[] = [];

    constructor() {
        this.loadInitialCoupons();
        this.checkAndSetExpiredStatus(); // Check for expired coupons on init
    }

    /**
     * Getter for all coupon data.
     * @returns {Coupon[]} The array of all coupons.
     */
    get allCoupons(): Coupon[] {
        return this._allCoupons;
    }

    /**
     * Loads initial sample coupon data.
     */
    private loadInitialCoupons(): void {
        this._allCoupons = [
            {
                id: '1',
                code: 'WELCOME20',
                description: 'Welcome discount for new customers',
                discountType: 'percentage',
                discountValue: 20,
                status: 'Active',
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                usageCount: 45,
                maxUsage: 100,
                customerName: 'Support Honore',
                type: 'Generate'
            },
            {
                id: '2',
                code: 'BULK50',
                description: 'Bulk order discount for wholesale customers',
                discountType: 'fixed',
                discountValue: 50,
                status: 'Active',
                startDate: '2024-06-01',
                endDate: '2024-08-31',
                usageCount: 23,
                maxUsage: 50,
                customerName: 'Support Honore',
                type: 'Generate'
            },
            {
                id: '3',
                code: 'FESTIVE15',
                description: 'Festival special offer for all customers',
                discountType: 'percentage',
                discountValue: 15,
                status: 'Expired', // Explicitly setting as Expired for testing 'Delete Expired'
                startDate: '2024-03-01',
                endDate: '2024-03-31', // Expired based on current date (June 2025)
                usageCount: 78,
                maxUsage: 200,
                communityName: 'Premium Members',
                type: 'Community'
            },
            {
                id: '4',
                code: 'STUDENT10',
                description: 'Student discount for educational purchases',
                discountType: 'percentage',
                discountValue: 10,
                status: 'Active',
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                usageCount: 156,
                communityName: 'Gold Members',
                type: 'Community'
            },
            {
                id: '5',
                code: 'POSDISCOUNT_2_474',
                description: 'POS System Discount',
                discountType: 'percentage',
                discountValue: 15,
                status: 'Active',
                startDate: '2024-10-01',
                endDate: '2025-01-10', // Expired based on current date (June 2025)
                usageCount: 10,
                customerName: 'Support Honore',
                type: 'Generate'
            },
            {
                id: '6',
                code: 'POSDISCOUNT_2_473',
                description: 'POS System Discount',
                discountType: 'percentage',
                discountValue: 25,
                status: 'Active',
                startDate: '2024-12-01',
                endDate: '2025-02-01', // Expired
                usageCount: 5,
                customerName: 'Support Honore',
                type: 'Generate'
            },
            {
                id: '7',
                code: 'POSDISCOUNT_2_472',
                description: 'POS System Discount',
                discountType: 'percentage',
                discountValue: 25,
                status: 'Inactive', // Simulating 'Coupon Used'
                startDate: '2024-12-01',
                endDate: '2024-12-28',
                usageCount: 8,
                customerName: 'Support Honore',
                type: 'Generate'
            },
            {
                id: '8',
                code: 'COMMUNITY_SALE',
                description: 'Exclusive discount for New Registrations',
                discountType: 'percentage',
                discountValue: 20,
                status: 'Active',
                startDate: '2024-06-01',
                endDate: '2024-07-15',
                usageCount: 50,
                communityName: 'New Registrations',
                type: 'Community'
            },
            {
                id: '9',
                code: 'LOYALTY_BONUS',
                description: 'Bonus for loyal customers',
                discountType: 'fixed',
                discountValue: 100,
                status: 'Active',
                startDate: '2024-05-15',
                endDate: '2024-11-30',
                usageCount: 15,
                maxUsage: 30,
                communityName: 'Loyal Customers',
                type: 'Community'
            },
            {
                id: '10',
                code: 'EARLYBIRD',
                description: 'Early bird discount for upcoming event',
                discountType: 'percentage',
                discountValue: 10,
                status: 'Expired', // Explicitly setting as Expired
                startDate: '2024-02-01',
                endDate: '2024-02-28', // Expired
                usageCount: 120,
                maxUsage: 150,
                customerName: 'Support Honore',
                type: 'Generate'
            }
        ];
    }

    /**
     * Helper to check and update coupon expiry status on load.
     * This method iterates through all coupons and marks them as 'Expired'
     * if their end date is in the past and they are not already 'Inactive' (used).
     */
    checkAndSetExpiredStatus(): void {
        const today = new Date();
        this._allCoupons.forEach((coupon) => {
            const endDate = new Date(coupon.endDate);
            if (endDate < today && coupon.status !== 'Inactive') {
                coupon.status = 'Expired';
            }
        });
    }

    /**
     * Generates a simple unique ID for new coupons.
     * @returns {string} A unique coupon ID.
     */
    generateCouponId(): string {
        return `coupon_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    }

    /**
     * Adds a new coupon to the data list.
     * @param {Coupon} newCoupon The coupon object to add.
     */
    addCoupon(newCoupon: Coupon): void {
        this._allCoupons.push(newCoupon);
        this.checkAndSetExpiredStatus(); // Re-check statuses after adding
    }

    /**
     * Updates an existing coupon in the data list.
     * @param {Coupon} updatedCoupon The coupon object with updated values.
     */
    updateCoupon(updatedCoupon: Coupon): void {
        const index = this._allCoupons.findIndex((c) => c.id === updatedCoupon.id);
        if (index !== -1) {
            this._allCoupons[index] = { ...updatedCoupon };
            this.checkAndSetExpiredStatus(); // Re-check statuses after update
        }
    }

    /**
     * Updates the status of a specific coupon.
     * @param {string} id The ID of the coupon to update.
     * @param {'Active' | 'Expired' | 'Inactive'} newStatus The new status.
     */
    updateCouponStatus(id: string, newStatus: 'Active' | 'Expired' | 'Inactive'): void {
        const coupon = this._allCoupons.find((c) => c.id === id);
        if (coupon) {
            coupon.status = newStatus;
            if (newStatus === 'Inactive') {
                // Increment usage count only if marking as 'Used'
                coupon.usageCount = (coupon.usageCount || 0) + 1;
            }
        }
    }

    /**
     * Deletes a single coupon by its ID.
     * @param {string} id The ID of the coupon to delete.
     */
    deleteCoupon(id: string): void {
        this._allCoupons = this._allCoupons.filter((c) => c.id !== id);
    }

    /**
     * Deletes all coupons that are currently marked as 'Expired'.
     */
    deleteExpiredCoupons(): void {
        this._allCoupons = this._allCoupons.filter((c) => c.status !== 'Expired');
    }

    /**
     * Deletes a list of selected coupons by their IDs.
     * @param {Set<string>} selectedIds A Set of IDs of coupons to delete.
     */
    deleteSelectedCoupons(selectedIds: Set<string>): void {
        this._allCoupons = this._allCoupons.filter((c) => !selectedIds.has(c.id));
    }
}
