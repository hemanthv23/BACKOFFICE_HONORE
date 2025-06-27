// ==========================================================
// src/app/apps/backoffice/components/coupons/components/coupon-selection.ts
// Manages the logic for selecting/deselecting coupons for batch actions.
// Depends on `CouponFiltering` to get the list of currently displayed coupons.
// ==========================================================
import { Coupon } from './interfaces';
import { CouponFiltering } from './coupon-filtering';
import { CouponData } from './coupon-data'; // To interact with data deletion

export class CouponSelection {
    selectedCoupons: Coupon[] = []; // Array to hold selected coupons for batch deletion

    constructor(
        private couponFiltering: CouponFiltering,
        private couponData: CouponData
    ) {}

    /**
     * Toggles the selection status of an individual coupon.
     * Adds the coupon to `selectedCoupons` if selected, removes if deselected.
     * @param {Coupon} coupon The coupon whose selection status is being toggled.
     */
    toggleCouponSelection(coupon: Coupon): void {
        if (coupon.isSelected) {
            this.selectedCoupons.push(coupon);
        } else {
            this.selectedCoupons = this.selectedCoupons.filter((c) => c.id !== coupon.id);
        }
    }

    /**
     * Toggles the selection status of all filtered coupons.
     * @param {Event} event The change event from the "select all" checkbox.
     */
    toggleAllSelections(event: Event): void {
        const isChecked = (event.target as HTMLInputElement).checked;
        this.couponFiltering.filteredCoupons.forEach((coupon) => {
            coupon.isSelected = isChecked;
        });
        this.selectedCoupons = isChecked ? [...this.couponFiltering.filteredCoupons] : [];
    }

    /**
     * Checks if all currently filtered coupons are selected.
     * @returns {boolean} True if all filtered coupons are selected, false otherwise.
     */
    allCouponsSelected(): boolean {
        if (this.couponFiltering.filteredCoupons.length === 0) {
            return false;
        }
        return this.couponFiltering.filteredCoupons.every((coupon) => coupon.isSelected);
    }

    /**
     * Handles the deletion of all coupons currently marked as 'Expired'.
     * Displays a confirmation prompt before deletion.
     */
    deleteExpiredCoupons(): void {
        if (window.confirm('Are you sure you want to delete ALL expired coupons? This action cannot be undone.')) {
            this.couponData.deleteExpiredCoupons();
            this.couponFiltering.filterCoupons(); // Re-filter to update view
            this.selectedCoupons = []; // Clear selections as well
        }
    }

    /**
     * Handles the deletion of all currently selected coupons.
     * Displays a confirmation prompt before deletion.
     */
    deleteSelectedCoupons(): void {
        if (this.selectedCoupons.length === 0) {
            alert('Please select at least one coupon to delete.');
            return;
        }
        if (window.confirm(`Are you sure you want to delete ${this.selectedCoupons.length} selected coupon(s)? This action cannot be undone.`)) {
            const selectedIds = new Set(this.selectedCoupons.map((c) => c.id));
            this.couponData.deleteSelectedCoupons(selectedIds);
            this.couponFiltering.filterCoupons(); // Re-filter to update view
            this.selectedCoupons = []; // Clear selections after deletion
        }
    }

    /**
     * Handles the deletion of a single coupon.
     * Displays a confirmation prompt before deletion.
     * @param {string} id The ID of the coupon to delete.
     */
    deleteCoupon(id: string): void {
        if (window.confirm('Are you sure you want to delete this coupon?')) {
            this.couponData.deleteCoupon(id);
            this.couponFiltering.filterCoupons(); // Re-filter to update view
            // Also ensure it's removed from selectedCoupons if it was there
            this.selectedCoupons = this.selectedCoupons.filter((c) => c.id !== id);
        }
    }

    /**
     * Handles the status update of a single coupon (e.g., marking as 'Used').
     * Displays a confirmation prompt before updating.
     * @param {string} id The ID of the coupon to update.
     * @param {'Active' | 'Expired' | 'Inactive'} newStatus The new status.
     */
    updateCouponStatus(id: string, newStatus: 'Active' | 'Expired' | 'Inactive') {
        const coupon = this.couponData.allCoupons.find((c) => c.id === id);
        if (coupon) {
            if (window.confirm(`Are you sure you want to mark coupon "${coupon.code}" as ${newStatus === 'Inactive' ? 'Used' : newStatus}?`)) {
                this.couponData.updateCouponStatus(id, newStatus);
                this.couponFiltering.filterCoupons(); // Re-filter to update view
            }
        }
    }
}
