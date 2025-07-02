// ==========================================================
// src/app/apps/backoffice/components/coupons/components/coupon-filtering.ts
// Handles filtering logic for the coupons.
// ==========================================================

import { Injectable } from '@angular/core';
import { Coupon, CouponStatusEnum, CouponTypeEnum } from '../interfaces';
import { CouponData } from './coupon-data'; // Import CouponData

@Injectable({
    providedIn: 'root'
})
export class CouponFiltering {
    searchTerm: string = '';
    statusFilter: string = ''; // Can be '0', '1', '2' for enum values, or '' for all
    typeFilter: string = ''; // Can be '0', '1' for enum values, or '' for all
    filteredCoupons: Coupon[] = [];
    allCoupons: Coupon[] = []; // This will be updated by CouponData's subscription

    // CHANGE: Made couponData public so it can be accessed by other classes like CouponSelection
    constructor(public couponData: CouponData) {
        // Subscribe to allCoupons$ from CouponData service
        this.couponData.allCoupons$.subscribe((coupons) => {
            this.allCoupons = coupons; // Keep local copy updated
            this.filterCoupons(); // Re-filter whenever the source data changes
        });
    }

    /**
     * Applies filters to the allCoupons list and updates filteredCoupons.
     */
    filterCoupons(): void {
        let tempCoupons = [...this.allCoupons]; // Start with all available coupons

        // Apply search term filter
        if (this.searchTerm) {
            const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
            tempCoupons = tempCoupons.filter(
                (coupon) =>
                    coupon.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                    coupon.code.toLowerCase().includes(lowerCaseSearchTerm) ||
                    (coupon.description && coupon.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    (coupon.customerName && coupon.customerName.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    (coupon.communityName && coupon.communityName.toLowerCase().includes(lowerCaseSearchTerm))
            );
        }

        // Apply status filter
        if (this.statusFilter !== '') {
            const statusValue = parseInt(this.statusFilter, 10);
            tempCoupons = tempCoupons.filter((coupon) => coupon.status === statusValue);
        }

        // Apply type filter
        if (this.typeFilter !== '') {
            const typeValue = parseInt(this.typeFilter, 10);
            tempCoupons = tempCoupons.filter((coupon) => coupon.type === typeValue);
        }

        this.filteredCoupons = tempCoupons;
    }
}
