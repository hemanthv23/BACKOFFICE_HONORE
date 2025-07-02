import { Coupon, CouponStatusEnum, CouponTypeEnum, DiscountTypeEnum } from '../interfaces';
import { CouponData } from './coupon-data';
import { CouponFiltering } from './coupon-filtering';

export class CouponModals {
    public showModal: boolean = false;
    public editingCoupon: boolean = false;
    public modalType: 'Generate' | 'Community' | '' = '';
    public currentCoupon: Coupon = this.initializeNewCoupon();
    public numberOfCouponsToGenerate: number = 1;

    // Mock options for community selection
    public communityOptions: string[] = ['Tech Innovators', 'Digital Creators', 'Startup Hub', 'Global Connect'];

    constructor(
        private couponData: CouponData,
        private couponFiltering: CouponFiltering
    ) {}

    private initializeNewCoupon(): Coupon {
        return {
            id: 0, // Will be set by CouponData
            name: '',
            code: this.generateRandomCode(),
            description: '',
            discountType: DiscountTypeEnum.Percentage,
            discountValue: 0,
            status: CouponStatusEnum.Active,
            startDate: new Date().toISOString().split('T')[0], // Today's date
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
            usageCount: 0,
            maxUsage: undefined,
            customerName: undefined,
            communityName: undefined,
            type: CouponTypeEnum.Generated, // Default
            isSelected: false
        };
    }

    private generateRandomCode(length: number = 8): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    showCreateModal(type: 'Generate' | 'Community'): void {
        this.editingCoupon = false;
        this.modalType = type;
        this.currentCoupon = this.initializeNewCoupon();
        // Set default type based on modal type
        this.currentCoupon.type = type === 'Generate' ? CouponTypeEnum.Generated : CouponTypeEnum.Community;
        this.showModal = true;
    }

    editCoupon(coupon: Coupon): void {
        this.editingCoupon = true;
        this.modalType = coupon.type === CouponTypeEnum.Generated ? 'Generate' : 'Community';
        // Create a deep copy to avoid direct mutation
        this.currentCoupon = { ...coupon };
        this.showModal = true;
    }

    saveCoupon(): void {
        // Basic validation
        if (!this.currentCoupon.name || !this.currentCoupon.code || !this.currentCoupon.description || this.currentCoupon.discountValue === undefined || !this.currentCoupon.startDate || !this.currentCoupon.endDate) {
            alert('Please fill in all required fields.');
            return;
        }

        if (this.currentCoupon.type === CouponTypeEnum.Community && !this.currentCoupon.communityName) {
            alert('Please select a community name for community coupons.');
            return;
        }

        if (new Date(this.currentCoupon.startDate) > new Date(this.currentCoupon.endDate)) {
            alert('Start Date cannot be after End Date.');
            return;
        }

        if (this.editingCoupon) {
            this.couponData.updateCoupon(this.currentCoupon);
            alert('Coupon updated successfully!');
        } else {
            if (this.modalType === 'Generate') {
                for (let i = 0; i < this.numberOfCouponsToGenerate; i++) {
                    const newCoupon = {
                        ...this.currentCoupon,
                        code: this.generateRandomCode(), // Generate unique code for each
                        customerName: this.currentCoupon.customerName || undefined,
                        type: CouponTypeEnum.Generated
                    };
                    this.couponData.addCoupon(newCoupon);
                }
                alert(`${this.numberOfCouponsToGenerate} coupons generated successfully!`);
            } else {
                this.couponData.addCoupon(this.currentCoupon);
                alert('Community coupon created successfully!');
            }
        }
        this.couponFiltering.filterCoupons(); // Refresh the filtered list
        this.closeModal();
    }

    closeModal(): void {
        this.showModal = false;
        this.editingCoupon = false;
        this.modalType = '';
        this.currentCoupon = this.initializeNewCoupon();
        this.numberOfCouponsToGenerate = 1;
    }
}
