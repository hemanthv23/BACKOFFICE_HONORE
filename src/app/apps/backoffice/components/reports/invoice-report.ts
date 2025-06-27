import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

interface InvoiceData {
    id: string;
    customerName: string;
    customerType: 'individual' | 'business' | 'community';
    orderDate: Date;
    status: 'paid' | 'pending' | 'overdue' | 'cancelled';
    amount: number;
    dueDate: Date;
}

@Component({
    selector: 'app-invoice-reports',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
    providers: [DatePipe],
    template: `
        <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <!-- Header Section -->
            <div class="bg-white shadow-lg border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900 mb-2">Invoice Reports</h1>
                            <p class="text-gray-600">Manage and track payment statuses across all customer types</p>
                        </div>
                        <div class="mt-4 sm:mt-0 flex space-x-3">
                            <button
                                (click)="exportToPDF()"
                                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
                            >
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Get Report (PDF)
                            </button>
                            <button
                                (click)="clearFilters()"
                                class="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
                            >
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Filters Section -->
                <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Filters</h2>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        <!-- Customer Type Filter -->
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">Customer Type</label>
                            <select [(ngModel)]="selectedCustomerType" (ngModelChange)="onFilterChange()" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                                <option value="">All Customer Types</option>
                                <option value="individual">Individual</option>
                                <option value="business">Business</option>
                                <option value="community">Community</option>
                            </select>
                        </div>

                        <!-- Date Type Filter -->
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">Date Type</label>
                            <select [(ngModel)]="selectedDateType" (ngModelChange)="onFilterChange()" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                                <option value="orderDate">Order Date</option>
                                <option value="dueDate">Due Date</option>
                            </select>
                        </div>

                        <!-- Order Status Filter -->
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">Order Status</label>
                            <select [(ngModel)]="selectedOrderStatus" (ngModelChange)="onFilterChange()" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                                <option value="">Select Order Status</option>
                                <option value="paid">Paid</option>
                                <option value="pending">Pending</option>
                                <option value="overdue">Overdue</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <!-- Start Date -->
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">Start Date</label>
                            <input
                                type="date"
                                [(ngModel)]="startDate"
                                (ngModelChange)="onFilterChange()"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="dd/mm/yyyy"
                            />
                        </div>

                        <!-- End Date -->
                        <div class="space-y-2">
                            <label class="block text-sm font-medium text-gray-700">End Date</label>
                            <input
                                type="date"
                                [(ngModel)]="endDate"
                                (ngModelChange)="onFilterChange()"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="dd/mm/yyyy"
                            />
                        </div>
                    </div>
                </div>

                <!-- Results Section -->
                <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                    <!-- Summary Cards -->
                    <div class="p-6 border-b border-gray-200">
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="ml-3">
                                        <p class="text-sm font-medium text-green-800">Paid</p>
                                        <p class="text-lg font-semibold text-green-900">{{ getSummary().paid }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="ml-3">
                                        <p class="text-sm font-medium text-yellow-800">Pending</p>
                                        <p class="text-lg font-semibold text-yellow-900">{{ getSummary().pending }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-red-50 p-4 rounded-lg border border-red-200">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                    clip-rule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="ml-3">
                                        <p class="text-sm font-medium text-red-800">Overdue</p>
                                        <p class="text-lg font-semibold text-red-900">{{ getSummary().overdue }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0">
                                        <div class="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                                            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fill-rule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clip-rule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    <div class="ml-3">
                                        <p class="text-sm font-medium text-gray-800">Total</p>
                                        <p class="text-lg font-semibold text-gray-900">{{ filteredInvoices.length }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Table Section -->
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr *ngFor="let invoice of filteredInvoices; trackBy: trackByInvoiceId" class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ invoice.id }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ invoice.customerName }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                            [ngClass]="{
                                                'bg-blue-100 text-blue-800': invoice.customerType === 'individual',
                                                'bg-purple-100 text-purple-800': invoice.customerType === 'business',
                                                'bg-green-100 text-green-800': invoice.customerType === 'community'
                                            }"
                                        >
                                            {{ invoice.customerType | titlecase }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{{ invoice.amount | number: '1.2-2' }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ invoice.orderDate | date: 'dd/MM/yyyy' }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ invoice.dueDate | date: 'dd/MM/yyyy' }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                                            [ngClass]="{
                                                'bg-green-100 text-green-800': invoice.status === 'paid',
                                                'bg-yellow-100 text-yellow-800': invoice.status === 'pending',
                                                'bg-red-100 text-red-800': invoice.status === 'overdue',
                                                'bg-gray-100 text-gray-800': invoice.status === 'cancelled'
                                            }"
                                        >
                                            {{ invoice.status | titlecase }}
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Empty State -->
                    <div *ngIf="filteredInvoices.length === 0" class="text-center py-12">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900">No invoices found</h3>
                        <p class="mt-1 text-sm text-gray-500">Try adjusting your filters to see more results.</p>
                    </div>

                    <!-- Pagination -->
                    <div *ngIf="filteredInvoices.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                        <div class="flex items-center justify-between">
                            <div class="flex-1 flex justify-between sm:hidden">
                                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Previous</button>
                                <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Next</button>
                            </div>
                            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <p class="text-sm text-gray-700">
                                        Showing <span class="font-medium">{{ filteredInvoices.length }}</span> results
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Back Button -->
                <div class="text-center pt-8">
                    <button
                        type="button"
                        routerLink="../"
                        class="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
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
export class InvoiceReports implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    // Filter properties
    selectedCustomerType: string = '';
    selectedDateType: string = 'orderDate';
    selectedOrderStatus: string = '';
    startDate: string = '';
    endDate: string = '';

    // Data properties
    invoices: InvoiceData[] = [];
    filteredInvoices: InvoiceData[] = [];

    constructor(private datePipe: DatePipe) {}

    ngOnInit() {
        this.loadSampleData();
        this.applyFilters();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadSampleData() {
        // Sample data with different customer types
        this.invoices = [
            {
                id: 'INV-001',
                customerName: 'John Doe',
                customerType: 'individual',
                orderDate: new Date('2024-01-15'),
                status: 'paid',
                amount: 1250.0,
                dueDate: new Date('2024-02-15')
            },
            {
                id: 'INV-002',
                customerName: 'TechCorp Ltd',
                customerType: 'business',
                orderDate: new Date('2024-01-20'),
                status: 'pending',
                amount: 5500.0,
                dueDate: new Date('2024-02-20')
            },
            {
                id: 'INV-003',
                customerName: 'Community Center',
                customerType: 'community',
                orderDate: new Date('2024-01-25'),
                status: 'overdue',
                amount: 750.0,
                dueDate: new Date('2024-02-10')
            },
            {
                id: 'INV-004',
                customerName: 'Sarah Wilson',
                customerType: 'individual',
                orderDate: new Date('2024-02-01'),
                status: 'paid',
                amount: 980.0,
                dueDate: new Date('2024-03-01')
            },
            {
                id: 'INV-005',
                customerName: 'Green Solutions Inc',
                customerType: 'business',
                orderDate: new Date('2024-02-05'),
                status: 'pending',
                amount: 3200.0,
                dueDate: new Date('2024-03-05')
            },
            {
                id: 'INV-006',
                customerName: 'Local Sports Club',
                customerType: 'community',
                orderDate: new Date('2024-02-10'),
                status: 'paid',
                amount: 1100.0,
                dueDate: new Date('2024-03-10')
            },
            {
                id: 'INV-007',
                customerName: 'Mike Johnson',
                customerType: 'individual',
                orderDate: new Date('2024-02-15'),
                status: 'cancelled',
                amount: 450.0,
                dueDate: new Date('2024-03-15')
            },
            {
                id: 'INV-008',
                customerName: 'Innovation Labs',
                customerType: 'business',
                orderDate: new Date('2024-02-20'),
                status: 'overdue',
                amount: 7800.0,
                dueDate: new Date('2024-03-05')
            }
        ];
    }

    onFilterChange() {
        // Real-time filtering with debounce
        setTimeout(() => {
            this.applyFilters();
        }, 100);
    }

    private applyFilters() {
        this.filteredInvoices = this.invoices.filter((invoice) => {
            // Customer type filter
            if (this.selectedCustomerType && invoice.customerType !== this.selectedCustomerType) {
                return false;
            }

            // Status filter
            if (this.selectedOrderStatus && invoice.status !== this.selectedOrderStatus) {
                return false;
            }

            // Date range filter
            const compareDate = this.selectedDateType === 'orderDate' ? invoice.orderDate : invoice.dueDate;

            if (this.startDate) {
                const startDate = new Date(this.startDate);
                if (compareDate < startDate) return false;
            }

            if (this.endDate) {
                const endDate = new Date(this.endDate);
                if (compareDate > endDate) return false;
            }

            return true;
        });
    }

    getSummary() {
        return {
            paid: this.filteredInvoices.filter((i) => i.status === 'paid').length,
            pending: this.filteredInvoices.filter((i) => i.status === 'pending').length,
            overdue: this.filteredInvoices.filter((i) => i.status === 'overdue').length,
            cancelled: this.filteredInvoices.filter((i) => i.status === 'cancelled').length
        };
    }

    clearFilters() {
        this.selectedCustomerType = '';
        this.selectedDateType = 'orderDate';
        this.selectedOrderStatus = '';
        this.startDate = '';
        this.endDate = '';
        this.applyFilters();
    }

    exportToPDF() {
        // Implement PDF export functionality
        console.log('Exporting to PDF...', this.filteredInvoices);
        // You would integrate with a PDF library like jsPDF here
    }

    trackByInvoiceId(index: number, invoice: InvoiceData): string {
        return invoice.id;
    }
}
