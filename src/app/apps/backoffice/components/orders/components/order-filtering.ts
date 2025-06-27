// ==========================================================
// src/app/apps/backoffice/components/orders/components/order-filtering.ts
// Contains the logic for filtering and sorting orders.
// This service provides pure functions for processing order lists.
// ==========================================================
import { Injectable } from '@angular/core';
import { Order } from './interfaces'; // Import interfaces

@Injectable({
    providedIn: 'root'
})
export class OrderFilteringService {
    constructor() {
        console.log('OrderFilteringService: Service constructor called.');
    }

    /**
     * Filters and sorts a given list of orders based on various criteria.
     * This method does not modify the original array.
     * @param orders The array of orders to filter and sort.
     * @param searchTerm Term to search in customer name, order ID, or phone.
     * @param statusFilter Filter by order status.
     * @param orderTypeFilter Filter by order type (Pickup/Delivery).
     * @param startDateFilter Start date for order date range.
     * @param endDateFilter End date for order date range.
     * @param sortBy Field to sort by (e.g., 'orderDate', 'totalAmount').
     * @param sortDirection Sort direction ('asc' or 'desc').
     * @returns {Order[]} The filtered and sorted array of orders.
     */
    filterAndSortOrders(orders: Order[], searchTerm: string, statusFilter: string, orderTypeFilter: string, startDateFilter: string, endDateFilter: string, sortBy: string, sortDirection: 'asc' | 'desc'): Order[] {
        let filtered = [...orders]; // Start with a shallow copy

        // 1. Apply search term filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter((order) => order.customer.toLowerCase().includes(term) || order.id.toLowerCase().includes(term) || order.phone.includes(term));
        }

        // 2. Apply status filter
        if (statusFilter) {
            filtered = filtered.filter((order) => order.status === statusFilter);
        }

        // 3. Apply order type filter
        if (orderTypeFilter) {
            filtered = filtered.filter((order) => order.orderType === orderTypeFilter);
        }

        // 4. Apply date range filtering
        if (startDateFilter) {
            const startDateTime = new Date(startDateFilter).setHours(0, 0, 0, 0); // Start of the day
            filtered = filtered.filter((order) => order.orderDate.getTime() >= startDateTime);
        }
        if (endDateFilter) {
            const endDateTime = new Date(endDateFilter).setHours(23, 59, 59, 999); // End of the day
            filtered = filtered.filter((order) => order.orderDate.getTime() <= endDateTime);
        }

        // 5. Apply sorting
        filtered.sort((a, b) => {
            let valueA: any, valueB: any;

            switch (sortBy) {
                case 'orderDate':
                    valueA = new Date(a.orderDate).getTime();
                    valueB = new Date(b.orderDate).getTime();
                    break;
                case 'totalAmount':
                    valueA = a.totalAmount;
                    valueB = b.totalAmount;
                    break;
                case 'customer':
                    valueA = a.customer.toLowerCase();
                    valueB = b.customer.toLowerCase();
                    break;
                case 'status':
                    // Custom sort for status to keep 'Pending' or 'Processing' higher, if desired,
                    // otherwise alphabetical. For now, simple alphabetical based on original code.
                    valueA = a.status;
                    valueB = b.status;
                    break;
                default:
                    return 0; // No sorting or invalid sortBy
            }

            // Handle string comparisons (localeCompare is good for strings)
            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            }
            // Handle number/date comparisons
            return sortDirection === 'asc' ? (valueA > valueB ? 1 : -1) : valueA < valueB ? 1 : -1;
        });

        console.log(`OrderFilteringService: Filtered and sorted ${filtered.length} orders.`);
        return filtered;
    }
}
