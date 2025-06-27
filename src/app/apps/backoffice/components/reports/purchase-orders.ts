import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Subject, interval, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

interface PurchaseOrder {
    id: string;
    orderNumber: string;
    customerType: string; // Changed to Individual, Business, Community
    customerName: string;
    communityName: string; // Added for filtering
    orderDate: Date;
    deliveryDate: Date;
    status: 'Pending' | 'Approved' | 'Shipped' | 'Delivered' | 'Cancelled';
    total: number;
    items: string[];
    supplier: string;
    priority: 'Low' | 'Medium' | 'High';
}

@Component({
    selector: 'app-purchase-orders',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
    providers: [DatePipe],
    template: `
        <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div class="bg-white shadow-sm border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900 mb-2">Purchase Orders</h1>
                            <p class="text-gray-600">Manage and track purchase orders in real-time</p>
                            <div class="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                <span>Total Orders: {{ totalOrders }}</span>
                                <span>•</span>
                                <span>Last Updated: {{ lastUpdated | date: 'short' }}</span>
                                <div class="flex items-center">
                                    <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1"></div>
                                    <span>Live</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col sm:flex-row gap-3">
                            <button (click)="downloadExcel()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2 group">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <span>Excel</span>
                            </button>

                            <button (click)="downloadPDF()" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2 group">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                                </svg>
                                <span>PDF</span>
                            </button>

                            <button
                                (click)="refreshData()"
                                [disabled]="isRefreshing"
                                class="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
                            >
                                <svg class="w-5 h-5" [class.animate-spin]="isRefreshing" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                <span>{{ isRefreshing ? 'Refreshing...' : 'Refresh' }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Filters & Search</h2>

                    <form [formGroup]="filterForm" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        <div class="lg:col-span-2">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Search</label>
                            <div class="relative">
                                <input
                                    type="text"
                                    formControlName="search"
                                    placeholder="Search orders, customers, communities, items..."
                                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                                <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Customer Type</label>
                            <select formControlName="customerType" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">All Types</option>
                                <option value="Individual">Individual</option>
                                <option value="Business">Business</option>
                                <option value="Community">Community</option>
                            </select>
                        </div>

                        <div *ngIf="filterForm.get('customerType')?.value === 'Community'">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Community Name</label>
                            <select formControlName="communityName" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">All Communities</option>
                                <option value="Green Valley Estates">Green Valley Estates</option>
                                <option value="Oakwood Residences">Oakwood Residences</option>
                                <option value="Maplewood Heights">Maplewood Heights</option>
                                <option value="Pinebrook Gardens">Pinebrook Gardens</option>
                                <option value="Riverside Community">Riverside Community</option>
                                <option value="Sunset Hills">Sunset Hills</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                            <select formControlName="status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input type="date" formControlName="startDate" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input type="date" formControlName="endDate" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                    </form>

                    <div class="flex flex-wrap gap-2 mt-4">
                        <button (click)="clearFilters()" class="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors">Clear All Filters</button>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Total Orders</p>
                                <p class="text-3xl font-bold text-gray-900">{{ getTotalOrders() }}</p>
                            </div>
                            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Total Value</p>
                                <p class="text-3xl font-bold text-gray-900">{{ getTotalValue() | currency }}</p>
                            </div>
                            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                    ></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Pending Orders</p>
                                <p class="text-3xl font-bold text-gray-900">{{ getPendingOrders() }}</p>
                            </div>
                            <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Delivered</p>
                                <p class="text-3xl font-bold text-gray-900">{{ getDeliveredOrders() }}</p>
                            </div>
                            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900">Purchase Orders</h3>
                        <p class="text-sm text-gray-600 mt-1">Showing {{ filteredOrders.length }} of {{ purchaseOrders.length }} orders</p>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Community</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr *ngFor="let order of filteredOrders; trackBy: trackByOrderId" class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div class="text-sm font-medium text-gray-900">#{{ order.orderNumber }}</div>
                                            <div class="text-sm text-gray-500">{{ order.customerType }}</div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-gray-900">{{ order.customerName }}</div>
                                        <div class="text-sm text-gray-500">{{ order.supplier }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">{{ order.communityName }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">{{ order.orderDate | date: 'short' }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">{{ order.deliveryDate | date: 'short' }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span [ngClass]="getStatusClass(order.status)" class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                                            {{ order.status }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-gray-900">{{ order.total | currency }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">{{ order.items.join(', ') }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div class="flex space-x-2">
                                            <button (click)="viewOrder(order)" class="text-blue-600 hover:text-blue-900 transition-colors">View</button>
                                            <button (click)="editOrder(order)" class="text-green-600 hover:text-green-900 transition-colors">Edit</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                        <div class="flex items-center justify-between">
                            <div class="flex-1 flex justify-between sm:hidden">
                                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Previous</button>
                                <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Next</button>
                            </div>
                            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <p class="text-sm text-gray-700">
                                    Showing <span class="font-medium">1</span> to <span class="font-medium">{{ filteredOrders.length }}</span> of <span class="font-medium">{{ filteredOrders.length }}</span> results
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center pt-6 border-t">
                    <button
                        type="button"
                        routerLink="../"
                        class="inline-flex items-center 
                                    px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2 2z"
                            />
                        </svg>
                        Back to Reports
                    </button>
                </div>
            </div>
        </div>
    `
})
export class PurchaseOrders implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    filterForm: FormGroup;
    purchaseOrders: PurchaseOrder[] = [];
    filteredOrders: PurchaseOrder[] = [];
    totalOrders = 0;
    lastUpdated = new Date();
    isRefreshing = false;

    constructor(
        private fb: FormBuilder,
        private datePipe: DatePipe
    ) {
        this.filterForm = this.fb.group({
            search: [''],
            customerType: [''],
            communityName: [''], // Added communityName to filters
            status: [''],
            startDate: [''],
            endDate: ['']
        });
    }

    ngOnInit() {
        this.initializeMockData();
        this.setupFilters();
        this.setupRealTimeUpdates();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initializeMockData() {
        // Generate mock data
        this.purchaseOrders = [
            {
                id: '1',
                orderNumber: 'PO-2025-001',
                customerType: 'Individual',
                customerName: 'Alice Smith',
                communityName: 'Green Valley Estates',
                orderDate: new Date('2025-06-01'),
                deliveryDate: new Date('2025-06-15'),
                status: 'Pending',
                total: 15000,
                items: ['Croissant', 'Coffee', 'Sandwich'],
                supplier: 'Supplier A',
                priority: 'High'
            },
            {
                id: '2',
                orderNumber: 'PO-2025-002',
                customerType: 'Business',
                customerName: 'XYZ Solutions',
                communityName: 'Oakwood Residences',
                orderDate: new Date('2025-06-05'),
                deliveryDate: new Date('2025-06-20'),
                status: 'Approved',
                total: 32000,
                items: ['Milk', 'Bread', 'Eggs', 'Butter'],
                supplier: 'Supplier B',
                priority: 'Medium'
            },
            {
                id: '3',
                orderNumber: 'PO-2025-003',
                customerType: 'Community',
                customerName: 'Maplewood Residents Assoc.',
                communityName: 'Maplewood Heights',
                orderDate: new Date('2025-06-10'),
                deliveryDate: new Date('2025-06-25'),
                status: 'Shipped',
                total: 75000,
                items: ['Laptops', 'Monitors', 'Keyboards', 'Mice'],
                supplier: 'Supplier C',
                priority: 'High'
            },
            {
                id: '4',
                orderNumber: 'PO-2025-004',
                customerType: 'Individual',
                customerName: 'Bob Johnson',
                communityName: 'Pinebrook Gardens',
                orderDate: new Date('2025-06-12'),
                deliveryDate: new Date('2025-06-18'),
                status: 'Delivered',
                total: 8500,
                items: ['Donuts', 'Muffins', 'Juice'],
                supplier: 'Supplier A',
                priority: 'Low'
            },
            {
                id: '5',
                orderNumber: 'PO-2025-005',
                customerType: 'Business',
                customerName: 'Global Logistics',
                communityName: 'Riverside Community',
                orderDate: new Date('2025-06-14'),
                deliveryDate: new Date('2025-06-30'),
                status: 'Cancelled',
                total: 45000,
                items: ['Warehouse Racks', 'Pallet Jacks'],
                supplier: 'Supplier D',
                priority: 'Medium'
            },
            {
                id: '6',
                orderNumber: 'PO-2025-006',
                customerType: 'Community',
                customerName: 'Sunset Hills Management',
                communityName: 'Sunset Hills',
                orderDate: new Date('2025-06-02'),
                deliveryDate: new Date('2025-06-16'),
                status: 'Pending',
                total: 20000,
                items: ['Gardening Tools', 'Fertilizer'],
                supplier: 'Supplier E',
                priority: 'Medium'
            },
            {
                id: '7',
                orderNumber: 'PO-2025-007',
                customerType: 'Individual',
                customerName: 'Charlie Brown',
                communityName: 'Green Valley Estates',
                orderDate: new Date('2025-06-03'),
                deliveryDate: new Date('2025-06-17'),
                status: 'Approved',
                total: 5000,
                items: ['Books', 'Stationery'],
                supplier: 'Supplier F',
                priority: 'Low'
            },
            {
                id: '8',
                orderNumber: 'PO-2025-008',
                customerType: 'Business',
                customerName: 'Innovate Tech',
                communityName: 'Oakwood Residences',
                orderDate: new Date('2025-06-07'),
                deliveryDate: new Date('2025-06-22'),
                status: 'Shipped',
                total: 120000,
                items: ['Servers', 'Networking Equipment'],
                supplier: 'Supplier G',
                priority: 'High'
            }
        ];
        this.filteredOrders = [...this.purchaseOrders];
        this.totalOrders = this.purchaseOrders.length;
    }

    private setupFilters() {
        this.filterForm.valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(() => {
            this.applyFilters();
        });
    }

    private setupRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        interval(30000)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.lastUpdated = new Date();
                // In a real app, you would fetch new data from your API here
            });
    }

    private applyFilters() {
        const filters = this.filterForm.value;
        this.filteredOrders = this.purchaseOrders.filter((order) => {
            const matchesSearch =
                !filters.search ||
                order.orderNumber.toLowerCase().includes(filters.search.toLowerCase()) ||
                order.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
                order.communityName.toLowerCase().includes(filters.search.toLowerCase()) ||
                order.items.some((item) => item.toLowerCase().includes(filters.search.toLowerCase()));

            const matchesCustomerType = !filters.customerType || order.customerType === filters.customerType;
            // Only apply communityName filter if customerType is 'Community'
            const matchesCommunityName = !(filters.customerType === 'Community') || !filters.communityName || order.communityName === filters.communityName;

            const matchesStatus = !filters.status || order.status === filters.status;

            const matchesStartDate = !filters.startDate || new Date(order.orderDate) >= new Date(filters.startDate);
            const matchesEndDate = !filters.endDate || new Date(order.orderDate) <= new Date(filters.endDate);

            return matchesSearch && matchesCustomerType && matchesCommunityName && matchesStatus && matchesStartDate && matchesEndDate;
        });
    }

    clearFilters() {
        this.filterForm.reset();
    }

    refreshData() {
        this.isRefreshing = true;
        // Simulate API call
        setTimeout(() => {
            this.lastUpdated = new Date();
            this.isRefreshing = false;
            // In a real app, you would fetch fresh data from your API here
        }, 2000);
    }

    downloadExcel() {
        const headers = ['Order Number', 'Customer Type', 'Customer Name', 'Community Name', 'Order Date', 'Delivery Date', 'Status', 'Total', 'Items', 'Supplier'];
        const csvContent = [
            headers.join(','),
            ...this.filteredOrders.map((order) =>
                [
                    order.orderNumber,
                    order.customerType,
                    order.customerName,
                    order.communityName,
                    this.datePipe.transform(order.orderDate, 'short'),
                    this.datePipe.transform(order.deliveryDate, 'short'),
                    order.status,
                    order.total,
                    `"${order.items.join(';')}"`,
                    order.supplier
                ].join(',')
            )
        ].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `purchase-orders-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        window.URL.revokeObjectURL(url);
    }

    downloadPDF() {
        const printContent = `
      <html>
        <head>
          <title>Purchase Orders Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Purchase Orders Report</h1>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <p>Total Orders: ${this.filteredOrders.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Type</th>
                <th>Community</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Total</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              ${this.filteredOrders
                  .map(
                      (order) => `
                <tr>
                  <td>${order.orderNumber}</td>
                  <td>${order.customerName}</td>
                  <td>${order.customerType}</td>
                  <td>${order.communityName}</td>
                  <td>${this.datePipe.transform(order.orderDate, 'short')}</td>
                  <td>${order.status}</td>
                  <td>$${order.total.toLocaleString()}</td>
                  <td>${order.items.join(', ')}</td>
                </tr>
              `
                  )
                  .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(printContent);
            printWindow.document.close();
            printWindow.print();
        }
    }

    getStatusClass(status: string): string {
        const classes = {
            Pending: 'bg-yellow-100 text-yellow-800',
            Approved: 'bg-blue-100 text-blue-800',
            Shipped: 'bg-purple-100 text-purple-800',
            Delivered: 'bg-green-100 text-green-800',
            Cancelled: 'bg-red-100 text-red-800'
        };
        return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800';
    }

    getTotalOrders(): number {
        return this.filteredOrders.length;
    }

    getTotalValue(): number {
        return this.filteredOrders.reduce((sum, order) => sum + order.total, 0);
    }

    getPendingOrders(): number {
        return this.filteredOrders.filter((order) => order.status === 'Pending').length;
    }

    getDeliveredOrders(): number {
        return this.filteredOrders.filter((order) => order.status === 'Delivered').length;
    }

    // New: View Order Functionality
    viewOrder(order: PurchaseOrder) {
        let details = `Order Details:\n\n`;
        details += `Order Number: ${order.orderNumber}\n`;
        details += `Customer Type: ${order.customerType}\n`;
        details += `Customer Name: ${order.customerName}\n`;
        details += `Community Name: ${order.communityName}\n`;
        details += `Order Date: ${this.datePipe.transform(order.orderDate, 'short')}\n`;
        details += `Delivery Date: ${this.datePipe.transform(order.deliveryDate, 'short')}\n`;
        details += `Status: ${order.status}\n`;
        details += `Total: ${this.datePipe.transform(order.total, 'currency')}\n`;
        details += `Items: ${order.items.join(', ')}\n`;
        details += `Supplier: ${order.supplier}\n`;
        details += `Priority: ${order.priority}\n`;
        alert(details);
    }

    // New: Edit Order Functionality
    editOrder(order: PurchaseOrder) {
        alert(`Edit functionality for Order #${order.orderNumber}. In a real application, this would open a form to modify the order details.`);
    }

    trackByOrderId(index: number, order: PurchaseOrder): string {
        return order.id;
    }
}
