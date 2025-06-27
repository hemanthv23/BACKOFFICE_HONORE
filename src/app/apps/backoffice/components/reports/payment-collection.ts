import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

// You'll need to install jsPDF and html2canvas
// npm install jspdf html2canvas
// npm install --save-dev @types/jspdf
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PaymentRecord {
    id: string;
    customerName: string;
    customerType: 'individual' | 'community' | 'business';
    invoiceNumber: string;
    amount: number;
    dueDate: Date;
    paidDate?: Date;
    status: 'paid' | 'pending' | 'overdue';
    paymentMethod?: string;
}

interface Customer {
    id: string;
    name: string;
    type: 'individual' | 'community' | 'business';
}

@Component({
    selector: 'app-payment-collection',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
    providers: [DatePipe],
    template: `
        <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div class="bg-white shadow-sm border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900 mb-2">Payment Collection Report</h1>
                            <p class="text-gray-600">Track and manage payment collections across all customer types.</p>
                        </div>
                        <div class="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
                            <button
                                (click)="exportToPDF()"
                                [disabled]="isGeneratingPDF"
                                class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
                            >
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                {{ isGeneratingPDF ? 'Generating...' : 'Export PDF' }}
                            </button>
                            <button
                                (click)="exportToCSV()"
                                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                Export CSV
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-8">
                    <h2 class="text-xl font-semibold text-gray-900 mb-6">Report Filters</h2>

                    <form [formGroup]="filterForm" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label for="startDate" class="block text-sm font-medium text-gray-700 mb-2"> Start Date </label>
                                <input type="date" id="startDate" formControlName="startDate" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                            </div>

                            <div>
                                <label for="endDate" class="block text-sm font-medium text-gray-700 mb-2"> End Date </label>
                                <input type="date" id="endDate" formControlName="endDate" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                            </div>

                            <div>
                                <label for="customerType" class="block text-sm font-medium text-gray-700 mb-2"> Customer Type </label>
                                <select id="customerType" formControlName="customerType" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                                    <option value="">All Types</option>
                                    <option value="individual">Individual</option>
                                    <option value="community">Community</option>
                                    <option value="business">Business</option>
                                </select>
                            </div>

                            <div>
                                <label for="status" class="block text-sm font-medium text-gray-700 mb-2"> Payment Status </label>
                                <select id="status" formControlName="status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
                                    <option value="">All Statuses</option>
                                    <option value="paid">Paid</option>
                                    <option value="pending">Pending</option>
                                    <option value="overdue">Overdue</option>
                                </select>
                            </div>
                        </div>

                        <div class="relative">
                            <label for="customerSearch" class="block text-sm font-medium text-gray-700 mb-2"> Search Customer </label>
                            <div class="relative">
                                <input
                                    type="text"
                                    id="customerSearch"
                                    formControlName="customerSearch"
                                    placeholder="Type customer name..."
                                    class="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    (input)="onCustomerSearch($event)"
                                />
                                <svg class="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>

                            <div *ngIf="filteredCustomers.length > 0 && showCustomerDropdown" class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                <div *ngFor="let customer of filteredCustomers" (click)="selectCustomer(customer)" class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between">
                                    <span>{{ customer.name }}</span>
                                    <span
                                        class="text-xs px-2 py-1 rounded-full text-white"
                                        [ngClass]="{
                                            'bg-blue-500': customer.type === 'individual',
                                            'bg-green-500': customer.type === 'community',
                                            'bg-purple-500': customer.type === 'business'
                                        }"
                                    >
                                        {{ customer.type | titlecase }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-col sm:flex-row gap-4">
                            <button
                                type="button"
                                (click)="applyFilters()"
                                class="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                                Apply Filters
                            </button>

                            <button
                                type="button"
                                (click)="clearFilters()"
                                class="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            >
                                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                                Clear Filters
                            </button>
                        </div>
                    </form>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <div class="flex items-center">
                            <div class="p-3 rounded-full bg-green-100 text-green-600">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Total Paid</p>
                                <p class="text-2xl font-bold text-gray-900">{{ summary.totalPaid | currency: 'INR' : 'symbol' : '1.2-2' }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <div class="flex items-center">
                            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Pending</p>
                                <p class="text-2xl font-bold text-gray-900">{{ summary.totalPending | currency: 'INR' : 'symbol' : '1.2-2' }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <div class="flex items-center">
                            <div class="p-3 rounded-full bg-red-100 text-red-600">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Overdue</p>
                                <p class="text-2xl font-bold text-gray-900">{{ summary.totalOverdue | currency: 'INR' : 'symbol' : '1.2-2' }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <div class="flex items-center">
                            <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2 2z"
                                    ></path>
                                </svg>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-600">Total Records</p>
                                <p class="text-2xl font-bold text-gray-900">{{ filteredPayments.length }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="payment-report-content" class="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900">Payment Records</h3>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr *ngFor="let payment of paginatedPayments; trackBy: trackByPaymentId" class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div>
                                                <div class="text-sm font-medium text-gray-900">{{ payment.customerName }}</div>
                                                <div class="text-sm text-gray-500">
                                                    <span
                                                        class="px-2 py-1 text-xs rounded-full text-white"
                                                        [ngClass]="{
                                                            'bg-blue-500': payment.customerType === 'individual',
                                                            'bg-green-500': payment.customerType === 'community',
                                                            'bg-purple-500': payment.customerType === 'business'
                                                        }"
                                                    >
                                                        {{ payment.customerType | titlecase }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ payment.invoiceNumber }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ payment.amount | currency: 'INR' : 'symbol' : '1.2-2' }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ payment.dueDate | date: 'MMM dd,YYYY' }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span
                                            class="px-2 py-1 text-xs font-medium rounded-full"
                                            [ngClass]="{
                                                'bg-green-100 text-green-800': payment.status === 'paid',
                                                'bg-yellow-100 text-yellow-800': payment.status === 'pending',
                                                'bg-red-100 text-red-800': payment.status === 'overdue'
                                            }"
                                        >
                                            {{ payment.status | titlecase }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button (click)="viewPaymentDetails(payment)" class="text-blue-600 hover:text-blue-900 mr-3">View</button>
                                        <button *ngIf="payment.status !== 'paid'" (click)="markAsPaid(payment)" class="text-green-600 hover:text-green-900">Mark Paid</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div class="flex-1 flex justify-between sm:hidden">
                            <button
                                (click)="previousPage()"
                                [disabled]="currentPage === 1"
                                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                (click)="nextPage()"
                                [disabled]="currentPage === totalPages"
                                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p class="text-sm text-gray-700">
                                    Showing <span class="font-medium">{{ startIndex + 1 }}</span> to <span class="font-medium">{{ endIndex }}</span> of <span class="font-medium">{{ filteredPayments.length }}</span> results
                                </p>
                            </div>
                            <div>
                                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        (click)="previousPage()"
                                        [disabled]="currentPage === 1"
                                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        *ngFor="let page of getPageNumbers()"
                                        (click)="goToPage(page)"
                                        [class]="
                                            'relative inline-flex items-center px-4 py-2 border text-sm font-medium ' +
                                            (page === currentPage ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50')
                                        "
                                    >
                                        {{ page }}
                                    </button>
                                    <button
                                        (click)="nextPage()"
                                        [disabled]="currentPage === totalPages"
                                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center pt-6 mt-8">
                    <button
                        type="button"
                        routerLink="../"
                        class="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                    >
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2 2z"
                            ></path>
                        </svg>
                        Back to Reports
                    </button>
                </div>
            </div>
        </div>

        <div *ngIf="showViewModal && selectedPaymentForView" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
            <div class="relative p-8 bg-white w-full max-w-md mx-auto rounded-lg shadow-xl">
                <h3 class="text-2xl font-bold text-gray-900 mb-6">Payment Details</h3>

                <div class="space-y-4 text-gray-700">
                    <div>
                        <p class="text-sm font-semibold">Customer Name:</p>
                        <p class="text-base">{{ selectedPaymentForView.customerName }}</p>
                    </div>
                    <div>
                        <p class="text-sm font-semibold">Customer Type:</p>
                        <p class="text-base">{{ selectedPaymentForView.customerType | titlecase }}</p>
                    </div>
                    <div>
                        <p class="text-sm font-semibold">Invoice Number:</p>
                        <p class="text-base">{{ selectedPaymentForView.invoiceNumber }}</p>
                    </div>
                    <div>
                        <p class="text-sm font-semibold">Amount:</p>
                        <p class="text-base">{{ selectedPaymentForView.amount | currency: 'INR' : 'symbol' : '1.2-2' }}</p>
                    </div>
                    <div>
                        <p class="text-sm font-semibold">Due Date:</p>
                        <p class="text-base">{{ selectedPaymentForView.dueDate | date: 'mediumDate' }}</p>
                    </div>
                    <div *ngIf="selectedPaymentForView.paidDate">
                        <p class="text-sm font-semibold">Paid Date:</p>
                        <p class="text-base">{{ selectedPaymentForView.paidDate | date: 'mediumDate' }}</p>
                    </div>
                    <div>
                        <p class="text-sm font-semibold">Status:</p>
                        <p class="text-base">
                            <span
                                class="px-2 py-1 text-xs font-medium rounded-full"
                                [ngClass]="{
                                    'bg-green-100 text-green-800': selectedPaymentForView.status === 'paid',
                                    'bg-yellow-100 text-yellow-800': selectedPaymentForView.status === 'pending',
                                    'bg-red-100 text-red-800': selectedPaymentForView.status === 'overdue'
                                }"
                            >
                                {{ selectedPaymentForView.status | titlecase }}
                            </span>
                        </p>
                    </div>
                    <div *ngIf="selectedPaymentForView.paymentMethod">
                        <p class="text-sm font-semibold">Payment Method:</p>
                        <p class="text-base">{{ selectedPaymentForView.paymentMethod }}</p>
                    </div>
                </div>

                <div class="mt-8 flex justify-end">
                    <button (click)="closeViewModal()" class="px-6 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors">Close</button>
                </div>
            </div>
        </div>
    `
})
export class PaymentCollection implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    filterForm!: FormGroup;
    paymentRecords: PaymentRecord[] = [];
    filteredPayments: PaymentRecord[] = [];
    paginatedPayments: PaymentRecord[] = [];

    customers: Customer[] = [];
    filteredCustomers: Customer[] = [];
    showCustomerDropdown = false;
    selectedCustomer: Customer | null = null;

    // Pagination
    currentPage = 1;
    pageSize = 10;
    totalPages = 0;

    // Summary
    summary = {
        totalPaid: 0,
        totalPending: 0,
        totalOverdue: 0
    };
    // PDF Generation
    isGeneratingPDF = false;

    // View Modal properties
    showViewModal = false;
    selectedPaymentForView: PaymentRecord | null = null;

    constructor(
        private fb: FormBuilder,
        private datePipe: DatePipe
    ) {}

    ngOnInit() {
        this.initializeForm();
        this.loadMockData();
        this.applyFilters();

        // Watch for form changes
        this.filterForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.applyFilters();
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initializeForm() {
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

        this.filterForm = this.fb.group({
            startDate: [this.datePipe.transform(lastMonth, 'yyyy-MM-dd')],
            endDate: [this.datePipe.transform(today, 'yyyy-MM-dd')],
            customerType: [''],
            status: [''],
            customerSearch: ['']
        });
    }

    private loadMockData() {
        // Mock customers
        this.customers = [
            { id: '1', name: 'Malini Malik', type: 'individual' },
            { id: '2', name: 'Kanika Vaish', type: 'individual' },
            { id: '3', name: 'Mahesh', type: 'individual' },
            { id: '4', name: 'Nithin - Flax cafe', type: 'business' },
            { id: '5', name: 'Sabrina Zia Ahmed', type: 'individual' },
            { id: '6', name: '19 Bright farms', type: 'business' },
            { id: '7', name: 'Aadarsh', type: 'individual' },
            { id: '8', name: 'Aadarsh Sivaraman', type: 'individual' },
            { id: '9', name: 'Aadvait Pillai', type: 'individual' },
            { id: '10', name: 'Anshu Juhnjunwala', type: 'individual' },
            { id: '11', name: 'Joseph George', type: 'individual' },
            { id: '12', name: 'Abhijit Nagendranath', type: 'community' },
            { id: '13', name: 'Joseph Kim', type: 'individual' },
            { id: '14', name: 'Green Valley Community', type: 'community' },
            { id: '15', name: 'Tech Solutions Ltd', type: 'business' }
        ];
        // Mock payment records
        this.paymentRecords = [
            {
                id: '1',
                customerName: 'Malini Malik',
                customerType: 'individual',
                invoiceNumber: 'INV-2024-001',
                amount: 1250.0,
                dueDate: new Date('2024-01-15'),
                paidDate: new Date('2024-01-10'),
                status: 'paid',
                paymentMethod: 'Credit Card'
            },
            {
                id: '2',
                customerName: 'Kanika Vaish',
                customerType: 'individual',
                invoiceNumber: 'INV-2024-002',
                amount: 890.5,
                dueDate: new Date('2024-01-20'),
                status: 'pending'
            },
            {
                id: '3',
                customerName: 'Nithin - Flax cafe',
                customerType: 'business',
                invoiceNumber: 'INV-2024-003',
                amount: 3200.0,
                dueDate: new Date('2024-01-10'),
                status: 'overdue'
            },
            {
                id: '4',
                customerName: '19 Bright farms',
                customerType: 'business',
                invoiceNumber: 'INV-2024-004',
                amount: 5500.0,
                dueDate: new Date('2024-01-25'),
                paidDate: new Date('2024-01-23'),
                status: 'paid',
                paymentMethod: 'Bank Transfer'
            },
            {
                id: '5',
                customerName: 'Green Valley Community',
                customerType: 'community',
                invoiceNumber: 'INV-2024-005',
                amount: 2750.0,
                dueDate: new Date('2024-01-30'),
                status: 'pending'
            },
            {
                id: '6',
                customerName: 'Aadarsh Sivaraman',
                customerType: 'individual',
                invoiceNumber: 'INV-2024-006',
                amount: 675.25,
                dueDate: new Date('2024-02-05'),
                status: 'pending'
            },
            {
                id: '7',
                customerName: 'Tech Solutions Ltd',
                customerType: 'business',
                invoiceNumber: 'INV-2024-007',
                amount: 8900.0,
                dueDate: new Date('2024-02-10'),
                paidDate: new Date('2024-02-08'),
                status: 'paid',
                paymentMethod: 'Check'
            },
            {
                id: '8',
                customerName: 'Joseph George',
                customerType: 'individual',
                invoiceNumber: 'INV-2024-008',
                amount: 450.0,
                dueDate: new Date('2024-01-05'),
                status: 'overdue'
            },
            {
                id: '9',
                customerName: 'Abhijit Nagendranath',
                customerType: 'community',
                invoiceNumber: 'INV-2024-009',
                amount: 1800.0,
                dueDate: new Date('2024-02-15'),
                status: 'pending'
            },
            {
                id: '10',
                customerName: 'Sabrina Zia Ahmed',
                customerType: 'individual',
                invoiceNumber: 'INV-2024-010',
                amount: 320.75,
                dueDate: new Date('2024-01-28'),
                paidDate: new Date('2024-01-25'),
                status: 'paid',
                paymentMethod: 'Online Transfer'
            }
        ];
    }

    onCustomerSearch(event: any) {
        const searchTerm = event.target.value.toLowerCase();
        if (searchTerm.length > 0) {
            this.filteredCustomers = this.customers.filter((customer) => customer.name.toLowerCase().includes(searchTerm));
            this.showCustomerDropdown = true;
        } else {
            this.filteredCustomers = [];
            this.showCustomerDropdown = false;
        }
    }

    selectCustomer(customer: Customer) {
        this.selectedCustomer = customer;
        this.filterForm.patchValue({
            customerSearch: customer.name,
            customerType: customer.type
        });
        this.showCustomerDropdown = false;
        this.filteredCustomers = [];
    }

    applyFilters() {
        const filters = this.filterForm.value;
        this.filteredPayments = this.paymentRecords.filter((payment) => {
            // Date filters
            if (filters.startDate) {
                const startDate = new Date(filters.startDate);
                if (payment.dueDate < startDate) return false;
            }

            if (filters.endDate) {
                const endDate = new Date(filters.endDate);
                if (payment.dueDate > endDate) return false;
            }

            // Customer type filter
            if (filters.customerType && payment.customerType !== filters.customerType) {
                return false;
            }

            // Status filter
            if (filters.status && payment.status !== filters.status) {
                return false;
            }

            // Customer search filter
            if (filters.customerSearch) {
                const searchTerm = filters.customerSearch.toLowerCase();
                if (!payment.customerName.toLowerCase().includes(searchTerm)) {
                    return false;
                }
            }

            return true;
        });

        this.calculateSummary();
        this.updatePagination();
    }

    clearFilters() {
        this.filterForm.reset();
        this.selectedCustomer = null;
        this.showCustomerDropdown = false;
        this.filteredCustomers = [];

        // Reset to default date range
        const today = new Date();
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

        this.filterForm.patchValue({
            startDate: this.datePipe.transform(lastMonth, 'yyyy-MM-dd'),
            endDate: this.datePipe.transform(today, 'yyyy-MM-dd')
        });
    }

    private calculateSummary() {
        this.summary = {
            totalPaid: 0,
            totalPending: 0,
            totalOverdue: 0
        };
        this.filteredPayments.forEach((payment) => {
            switch (payment.status) {
                case 'paid':
                    this.summary.totalPaid += payment.amount;
                    break;
                case 'pending':
                    this.summary.totalPending += payment.amount;
                    break;
                case 'overdue':
                    this.summary.totalOverdue += payment.amount;
                    break;
            }
        });
    }

    private updatePagination() {
        this.totalPages = Math.ceil(this.filteredPayments.length / this.pageSize);
        this.currentPage = Math.min(this.currentPage, this.totalPages || 1);
        this.updatePaginatedPayments();
    }

    private updatePaginatedPayments() {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedPayments = this.filteredPayments.slice(startIndex, endIndex);
    }

    get startIndex(): number {
        return (this.currentPage - 1) * this.pageSize;
    }

    get endIndex(): number {
        return Math.min(this.startIndex + this.pageSize, this.filteredPayments.length);
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePaginatedPayments();
        }
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePaginatedPayments();
        }
    }

    goToPage(page: number) {
        this.currentPage = page;
        this.updatePaginatedPayments();
    }

    getPageNumbers(): number[] {
        const pages: number[] = [];
        const maxPagesToShow = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    }

    trackByPaymentId(index: number, payment: PaymentRecord): string {
        return payment.id;
    }

    // --- View Modal Functions ---
    viewPaymentDetails(payment: PaymentRecord) {
        this.selectedPaymentForView = payment;
        this.showViewModal = true;
    }

    closeViewModal() {
        this.showViewModal = false;
        this.selectedPaymentForView = null;
    }
    // --- End View Modal Functions ---

    markAsPaid(payment: PaymentRecord) {
        // Update payment status
        const index = this.paymentRecords.findIndex((p) => p.id === payment.id);
        if (index !== -1) {
            this.paymentRecords[index] = {
                ...payment,
                status: 'paid',
                paidDate: new Date(),
                paymentMethod: 'Manual Entry'
            };
            this.applyFilters();
        }
    }

    async exportToPDF() {
        this.isGeneratingPDF = true;
        try {
            const element = document.getElementById('payment-report-content');
            if (!element) {
                throw new Error('Report content not found');
            }

            // Create a temporary element with all data for PDF
            const tempElement = document.createElement('div');
            tempElement.innerHTML = `
                <div style="padding: 20px; font-family: Arial, sans-serif;">
                  <h1 style="color: #1f2937; margin-bottom: 20px;">Payment Collection Report</h1>
                  <p style="color: #6b7280; margin-bottom: 30px;">Generated on: ${new Date().toLocaleDateString()}</p>
                  
                  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px;">
                    <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
                      <h3 style="color: #059669; margin: 0 0 5px 0;">Total Paid</h3>
                      <p style="font-size: 24px; font-weight: bold; margin: 0;">₹${this.summary.totalPaid.toFixed(2)}</p>
                    </div>
                    <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
                      <h3 style="color: #d97706; margin: 0 0 5px 0;">Pending</h3>
                      <p style="font-size: 24px; font-weight: bold; margin: 0;">₹${this.summary.totalPending.toFixed(2)}</p>
                    </div>
                    <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
                      <h3 style="color: #dc2626; margin: 0 0 5px 0;">Overdue</h3>
                      <p style="font-size: 24px; font-weight: bold; margin: 0;">₹${this.summary.totalOverdue.toFixed(2)}</p>
                    </div>
                    <div style="background: #f9fafb; padding: 15px; border-radius: 8px;">
                      <h3 style="color: #2563eb; margin: 0 0 5px 0;">Total Records</h3>
                      <p style="font-size: 24px; font-weight: bold; margin: 0;">${this.filteredPayments.length}</p>
                    </div>
                  </div>
                  
                  <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                      <tr style="background-color: #f9fafb;">
                        <th style="border: 1px solid #e5e7eb; padding: 12px; text-align: left;">Customer</th>
                        <th style="border: 1px solid #e5e7eb; padding: 12px; text-align: left;">Type</th>
                        <th style="border: 1px solid #e5e7eb; padding: 12px; text-align: left;">Invoice</th>
                        <th style="border: 1px solid #e5e7eb; padding: 12px; text-align: left;">Amount</th>
                        <th style="border: 1px solid #e5e7eb; padding: 12px; text-align: left;">Due Date</th>
                        <th style="border: 1px solid #e5e7eb; padding: 12px; text-align: left;">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${this.filteredPayments
                          .map(
                              (payment) => `
                              <tr>
                                  <td style="border: 1px solid #e5e7eb; padding: 12px;">${payment.customerName}</td>
                                  <td style="border: 1px solid #e5e7eb; padding: 12px;">${payment.customerType}</td>
                                  <td style="border: 1px solid #e5e7eb; padding: 12px;">${payment.invoiceNumber}</td>
                                  <td style="border: 1px solid #e5e7eb; padding: 12px;">₹${payment.amount.toFixed(2)}</td>
                                  <td style="border: 1px solid #e5e7eb; padding: 12px;">${this.datePipe.transform(payment.dueDate, 'MMM dd,YYYY')}</td>
                                  <td style="border: 1px solid #e5e7eb; padding: 12px;">${payment.status.toUpperCase()}</td>
                                </tr>
                              `
                          )
                          .join('')}
                    </tbody>
                  </table>
                </div>
            `;
            document.body.appendChild(tempElement);

            const canvas = await html2canvas(tempElement, {
                scale: 2,
                useCORS: true,
                allowTaint: true
            });
            document.body.removeChild(tempElement);

            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 0;
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`payment-collection-report-${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
            this.isGeneratingPDF = false;
        }
    }

    exportToCSV() {
        const headers = ['Customer Name', 'Customer Type', 'Invoice Number', 'Amount (INR)', 'Due Date', 'Status', 'Payment Method', 'Paid Date'];
        const csvData = this.filteredPayments.map((payment) => [
            payment.customerName,
            payment.customerType,
            payment.invoiceNumber,
            payment.amount.toFixed(2), // Format amount for CSV
            this.datePipe.transform(payment.dueDate, 'yyyy-MM-dd') || '',
            payment.status,
            payment.paymentMethod || '',
            payment.paidDate ? this.datePipe.transform(payment.paidDate, 'yyyy-MM-dd') : ''
        ]);
        const csvContent = [headers, ...csvData].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `payment-collection-report-${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
