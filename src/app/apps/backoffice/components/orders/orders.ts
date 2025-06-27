// ================================
// src/app/apps/backoffice/components/orders/orders.ts
// The main Angular component for Order management.
// Refactored to use dedicated services for data, filtering, modals, and utilities.
// Functionalities and styles are preserved as per original component logic.
// Updated: Removed "New Order" button and all its associated functionalities.
// Action icons replaced with text.
// ================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';

// Import interfaces and services from their correct paths and with correct names
import { Order, OrderItem } from './components/interfaces';
import { OrderDataService } from './components/order-data';
import { OrderFilteringService } from './components/order-filtering';
import { OrderModalsService } from './components/order-modals';
// Will use showEditOrderModal
import { OrderUtilsService } from './components/order-utils';

import html2pdf from 'html2pdf.js';
// Re-add html2pdf import

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    template: `
        <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div class="mb-4">
                <button routerLink="../" class="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors duration-200 shadow-md flex items-center space-x-1 sm:space-x-2 w-auto">
                    <svg class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    <span class="whitespace-nowrap">Back to Home</span>
                </button>
            </div>
            <div class="max-w-7xl mx-auto">
                <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
                            <p class="text-gray-600">Track and manage all bakery orders efficiently</p>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <button (click)="exportOrders()" class="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors duration-200 text-sm sm:text-base">
                                <i class="fas fa-download mr-2"></i>Export
                            </button>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
                    <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-200">
                        <div class="flex items-center">
                            <div class="p-2 bg-blue-100 rounded-lg">
                                <i class="fas fa-receipt text-blue-600 text-lg sm:text-xl"></i>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-sm sm:text-lg font-semibold text-blue-800">Total Orders</h3>
                                <p class="text-lg sm:text-2xl font-bold text-blue-900">{{ orderUtilsService.getTotalOrdersCount(allOrders) }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-200">
                        <div class="flex items-center">
                            <div class="p-2 bg-green-100 rounded-lg">
                                <i class="fas fa-check-circle text-green-600 text-lg sm:text-xl"></i>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-sm sm:text-lg font-semibold text-green-800">Completed</h3>
                                <p class="text-lg sm:text-2xl font-bold text-green-900">{{ orderUtilsService.getOrdersCountByStatus(allOrders, 'Completed') }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-200">
                        <div class="flex items-center">
                            <div class="p-2 bg-yellow-100 rounded-lg">
                                <i class="fas fa-clock text-yellow-600 text-lg sm:text-xl"></i>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-sm sm:text-lg font-semibold text-yellow-800">Pending</h3>
                                <p class="text-lg sm:text-2xl font-bold text-yellow-900">{{ orderUtilsService.getOrdersCountByStatus(allOrders, 'Pending') }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-200 col-span-2 lg:col-span-1">
                        <div class="flex items-center">
                            <div class="p-2 bg-purple-100 rounded-lg">
                                <i class="fa-solid fa-indian-rupee-sign text-purple-600 text-lg sm:text-xl"></i>
                            </div>
                            <div class="ml-3">
                                <h3 class="text-sm sm:text-lg font-semibold text-purple-800">Revenue</h3>
                                <p class="text-lg sm:text-2xl font-bold text-purple-900">₹{{ orderUtilsService.getTotalRevenue(allOrders) | number: '1.0-0' }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
                    <div class="flex flex-col lg:flex-row gap-4">
                        <div class="flex-1">
                            <input
                                type="text"
                                [(ngModel)]="searchTerm"
                                (input)="filterOrders()"
                                placeholder="Search by customer name, order ID, or phone..."
                                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div class="flex flex-col sm:flex-row gap-4">
                            <select [(ngModel)]="statusFilter" (change)="filterOrders()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">All Status</option>
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Ready">Ready</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <select [(ngModel)]="orderTypeFilter" (change)="filterOrders()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">All Types</option>
                                <option value="Pickup">Pickup</option>
                                <option value="Delivery">Delivery</option>
                            </select>
                            <div class="flex items-center gap-2">
                                <label for="startDate" class="text-sm text-gray-700 hidden sm:block">From:</label>
                                <input type="date" id="startDate" [(ngModel)]="startDateFilter" (change)="filterOrders()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            <div class="flex items-center gap-2">
                                <label for="endDate" class="text-sm text-gray-700 hidden sm:block">To:</label>
                                <input type="date" id="endDate" [(ngModel)]="endDateFilter" (change)="filterOrders()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            </div>
                            <select [(ngModel)]="sortBy" (change)="filterOrders()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="orderDate">Date</option>
                                <option value="totalAmount">Amount</option>
                                <option value="customer">Customer</option>
                                <option value="status">Status</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div class="p-4 sm:p-6 border-b border-gray-200">
                        <h3 class="text-xl font-semibold text-gray-900">Orders List</h3>
                    </div>

                    <div class="lg:hidden">
                        <div *ngFor="let order of paginatedOrders" class="border-b border-gray-200 p-4">
                            <div class="flex justify-between items-start mb-3">
                                <div>
                                    <p class="font-semibold text-gray-900">#{{ order.id }}</p>
                                    <p class="text-sm text-gray-600">{{ order.customer }}</p>
                                    <p class="text-xs text-gray-500">{{ order.phone }}</p>
                                </div>
                                <span [class]="orderUtilsService.getOrderStatusClass(order.status)">{{ order.status }}</span>
                            </div>
                            <div class="flex justify-between items-center mb-3">
                                <span class="text-sm font-medium text-gray-700">₹{{ order.totalAmount }}</span>
                                <span class="text-xs text-gray-500">{{ order.orderDate | date: 'short' }}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span [class]="orderUtilsService.getOrderTypeClass(order.orderType)">{{ order.orderType }}</span>
                                <div class="flex gap-2">
                                    <button (click)="viewOrderDetails(order)" class="text-blue-600 hover:text-blue-800 text-sm font-medium" title="View Order Details">View</button>
                                    <button (click)="editOrder(order)" class="text-green-600 hover:text-green-800 text-sm font-medium" title="Edit Order">Edit</button>
                                    <button (click)="printOrder(order)" class="text-purple-600 hover:text-purple-900 text-sm font-medium" title="Print Order PDF">Print</button>
                                    <button
                                        (click)="cancelOrder(order)"
                                        [disabled]="order.status === 'Completed' || order.status === 'Cancelled'"
                                        class="text-red-600 hover:text-red-800 text-sm font-medium disabled:text-gray-400"
                                        title="Cancel Order"
                                    >
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="hidden lg:block overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order No</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Type</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date/Time</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wanted Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr *ngFor="let order of paginatedOrders" class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ order.id }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div class="text-sm font-medium text-gray-900">{{ order.customer }}</div>
                                            <div class="text-sm text-gray-500">{{ order.phone }}</div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span [class]="orderUtilsService.getOrderStatusClass(order.status)">{{ order.status }}</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ order.paymentStatus }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span [class]="orderUtilsService.getOrderTypeClass(order.orderType)">{{ order.orderType }}</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.orderDate | date: 'short' }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ order.deliveryDate | date: 'short' }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div class="flex space-x-2">
                                            <button (click)="viewOrderDetails(order)" class="text-blue-600 hover:text-blue-900" title="View Order Details"><i class="fas fa-eye"></i></button>
                                            <button (click)="editOrder(order)" class="text-green-600 hover:text-green-900" title="Edit Order"><i class="fas fa-edit"></i></button>
                                            <button (click)="printOrder(order)" class="text-purple-600 hover:text-purple-900" title="Print Order PDF"><i class="fas fa-print"></i></button>
                                            <button (click)="cancelOrder(order)" [disabled]="order.status === 'Completed' || order.status === 'Cancelled'" class="text-red-600 hover:text-red-900 disabled:text-gray-400" title="Cancel Order">
                                                <i class="fas fa-times"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                        <div class="flex flex-col sm:flex-row items-center justify-between">
                            <div class="text-sm text-gray-700 mb-4 sm:mb-0">Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }} of {{ filteredOrders.length }} results</div>
                            <div class="flex space-x-2">
                                <button (click)="previousPage()" [disabled]="currentPage === 1" class="px-3 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">Previous</button>
                                <span
                                    *ngFor="let page of getPages()"
                                    class="px-3 py-2 rounded-md text-sm font-medium"
                                    [class]="page === currentPage ? 'bg-blue-500 text-white' : 'bg-white border border-gray-300 text-gray-500 hover:bg-gray-50'"
                                    (click)="goToPage(page)"
                                >
                                    {{ page }}
                                </span>
                                <button (click)="nextPage()" [disabled]="currentPage === getTotalPages()" class="px-3 py-2 rounded-md bg-white border border-gray-300 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div *ngIf="orderModalsService.showOrderDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
            <div class="relative mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div class="flex justify-between items-center mb-4">
                    <div class="flex-grow"></div>
                    <button (click)="orderModalsService.closeOrderDetailsModal()" class="text-gray-400 hover:text-gray-600 ml-4" title="Close Order Details">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>

                <h3 class="text-lg font-bold text-gray-900 mb-4 text-right">Order Details - #{{ orderModalsService.selectedOrder?.id }}</h3>

                <div *ngIf="orderModalsService.selectedOrder" class="space-y-4" id="orderDetailsContent">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 class="font-semibold text-gray-800">Customer Information</h4>
                            <p><strong>Name:</strong> {{ orderModalsService.selectedOrder.customer }}</p>
                            <p><strong>Email:</strong> {{ orderModalsService.selectedOrder.email }}</p>
                            <p><strong>Phone:</strong> {{ orderModalsService.selectedOrder.phone }}</p>
                        </div>
                        <div>
                            <h4 class="font-semibold text-gray-800">Order Information</h4>
                            <p>
                                <strong>Status:</strong> <span [class]="orderUtilsService.getOrderStatusClass(orderModalsService.selectedOrder.status)">{{ orderModalsService.selectedOrder.status }}</span>
                            </p>
                            <p>
                                <strong>Type:</strong> <span [class]="orderUtilsService.getOrderTypeClass(orderModalsService.selectedOrder.orderType)">{{ orderModalsService.selectedOrder.orderType }}</span>
                            </p>
                            <p><strong>Order Date:</strong> {{ orderModalsService.selectedOrder.orderDate | date: 'full' }}</p>
                            <p *ngIf="orderModalsService.selectedOrder.deliveryDate"><strong>Delivery Date:</strong> {{ orderModalsService.selectedOrder.deliveryDate | date: 'full' }}</p>
                            <p><strong>Payment Status:</strong> {{ orderModalsService.selectedOrder.paymentStatus }}</p>
                        </div>
                    </div>

                    <div>
                        <h4 class="font-semibold text-gray-800 mb-2">Order Items</h4>
                        <div class="overflow-x-auto">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-gray-200">
                                    <tr *ngFor="let item of orderModalsService.selectedOrder.items">
                                        <td class="px-4 py-2 text-sm text-gray-900">{{ item.name }}</td>
                                        <td class="px-4 py-2 text-sm text-gray-900">{{ item.quantity }}</td>
                                        <td class="px-4 py-2 text-sm text-gray-900">₹{{ item.price }}</td>
                                        <td class="px-4 py-2 text-sm font-semibold text-gray-900">₹{{ item.total }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="mt-4 text-right">
                            <p class="text-lg font-bold">Total: ₹{{ orderModalsService.selectedOrder.totalAmount }}</p>
                        </div>
                    </div>

                    <div *ngIf="orderModalsService.selectedOrder.notes">
                        <h4 class="font-semibold text-gray-800">Notes</h4>
                        <p class="text-gray-600">{{ orderModalsService.selectedOrder.notes }}</p>
                    </div>

                    <div class="flex justify-end space-x-3 mt-6">
                        <button (click)="orderModalsService.closeOrderDetailsModal()" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg" title="Close">Close</button>
                    </div>
                </div>
            </div>
        </div>

        <div *ngIf="orderModalsService.showEditOrderModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center p-4">
            <div class="relative mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
                <div class="mt-3">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-bold text-gray-900">Edit Order</h3>
                        <button (click)="orderModalsService.closeEditOrderModal()" class="text-gray-400 hover:text-gray-600" title="Close Edit Form">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    <form (ngSubmit)="saveOrder()" #orderForm="ngForm">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label for="customer" class="block text-sm font-medium text-gray-700">Customer Name</label>
                                <input
                                    type="text"
                                    id="customer"
                                    name="customer"
                                    [(ngModel)]="orderModalsService.newOrder.customer"
                                    required
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" id="email" name="email" [(ngModel)]="orderModalsService.newOrder.email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
                                <input type="text" id="phone" name="phone" [(ngModel)]="orderModalsService.newOrder.phone" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500" />
                            </div>
                            <div>
                                <label for="orderType" class="block text-sm font-medium text-gray-700">Order Type</label>
                                <select id="orderType" name="orderType" [(ngModel)]="orderModalsService.newOrder.orderType" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="Pickup">Pickup</option>
                                    <option value="Delivery">Delivery</option>
                                </select>
                            </div>
                            <div>
                                <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                                <select id="status" name="status" [(ngModel)]="orderModalsService.newOrder.status" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Ready">Ready</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <label for="paymentStatus" class="block text-sm font-medium text-gray-700">Payment Status</label>
                                <select
                                    id="paymentStatus"
                                    name="paymentStatus"
                                    [(ngModel)]="orderModalsService.newOrder.paymentStatus"
                                    required
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Refunded">Refunded</option>
                                </select>
                            </div>
                            <div>
                                <label for="orderDate" class="block text-sm font-medium text-gray-700">Order Date</label>
                                <input
                                    type="datetime-local"
                                    id="orderDate"
                                    name="orderDate"
                                    [(ngModel)]="orderModalsService.newOrder.orderDate"
                                    required
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div *ngIf="orderModalsService.newOrder.orderType === 'Delivery'">
                                <label for="deliveryDate" class="block text-sm font-medium text-gray-700">Delivery Date</label>
                                <input
                                    type="datetime-local"
                                    id="deliveryDate"
                                    name="deliveryDate"
                                    [(ngModel)]="orderModalsService.newOrder.deliveryDate"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <h4 class="font-semibold text-gray-800 mb-2">Order Items</h4>
                        <div *ngFor="let item of orderModalsService.newOrder.items; let i = index" class="grid grid-cols-5 gap-2 items-end mb-2 p-2 border border-gray-200 rounded-md">
                            <div class="col-span-2">
                                <label [for]="'itemName' + i" class="block text-xs font-medium text-gray-700">Item Name</label>
                                <input type="text" [id]="'itemName' + i" [(ngModel)]="item.name" name="itemName{{ i }}" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm" />
                            </div>
                            <div>
                                <label [for]="'itemQty' + i" class="block text-xs font-medium text-gray-700">Qty</label>
                                <input
                                    type="number"
                                    [id]="'itemQty' + i"
                                    [(ngModel)]="item.quantity"
                                    (input)="orderModalsService.calculateItemTotal(item)"
                                    name="itemQty{{ i }}"
                                    required
                                    min="1"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                                />
                            </div>
                            <div>
                                <label [for]="'itemPrice' + i" class="block text-xs font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    [id]="'itemPrice' + i"
                                    [(ngModel)]="item.price"
                                    (input)="orderModalsService.calculateItemTotal(item)"
                                    name="itemPrice{{ i }}"
                                    required
                                    min="0"
                                    step="0.01"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                                />
                            </div>
                            <div class="flex items-center">
                                <span class="text-sm font-medium text-gray-700 mr-2">Total: ₹{{ item.total | number: '1.0-0' }}</span>
                                <button type="button" (click)="orderModalsService.removeItem(i)" class="text-red-500 hover:text-red-700 text-lg" title="Remove Item">
                                    <i class="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </div>
                        <button type="button" (click)="orderModalsService.addItem()" class="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm" title="Add New Item"><i class="fas fa-plus mr-1"></i>Add Item</button>
                        <div class="text-right font-bold text-lg mt-4">Overall Total: ₹{{ orderModalsService.newOrder.totalAmount | number: '1.0-0' }}</div>
                        <div class="flex justify-end space-x-3 mt-6">
                            <button type="button" (click)="orderModalsService.closeEditOrderModal()" class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg" title="Cancel">Cancel</button>
                            <button type="submit" [disabled]="!orderForm.valid" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed" title="Update Order">
                                <i class="fas fa-save mr-2"></i>Update Order
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
            .animate-pulse {
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            @keyframes pulse {
                0%,
                100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.5;
                }
            }
            /* Status styles */
            .status-Pending {
                @apply bg-yellow-100 text-yellow-800 px-2.5 py-0.5 rounded-full text-xs font-medium;
            }
            .status-Processing {
                @apply bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full text-xs font-medium;
            }
            .status-Ready {
                @apply bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full text-xs font-medium;
            }
            .status-Completed {
                @apply bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full text-xs font-medium;
            }
            .status-Cancelled {
                @apply bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full text-xs font-medium;
            }

            /* Order Type styles */
            .type-Pickup {
                @apply bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full text-xs font-medium;
            }
            .type-Delivery {
                @apply bg-pink-100 text-pink-800 px-2.5 py-0.5 rounded-full text-xs font-medium;
            }
        `
    ]
})
export class Orders implements OnInit {
    allOrders: Order[] = [];
    filteredOrders: Order[] = [];
    paginatedOrders: Order[] = [];
    currentPage = 1;
    itemsPerPage = 10;
    searchTerm = '';
    statusFilter = '';
    orderTypeFilter = '';
    startDateFilter: string = '';
    endDateFilter: string = '';
    sortBy: string = 'orderDate';
    // Default sort by orderDate
    sortDirection: 'asc' | 'desc' = 'asc';
    // Added for sorting direction

    Math = Math;
    // Make Math object available in the template

    constructor(
        public orderDataService: OrderDataService,
        private orderFilteringService: OrderFilteringService,
        public orderModalsService: OrderModalsService,
        public orderUtilsService: OrderUtilsService
    ) {}

    ngOnInit(): void {
        this.loadAndFilterOrders();
    }

    loadAndFilterOrders(): void {
        this.orderDataService.getOrders().subscribe((orders: Order[]) => {
            this.allOrders = orders;
            this.filterOrders();
        });
    }

    filterOrders(): void {
        this.filteredOrders = this.orderFilteringService.filterAndSortOrders(
            this.allOrders,
            this.searchTerm,
            this.statusFilter,
            this.orderTypeFilter,
            this.startDateFilter,
            this.endDateFilter,
            this.sortBy,
            this.sortDirection // Pass the sort direction
        );
        this.currentPage = 1; // Reset to first page after filter
        this.updatePagination();
    }

    updatePagination(): void {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
    }

    getTotalPages(): number {
        return Math.ceil(this.filteredOrders.length / this.itemsPerPage);
    }

    getPages(): number[] {
        const totalPages = this.getTotalPages();
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.getTotalPages()) {
            this.currentPage = page;
            this.updatePagination();
        }
    }

    nextPage(): void {
        if (this.currentPage < this.getTotalPages()) {
            this.currentPage++;
            this.updatePagination();
        }
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePagination();
        }
    }

    viewOrderDetails(order: Order): void {
        this.orderModalsService.viewOrderDetails(order);
    }

    editOrder(order: Order): void {
        this.orderModalsService.editOrder(order);
    }

    saveOrder(): void {
        // Since new order creation is removed, this method will only handle updates.
        this.orderDataService.updateOrder(this.orderModalsService.newOrder);
        alert(`Order ${this.orderModalsService.newOrder.id} updated successfully!`);

        this.loadAndFilterOrders(); // Refresh table
        this.orderModalsService.closeEditOrderModal();
        // Close and reset modal
    }

    cancelOrder(order: Order): void {
        if (confirm(`Are you sure you want to cancel order ${order.id}?`)) {
            this.orderDataService.updateOrderStatusAndPayment(order.id, 'Cancelled', 'Refunded');
            this.loadAndFilterOrders();
            alert(`Order ${order.id} has been cancelled.`);
        }
    }

    // New or re-added method for professional PDF generation
    printOrder(order: Order): void {
        if (order) {
            const orderDateFormatted = order.orderDate
                ? new Date(order.orderDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                  })
                : 'N/A';

            const deliveryDateFormatted = order.deliveryDate
                ? new Date(order.deliveryDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                  })
                : 'N/A';

            const itemsHtml = order.items
                .map(
                    (item, index) => `
                <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 8px 12px; font-size: 11px; color: #333;">${item.name}</td>
                    <td style="padding: 8px 12px; text-align: center; font-size: 11px; color: #333;">${item.quantity}</td>
                    <td style="padding: 8px 12px; text-align: right; font-size: 11px; color: #333;">₹${item.price.toFixed(2)}</td>
                    <td style="padding: 8px 12px; text-align: right; font-size: 11px; color: #333; font-weight: bold;">₹${item.total.toFixed(2)}</td>
                </tr>
            `
                )
                .join('');
            const content = `
            <div style="font-family: 'Inter', Arial, sans-serif; padding: 20px; color: #2d3748; font-size: 12px; line-height: 1.5; background-color: #ffffff;">

                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px;">
                    <div style="width: 50%;"></div> 

                    <div style="text-align: right; width: 50%;">
                        <div style="margin-bottom: 5px;">
                            <span style="font-size: 28px; font-weight: bold; color: #2d3748;">HONOR<span style="color: #F59E0B;">E</span></span>
                        </div>
                        <p style="font-size: 12px; color: #555; margin-top: 0px; margin-bottom: 10px;">Traditional Baking</p>
                        <p style="margin: 0; font-size: 10px; color: #777;">Ground Floor, No. 549/3, 9th A Main Rd, Indira Nagar 1st Stage,</p>
                        <p style="margin: 0; font-size: 10px; color: #777;">Stage 1, Indiranagar, Bengaluru, Karnataka 560038</p>
                        <p style="margin: 0; font-size: 10px; color: #777;">Phone: (123) 456-7890 | Email: info@honoree.com</p>
                    </div>
                </div>

                <h1 style="font-size: 20px; font-weight: bold; text-align: center; margin-bottom: 25px; color: #444;">Order Details - #${order.id}</h1>

                <div style="display: flex; justify-content: space-between; margin-bottom: 25px;">
                    <div style="width: 48%; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
                        <h2 style="font-size: 14px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 12px; color: #555;">Customer Information</h2>
                        <p style="margin: 5px 0;"><strong>Name:</strong> ${order.customer}</p>
                        <p style="margin: 5px 0;"><strong>Email:</strong> ${order.email}</p>
                        <p style="margin: 5px 0;"><strong>Phone:</strong> ${order.phone}</p>
                    </div>

                    <div style="width: 48%; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
                        <h2 style="font-size: 14px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 12px; color: #555;">Order Information</h2>
                        <p style="margin: 5px 0;"><strong>Status:</strong> ${order.status}</p>
                        <p style="margin: 5px 0;"><strong>Type:</strong> ${order.orderType}</p>
                        <p style="margin: 5px 0;"><strong>Order Date:</strong> ${orderDateFormatted}</p>
                        ${order.deliveryDate ? `<p style="margin: 5px 0;"><strong>Delivery Date:</strong> ${deliveryDateFormatted}</p>` : ''}
                        <p style="margin: 5px 0;"><strong>Payment Status:</strong> ${order.paymentStatus}</p>
                    </div>
                </div>

                <div style="margin-bottom: 25px;">
                    <h2 style="font-size: 14px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 12px; color: #555;">Order Items</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background-color: #f2f2f2; border-bottom: 2px solid #ddd;">
                                <th style="padding: 10px 12px; text-align: left; font-size: 11px; color: #555; text-transform: uppercase;">Item</th>
                                <th style="padding: 10px 12px; text-align: center; font-size: 11px; color: #555; text-transform: uppercase;">Qty</th>
                                <th style="padding: 10px 12px; text-align: right; font-size: 11px; color: #555; text-transform: uppercase;">Price</th>
                                <th style="padding: 10px 12px; text-align: right; font-size: 11px; color: #555; text-transform: uppercase;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>
                    <p style="text-align: right; font-weight: bold; font-size: 1.2em; margin-top: 15px; padding-top: 10px; border-top: 1px solid #e0e0e0;">Total Amount: ₹${order.totalAmount.toFixed(2)}</p>
                </div>

                ${
                    order.notes
                        ? `
                    <div style="margin-bottom: 25px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
                        <h2 style="font-size: 14px; font-weight: bold; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 12px; color: #555;">Notes</h2>
                        <p style="margin: 0; color: #666;">${order.notes}</p>
                    </div>
                `
                        : ''
                }

                <div style="text-align: center; margin-top: 40px; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 15px;">
                    <p>&copy; ${new Date().getFullYear()} HONORE Bakery. All rights reserved. | Thank you for your business!</p>
                </div>
            </div>
        `;

            const tempElement = document.createElement('div');
            tempElement.innerHTML = content;
            document.body.appendChild(tempElement);

            html2pdf()
                .from(tempElement)
                .set({
                    margin: 10,
                    filename: `HONOREE-Order-${order.id}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        letterRendering: true
                    },
                    jsPDF: {
                        unit: 'mm',
                        format: 'a4',
                        orientation: 'portrait'
                    }
                })
                .save()
                .then(() => {
                    document.body.removeChild(tempElement);
                })
                .catch((error: any) => {
                    console.error('PDF generation failed:', error);
                    if (document.body.contains(tempElement)) {
                        document.body.removeChild(tempElement);
                    }
                });
        }
    }

    exportOrders(): void {
        this.orderUtilsService.exportOrders(this.filteredOrders);
    }
}
