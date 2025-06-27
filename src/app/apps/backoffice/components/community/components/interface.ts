// community/components/interface.ts

/**
 * Defines the structure for a Community object.
 */
export interface CommunityInterface {
    id: number;
    name: string;
    deliveryDay: string;
    deliveryTime: string;
    maxOrderPerDay: number;
    postalCode: string;
    address: string;
    customerIds: number[]; // Added to store associated customer IDs
}

/**
 * Defines the structure for a Customer object.
 */
export interface Customer {
    id: number;
    name: string;
    email: string;
    orderCount: number;
}
