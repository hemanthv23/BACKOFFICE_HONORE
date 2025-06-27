// ==========================================================
// src/app/apps/backoffice/components/coupons/components/coupon-filtering.ts
// Contains logic for filtering and searching coupons.
// Depends on `CouponData` for the source of coupons.
// ==========================================================
import { Coupon } from './interfaces';
import { CouponData } from './coupon-data';

export class CouponFiltering {
    searchTerm: string = '';
    statusFilter: string = '';
    typeFilter: string = '';

    private _filteredCoupons: Coupon[] = [];

    constructor(private couponData: CouponData) {
        this.filterCoupons(); // Initial filter when instantiated
    }

    /**
     * Getter for filtered coupons.
     * @returns {Coupon[]} The array of coupons after applying filters.
     */
    get filteredCoupons(): Coupon[] {
        return this._filteredCoupons;
    }

    /**
     * Applies all active filters and search term to the coupon data.
     * Updates `_filteredCoupons`.
     */
    filterCoupons(): void {
        this._filteredCoupons = this.couponData.allCoupons.filter((coupon) => {
            const matchesSearch =
                !this.searchTerm ||
                coupon.code.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                coupon.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                (coupon.customerName && coupon.customerName.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
                (coupon.communityName && coupon.communityName.toLowerCase().includes(this.searchTerm.toLowerCase()));

            const matchesStatus = !this.statusFilter || coupon.status === this.statusFilter;
            const matchesType = !this.typeFilter || coupon.type === this.typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });
    }
}
