// ==========================================================
// src/app/apps/backoffice/components/coupons/components/coupon-modals.ts
// Manages the state and logic for coupon creation and editing modals.
// ==========================================================

import { Injectable } from '@angular/core';
import { Coupon, DiscountTypeEnum, CouponStatusEnum, CouponTypeEnum } from '../interfaces';
import { CouponData } from './coupon-data';
import { CouponFiltering } from './coupon-filtering';

@Injectable({
    providedIn: 'root'
})
export class CouponModals {
    showModal: boolean = false;
    editingCoupon: boolean = false;
    modalType: 'Generate' | 'Community' | 'Edit' = 'Generate';
    currentCoupon: Coupon = this.resetCoupon();

    // UPDATED: Changed mock options for community names as requested
    communityOptions: string[] = ['Individual', 'Business', 'Community'];

    constructor(
        private couponData: CouponData,
        private couponFiltering: CouponFiltering
    ) {}

    private resetCoupon(): Coupon {
        return {
            id: 0,
            name: '',
            code: '',
            description: '',
            discountType: DiscountTypeEnum.Percentage,
            discountValue: 0,
            status: CouponStatusEnum.Active,
            startDate: new Date().toISOString().substring(0, 10),
            endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().substring(0, 10),
            usageCount: 0,
            maxUsage: null,
            customerName: null,
            communityName: null,
            type: CouponTypeEnum.Generated,
            isSelected: false
        };
    }

    showCreateModal(type: 'Generate' | 'Community'): void {
        this.editingCoupon = false;
        this.modalType = type;
        this.currentCoupon = this.resetCoupon();

        if (type === 'Community') {
            this.currentCoupon.type = CouponTypeEnum.Community;
            this.currentCoupon.customerName = null;
            // Set a default community name if you wish, or leave it for user selection
            this.currentCoupon.communityName = this.communityOptions[0] || null; // e.g., default to 'Individual'
        } else {
            // 'Generate'
            this.currentCoupon.type = CouponTypeEnum.Generated;
            this.currentCoupon.communityName = null;
        }

        this.showModal = true;
    }

    showEditModal(coupon: Coupon): void {
        this.editingCoupon = true;
        this.modalType = coupon.type === CouponTypeEnum.Community ? 'Community' : 'Generate';
        this.currentCoupon = { ...coupon };
        this.currentCoupon.startDate = coupon.startDate ? new Date(coupon.startDate).toISOString().substring(0, 10) : '';
        this.currentCoupon.endDate = coupon.endDate ? new Date(coupon.endDate).toISOString().substring(0, 10) : '';
        this.showModal = true;
    }

    closeModal(): void {
        this.showModal = false;
        this.currentCoupon = this.resetCoupon();
        this.editingCoupon = false;
        this.modalType = 'Generate';
    }
}
