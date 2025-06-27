import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; // Import Observable and of
import { Order, OrderItem } from './interfaces'; // Import interfaces

@Injectable({
    providedIn: 'root'
})
export class OrderDataService {
    private _orders: Order[] = []; // Internal array to hold all orders

    constructor() {
        console.log('OrderDataService: Service constructor called.');
        this.loadInitialData(); // Load sample data on service initialization
    }

    /**
     * Loads initial sample order data. In a real application, this would fetch from a backend.
     */
    private loadInitialData(): void {
        // Sample data - copied directly from your original component
        this._orders = [
            {
                id: 'ORD-2024-001',
                customer: 'Priya Sharma',
                email: 'priya.sharma@email.com',
                phone: '+91 98765 43210',
                items: [
                    { id: '1', name: 'Chocolate Cake', quantity: 1, price: 450, total: 450 },
                    { id: '2', name: 'Vanilla Cupcakes', quantity: 6, price: 50, total: 300 }
                ],
                totalAmount: 750,
                status: 'Completed',
                orderDate: new Date('2024-06-10T10:00:00'),
                deliveryDate: new Date('2024-06-12T14:00:00'),
                paymentStatus: 'Paid',
                orderType: 'Delivery',
                notes: 'Please deliver before 2 PM'
            },
            {
                id: 'ORD-2024-002',
                customer: 'Raj Patel',
                email: 'raj.patel@email.com',
                phone: '+91 87654 32109',
                items: [
                    { id: '3', name: 'Red Velvet Cake', quantity: 1, price: 520, total: 520 },
                    { id: '4', name: 'Brownies', quantity: 4, price: 80, total: 320 }
                ],
                totalAmount: 840,
                status: 'Processing',
                orderDate: new Date('2024-06-11T11:30:00'),
                paymentStatus: 'Paid',
                orderType: 'Pickup'
            },
            {
                id: 'ORD-2024-003',
                customer: 'Anita Kumar',
                email: 'anita.kumar@email.com',
                phone: '+91 76543 21098',
                items: [
                    { id: '5', name: 'Birthday Cake Custom', quantity: 1, price: 1200, total: 1200 },
                    { id: '6', name: 'Party Cookies', quantity: 12, price: 25, total: 300 }
                ],
                totalAmount: 1500,
                status: 'Ready',
                orderDate: new Date('2024-06-09T09:00:00'),
                deliveryDate: new Date('2024-06-13T16:00:00'),
                paymentStatus: 'Paid',
                orderType: 'Delivery',
                notes: 'Custom design - unicorn theme'
            },
            {
                id: 'ORD-2024-004',
                customer: 'Vikram Singh',
                email: 'vikram.singh@email.com',
                phone: '+91 65432 10987',
                items: [
                    { id: '7', name: 'Croissants', quantity: 6, price: 45, total: 270 },
                    { id: '8', name: 'Danish Pastry', quantity: 3, price: 65, total: 195 }
                ],
                totalAmount: 465,
                status: 'Pending',
                orderDate: new Date('2024-06-12T08:45:00'),
                paymentStatus: 'Pending',
                orderType: 'Pickup'
            },
            {
                id: 'ORD-2024-005',
                customer: 'Sunita Devi',
                email: 'sunita.devi@email.com',
                phone: '+91 54321 09876',
                items: [{ id: '9', name: 'Wedding Cake', quantity: 1, price: 2500, total: 2500 }],
                totalAmount: 2500,
                status: 'Processing',
                orderDate: new Date('2024-06-08T14:00:00'),
                deliveryDate: new Date('2024-06-15T10:00:00'),
                paymentStatus: 'Paid',
                orderType: 'Delivery',
                notes: '3-tier cake, serves 50 people'
            },
            {
                id: 'ORD-2024-006',
                customer: 'Rahul Kumar',
                email: 'rahul.kumar@email.com',
                phone: '+91 99887 76655',
                items: [
                    { id: '10', name: 'Apple Pie', quantity: 1, price: 300, total: 300 },
                    { id: '11', name: 'Chocolate Chip Cookies', quantity: 10, price: 30, total: 300 }
                ],
                totalAmount: 600,
                status: 'Completed',
                orderDate: new Date('2024-06-07T16:00:00'),
                deliveryDate: new Date('2024-06-09T11:00:00'),
                paymentStatus: 'Paid',
                orderType: 'Pickup',
                notes: ''
            },
            {
                id: 'ORD-2024-007',
                customer: 'Pooja Singh',
                email: 'pooja.singh@email.com',
                phone: '+91 90000 11111',
                items: [{ id: '12', name: 'Black Forest Pastry', quantity: 4, price: 120, total: 480 }],
                totalAmount: 480,
                status: 'Cancelled',
                orderDate: new Date('2024-06-06T13:00:00'),
                paymentStatus: 'Refunded',
                orderType: 'Delivery',
                notes: 'Customer cancelled due to change of plans'
            },
            {
                id: 'ORD-2024-008',
                customer: 'Siddharth Gupta',
                email: 'siddharth.gupta@email.com',
                phone: '+91 81234 56789',
                items: [
                    { id: '13', name: 'Lemon Tarts', quantity: 3, price: 90, total: 270 },
                    { id: '14', name: 'Fruit Cake', quantity: 1, price: 400, total: 400 }
                ],
                totalAmount: 670,
                status: 'Pending',
                orderDate: new Date('2024-06-12T10:15:00'),
                paymentStatus: 'Pending',
                orderType: 'Pickup'
            },
            {
                id: 'ORD-2024-009',
                customer: 'Neha Sharma',
                email: 'neha.sharma@email.com',
                phone: '+91 78901 23456',
                items: [{ id: '15', name: 'Chocolate Eclairs', quantity: 5, price: 70, total: 350 }],
                totalAmount: 350,
                status: 'Processing',
                orderDate: new Date('2024-06-11T15:00:00'),
                paymentStatus: 'Pending',
                orderType: 'Delivery'
            },
            {
                id: 'ORD-2024-010',
                customer: 'Gaurav Jain',
                email: 'gaurav.jain@email.com',
                phone: '+91 98765 12345',
                items: [{ id: '16', name: 'Cheesecake Slice', quantity: 2, price: 150, total: 300 }],
                totalAmount: 300,
                status: 'Ready',
                orderDate: new Date('2024-06-10T17:00:00'),
                paymentStatus: 'Paid',
                orderType: 'Pickup'
            },
            {
                id: 'ORD-2024-011',
                customer: 'Deepika Rao',
                email: 'deepika.rao@email.com',
                phone: '+91 91234 56789',
                items: [{ id: '17', name: 'Donuts', quantity: 8, price: 40, total: 320 }],
                totalAmount: 320,
                status: 'Completed',
                orderDate: new Date('2024-06-05T09:30:00'),
                deliveryDate: new Date('2024-06-06T10:00:00'),
                paymentStatus: 'Paid',
                orderType: 'Pickup'
            }
        ];
        console.log(`OrderDataService: Loaded ${this._orders.length} initial orders.`);
    }

    /**
     * Returns a deep copy of all orders wrapped in an Observable to prevent direct modification of internal state.
     * Components should subscribe to this to get the latest data.
     * @returns {Observable<Order[]>} An Observable emitting a deep copy of the orders array.
     */
    getOrders(): Observable<Order[]> {
        // Deep copy to ensure immutability when passed to other services/components
        return of(JSON.parse(JSON.stringify(this._orders)));
    }

    /**
     * Updates an existing order in the internal list.
     * @param updatedOrderData The updated order object.
     */
    updateOrder(updatedOrderData: Order): void {
        const index = this._orders.findIndex((order) => order.id === updatedOrderData.id);
        if (index > -1) {
            // Ensure dates are Date objects before storing
            const orderToUpdate: Order = {
                ...updatedOrderData,
                orderDate: new Date(updatedOrderData.orderDate),
                deliveryDate: updatedOrderData.deliveryDate ? new Date(updatedOrderData.deliveryDate) : undefined
            };
            this._orders[index] = orderToUpdate;
            console.log('OrderDataService: Updated order:', updatedOrderData.id);
        } else {
            console.warn('OrderDataService: Order not found for update:', updatedOrderData.id);
        }
    }

    /**
     * Updates the status and payment status of a specific order.
     * Used primarily for the 'Cancel' functionality.
     * @param orderId The ID of the order to update.
     * @param newStatus The new status for the order.
     * @param newPaymentStatus The new payment status for the order.
     */
    updateOrderStatusAndPayment(orderId: string, newStatus: Order['status'], newPaymentStatus: Order['paymentStatus']): void {
        const orderToUpdate = this._orders.find((order) => order.id === orderId);
        if (orderToUpdate) {
            orderToUpdate.status = newStatus;
            orderToUpdate.paymentStatus = newPaymentStatus;
            console.log(`OrderDataService: Order ${orderId} status updated to ${newStatus}, payment to ${newPaymentStatus}.`);
        } else {
            console.warn(`OrderDataService: Order ${orderId} not found for status update.`);
        }
    }

    /**
     * Generates a simple unique ID for an order item.
     * @returns {string} A unique item ID.
     */
    generateItemId(): string {
        return Math.random().toString(36).substring(2, 9);
    }

    // Removed generateOrderId() and addOrder() as new order creation is no longer supported
}
