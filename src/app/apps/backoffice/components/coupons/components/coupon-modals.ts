// ==========================================================
// src/app/apps/backoffice/components/coupons/components/coupon-modals.ts
// Manages the state and logic for the Create/Edit Coupon modal.
// Depends on `CouponData` for data manipulation and `CouponFiltering` for re-filtering.
// ==========================================================
import { Coupon } from './interfaces';
import { CouponData } from './coupon-data';
import { CouponFiltering } from './coupon-filtering';

export class CouponModals {
    showModal: boolean = false;
    editingCoupon: boolean = false;
    modalType: 'Generate' | 'Community' = 'Generate';

    currentCoupon: Partial<Coupon> = {}; // Used for the form fields

    communityOptions: string[] = ['Premium Members', 'Gold Members', 'VIP Members', 'New Registrations', 'Loyal Customers'];

    // New property to hold the number of coupons to generate
    numberOfCouponsToGenerate: number = 1;

    constructor(
        private couponData: CouponData,
        private couponFiltering: CouponFiltering
    ) {}

    /**
     * Opens the coupon creation modal, initializing a new coupon based on type.
     * @param {'Generate' | 'Community'} type The type of coupon to create.
     */
    showCreateModal(type: 'Generate' | 'Community'): void {
        this.modalType = type;
        this.editingCoupon = false;
        this.currentCoupon = {
            type: type,
            status: 'Active',
            discountType: 'percentage',
            usageCount: 0,
            startDate: new Date().toISOString().split('T')[0], // Default to today
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Default to 30 days from now
            isSelected: false // New coupons are not selected by default
        };

        // Reset numberOfCouponsToGenerate when opening for 'Generate'
        if (type === 'Generate') {
            this.numberOfCouponsToGenerate = 1;
        }

        this.showModal = true;
    }

    /**
     * Opens the coupon editing modal, populating the form with existing coupon data.
     * @param {Coupon} coupon The coupon to edit.
     */
    editCoupon(coupon: Coupon): void {
        this.editingCoupon = true;
        this.modalType = coupon.type;
        this.currentCoupon = { ...coupon }; // Create a copy to avoid direct mutation
        this.showModal = true;
    }

    /**
     * Saves the current coupon data (either creates a new one or updates an existing one).
     */
    saveCoupon(): void {
        // Validation for required fields
        if (!this.currentCoupon.description || this.currentCoupon.discountValue === undefined || !this.currentCoupon.startDate || !this.currentCoupon.endDate) {
            alert('Please fill in all required fields: Description, Discount Value, Start Date, and End Date.');
            return;
        }

        if (this.modalType === 'Community' && !this.currentCoupon.communityName) {
            alert('Please select a community name for community coupons.');
            return;
        }

        if (this.currentCoupon.maxUsage !== undefined && this.currentCoupon.maxUsage < 1) {
            alert('Max Usage must be a positive number if specified.');
            return;
        }

        const startDate = new Date(this.currentCoupon.startDate);
        const endDate = new Date(this.currentCoupon.endDate);
        if (endDate < startDate) {
            alert('End Date cannot be before Start Date.');
            return;
        }

        if (this.editingCoupon) {
            // Ensure code exists for editing, if it's a community coupon
            if (this.modalType === 'Community' && !this.currentCoupon.code) {
                alert('Coupon Code is required for Community Coupons.');
                return;
            }
            this.couponData.updateCoupon(this.currentCoupon as Coupon);
        } else {
            if (this.modalType === 'Generate') {
                // Generate multiple coupons
                for (let i = 0; i < this.numberOfCouponsToGenerate; i++) {
                    const newCoupon: Coupon = {
                        ...this.currentCoupon,
                        id: this.couponData.generateCouponId(), // Assuming this generates a unique ID
                        code: this.generateUniqueCode(), // Generate unique code for each generated coupon
                        usageCount: 0,
                        status: 'Active',
                        isSelected: false,
                        customerName: '' // Ensure no customer name for generated coupons
                    } as Coupon;
                    this.couponData.addCoupon(newCoupon);
                }
            } else {
                // Add single community coupon
                if (!this.currentCoupon.code) {
                    alert('Coupon Code is required for Community Coupons.');
                    return;
                }
                const newCoupon: Coupon = {
                    ...this.currentCoupon,
                    id: this.couponData.generateCouponId(),
                    usageCount: 0, // New coupons start with 0 usage
                    status: 'Active', // New coupons are active by default
                    isSelected: false // Ensure new coupons are not selected by default
                } as Coupon;
                this.couponData.addCoupon(newCoupon);
            }
        }

        this.couponFiltering.filterCoupons(); // Re-filter to update view
        this.closeModal();
    }

    /**
     * Closes the coupon modal and resets the current coupon data.
     */
    closeModal(): void {
        this.showModal = false;
        this.currentCoupon = {}; // Clear current coupon data
        this.numberOfCouponsToGenerate = 1; // Reset count when modal closes
    }

    /**
     * Generates a unique coupon code.
     * You might want to enhance this for better uniqueness.
     */
    private generateUniqueCode(): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
}
