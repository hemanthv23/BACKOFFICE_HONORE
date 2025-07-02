import { Coupon, CouponStatusEnum, CouponTypeEnum } from '../interfaces';
import { CouponData } from './coupon-data';

export class CouponFiltering {
    public searchTerm: string = '';
    public statusFilter: string = ''; // Keep as string for dropdown value
    public typeFilter: string = ''; // Keep as string for dropdown value
    public filteredCoupons: Coupon[] = [];

    constructor(private couponData: CouponData) {
        this.filterCoupons(); // Initial filter
    }

    filterCoupons(): void {
        let tempCoupons = [...this.couponData.allCoupons];

        // Apply search term filter
        if (this.searchTerm) {
            const lowerCaseSearchTerm = this.searchTerm.toLowerCase();
            tempCoupons = tempCoupons.filter(
                (coupon) =>
                    coupon.name.toLowerCase().includes(lowerCaseSearchTerm) ||
                    coupon.code.toLowerCase().includes(lowerCaseSearchTerm) ||
                    (coupon.description && coupon.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    (coupon.customerName && coupon.customerName.toLowerCase().includes(lowerCaseSearchTerm)) ||
                    (coupon.communityName && coupon.communityName.toLowerCase().includes(lowerCaseSearchTerm))
            );
        }

        // Apply status filter
        if (this.statusFilter) {
            let statusEnum: CouponStatusEnum | undefined;
            if (this.statusFilter === 'Active') {
                statusEnum = CouponStatusEnum.Active;
            } else if (this.statusFilter === 'Expired') {
                statusEnum = CouponStatusEnum.Expired;
            } else if (this.statusFilter === 'Inactive') {
                statusEnum = CouponStatusEnum.Inactive;
            }

            if (statusEnum !== undefined) {
                tempCoupons = tempCoupons.filter((coupon) => coupon.status === statusEnum);
            }
        }

        // Apply type filter
        if (this.typeFilter) {
            let typeEnum: CouponTypeEnum | undefined;
            if (this.typeFilter === 'Generate') {
                // Assuming 'Generate' maps to Generated
                typeEnum = CouponTypeEnum.Generated;
            } else if (this.typeFilter === 'Community') {
                typeEnum = CouponTypeEnum.Community;
            }

            if (typeEnum !== undefined) {
                tempCoupons = tempCoupons.filter((coupon) => coupon.type === typeEnum);
            }
        }

        this.filteredCoupons = tempCoupons;
    }
}
