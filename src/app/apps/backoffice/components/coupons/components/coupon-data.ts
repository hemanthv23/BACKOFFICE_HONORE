import { Coupon, CouponStatusEnum, CouponTypeEnum, DiscountTypeEnum } from '../interfaces';

export class CouponData {
    public allCoupons: Coupon[] = [];

    constructor() {
        this.generateMockCoupons();
    }

    private generateMockCoupons(): void {
        const mockCoupons: Coupon[] = [
            {
                id: 1,
                name: 'SUMMER_SALE',
                code: 'SUMMER2024',
                description: '20% off on all summer items',
                discountType: DiscountTypeEnum.Percentage,
                discountValue: 20,
                status: CouponStatusEnum.Active,
                startDate: '2024-06-01',
                endDate: '2024-08-31',
                usageCount: 150,
                maxUsage: 500,
                type: CouponTypeEnum.Generated,
                customerName: 'N/A',
                communityName: 'N/A',
                isSelected: false
            },
            {
                id: 2,
                name: 'WELCOME_NEW',
                code: 'WELCOME10',
                description: '₹100 off for new customers',
                discountType: DiscountTypeEnum.Fixed,
                discountValue: 100,
                status: CouponStatusEnum.Active,
                startDate: '2024-01-01',
                endDate: '2024-12-31',
                usageCount: 300,
                maxUsage: 1000,
                type: CouponTypeEnum.Generated,
                customerName: 'N/A',
                communityName: 'N/A',
                isSelected: false
            },
            {
                id: 3,
                name: 'COMMUNITY_PROMO_A',
                code: 'COMMUNITYA',
                description: 'Special offer for Community A members',
                discountType: DiscountTypeEnum.Percentage,
                discountValue: 15,
                status: CouponStatusEnum.Active,
                startDate: '2024-05-15',
                endDate: '2024-07-30',
                usageCount: 80,
                maxUsage: 200,
                type: CouponTypeEnum.Community,
                communityName: 'Tech Innovators',
                customerName: 'N/A',
                isSelected: false
            },
            {
                id: 4,
                name: 'EXPIRED_DEAL',
                code: 'OLDIEBUTGOODIE',
                description: 'Expired discount',
                discountType: DiscountTypeEnum.Fixed,
                discountValue: 50,
                status: CouponStatusEnum.Expired,
                startDate: '2023-01-01',
                endDate: '2023-02-28',
                usageCount: 50,
                maxUsage: 50,
                type: CouponTypeEnum.Generated,
                customerName: 'N/A',
                communityName: 'N/A',
                isSelected: false
            },
            {
                id: 5,
                name: 'USED_COUPON',
                code: 'USED50',
                description: 'Coupon already used',
                discountType: DiscountTypeEnum.Percentage,
                discountValue: 10,
                status: CouponStatusEnum.Inactive,
                startDate: '2024-03-01',
                endDate: '2024-09-30',
                usageCount: 1,
                maxUsage: 1,
                type: CouponTypeEnum.Generated,
                customerName: 'John Doe',
                communityName: 'N/A',
                isSelected: false
            }
        ];
        this.allCoupons = mockCoupons;
    }

    addCoupon(coupon: Coupon): void {
        // Assign a new ID (simple increment for mock data)
        coupon.id = this.allCoupons.length > 0 ? Math.max(...this.allCoupons.map((c) => c.id)) + 1 : 1;
        coupon.createdAt = new Date().toISOString();
        this.allCoupons.push(coupon);
    }

    updateCoupon(updatedCoupon: Coupon): void {
        const index = this.allCoupons.findIndex((c) => c.id === updatedCoupon.id);
        if (index !== -1) {
            this.allCoupons[index] = { ...updatedCoupon, updatedAt: new Date().toISOString() };
        }
    }

    deleteCoupon(id: number): void {
        this.allCoupons = this.allCoupons.filter((coupon) => coupon.id !== id);
    }

    // Helper to get a coupon by ID
    getCouponById(id: number): Coupon | undefined {
        return this.allCoupons.find((coupon) => coupon.id === id);
    }

    updateCouponStatus(id: number, newStatus: CouponStatusEnum): void {
        const coupon = this.getCouponById(id);
        if (coupon) {
            coupon.status = newStatus;
            coupon.updatedAt = new Date().toISOString();
        }
    }
}
