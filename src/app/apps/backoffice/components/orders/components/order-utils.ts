// ==========================================================
// src/app/apps/backoffice/components/orders/components/order-utils.ts
// Provides utility functions for styling, statistical calculations,
// and actions like export and print.
// ==========================================================
import { Injectable } from '@angular/core';
import { Order, OrderItem } from './interfaces'; // Import interfaces

@Injectable({
    providedIn: 'root'
})
export class OrderUtilsService {
    constructor() {
        console.log('OrderUtilsService: Service constructor called.');
    }

    // --- Styling Methods ---
    /**
     * Returns Tailwind CSS classes for order status badges.
     * @param status The order status.
     * @returns Tailwind CSS class string.
     */
    getOrderStatusClass(status: Order['status']): string {
        switch (status) {
            case 'Completed':
                return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800';
            case 'Pending':
                return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800';
            case 'Processing':
                return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800';
            case 'Ready':
                return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800';
            case 'Cancelled':
                return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800';
            default:
                return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800';
        }
    }

    /**
     * Returns Tailwind CSS classes for order type badges.
     * @param type The order type (Pickup/Delivery).
     * @returns Tailwind CSS class string.
     */
    getOrderTypeClass(type: Order['orderType']): string {
        switch (type) {
            case 'Pickup':
                return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800';
            case 'Delivery':
                return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800';
            default:
                return 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800';
        }
    }

    // --- Statistical Calculation Methods ---
    /**
     * Calculates the total number of orders in a given array.
     * @param orders The array of orders.
     * @returns {number} The total count of orders.
     */
    getTotalOrdersCount(orders: Order[]): number {
        return orders.length;
    }

    /**
     * Filters orders by a specific status and returns the count.
     * @param orders The array of orders.
     * @param status The status to filter by.
     * @returns {number} The count of orders with the specified status.
     */
    getOrdersCountByStatus(orders: Order[], status: Order['status']): number {
        return orders.filter((order) => order.status === status).length;
    }

    /**
     * Calculates the total revenue from a given list of orders.
     * @param orders The array of orders.
     * @returns {number} The total revenue.
     */
    getTotalRevenue(orders: Order[]): number {
        return orders.reduce((sum, order) => sum + order.totalAmount, 0);
    }

    // --- Action Methods ---
    /**
     * Handles printing the details of a specific order.
     * Opens a new window with formatted order details for printing.
     * @param order The order object to print.
     */
    printOrder(order: Order): void {
        console.log('OrderUtilsService: Preparing to print Order:', order.id);
        const printContent = `
        <style>
          body { font-family: sans-serif; margin: 20px; }
          h1, h3 { color: #333; }
          p { margin-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .total-amount { text-align: right; margin-top: 20px; font-size: 1.2em; font-weight: bold; }
          /* Re-apply styling classes directly as they won't be from Tailwind in print context */
          .status-tag { display: inline-block; padding: 4px 8px; border-radius: 9999px; font-size: 0.8em; font-weight: bold; }
          .status-Completed { background-color: #d1fae5; color: #065f46; }
          .status-Pending { background-color: #fffbeb; color: #92400e; }
          .status-Processing { background-color: #eff6ff; color: #1e40af; }
          .status-Ready { background-color: #ede9fe; color: #5b21b6; }
          .status-Cancelled { background-color: #fee2e2; color: #991b1b; }
          .type-tag { display: inline-block; padding: 4px 8px; border-radius: 9999px; font-size: 0.8em; font-weight: bold; }
          .type-Pickup { background-color: #e0e7ff; color: #4338ca; }
          .type-Delivery { background-color: #e6fffa; color: #047857; }
        </style>
        <h1>Order Details - #${order.id}</h1>
        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${order.customer}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <h3>Order Information</h3>
        <p><strong>Status:</strong> <span class="status-tag status-${order.status}">${order.status}</span></p>
        <p><strong>Type:</strong> <span class="type-tag type-${order.orderType}">${order.orderType}</span></p>
        <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
        ${order.deliveryDate ? `<p><strong>Delivery Date:</strong> ${new Date(order.deliveryDate).toLocaleString()}</p>` : ''}
        <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
        ${order.notes ? `<p><strong>Notes:</strong> ${order.notes}</p>` : ''}
        <h3>Order Items</h3>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items
                .map(
                    (item) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price}</td>
                <td>₹${item.total}</td>
              </tr>
            `
                )
                .join('')}
          </tbody>
        </table>
        <p class="total-amount">Total Amount: ₹${order.totalAmount}</p>
      `;

        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Print Order</title>');
            printWindow.document.write(printContent); // Content now includes styles
            printWindow.document.write('</head><body>');
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        } else {
            alert('Could not open print window. Please allow pop-ups for this site.');
        }
    }

    /**
     * Exports a list of orders to a CSV file.
     * @param orders The array of orders to export.
     */
    exportOrders(orders: Order[]): void {
        console.log('OrderUtilsService: Exporting orders to CSV.');
        // Convert orders to CSV format (copied directly from your original component)
        const headers = ['Order ID', 'Customer Name', 'Customer Email', 'Customer Phone', 'Total Amount', 'Status', 'Order Date', 'Delivery Date', 'Payment Status', 'Order Type', 'Notes', 'Item Count', 'Items Details'];

        const rows = orders.map((order) => {
            const itemsDetails = order.items.map((item) => `${item.name} (Qty: ${item.quantity}, Price: ${item.price})`).join('; ');
            return [
                `"${order.id}"`,
                `"${order.customer}"`,
                `"${order.email}"`,
                `"${order.phone}"`,
                order.totalAmount,
                `"${order.status}"`,
                `"${new Date(order.orderDate).toLocaleString()}"`,
                `"${order.deliveryDate ? new Date(order.deliveryDate).toLocaleString() : ''}"`,
                `"${order.paymentStatus}"`,
                `"${order.orderType}"`,
                `"${order.notes || ''}"`,
                order.items.length,
                `"${itemsDetails}"`
            ]
                .map((col) => (typeof col === 'string' ? col.replace(/"/g, '""') : col))
                .join(','); // Handle commas in data
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            // Feature detection
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'bakery_orders.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            alert('Orders exported successfully to bakery_orders.csv!');
        } else {
            alert('Your browser does not support downloading files directly. Please copy the data manually.');
            // Fallback for older browsers: open CSV in a new window
            window.open('data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
        }
    }
}
