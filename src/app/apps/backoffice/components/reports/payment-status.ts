import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject, interval, takeUntil, debounceTime, distinctUntilChanged, BehaviorSubject, combineLatest, map } from 'rxjs';
import * as XLSX from 'xlsx';

interface PaymentRecord {
    id: string;
    customerName: string;
    customerPhone: string;
    orderNumber: string;
    amount: number;
    paymentType: string;
    paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED' | 'FAILED' | 'OVERDUE';
    paymentDate: Date;
    isProcessing?: boolean;
}

@Component({
    selector: 'app-payment-status',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
    providers: [DatePipe, CurrencyPipe],
    template: `
        <div class="min-h-screen bg-gray-50">
            <div class="bg-white shadow-sm border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900 mb-2">Payment Status</h1>
                            <p class="text-gray-600">Real-time payment tracking and management</p>
                        </div>
                        <div class="mt-4 sm:mt-0 flex items-center space-x-4">
                            <div class="flex items-center text-sm text-gray-500">
                                <div class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                Live Updates
                            </div>
                            <span class="text-sm text-gray-500"> Last updated: {{ lastUpdated | date: 'HH:mm:ss' }} </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-lg shadow p-6 transform hover:scale-105 transition-transform duration-200">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-500">Total Paid</p>
                                <p class="text-2xl font-bold text-gray-900">{{ stats.paid }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6 transform hover:scale-105 transition-transform duration-200">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                                    <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-500">Pending</p>
                                <p class="text-2xl font-bold text-gray-900">{{ stats.pending }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6 transform hover:scale-105 transition-transform duration-200">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-500">Failed</p>
                                <p class="text-2xl font-bold text-gray-900">{{ stats.failed }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg shadow p-6 transform hover:scale-105 transition-transform duration-200">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                            <div class="ml-4">
                                <p class="text-sm font-medium text-gray-500">Total Amount</p>
                                <p class="text-2xl font-bold text-gray-900">{{ stats.totalAmount | currency: 'INR' : 'symbol' : '1.2-2' }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow mb-6">
                    <div class="p-6">
                        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
                            <div class="flex-1 max-w-lg">
                                <div class="relative">
                                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        #searchInput
                                        (input)="onSearchInput($event)"
                                        placeholder="Search by customer name, order number, or phone..."
                                        class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                <select (change)="onStatusFilter($event)" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    <option value="">All Statuses</option>
                                    <option value="PAID">Paid</option>
                                    <option value="PENDING">Pending</option>
                                    <option value="REFUNDED">Refunded</option>
                                    <option value="FAILED">Failed</option>
                                    <option value="OVERDUE">Overdue</option>
                                </select>

                                <select (change)="onPaymentTypeFilter($event)" class="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                    <option value="">All Payment Types</option>
                                    <option value="RAZORPAY">RazorPay</option>
                                    <option value="CARD">Card</option>
                                    <option value="UPI">UPI</option>
                                    <option value="NETBANKING">Net Banking</option>
                                </select>

                                <button
                                    (click)="exportToExcel()"
                                    class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 transform hover:scale-105"
                                >
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    Export
                                </button>

                                <button
                                    (click)="clearFilters()"
                                    class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                                >
                                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                    Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-lg shadow overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button (click)="sortBy('customerName')" class="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                                            <span>Customer</span>
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                                            </svg>
                                        </button>
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button (click)="sortBy('orderNumber')" class="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                                            <span>Order</span>
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                                            </svg>
                                        </button>
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button (click)="sortBy('amount')" class="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                                            <span>Amount</span>
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                                            </svg>
                                        </button>
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Type</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <button (click)="sortBy('paymentDate')" class="flex items-center space-x-1 hover:text-gray-700 transition-colors">
                                            <span>Date</span>
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                                            </svg>
                                        </button>
                                    </th>
                                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr *ngFor="let payment of filteredPayments$ | async; trackBy: trackByPayment" class="hover:bg-gray-50 transition-colors duration-150" [class.animate-pulse]="payment.isProcessing">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-gray-900">{{ payment.customerName }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">{{ payment.customerPhone }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-mono text-gray-900">{{ payment.orderNumber }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-semibold text-gray-900">
                                            {{ payment.amount | currency: 'INR' : 'symbol' : '1.2-2' }}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">{{ payment.paymentType }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span [ngClass]="getStatusClass(payment.paymentStatus)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200">
                                            <span *ngIf="payment.isProcessing" class="w-2 h-2 bg-current rounded-full mr-1 animate-pulse"></span>
                                            {{ payment.paymentStatus }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ payment.paymentDate | date: 'dd/MM/yyyy HH:mm' }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div class="flex items-center space-x-3 justify-end">
                                            <button (click)="viewDetails(payment)" class="text-blue-600 hover:text-blue-900 transition-colors duration-200 transform hover:scale-110" title="View Payment Details">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                    ></path>
                                                </svg>
                                            </button>

                                            <button
                                                *ngIf="payment.paymentStatus === 'PENDING' || payment.paymentStatus === 'FAILED'"
                                                (click)="retryPayment(payment)"
                                                [disabled]="payment.isProcessing"
                                                class="text-yellow-600 hover:text-yellow-900 transition-colors duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Retry Payment"
                                            >
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                                </svg>
                                            </button>

                                            <button
                                                *ngIf="payment.paymentStatus === 'PAID'"
                                                (click)="initiateRefund(payment)"
                                                [disabled]="payment.isProcessing"
                                                class="text-red-600 hover:text-red-900 transition-colors duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Initiate Refund"
                                            >
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
                                                </svg>
                                            </button>

                                            <button
                                                *ngIf="payment.paymentStatus === 'PAID' || payment.paymentStatus === 'REFUNDED'"
                                                (click)="sendReceipt(payment)"
                                                class="text-green-600 hover:text-green-900 transition-colors duration-200 transform hover:scale-110"
                                                title="Send Receipt"
                                            >
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div *ngIf="(filteredPayments$ | async)?.length === 0" class="text-center py-12">
                        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <h3 class="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
                        <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
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

            <div
                *ngIf="showNotification"
                class="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 transform transition-all duration-300 z-50"
                [class.translate-y-0]="showNotification"
                [class.translate-y-full]="!showNotification"
            >
                <div class="flex items-center">
                    <div [ngClass]="notificationIcon" class="flex-shrink-0 w-6 h-6 mr-3">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="notificationPath"></path>
                        </svg>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900">{{ notificationTitle }}</p>
                        <p class="text-sm text-gray-500">{{ notificationMessage }}</p>
                    </div>
                    <button (click)="dismissNotification()" class="ml-4 text-gray-400 hover:text-gray-600">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `
})
export class PaymentStatus implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private payments$ = new BehaviorSubject<PaymentRecord[]>([]);
    private searchTerm$ = new BehaviorSubject<string>('');
    private statusFilter$ = new BehaviorSubject<string>('');
    private paymentTypeFilter$ = new BehaviorSubject<string>('');
    filteredPayments$ = combineLatest([this.payments$, this.searchTerm$.pipe(debounceTime(300), distinctUntilChanged()), this.statusFilter$, this.paymentTypeFilter$]).pipe(
        map(([payments, searchTerm, statusFilter, paymentTypeFilter]) => this.performFiltering(payments, searchTerm, statusFilter, paymentTypeFilter)),
        map((filtered) => this.sortPayments(filtered))
    );
    lastUpdated: Date = new Date();
    stats = { paid: 0, pending: 0, failed: 0, totalAmount: 0 };
    // Notification properties
    showNotification = false;
    notificationTitle = '';
    notificationMessage = '';
    notificationIcon = '';
    notificationPath = '';
    // Sorting
    sortField: string = '';
    sortDirection: 'asc' | 'desc' = 'asc';

    constructor(
        private datePipe: DatePipe,
        private currencyPipe: CurrencyPipe
    ) {}

    ngOnInit(): void {
        this.loadInitialData();
        this.setupRealTimeUpdates();
        this.updateStats();
        this.payments$.subscribe(() => this.updateStats());
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadInitialData(): void {
        const initialPayments: PaymentRecord[] = [
            {
                id: '1',
                customerName: 'Radhika Mukhija',
                customerPhone: '9045000077',
                orderNumber: 'IND2025_88469',
                amount: 1081.7,
                paymentType: 'RAZORPAY',
                paymentStatus: 'REFUNDED',
                paymentDate: new Date('2025-03-27T18:13:00')
            },
            {
                id: '2',
                customerName: 'Geetanjali Pasi',
                customerPhone: '9886783979',
                orderNumber: 'COM2025_36911',
                amount: 832.57,
                paymentType: 'RAZORPAY',
                paymentStatus: 'PAID',
                paymentDate: new Date('2025-06-08T15:22:00')
            },
            {
                id: '3',
                customerName: 'Amit Sharma',
                customerPhone: '9876543210',
                orderNumber: 'ORD2025_12345',
                amount: 2500.0,
                paymentType: 'UPI',
                paymentStatus: 'PENDING',
                paymentDate: new Date('2025-06-17T10:30:00')
            },
            {
                id: '4',
                customerName: 'Priya Singh',
                customerPhone: '8765432109',
                orderNumber: 'ORD2025_67890',
                amount: 1750.25,
                paymentType: 'CARD',
                paymentStatus: 'FAILED',
                paymentDate: new Date('2025-06-16T14:45:00')
            },
            {
                id: '5',
                customerName: 'Rajesh Kumar',
                customerPhone: '7654321098',
                orderNumber: 'ORD2025_54321',
                amount: 3200.8,
                paymentType: 'NETBANKING',
                paymentStatus: 'OVERDUE',
                paymentDate: new Date('2025-06-15T09:15:00')
            },
            {
                id: '6',
                customerName: 'Sunita Devi',
                customerPhone: '9123456789',
                orderNumber: 'ORD2025_99999',
                amount: 1250.0,
                paymentType: 'UPI',
                paymentStatus: 'PAID',
                paymentDate: new Date('2025-06-17T12:00:00')
            }
        ];
        this.payments$.next(initialPayments);
    }

    private setupRealTimeUpdates(): void {
        // Real-time updates every 10 seconds
        interval(10000)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.simulateRealTimeUpdate();
                this.lastUpdated = new Date();
            });
    }

    private simulateRealTimeUpdate(): void {
        const currentPayments = this.payments$.getValue();
        const updatedPayments = currentPayments.map((payment) => {
            // Simulate status changes for PENDING and FAILED payments
            if (payment.paymentStatus === 'PENDING' && Math.random() < 0.3) {
                // 30% chance to become PAID
                return { ...payment, paymentStatus: 'PAID', paymentDate: new Date(), isProcessing: false } as PaymentRecord;
            }
            if (payment.paymentStatus === 'FAILED' && Math.random() < 0.2) {
                // 20% chance to become PENDING on retry
                return { ...payment, paymentStatus: 'PENDING', isProcessing: false } as PaymentRecord;
            }
            return payment;
        });

        // Add a new random payment occasionally
        if (Math.random() < 0.1) {
            // 10% chance to add a new payment
            updatedPayments.push(this.generateRandomPayment());
        }

        this.payments$.next(updatedPayments);
    }

    private generateRandomPayment(): PaymentRecord {
        const statuses: ('PAID' | 'PENDING' | 'REFUNDED' | 'FAILED' | 'OVERDUE')[] = ['PAID', 'PENDING', 'FAILED', 'OVERDUE'];
        const paymentTypes = ['RAZORPAY', 'CARD', 'UPI', 'NETBANKING'];
        const randomId = Math.random().toString(36).substring(2, 11);
        const randomAmount = parseFloat((Math.random() * 5000 + 100).toFixed(2));
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const randomPaymentType = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];
        const randomDate = new Date(Date.now() - Math.floor(Math.random() * 86400000 * 7)); // Within last 7 days

        const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Heidi'];
        const surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'];
        const randomName = `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
        const randomPhone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;

        return {
            id: randomId,
            customerName: randomName,
            customerPhone: randomPhone,
            orderNumber: `ORD${new Date().getFullYear()}_${Math.floor(10000 + Math.random() * 90000)}`,
            amount: randomAmount,
            paymentType: randomPaymentType,
            paymentStatus: randomStatus,
            paymentDate: randomDate,
            isProcessing: false
        };
    }

    private updateStats(): void {
        const currentPayments = this.payments$.getValue();
        this.stats.paid = currentPayments.filter((p) => p.paymentStatus === 'PAID').length;
        this.stats.pending = currentPayments.filter((p) => p.paymentStatus === 'PENDING').length;
        this.stats.failed = currentPayments.filter((p) => p.paymentStatus === 'FAILED' || p.paymentStatus === 'OVERDUE').length;
        this.stats.totalAmount = currentPayments.reduce((sum, p) => sum + p.amount, 0);
    }

    onSearchInput(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        this.searchTerm$.next(inputElement.value);
    }

    onStatusFilter(event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        this.statusFilter$.next(selectElement.value);
    }

    onPaymentTypeFilter(event: Event): void {
        const selectElement = event.target as HTMLSelectElement;
        this.paymentTypeFilter$.next(selectElement.value);
    }

    clearFilters(): void {
        this.searchTerm$.next('');
        this.statusFilter$.next('');
        this.paymentTypeFilter$.next('');
        // Reset select elements in the template if needed, e.g., using ngModel
    }

    performFiltering(payments: PaymentRecord[], searchTerm: string, statusFilter: string, paymentTypeFilter: string): PaymentRecord[] {
        let filtered = payments;

        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            filtered = filtered.filter((payment) => payment.customerName.toLowerCase().includes(lowerSearchTerm) || payment.orderNumber.toLowerCase().includes(lowerSearchTerm) || payment.customerPhone.includes(lowerSearchTerm));
        }

        if (statusFilter) {
            filtered = filtered.filter((payment) => payment.paymentStatus === statusFilter);
        }

        if (paymentTypeFilter) {
            filtered = filtered.filter((payment) => payment.paymentType === paymentTypeFilter);
        }

        return filtered;
    }

    sortBy(field: string): void {
        if (this.sortField === field) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortField = field;
            this.sortDirection = 'asc';
        }
        // Trigger re-sort by pushing a new value to payments$ (or filteredPayments$ can handle it directly)
        this.payments$.next([...this.payments$.getValue()]);
    }

    sortPayments(payments: PaymentRecord[]): PaymentRecord[] {
        if (!this.sortField) {
            return payments;
        }

        return [...payments].sort((a, b) => {
            const aValue = (a as any)[this.sortField];
            const bValue = (b as any)[this.sortField];

            if (aValue < bValue) {
                return this.sortDirection === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return this.sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }

    getStatusClass(status: 'PAID' | 'PENDING' | 'REFUNDED' | 'FAILED' | 'OVERDUE'): string {
        switch (status) {
            case 'PAID':
                return 'bg-green-100 text-green-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            case 'REFUNDED':
                return 'bg-blue-100 text-blue-800';
            case 'FAILED':
                return 'bg-red-100 text-red-800';
            case 'OVERDUE':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    trackByPayment(index: number, payment: PaymentRecord): string {
        return payment.id;
    }

    viewDetails(payment: PaymentRecord): void {
        this.showNotification = true;
        this.notificationTitle = 'Payment Details';
        this.notificationMessage = `Customer: ${payment.customerName}, Order: ${payment.orderNumber}, Amount: ${this.currencyPipe.transform(payment.amount, 'INR', 'symbol', '1.2-2')}, Status: ${payment.paymentStatus}`;
        this.notificationIcon = 'text-blue-500';
        this.notificationPath = 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'; // Info circle icon
        setTimeout(() => this.dismissNotification(), 5000);
    }

    retryPayment(payment: PaymentRecord): void {
        this.setProcessingStatus(payment.id, true);
        // Simulate API call
        setTimeout(() => {
            const currentPayments = this.payments$.getValue();
            const updatedPayments = currentPayments.map((p) => {
                if (p.id === payment.id) {
                    const newStatus: 'PAID' | 'PENDING' | 'FAILED' = Math.random() < 0.7 ? 'PAID' : 'FAILED'; // 70% chance to succeed
                    this.showNotification = true;
                    if (newStatus === 'PAID') {
                        this.notificationTitle = 'Payment Retried Successfully';
                        this.notificationMessage = `Order ${payment.orderNumber} is now PAID.`;
                        this.notificationIcon = 'text-green-500';
                        this.notificationPath = 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'; // Check circle icon
                    } else {
                        this.notificationTitle = 'Payment Retry Failed';
                        this.notificationMessage = `Order ${payment.orderNumber} retry failed. Please try again.`;
                        this.notificationIcon = 'text-red-500';
                        this.notificationPath = 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z'; // X circle icon
                    }
                    setTimeout(() => this.dismissNotification(), 3000);
                    return { ...p, paymentStatus: newStatus, paymentDate: new Date(), isProcessing: false } as PaymentRecord;
                }
                return p;
            });
            this.payments$.next(updatedPayments);
        }, 2000); // Simulate 2 second API call
    }

    initiateRefund(payment: PaymentRecord): void {
        this.setProcessingStatus(payment.id, true);
        // Simulate API call
        setTimeout(() => {
            const currentPayments = this.payments$.getValue();
            const updatedPayments = currentPayments.map((p) => {
                if (p.id === payment.id) {
                    this.showNotification = true;
                    this.notificationTitle = 'Refund Initiated';
                    this.notificationMessage = `Refund for order ${payment.orderNumber} initiated.`;
                    this.notificationIcon = 'text-blue-500';
                    this.notificationPath = 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1'; // Dollar circle icon (approximation)
                    setTimeout(() => this.dismissNotification(), 3000);
                    return { ...p, paymentStatus: 'REFUNDED', paymentDate: new Date(), isProcessing: false } as PaymentRecord;
                }
                return p;
            });
            this.payments$.next(updatedPayments);
        }, 2000);
    }

    sendReceipt(payment: PaymentRecord): void {
        this.setProcessingStatus(payment.id, true);
        // Simulate API call
        setTimeout(() => {
            const currentPayments = this.payments$.getValue();
            const updatedPayments = currentPayments.map((p) => {
                if (p.id === payment.id) {
                    this.showNotification = true;
                    this.notificationTitle = 'Receipt Sent';
                    this.notificationMessage = `Receipt for order ${payment.orderNumber} sent to ${payment.customerName}.`;
                    this.notificationIcon = 'text-green-500';
                    this.notificationPath = 'M12 19l9 2-9-18-9 18 9-2zm0 0v-8'; // Paper plane icon
                    setTimeout(() => this.dismissNotification(), 3000);
                    return { ...p, isProcessing: false }; // Just remove processing status
                }
                return p;
            });
            this.payments$.next(updatedPayments);
        }, 1500);
    }

    private setProcessingStatus(paymentId: string, isProcessing: boolean): void {
        const currentPayments = this.payments$.getValue();
        const updatedPayments = currentPayments.map((p) => (p.id === paymentId ? { ...p, isProcessing: isProcessing } : p));
        this.payments$.next(updatedPayments);
    }

    dismissNotification(): void {
        this.showNotification = false;
    }

    exportToExcel(): void {
        this.filteredPayments$.pipe(takeUntil(this.destroy$)).subscribe((payments) => {
            const data = payments.map((payment) => ({
                'Customer Name': payment.customerName,
                'Customer Phone': payment.customerPhone,
                'Order Number': payment.orderNumber,
                'Amount (INR)': payment.amount,
                'Payment Type': payment.paymentType,
                'Payment Status': payment.paymentStatus,
                'Payment Date': this.datePipe.transform(payment.paymentDate, 'dd/MM/yyyy HH:mm')
            }));

            const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Payment Status');
            XLSX.writeFile(wb, 'payment_status.xlsx');

            this.showNotification = true;
            this.notificationTitle = 'Export Successful';
            this.notificationMessage = 'Payment data exported to Excel.';
            this.notificationIcon = 'text-green-500';
            this.notificationPath = 'M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'; // Download icon
            setTimeout(() => this.dismissNotification(), 3000);
        });
    }
}
