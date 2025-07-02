export interface Coupon {
    id: number;
    name: string;
    code: string;
    description?: string;
    discountType: number;
    discountValue: number;
    status: number;
    startDate: string;
    endDate: string;
    usageCount: number;
    maxUsage?: number;
    customerName?: string;
    communityName?: string;
    type: number;
    createdAt?: string;
    updatedAt?: string;
    isSelected?: boolean; // For UI selection
}

export enum DiscountTypeEnum {
    Percentage = 0,
    Fixed = 1
}

export enum CouponStatusEnum {
    Active = 0,
    Expired = 1,
    Inactive = 2 // Represents 'Coupon Used' or disabled
}

export enum CouponTypeEnum {
    Generated = 0, // For customer-specific coupons
    Community = 1 // For specific communities
}
