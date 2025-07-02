// ==========================================================
// src/app/apps/backoffice/components/coupons/components/coupon-selection.ts
// Handles selection logic for coupons in the list.
// ==========================================================

import { Injectable } from '@angular/core';
import { Coupon } from '../interfaces';
import { CouponFiltering } from './coupon-filtering'; // Import CouponFiltering
import { CouponData } from './coupon-data'; // Import CouponData

@Injectable({
    providedIn: 'root'
})
export class CouponSelection {
    selectedCoupons: Coupon[] = [];

    constructor(
        private couponFiltering: CouponFiltering,
        private couponData: CouponData
    ) {
        // Subscribe to changes in filteredCoupons from CouponFiltering
        // This ensures that when filters change, we can adjust selections if needed.
        this.couponFiltering.couponData.allCoupons$.subscribe(() => {
            // Re-evaluate selections based on the currently filtered and available coupons
            this.selectedCoupons = this.couponFiltering.filteredCoupons.filter((coupon) => coupon.isSelected);
        });
    }

    /**
     * Toggles the selection status of a single coupon.
     * @param coupon The coupon object whose selection state is to be toggled.
     */
    toggleCouponSelection(coupon: Coupon): void {
        // coupon.isSelected is bound via ngModel in the template, so it's already updated.
        if (coupon.isSelected) {
            this.selectedCoupons.push(coupon);
        } else {
            this.selectedCoupons = this.selectedCoupons.filter((c) => c.id !== coupon.id);
        }
    }

    /**
     * Toggles the selection of all currently filtered coupons.
     * @param event The change event from the checkbox.
     */
    toggleAllSelections(event: Event): void {
        const isChecked = (event.target as HTMLInputElement).checked;
        this.selectedCoupons = []; // Clear existing selections

        this.couponFiltering.filteredCoupons.forEach((coupon) => {
            coupon.isSelected = isChecked; // Set selection status
            if (isChecked) {
                this.selectedCoupons.push(coupon); // Add to selected list if checked
            }
        });
    }

    /**
     * Checks if all currently filtered coupons are selected.
     * @returns True if all filtered coupons are selected, false otherwise.
     */
    allCouponsSelected(): boolean {
        if (this.couponFiltering.filteredCoupons.length === 0) {
            return false; // No coupons to select
        }
        return this.selectedCoupons.length === this.couponFiltering.filteredCoupons.length && this.couponFiltering.filteredCoupons.every((coupon) => coupon.isSelected);
    }

    /**
     * Clears all current coupon selections.
     */
    clearSelections(): void {
        this.couponFiltering.allCoupons.forEach((coupon) => (coupon.isSelected = false)); // Clear from all coupons
        this.selectedCoupons = []; // Clear selected list
    }
}
