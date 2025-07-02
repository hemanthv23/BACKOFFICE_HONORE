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
    maxUsage?: number | null;
    customerName?: string | null;
    communityName?: string | null;
    type: number;
    createdAt?: string;
    updatedAt?: string;
    isSelected?: boolean;
}

export enum DiscountTypeEnum {
    Percentage = 0,
    Fixed = 1
}

export enum CouponStatusEnum {
    Active = 0,
    Expired = 1,
    Inactive = 2
}

export enum CouponTypeEnum {
    Generated = 0,
    Community = 1
}
