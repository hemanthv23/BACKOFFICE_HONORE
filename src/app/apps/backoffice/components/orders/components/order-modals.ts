// ==========================================================
// src/app/apps/backoffice/components/orders/components/order-modals.ts
// Manages the state and data for various order-related modals.
// Also includes helper functions for new/edit order form data.
// Updated: Removed all references and functionalities for "New Order".
// This service now exclusively supports "Edit Order" and "View Order Details".
// ==========================================================
import { Injectable } from '@angular/core';
import { Order, OrderItem } from './interfaces'; // Import interfaces
import { OrderDataService } from './order-data'; // For ID generation for items

@Injectable({
    providedIn: 'root'
})
export class OrderModalsService {
    // Modal visibility flags
    showOrderDetailsModal: boolean = false;
    // This modal is now solely for editing, not new creation
    showEditOrderModal: boolean = false; // Renamed from showNewOrderModal for clarity

    // Data for modals
    selectedOrder: Order | null = null; // For viewing order details
    // `isEditMode` flag is largely redundant now, as the modal is always in edit mode
    isEditMode: boolean = true; // Always true, as this modal is only for editing existing orders
    newOrder: Order; // Represents the order being edited in the form

    constructor(private orderDataService: OrderDataService) {
        // Inject OrderDataService for item ID generation
        console.log('OrderModalsService: Service constructor called.');
        // Initialize newOrder for form binding, assuming it's primarily used for editing now
        this.newOrder = this.initializeOrderForEditForm();
    }

    /**
     * Initializes a fresh Order object structure for the edit order form.
     * This is used to reset the form or prepare it for loading an existing order.
     * The 'id' is left empty as it will be populated when an order is loaded for editing.
     * @returns {Order} A new, empty order object structure for the form.
     */
    private initializeOrderForEditForm(): Order {
        return {
            id: '', // Will be populated from the order being edited
            customer: '',
            email: '',
            phone: '',
            items: [{ id: this.orderDataService.generateItemId(), name: '', quantity: 1, price: 0, total: 0 }],
            totalAmount: 0,
            status: 'Pending',
            orderDate: new Date(), // Set current date/time as default
            paymentStatus: 'Pending',
            orderType: 'Pickup',
            notes: ''
        };
    }

    // --- Order Details Modal ---
    /**
     * Opens the order details modal and sets the selected order.
     * @param order The order object to display.
     */
    viewOrderDetails(order: Order): void {
        this.selectedOrder = order;
        this.showOrderDetailsModal = true;
        console.log('OrderModalsService: Opened order details modal for ID:', order.id);
    }

    /**
     * Closes the order details modal.
     */
    closeOrderDetailsModal(): void {
        this.showOrderDetailsModal = false;
        this.selectedOrder = null;
        console.log('OrderModalsService: Closed order details modal.');
    }

    // --- Edit Order Modal ---
    /**
     * Opens the edit order modal, pre-filling the form with existing order data.
     * @param order The order object to edit.
     */
    editOrder(order: Order): void {
        this.isEditMode = true; // Explicitly set, though now always true for this modal
        // Deep copy the order to avoid direct modification before saving
        this.newOrder = JSON.parse(JSON.stringify(order));
        // Ensure date fields are in correct format for datetime-local input (YYYY-MM-DDTHH:MM)
        this.newOrder.orderDate = new Date(this.newOrder.orderDate).toISOString().slice(0, 16) as any;
        if (this.newOrder.deliveryDate) {
            this.newOrder.deliveryDate = new Date(this.newOrder.deliveryDate).toISOString().slice(0, 16) as any;
        }
        this.calculateOverallTotal(); // Recalculate to be safe after deep copy
        this.showEditOrderModal = true; // Use the renamed property
        console.log('OrderModalsService: Opened edit order modal for ID:', order.id);
    }

    /**
     * Closes the edit order modal and resets the form.
     */
    closeEditOrderModal(): void {
        // Renamed from closeNewOrderModal
        this.showEditOrderModal = false; // Use the renamed property
        this.newOrder = this.initializeOrderForEditForm(); // Reset form model
        console.log('OrderModalsService: Closed edit order modal.');
    }

    /**
     * Adds a new empty item row to the `newOrder.items` array.
     */
    addItem(): void {
        this.newOrder.items.push({ id: this.orderDataService.generateItemId(), name: '', quantity: 1, price: 0, total: 0 });
        console.log('OrderModalsService: Added new item row to form.');
    }

    /**
     * Removes an item from the `newOrder.items` array by index.
     * @param index The index of the item to remove.
     */
    removeItem(index: number): void {
        this.newOrder.items.splice(index, 1);
        this.calculateOverallTotal(); // Recalculate total after removal
        console.log('OrderModalsService: Removed item at index:', index);
    }

    /**
     * Calculates the total for a single order item (quantity * price).
     * @param item The order item to calculate total for.
     */
    calculateItemTotal(item: OrderItem): void {
        item.total = item.quantity * item.price;
        this.calculateOverallTotal(); // Also update overall total
    }

    /**
     * Calculates the `totalAmount` for the entire `newOrder` based on its items.
     */
    calculateOverallTotal(): void {
        this.newOrder.totalAmount = this.newOrder.items.reduce((sum, item) => sum + item.total, 0);
        console.log('OrderModalsService: Overall total recalculated:', this.newOrder.totalAmount);
    }
}
