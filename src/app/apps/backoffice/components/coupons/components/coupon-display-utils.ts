import { CouponStatusEnum } from '../interfaces';

export class CouponDisplayUtils {
    formatDate(dateString: string): string {
        if (!dateString) {
            return 'N/A';
        }
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            console.error('Invalid date string:', dateString);
            return 'Invalid Date';
        }
    }

    getCouponStatusClass(status: CouponStatusEnum): string {
        switch (status) {
            case CouponStatusEnum.Active:
                return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800';
            case CouponStatusEnum.Expired:
                return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800';
            case CouponStatusEnum.Inactive: // This now covers 'Used'
                return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800';
            default:
                return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800';
        }
    }

    // --- ADDED THIS METHOD ---
    getCouponStatusString(status: CouponStatusEnum): string {
        switch (status) {
            case CouponStatusEnum.Active:
                return 'Active';
            case CouponStatusEnum.Expired:
                return 'Expired';
            case CouponStatusEnum.Inactive:
                return 'Used'; // Display 'Used' for Inactive status
            default:
                return 'Unknown';
        }
    }
    // --- END OF ADDED METHOD ---

    getDiscountTypeString(discountType: number): string {
        switch (discountType) {
            case 0:
                return 'Percentage';
            case 1:
                return 'Fixed';
            default:
                return 'Unknown';
        }
    }

    getCouponTypeString(couponType: number): string {
        switch (couponType) {
            case 0:
                return 'Generated';
            case 1:
                return 'Community';
            default:
                return 'Unknown';
        }
    }
}
