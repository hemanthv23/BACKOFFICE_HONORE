import { Coupon, CouponStatusEnum, DiscountTypeEnum } from '../interfaces';
import { CouponData } from './coupon-data';

export class CouponStats {
    constructor(private couponData: CouponData) {}

    getTotalCoupons(): number {
        return this.couponData.allCoupons.length;
    }

    getActiveCoupons(): number {
        return this.couponData.allCoupons.filter((coupon) => coupon.status === CouponStatusEnum.Active).length;
    }

    getExpiredCoupons(): number {
        return this.couponData.allCoupons.filter((coupon) => coupon.status === CouponStatusEnum.Expired).length;
    }

    getUsedCoupons(): number {
        return this.couponData.allCoupons.filter((coupon) => coupon.status === CouponStatusEnum.Inactive).length;
    }

    getTotalUsage(): number {
        return this.couponData.allCoupons.reduce((sum, coupon) => sum + (coupon.usageCount || 0), 0);
    }

    getTotalSavings(): number {
        // This is a simplified calculation. For percentage coupons,
        // it just sums the percentage value. In a real scenario,
        // you'd need to define "savings" more concretely, e.g., based on average order value.
        // Here, it sums fixed amounts and treats percentage values as their numerical value.
        return this.couponData.allCoupons.reduce((sum, coupon) => sum + coupon.discountValue, 0);
    }

    getDiscountTypeDistribution(): { percentage: number; fixed: number } {
        const percentage = this.couponData.allCoupons.filter((c) => c.discountType === DiscountTypeEnum.Percentage).length;
        const fixed = this.couponData.allCoupons.filter((c) => c.discountType === DiscountTypeEnum.Fixed).length;
        return { percentage, fixed };
    }

    getCouponStatusDistribution(): { active: number; expired: number; inactive: number } {
        const active = this.getActiveCoupons();
        const expired = this.getExpiredCoupons();
        const inactive = this.getUsedCoupons();
        return { active, expired, inactive };
    }
}
