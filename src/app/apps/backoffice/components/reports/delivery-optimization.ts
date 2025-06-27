import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs'; //
import * as XLSX from 'xlsx'; // Import the xlsx library

interface DeliveryItem {
    deliveryRank: number;
    block: string;
    phase: string;
    doorNo: string;
    customerDoorNo: string;
    customerName: string;
    isMapped: boolean; //
}

interface LocationData {
    name: string;
    totalDeliveries: number;
    completedDeliveries: number;
    pendingDeliveries: number; //
    totalValue: number; // Added for the total value display
}

@Component({
    selector: 'app-delivery-management',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink], //
    providers: [DatePipe],
    template: `
        <div class="min-h-screen bg-gray-50">
            <div class="bg-white shadow-sm border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6">
                        <div class="mb-4 sm:mb-0">
                            <div class="flex items-center space-x-2 mb-2">
                                <svg class="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ currentLocation.name }}</h1>
                            </div>
                            <p class="text-gray-600">Delivery Management & Customer Mapping</p>
                        </div>

                        <div class="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <select [(ngModel)]="selectedLocationIndex" (ngModelChange)="switchLocation($event)" class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-sm">
                                <option *ngFor="let location of locations; let i = index" [value]="i">{{ location.name }}</option>
                            </select>
                            <button (click)="refreshData()" class="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors text-sm">
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 pb-6">
                        <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm opacity-90">Total Deliveries</p>
                                    <p class="text-2xl font-bold">{{ currentLocation.totalDeliveries }}</p>
                                </div>
                                <svg class="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                    />
                                </svg>
                            </div>
                        </div>
                        <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm opacity-90">Total Value</p>
                                    <p class="text-2xl font-bold">₹{{ currentLocation.totalValue | number: '1.2-2' }}</p>
                                </div>
                                <svg class="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m-2 2v4m-2 4h4m-2-8V4" />
                                </svg>
                            </div>
                        </div>

                        <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm opacity-90">Completed</p>
                                    <p class="text-2xl font-bold">{{ currentLocation.completedDeliveries }}</p>
                                </div>
                                <svg class="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-4 text-white">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-sm opacity-90">Pending</p>
                                    <p class="text-2xl font-bold">{{ currentLocation.pendingDeliveries }}</p>
                                </div>
                                <svg class="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
                    <div class="flex flex-wrap gap-2">
                        <button (click)="uploadComDetails()" class="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors text-sm">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload Com Details
                        </button>

                        <button (click)="downloadComDetails()" class="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors text-sm">
                            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download Com Details
                        </button>
                    </div>

                    <button (click)="showDeliveryList()" class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors text-sm">
                        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Delivery List
                    </button>
                </div>

                <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Rank</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phase</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Door No</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Door No</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr *ngFor="let item of paginatedDeliveryData; let i = index" class="hover:bg-gray-50 transition-colors" [class.bg-green-50]="item.isMapped">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {{ item.deliveryRank }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ item.block }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ item.phase }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.doorNo }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.customerDoorNo }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span *ngIf="item.customerName" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"> {{ item.customerName }} </span>
                                        <span *ngIf="!item.customerName" class="text-gray-400 italic">Not mapped</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            (click)="openMapCustomer(item, (currentPage - 1) * pageSize + i)"
                                            class="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm"
                                        >
                                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Map Customer
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div *ngIf="totalPages > 1" class="px-6 py-4 flex items-center justify-between border-t border-gray-200 bg-white">
                        <div class="flex-1 flex justify-between sm:hidden">
                            <button
                                (click)="prevPage()"
                                [disabled]="currentPage === 1"
                                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                (click)="nextPage()"
                                [disabled]="currentPage === totalPages"
                                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p class="text-sm text-gray-700">
                                    Showing
                                    <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
                                    to
                                    <span class="font-medium">{{ Math.min(currentPage * pageSize, currentDeliveryData.length) }}</span>
                                    of
                                    <span class="font-medium">{{ currentDeliveryData.length }}</span>
                                    results
                                </p>
                            </div>
                            <div>
                                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        (click)="prevPage()"
                                        [disabled]="currentPage === 1"
                                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span class="sr-only">Previous</span>
                                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                    <ng-container *ngFor="let page of pageNumbers">
                                        <button
                                            (click)="goToPage(page)"
                                            [ngClass]="{ 'z-10 bg-teal-50 border-teal-500 text-teal-600': page === currentPage, 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50': page !== currentPage }"
                                            class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                                        >
                                            {{ page }}
                                        </button>
                                    </ng-container>
                                    <button
                                        (click)="nextPage()"
                                        [disabled]="currentPage === totalPages"
                                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span class="sr-only">Next</span>
                                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10l-3.293-3.293a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="text-center pt-8">
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
                            />
                        </svg>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>

        <div *ngIf="showMapModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-lg bg-white">
                <div class="mt-3">
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-semibold text-gray-900 flex items-center">
                            <svg class="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Map Customer
                        </h3>
                        <button (click)="closeMapModal()" class="text-gray-400 hover:text-gray-600 focus:outline-none">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form [formGroup]="mapCustomerForm" (ngSubmit)="saveMapping()" class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Delivery Rank:</label>
                                <input type="text" formControlName="deliveryRank" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" readonly />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Block:</label>
                                <input type="text" formControlName="block" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter block" />
                                <div *ngIf="mapCustomerForm.get('block')?.invalid && mapCustomerForm.get('block')?.touched" class="text-red-500 text-sm mt-1">Block is required.</div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Customer Name:</label>
                                <select formControlName="customerName" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
                                    <option value="">Select Customer</option>
                                    <option *ngFor="let customer of availableCustomers" [value]="customer">{{ customer }}</option>
                                </select>
                                <div *ngIf="mapCustomerForm.get('customerName')?.invalid && mapCustomerForm.get('customerName')?.touched" class="text-red-500 text-sm mt-1">Customer Name is required.</div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Customer Door No:</label>
                                <input type="text" formControlName="customerDoorNo" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter customer door number" />
                                <div *ngIf="mapCustomerForm.get('customerDoorNo')?.invalid && mapCustomerForm.get('customerDoorNo')?.touched" class="text-red-500 text-sm mt-1">Customer Door No is required.</div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Phase:</label>
                                <input type="text" formControlName="phase" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50" readonly />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Door No:</label>
                                <input type="text" formControlName="doorNo" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter door number" />
                                <div *ngIf="mapCustomerForm.get('doorNo')?.invalid && mapCustomerForm.get('doorNo')?.touched" class="text-red-500 text-sm mt-1">Door No is required.</div>
                            </div>
                        </div>

                        <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t border-gray-200">
                            <button type="button" (click)="closeMapModal()" class="w-full sm:w-auto px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">Cancel</button>

                            <button
                                type="button"
                                (click)="removeMapping()"
                                *ngIf="selectedItem?.isMapped"
                                class="w-full sm:w-auto px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                            >
                                Remove Mapping
                            </button>
                            <button
                                type="submit"
                                [disabled]="!mapCustomerForm.valid"
                                class="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
})
export class DeliveryOptimization implements OnInit, OnDestroy {
    showMapModal = false;
    selectedItem: DeliveryItem | null = null; //
    selectedItemIndex = -1;
    selectedLocationIndex = 0;
    mapCustomerForm: FormGroup;
    availableCustomers = ["Nayara Martin's", 'Ana Possari', 'Sophie Kalbach Mardon', 'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Sunita Devi', 'Ramesh Gupta', 'Kavya Reddy', 'Vikram Singh']; //

    pageSize = 10; // Number of items per page.
    currentPage = 1; // Current page number.

    // Expose Math to the template
    public Math = Math;

    private subscriptions: Subscription = new Subscription();

    locations: LocationData[] = [
        //
        {
            name: 'Adarsh Palm Meadows',
            totalDeliveries: 20,
            completedDeliveries: 0,
            pendingDeliveries: 0,
            totalValue: 150000.0 // Sample Indian Rupee value
        },
        {
            name: 'Green Valley Residency', //
            totalDeliveries: 20,
            completedDeliveries: 0,
            pendingDeliveries: 0,
            totalValue: 220000.0
        },
        {
            name: 'Sunrise Apartments',
            totalDeliveries: 20, //
            completedDeliveries: 0,
            pendingDeliveries: 0,
            totalValue: 180000.0
        },
        {
            name: 'Royal Gardens',
            totalDeliveries: 20,
            completedDeliveries: 0,
            pendingDeliveries: 0,
            totalValue: 195000.0
        },
        {
            name: 'Crystal Heights', //
            totalDeliveries: 20,
            completedDeliveries: 0,
            pendingDeliveries: 0,
            totalValue: 160000.0
        },
        {
            name: 'Serene Villas',
            totalDeliveries: 20, //
            completedDeliveries: 0,
            pendingDeliveries: 0,
            totalValue: 210000.0
        },
        {
            name: 'Paradise Homes',
            totalDeliveries: 20,
            completedDeliveries: 0,
            pendingDeliveries: 0,
            totalValue: 230000.0
        },
        {
            name: 'Golden Oaks', //
            totalDeliveries: 20,
            completedDeliveries: 0,
            pendingDeliveries: 0,
            totalValue: 170000.0
        },
        {
            name: 'Silver Springs',
            totalDeliveries: 20, //
            completedDeliveries: 0,
            pendingDeliveries: 0,
            totalValue: 205000.0
        },
        {
            name: 'Emerald Gardens',
            totalDeliveries: 20, //
            completedDeliveries: 0,
            pendingDeliveries: 0,
            totalValue: 175000.0
        }
    ];

    deliveryDataSets: DeliveryItem[][] = [
        // Adarsh Palm Meadows data (total 20 items)
        [
            { deliveryRank: 1, block: '', phase: 'Phase2', doorNo: '282', customerDoorNo: '', customerName: '', isMapped: false },
            { deliveryRank: 2, block: '', phase: 'Phase2', doorNo: '281', customerDoorNo: '281, Phase2', customerName: "Nayara Martin's", isMapped: true },
            { deliveryRank: 3, block: '', phase: 'Phase2', doorNo: '280', customerDoorNo: '', customerName: '', isMapped: false }, //
            { deliveryRank: 4, block: '', phase: 'Phase2', doorNo: '278', customerDoorNo: '', customerName: '', isMapped: false },
            { deliveryRank: 5, block: '', phase: 'Phase2', doorNo: '277', customerDoorNo: '277, Phase2', customerName: 'Ana Possari', isMapped: true },
            { deliveryRank: 6, block: '', phase: 'Phase2', doorNo: '276', customerDoorNo: '', customerName: '', isMapped: false }, //
            { deliveryRank: 7, block: '', phase: 'Phase2', doorNo: '275', customerDoorNo: '', customerName: '', isMapped: false },
            { deliveryRank: 8, block: '', phase: 'Phase2', doorNo: '274', customerDoorNo: '', customerName: '', isMapped: false },
            { deliveryRank: 9, block: '', phase: 'Phase2', doorNo: '273', customerDoorNo: '', customerName: '', isMapped: false },
            { deliveryRank: 10, block: '', phase: 'Phase2', doorNo: '294', customerDoorNo: '', customerName: '', isMapped: false }, //
            { deliveryRank: 11, block: '', phase: 'Phase2', doorNo: '293', customerDoorNo: '', customerName: '', isMapped: false },
            { deliveryRank: 12, block: '', phase: 'Phase2', doorNo: '292', customerDoorNo: '', customerName: '', isMapped: false },
            { deliveryRank: 13, block: '', phase: 'Phase2', doorNo: '291', customerDoorNo: '', customerName: '', isMapped: false },
            { deliveryRank: 14, block: '', phase: 'Phase2', doorNo: '290', customerDoorNo: '', customerName: '', isMapped: false }, //
            { deliveryRank: 15, block: '', phase: 'Phase2', doorNo: '289', customerDoorNo: '', customerName: '', isMapped: false },
            { deliveryRank: 16, block: '', phase: 'Phase2', doorNo: '288', customerDoorNo: '', customerName: '', isMapped: false },
            { deliveryRank: 17, block: '', phase: 'Phase2', doorNo: '287', customerDoorNo: '287, Phase2', customerName: 'Sophie Kalbach Mardon', isMapped: true }, //
            { deliveryRank: 18, block: '', phase: 'Phase2', doorNo: '286', customerDoorNo: '', customerName: '', isMapped: false },
            { deliveryRank: 19, block: '', phase: 'Phase2', doorNo: '285', customerDoorNo: '', customerName: '', isMapped: false },
            { deliveryRank: 20, block: '', phase: 'Phase2', doorNo: '284', customerDoorNo: '', customerName: '', isMapped: false } // Added 20th item
        ],
        // Generate data for other locations, ensuring 20 items each and proper mapping status
        ...Array.from({ length: 9 }, (_, locationIndex) =>
            Array.from({ length: 20 }, (_, i) => {
                // Force 20 items for each location
                const isMapped = Math.random() > 0.7;
                const customerName = isMapped ? this.availableCustomers[Math.floor(Math.random() * this.availableCustomers.length)] : '';
                const customerDoorNo = isMapped ? `${300 + i + locationIndex * 50}, Phase${Math.floor(Math.random() * 3) + 1}` : '';

                return {
                    deliveryRank: i + 1,
                    block: '',
                    phase: `Phase${Math.floor(Math.random() * 3) + 1}`,
                    doorNo: (300 + i + locationIndex * 50).toString(),
                    customerDoorNo: customerDoorNo,
                    customerName: customerName,
                    isMapped: isMapped
                };
            })
        )
    ]; // , , ,

    constructor(private fb: FormBuilder) {
        //
        this.mapCustomerForm = this.fb.group({
            deliveryRank: [{ value: '', disabled: true }, Validators.required],
            block: ['', Validators.required],
            customerName: ['', Validators.required],
            customerDoorNo: ['', Validators.required],
            phase: [{ value: '', disabled: true }, Validators.required],
            doorNo: ['', Validators.required]
        }); //
    }

    ngOnInit() {
        //
        this.updateLocationStats();
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    get currentLocation(): LocationData {
        return this.locations[this.selectedLocationIndex]; //
    }

    get currentDeliveryData(): DeliveryItem[] {
        return this.deliveryDataSets[this.selectedLocationIndex]; //
    }

    // Pagination getters
    get paginatedDeliveryData(): DeliveryItem[] {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        return this.currentDeliveryData.slice(startIndex, startIndex + this.pageSize);
    }

    get totalPages(): number {
        return Math.ceil(this.currentDeliveryData.length / this.pageSize);
    }

    get pageNumbers(): number[] {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    goToPage(page: number) {
        this.currentPage = page;
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
        }
    }

    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
        }
    }

    switchLocation(locationIndex: number) {
        this.selectedLocationIndex = locationIndex;
        this.currentPage = 1; // Reset to first page on location switch
        this.updateLocationStats(); //
    }

    updateLocationStats() {
        const currentData = this.currentDeliveryData; //
        const mapped = currentData.filter((item) => item.isMapped).length;
        const unmapped = currentData.length - mapped;
        // Placeholder for total value calculation - adjust as per your actual business logic
        const totalValue = currentData.length * 7500; // Example: ₹7500 per delivery

        this.locations[this.selectedLocationIndex] = {
            ...this.locations[this.selectedLocationIndex],
            completedDeliveries: mapped,
            pendingDeliveries: unmapped,
            totalDeliveries: currentData.length,
            totalValue: totalValue
        }; //
    }

    openMapCustomer(item: DeliveryItem, index: number) {
        this.selectedItem = { ...item }; //
        this.selectedItemIndex = index; //
        this.showMapModal = true;

        this.mapCustomerForm.patchValue({
            deliveryRank: item.deliveryRank,
            block: item.block,
            customerName: item.customerName,
            customerDoorNo: item.customerDoorNo,
            phase: item.phase,
            doorNo: item.doorNo
        }); //
    }

    closeMapModal() {
        this.showMapModal = false;
        this.selectedItem = null; //
        this.selectedItemIndex = -1;
        this.mapCustomerForm.reset();
    }

    saveMapping() {
        if (this.mapCustomerForm.valid && this.selectedItemIndex >= 0) {
            const formValue = this.mapCustomerForm.value; //
            const updatedItem: DeliveryItem = {
                ...this.selectedItem!,
                block: formValue.block,
                customerName: formValue.customerName,
                customerDoorNo: formValue.customerDoorNo,
                doorNo: formValue.doorNo,
                isMapped: true //
            };
            this.deliveryDataSets[this.selectedLocationIndex][this.selectedItemIndex] = updatedItem; //
            this.updateLocationStats();
            this.closeMapModal();

            this.showSuccessMessage('Customer mapped successfully!');
        }
    }

    removeMapping() {
        if (this.selectedItemIndex >= 0) {
            const updatedItem: DeliveryItem = {
                ...this.selectedItem!,
                customerName: '',
                customerDoorNo: '',
                isMapped: false //
            };
            this.deliveryDataSets[this.selectedLocationIndex][this.selectedItemIndex] = updatedItem; //
            this.updateLocationStats();
            this.closeMapModal();

            this.showSuccessMessage('Customer mapping removed successfully!');
        }
    }

    refreshData() {
        this.updateLocationStats(); //
        this.showSuccessMessage('Data refreshed successfully!');
    }

    uploadComDetails() {
        // Create a file input element
        const input = document.createElement('input'); //
        input.type = 'file';
        input.accept = '.csv,.xlsx,.xls';
        input.style.display = 'none';

        input.onchange = (event: any) => {
            const file = event.target.files[0]; //
            if (file) {
                console.log('File selected:', file.name);
                this.showSuccessMessage(`File "${file.name}" uploaded successfully!`);
            }
        };
        document.body.appendChild(input); //
        input.click();
        document.body.removeChild(input);
    }

    downloadComDetails() {
        const currentData = this.currentDeliveryData; //

        // Map data to a format suitable for Excel
        const wsData = currentData.map((item) => ({
            'Delivery Rank': item.deliveryRank,
            Block: item.block || 'N/A',
            Phase: item.phase,
            'Door No': item.doorNo,
            'Customer Door No': item.customerDoorNo || 'N/A',
            'Customer Name': item.customerName || 'N/A',
            Status: item.isMapped ? 'Mapped' : 'Unmapped'
        }));

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(wsData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Delivery Details');

        const fileName = `${this.currentLocation.name.replace(/\s+/g, '_')}_delivery_details.xlsx`;
        XLSX.writeFile(wb, fileName);

        this.showSuccessMessage('Delivery details downloaded successfully!'); //
    }

    showDeliveryList() {
        // This would typically navigate to a delivery list view
        console.log('Showing delivery list for:', this.currentLocation.name); //
        this.showSuccessMessage('Opening delivery list...');
    }

    // Removed convertToCSV as we are now downloading Excel
    // private convertToCSV(data: DeliveryItem[]): string {
    //     const headers = ['Delivery Rank', 'Block', 'Phase', 'Door No', 'Customer Door No', 'Customer Name', 'Status']; //
    //     const csvRows = [headers.join(',')];

    //     data.forEach((item) => {
    //         const row = [item.deliveryRank, item.block || 'N/A', item.phase, item.doorNo, item.customerDoorNo || 'N/A', item.customerName || 'N/A', item.isMapped ? 'Mapped' : 'Unmapped'];
    //         csvRows.push(row.join(','));
    //     });
    //     return csvRows.join('\n'); //
    // }

    private showSuccessMessage(message: string) {
        // Create a temporary success message element
        const messageDiv = document.createElement('div'); //
        messageDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300';
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv); //
        // Remove the message after 3 seconds
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(messageDiv)) {
                    document.body.removeChild(messageDiv);
                }
            }, 300); //
        }, 3000); //
    }
}
