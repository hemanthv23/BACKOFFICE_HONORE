// ==========================================================
// src/app/apps/backoffice/components/coupons/components/coupon-modals.ts
// Manages the state and logic for coupon creation and editing modals.
// ==========================================================

import { Injectable } from '@angular/core';
import { Coupon, DiscountTypeEnum, CouponStatusEnum, CouponTypeEnum } from '../interfaces';
import { CouponData } from './coupon-data'; // Import CouponData
import { CouponFiltering } from './coupon-filtering'; // Import CouponFiltering (if needed for re-filtering after modal close)

@Injectable({
    providedIn: 'root'
})
export class CouponModals {
    showModal: boolean = false;
    editingCoupon: boolean = false;
    modalType: 'Generate' | 'Community' | 'Edit' = 'Generate'; // To distinguish between add types and edit
    currentCoupon: Coupon = this.resetCoupon();

    // Mock options for community names - replace with actual data from an API if available
    communityOptions: string[] = ['LocalDevs', 'GamersHub', 'FoodiesUnited', 'Tech Enthusiasts'];

    constructor(
        private couponData: CouponData,
        private couponFiltering: CouponFiltering
    ) {}

    private resetCoupon(): Coupon {
        // Initializes a new coupon with default values
        return {
            id: 0,
            name: '',
            code: '',
            description: '',
            discountType: DiscountTypeEnum.Percentage,
            discountValue: 0,
            status: CouponStatusEnum.Active,
            startDate: new Date().toISOString().substring(0, 10), // Current date as 'YYYY-MM-DD'
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().substring(0, 10), // One year from now
            usageCount: 0,
            maxUsage: null, // Nullable
            customerName: null, // Nullable
            communityName: null, // Nullable
            type: CouponTypeEnum.Generated, // Default to Generated
            isSelected: false
        };
    }

    /**
     * Shows the create coupon modal, initializing a new coupon.
     * @param type 'Generate' for customer coupons, 'Community' for community coupons.
     */
    showCreateModal(type: 'Generate' | 'Community'): void {
        this.editingCoupon = false;
        this.modalType = type;
        this.currentCoupon = this.resetCoupon(); // Reset to a fresh coupon

        // Set specific type for new coupon
        if (type === 'Community') {
            this.currentCoupon.type = CouponTypeEnum.Community;
            this.currentCoupon.customerName = null; // Ensure customerName is null for community coupons
        } else {
            // 'Generate'
            this.currentCoupon.type = CouponTypeEnum.Generated;
            this.currentCoupon.communityName = null; // Ensure communityName is null for generated coupons
        }

        this.showModal = true;
    }

    /**
     * Shows the edit coupon modal, pre-populating with existing coupon data.
     * @param coupon The coupon to be edited.
     */
    showEditModal(coupon: Coupon): void {
        this.editingCoupon = true;
        this.modalType = coupon.type === CouponTypeEnum.Community ? 'Community' : 'Generate'; // Set modal type based on coupon type
        this.currentCoupon = { ...coupon }; // Create a copy to avoid direct mutation of the original object
        // Ensure date inputs are in 'YYYY-MM-DD' format
        this.currentCoupon.startDate = coupon.startDate ? new Date(coupon.startDate).toISOString().substring(0, 10) : '';
        this.currentCoupon.endDate = coupon.endDate ? new Date(coupon.endDate).toISOString().substring(0, 10) : '';
        this.showModal = true;
    }

    /**
     * Closes the coupon modal and resets the current coupon form.
     */
    closeModal(): void {
        this.showModal = false;
        this.currentCoupon = this.resetCoupon(); // Reset form
        this.editingCoupon = false;
        this.modalType = 'Generate';
    }

    // Removed checkCouponCodeUniqueness and generateUniqueCode methods
    // as their corresponding API endpoints are no longer in the final list.
}
