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
    maxUsage?: number | null; // API can return null
    customerName?: string | null; // API can return null
    communityName?: string | null; // API can return null
    type: number;
    createdAt?: string; // These are typically set by the backend on creation/update
    updatedAt?: string; // These are typically set by the backend on creation/update
    isSelected?: boolean; // For UI selection, not part of API
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
