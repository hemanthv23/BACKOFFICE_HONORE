// ==========================================================
// src/app/apps/backoffice/components/communication/communication.ts
// The main Angular component for Communication, integrating modular logic.
// Updated: Fixed pagination reset issue, refined pagination logic, and added debug logs.
// ==========================================================
import { Component, OnInit, OnDestroy, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router'; // Assuming RouterLink is used for navigation

// Import modular logic classes and interfaces
// CORRECTED PATHS: These imports now correctly point to the 'components' subdirectory.
import { Communication } from './components/interfaces';
import { CommunicationData } from './components/communication-data';
import { CommunicationFiltering } from './components/communication-filtering';
import { CommunicationDisplayUtils } from './components/communication-display-utils';
import { CommunicationStats } from './components/communication-stats';

@Component({
    selector: 'app-communication',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink], // CommonModule for ngIf, ngFor; FormsModule for ngModel; RouterLink for navigation
    template: `
        <div class="min-h-screen bg-gray-50 p-4 md:p-6">
            <div class="mb-4">
                <button routerLink="../" class="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors duration-200 shadow-md flex items-center space-x-1 sm:space-x-2 w-auto">
                    <svg class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    <span class="whitespace-nowrap">Back to Home</span>
                </button>
            </div>
            <div class="max-w-7xl mx-auto">
                <!-- Header Section -->
                <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900 mb-2">Communication Center</h1>
                            <p class="text-gray-600">Manage customer communications and notifications</p>
                        </div>
                        <div class="mt-4 md:mt-0 flex items-center space-x-2 text-sm text-gray-500">
                            <!-- SVG for refresh icon -->
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            <span>Last updated: {{ lastRefresh() | date: 'mediumTime' }}</span>
                        </div>
                    </div>
                </div>

                <!-- Stats Grid Section -->
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    <div class="bg-white rounded-xl shadow-lg p-4">
                        <h3 class="text-sm font-medium text-gray-500">Total Messages</h3>
                        <p class="text-2xl font-bold text-blue-600">{{ communicationStats.stats().total }}</p>
                    </div>
                    <div class="bg-white rounded-xl shadow-lg p-4">
                        <h3 class="text-sm font-medium text-gray-500">Successful</h3>
                        <p class="text-2xl font-bold text-green-600">{{ communicationStats.stats().successful }}</p>
                    </div>
                    <div class="bg-white rounded-xl shadow-lg p-4">
                        <h3 class="text-sm font-medium text-gray-500">Pending</h3>
                        <p class="text-2xl font-bold text-yellow-600">{{ communicationStats.stats().pending }}</p>
                    </div>
                    <div class="bg-white rounded-xl shadow-lg p-4">
                        <h3 class="text-sm font-medium text-gray-500">Failed</h3>
                        <p class="text-2xl font-bold text-red-600">{{ communicationStats.stats().failed }}</p>
                    </div>
                    <div class="bg-white rounded-xl shadow-lg p-4">
                        <h3 class="text-sm font-medium text-gray-500">Emails</h3>
                        <p class="text-2xl font-bold text-purple-600">{{ communicationStats.stats().emails }}</p>
                    </div>
                    <div class="bg-white rounded-xl shadow-lg p-4">
                        <h3 class="text-sm font-medium text-gray-500">SMS</h3>
                        <p class="text-2xl font-bold text-indigo-600">{{ communicationStats.stats().sms }}</p>
                    </div>
                </div>

                <!-- Filtering and Action Buttons Section -->
                <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-4">
                        <!-- Search Input -->
                        <div class="relative">
                            <svg class="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search email/phone..."
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                [ngModel]="communicationFiltering.searchTerm()"
                                (ngModelChange)="onSearchChange($event)"
                            />
                        </div>

                        <!-- Status Filter Dropdown -->
                        <select
                            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            [ngModel]="communicationFiltering.statusFilter()"
                            (ngModelChange)="communicationFiltering.statusFilter.set($event); resetPagination()"
                        >
                            <option value="All">All Status</option>
                            <option value="SUCCESS">Success</option>
                            <option value="SMS_MESSAGE_UPLOADED">Uploaded</option>
                            <option value="PENDING">Pending</option>
                            <option value="SEND_REQUESTED">Requested</option>
                            <option value="SEND_FAILED">Failed</option>
                        </select>

                        <!-- Type Filter Dropdown -->
                        <select
                            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            [ngModel]="communicationFiltering.typeFilter()"
                            (ngModelChange)="communicationFiltering.typeFilter.set($event); resetPagination()"
                        >
                            <option value="All">All Types</option>
                            <option value="EMAIL">Email</option>
                            <option value="SMS">SMS</option>
                        </select>

                        <!-- Message Type Filter Dropdown -->
                        <select
                            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            [ngModel]="communicationFiltering.messageTypeFilter()"
                            (ngModelChange)="communicationFiltering.messageTypeFilter.set($event); resetPagination()"
                        >
                            <option value="All">All Messages</option>
                            <option value="SHIPPING_UPDATE">Shipping Update</option>
                            <option value="PROMOTIONAL_OFFER">Promotional</option>
                            <option value="NEW_USER_REGISTRATION">Registration</option>
                            <option value="PASSWORD_RESET">Password Reset</option>
                            <option value="NEW_ORDER_CONFIRMATION">Order Confirmation</option>
                        </select>
                    </div>

                    <!-- Data Count and Action Buttons -->
                    <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div class="flex items-center space-x-2 text-sm text-gray-600">
                            <span>Showing {{ paginatedCommunications().length }} of {{ communicationFiltering.filteredCommunications().length }} entries</span>
                        </div>
                        <div class="flex space-x-2">
                            <!-- Refresh Button -->
                            <button (click)="handleRefresh()" [disabled]="isLoading()" class="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50">
                                <svg class="w-4 h-4" [class.animate-spin]="isLoading()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                </svg>
                                <span>Refresh</span>
                            </button>
                            <!-- Export CSV Button -->
                            <button (click)="handleExport()" class="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                                <span>Export CSV</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Debugging line to show current pagination state -->
                <p class="text-sm text-gray-700 mb-2">
                    Debug: Current Page: <span class="font-medium">{{ currentPage() }}</span
                    >, Paginated Length: <span class="font-medium">{{ paginatedCommunications().length }}</span
                    >, Total Filtered: <span class="font-medium">{{ communicationFiltering.filteredCommunications().length }}</span>
                </p>

                <!-- Communications Table Section -->
                <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL#</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email / Phone</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message Type</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Sent</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <ng-container *ngIf="paginatedCommunications().length > 0; else noData">
                                    <tr *ngFor="let comm of paginatedCommunications(); let i = index; trackBy: trackByFn" class="hover:bg-gray-50 transition-colors">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {{ (currentPage() - 1) * itemsPerPage + i + 1 }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center">
                                                <span class="text-sm text-gray-900">{{ comm.emailPhone }}</span>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span [class]="'inline-flex px-2 py-1 text-xs font-semibold rounded-full ' + (comm.type === 'EMAIL' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800')">
                                                {{ comm.type }}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {{ communicationDisplayUtils.formatMessageType(comm.messageType) }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <div class="flex items-center">
                                                <ng-container [ngSwitch]="comm.status">
                                                    <svg *ngSwitchCase="'SUCCESS'" class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                    <svg *ngSwitchCase="'SMS_MESSAGE_UPLOADED'" class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                    <svg *ngSwitchCase="'SEND_FAILED'" class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                                    </svg>
                                                    <svg *ngSwitchDefault class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                    </svg>
                                                </ng-container>
                                                <span [class]="'ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ' + communicationDisplayUtils.getStatusColor(comm.status)">
                                                    {{ communicationDisplayUtils.formatStatus(comm.status) }}
                                                </span>
                                            </div>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {{ comm.dateSent }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ comm.time }}
                                        </td>
                                    </tr>
                                </ng-container>
                                <ng-template #noData>
                                    <tr>
                                        <td colspan="7" class="px-6 py-4 text-center text-sm text-gray-500">No communication records found matching your criteria.</td>
                                    </tr>
                                </ng-template>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination Controls -->
                    <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <!-- Mobile Pagination Controls -->
                        <div class="flex-1 flex justify-between sm:hidden">
                            <button
                                (click)="previousPage()"
                                [disabled]="currentPage() === 1"
                                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <button
                                (click)="nextPage()"
                                [disabled]="currentPage() === totalPages()"
                                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>

                        <!-- Desktop Pagination Controls -->
                        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p class="text-sm text-gray-700">
                                    Showing <span class="font-medium">{{ Math.min((currentPage() - 1) * itemsPerPage + 1, communicationFiltering.filteredCommunications().length) }}</span> to
                                    <span class="font-medium">{{ Math.min(currentPage() * itemsPerPage, communicationFiltering.filteredCommunications().length) }}</span>
                                    of <span class="font-medium">{{ communicationFiltering.filteredCommunications().length }}</span> results
                                </p>
                            </div>
                            <div>
                                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        (click)="previousPage()"
                                        [disabled]="currentPage() === 1"
                                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        *ngFor="let page of getVisiblePages()"
                                        (click)="setCurrentPage(page)"
                                        [class]="
                                            'relative inline-flex items-center px-4 py-2 border text-sm font-medium ' +
                                            (currentPage() === page ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50')
                                        "
                                    >
                                        {{ page }}
                                    </button>
                                    <button
                                        (click)="nextPage()"
                                        [disabled]="currentPage() === totalPages() || totalPages() === 0"
                                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            .animate-spin {
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }
        `
    ]
})
export class CommunicationComponent implements OnInit, OnDestroy {
    // Services/Logic classes - instances are created in the constructor
    communicationData: CommunicationData;
    communicationFiltering: CommunicationFiltering;
    communicationDisplayUtils: CommunicationDisplayUtils;
    communicationStats: CommunicationStats;

    // Local state for pagination, loading, and refresh using Angular Signals
    currentPage = signal(1);
    itemsPerPage = 10; // Explicitly set itemsPerPage to 10 for clarity and consistency
    isLoading = signal(false);
    lastRefresh = signal(new Date());
    private refreshInterval: any; // For the auto-refresh timer

    Math = Math; // Make Math object available in the template for calculations (e.g., Math.min, Math.ceil)

    constructor() {
        console.log('CommunicationComponent: Constructor called.');
        // Initialize instances of the service classes
        this.communicationData = new CommunicationData();
        this.communicationFiltering = new CommunicationFiltering(this.communicationData);
        this.communicationDisplayUtils = new CommunicationDisplayUtils();
        this.communicationStats = new CommunicationStats(this.communicationData, this.communicationFiltering);

        // Effect to reset pagination when filters change (ONLY if the filters themselves change, not computed values)
        // This effect is now more carefully crafted to only react to direct filter signal changes.
        effect(() => {
            console.log('CommunicationComponent: Effect watching filter signals triggered (for explicit filter changes).');
            const currentSearchTerm = this.communicationFiltering.searchTerm();
            const currentStatusFilter = this.communicationFiltering.statusFilter();
            const currentTypeFilter = this.communicationFiltering.typeFilter();
            const currentMessageTypeFilter = this.communicationFiltering.messageTypeFilter();

            // Only reset if a filter has actually changed from its previous value
            // This is to prevent re-setting page 1 when other signals (like currentPage itself)
            // cause filteredCommunications to re-evaluate.
            // We explicitly check if any filter has changed *and* if we're not already on page 1.
            // We will *not* reset here if the change is a result of pagination itself.
            // The `resetPagination()` method is now explicitly called from `onSearchChange`
            // and the dropdown `(ngModelChange)` events directly.
            // Therefore, this effect primarily serves for logging or very specific derived state,
            // NOT for controlling primary `currentPage` reset based on filter *changes* from inputs.
            // The primary pagination reset on filter change is handled by the `(ngModelChange)` and `onSearchChange` callbacks.
        });

        // Effect to adjust current page if it exceeds total pages
        effect(() => {
            console.log('CommunicationComponent: Effect watching totalPages and currentPage triggered.');
            const total = this.totalPages();
            const current = this.currentPage();
            if (current > total && total > 0) {
                console.log(`CommunicationComponent: Current page (${current}) adjusted to max page (${total}).`);
                this.currentPage.set(total);
            } else if (total === 0 && current !== 1) {
                console.log('CommunicationComponent: No results (total pages 0), ensuring current page is 1.');
                this.currentPage.set(1);
            }
        });
    }

    ngOnInit(): void {
        console.log('CommunicationComponent: ngOnInit called.');
        this.startAutoRefresh();
    }

    ngOnDestroy(): void {
        console.log('CommunicationComponent: ngOnDestroy called.');
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            console.log('CommunicationComponent: Auto-refresh interval cleared.');
        }
        this.communicationFiltering.ngOnDestroy();
    }

    /**
     * Handles changes from the search input field.
     * Updates the `searchTerm` signal in the `CommunicationFiltering` service.
     * @param value The new search term from the input.
     */
    onSearchChange(value: string): void {
        console.log(`CommunicationComponent: onSearchChange() called with value: '${value}'.`);
        this.communicationFiltering.searchTerm.set(value);
        this.resetPagination(); // Explicitly reset pagination when search term changes
    }

    // ===========================================
    // Pagination Logic using Computed Signals
    // ===========================================

    /**
     * Computed signal that calculates the total number of pages required
     * based on the filtered communications and items per page.
     * It reacts automatically to changes in `filteredCommunications`.
     */
    totalPages = computed(() => {
        const totalItems = this.communicationFiltering.filteredCommunications().length;
        const pages = Math.ceil(totalItems / this.itemsPerPage) || 1;
        console.log(`CommunicationComponent: totalPages computed -> Total Items: ${totalItems}, Items Per Page: ${this.itemsPerPage}, Calculated Pages: ${pages}`);
        return pages;
    });

    /**
     * Computed signal that returns the subset of filtered communications
     * corresponding to the current page.
     * It reacts automatically to changes in `filteredCommunications` or `currentPage`.
     */
    paginatedCommunications = computed(() => {
        const filtered = this.communicationFiltering.filteredCommunications();
        const start = (this.currentPage() - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const paginated = filtered.slice(start, end);
        console.log(`CommunicationComponent: paginatedCommunications computed -> Current Page: ${this.currentPage()}, Start Index: ${start}, End Index: ${end}, Paginated Count: ${paginated.length}`);
        return paginated;
    });

    /**
     * Navigates to the previous page if not already on the first page.
     */
    previousPage(): void {
        console.log('CommunicationComponent: previousPage() called.');
        if (this.currentPage() > 1) {
            this.currentPage.set(this.currentPage() - 1);
            console.log('CommunicationComponent: Navigated to previous page:', this.currentPage());
        }
    }

    /**
     * Navigates to the next page if not already on the last page.
     */
    nextPage(): void {
        console.log('CommunicationComponent: nextPage() called.');
        if (this.currentPage() < this.totalPages()) {
            this.currentPage.set(this.currentPage() + 1);
            console.log('CommunicationComponent: Navigated to next page:', this.currentPage());
        }
    }

    /**
     * Sets the current page to a specific page number.
     * @param page The page number to navigate to.
     */
    setCurrentPage(page: number): void {
        console.log(`CommunicationComponent: setCurrentPage() called with page: ${page}.`);
        // Ensure the page number is valid before setting
        if (page >= 1 && page <= this.totalPages()) {
            this.currentPage.set(page);
            console.log('CommunicationComponent: Set current page to:', page, '. Current signal value:', this.currentPage()); // Added extra log
        } else {
            console.warn(`CommunicationComponent: Attempted to set invalid page number: ${page}. Total pages: ${this.totalPages()}`);
        }
    }

    /**
     * Generates an array of page numbers to display in the pagination control.
     * Implements logic to show a limited number of pages (e.g., 5) around the current page.
     * @returns {number[]} An array of page numbers.
     */
    getVisiblePages(): number[] {
        const total = this.totalPages();
        const current = this.currentPage();
        const pages: number[] = [];
        const maxVisiblePages = 5; // Max number of page buttons to show

        if (total <= maxVisiblePages) {
            // If total pages are less than or equal to max visible, show all pages
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
        } else {
            // Calculate start and end for visible pages
            let startPage = Math.max(1, current - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(total, startPage + maxVisiblePages - 1);

            // Adjust start/end if we are near the total end
            if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }
        }
        return pages;
    }

    // ===========================================
    // Data Refresh and Export Logic
    // ===========================================

    /**
     * Handles manual data refresh.
     * Sets loading state, simulates API call, updates refresh time, clears loading state,
     * and crucially, resets pagination.
     */
    handleRefresh(): void {
        this.isLoading.set(true);
        console.log('CommunicationComponent: Refreshing data...');
        setTimeout(() => {
            this.communicationData.fetchFreshData(); // This will update `allCommunications`

            // Reset all filter signals to their default values
            this.communicationFiltering.searchTerm.set('');
            this.communicationFiltering.statusFilter.set('All');
            this.communicationFiltering.typeFilter.set('All');
            this.communicationFiltering.messageTypeFilter.set('All');
            console.log('CommunicationComponent: Filters reset to default values.');

            this.lastRefresh.set(new Date()); // Update last refresh timestamp
            this.isLoading.set(false);
            this.resetPagination(); // Reset pagination to page 1 after refreshing data and filters
            console.log('CommunicationComponent: Data refresh complete, filters and pagination reset.');
        }, 1000); // Simulate 1 second network delay
    }

    /**
     * Starts an automatic data refresh interval.
     */
    startAutoRefresh(): void {
        console.log('CommunicationComponent: startAutoRefresh() called. Interval set for 5 minutes.');
        // Refresh every 5 minutes (300000 milliseconds)
        this.refreshInterval = setInterval(() => {
            this.handleRefresh();
        }, 300000);
    }

    /**
     * Handles exporting the currently filtered data to a CSV file.
     * It delegates the actual export logic to the `communicationStats` service,
     * passing utility functions for consistent formatting.
     */
    handleExport(): void {
        console.log('CommunicationComponent: Initiating CSV export...');
        this.communicationStats.exportToCsv(
            (type: string) => this.communicationDisplayUtils.formatMessageType(type),
            (status: string) => this.communicationDisplayUtils.formatStatus(status)
        );
    }

    /**
     * TrackBy function for ngFor loop performance optimization.
     * @param index The index of the item.
     * @param item The Communication object.
     * @returns A unique identifier for the item (its ID).
     */
    trackByFn(index: number, item: Communication): number {
        return item.id;
    }

    /**
     * Resets the current page to the first page (page 1).
     * This method is public so it can be called from the template (e.g., when filters change).
     */
    public resetPagination(): void {
        this.currentPage.set(1);
        console.log('CommunicationComponent: Pagination reset to page 1 by explicit call.');
    }
}
