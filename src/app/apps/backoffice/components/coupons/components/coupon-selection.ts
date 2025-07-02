import { Coupon, CouponStatusEnum } from '../interfaces';
import { CouponData } from './coupon-data';
import { CouponFiltering } from './coupon-filtering';

export class CouponSelection {
    public selectedCoupons: Coupon[] = [];

    constructor(
        private couponFiltering: CouponFiltering,
        private couponData: CouponData
    ) {}

    toggleCouponSelection(coupon: Coupon): void {
        coupon.isSelected = !coupon.isSelected;
        this.updateSelectedCouponsList();
    }

    allCouponsSelected(): boolean {
        if (this.couponFiltering.filteredCoupons.length === 0) {
            return false;
        }
        return this.couponFiltering.filteredCoupons.every((coupon) => coupon.isSelected);
    }

    toggleAllSelections(event: Event): void {
        const isChecked = (event.target as HTMLInputElement).checked;
        this.couponFiltering.filteredCoupons.forEach((coupon) => (coupon.isSelected = isChecked));
        this.updateSelectedCouponsList();
    }

    private updateSelectedCouponsList(): void {
        this.selectedCoupons = this.couponFiltering.filteredCoupons.filter((coupon) => coupon.isSelected);
    }

    deleteCoupon(id: number): void {
        if (confirm('Are you sure you want to delete this coupon?')) {
            this.couponData.deleteCoupon(id);
            this.couponFiltering.filterCoupons(); // Re-filter after deletion
            this.updateSelectedCouponsList(); // Update selection list
        }
    }

    deleteSelectedCoupons(): void {
        if (this.selectedCoupons.length === 0) {
            alert('No coupons selected for deletion.');
            return;
        }
        if (confirm(`Are you sure you want to delete ${this.selectedCoupons.length} selected coupons?`)) {
            this.selectedCoupons.forEach((coupon) => this.couponData.deleteCoupon(coupon.id));
            this.selectedCoupons = []; // Clear selected list
            this.couponFiltering.filterCoupons(); // Re-filter after deletion
        }
    }

    deleteExpiredCoupons(): void {
        if (confirm('Are you sure you want to delete all expired coupons?')) {
            const expiredCoupons = this.couponData.allCoupons.filter((c) => c.status === CouponStatusEnum.Expired);
            expiredCoupons.forEach((coupon) => this.couponData.deleteCoupon(coupon.id));
            this.couponFiltering.filterCoupons(); // Re-filter
            this.updateSelectedCouponsList(); // Update selection list
            alert(`${expiredCoupons.length} expired coupons deleted.`);
        }
    }

    updateCouponStatus(id: number, newStatus: CouponStatusEnum): void {
        this.couponData.updateCouponStatus(id, newStatus);
        this.couponFiltering.filterCoupons(); // Re-filter after status change
        this.updateSelectedCouponsList(); // Update selection list
    }
}
