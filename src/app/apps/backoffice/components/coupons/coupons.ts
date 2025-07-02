// ==========================================================
// src/app/apps/backoffice/components/coupons/coupons.ts
// Minimal shell component for Coupons, importing and utilizing modular logic.
// Updated: Enhanced responsiveness while maintaining all original functionality,
//          and refactored to use the new Coupon interface and enums from interfaces.ts.
//          Fixed 'getCouponStatusString' error.
//          Reverted 'Actions' column to only Edit and Delete icons as requested.
//          Improved mobile readability of coupon list items by adjusting label font weight.
// ==========================================================
import { Component, OnInit, OnDestroy } from '@angular/core'; // Added OnDestroy
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule for HTTP client functionality

// Import all modular logic classes and interfaces
import { Coupon, DiscountTypeEnum, CouponStatusEnum, CouponTypeEnum } from './interfaces';
import { CouponData } from './components/coupon-data'; // The service we made injectable
import { CouponFiltering } from './components/coupon-filtering';
import { CouponModals } from './components/coupon-modals';
import { CouponStats } from './components/coupon-stats';
import { CouponDisplayUtils } from './components/coupon-display-utils';
import { CouponSelection } from './components/coupon-selection';
import { Observable, Subscription } from 'rxjs'; // Import Subscription for managing subscriptions

@Component({
    selector: 'app-coupons',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule, HttpClientModule], // Add HttpClientModule here
    template: `
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <div class="min-h-screen bg-gray-50 p-4 lg:p-8">
            <div class="max-w-7xl mx-auto">
                <div class="mb-4">
                    <button
                        routerLink="../"
                        class="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors duration-200 shadow-md flex items-center space-x-1 sm:space-x-2 w-auto"
                    >
                        <svg class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            ></path>
                        </svg>
                        <span class="whitespace-nowrap">Back to Home</span>
                    </button>
                </div>
                <div class="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-8">
                    <div class="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                        <div class="flex-1">
                            <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Coupon Management</h1>
                            <p class="text-gray-600 text-sm lg:text-base">Create, manage, and track your discount coupons and promotional offers</p>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-3 xl:flex-shrink-0 xl:min-w-fit">
                            <button
                                (click)="couponModals.showCreateModal('Generate')"
                                class="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-5 py-2.5 lg:px-6 lg:py-3 rounded-lg font-semibold text-sm lg:text-base transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 min-w-[160px] sm:min-w-[180px]"
                            >
                                <i class="fas fa-plus text-sm lg:text-base"></i>
                                <span class="whitespace-nowrap">Generate Coupon</span>
                            </button>
                            <button
                                (click)="couponModals.showCreateModal('Community')"
                                class="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2.5 lg:px-6 lg:py-3 rounded-lg font-semibold text-sm lg:text-base transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2.5 min-w-[160px] sm:min-w-[180px]"
                            >
                                <i class="fas fa-users text-sm lg:text-base"></i>
                                <span class="whitespace-nowrap">Community Coupon</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow duration-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Coupons</h3>
                                <p class="text-3xl font-bold text-purple-700 mt-2">{{ couponStats.getTotalCoupons() }}</p>
                            </div>
                            <div class="p-3 bg-purple-100 rounded-full">
                                <i class="fas fa-ticket-alt text-purple-600 text-xl"></i>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-sm font-medium text-gray-600 uppercase tracking-wide">Active Coupons</h3>
                                <p class="text-3xl font-bold text-green-700 mt-2">{{ couponStats.getActiveCoupons() }}</p>
                            </div>
                            <div class="p-3 bg-green-100 rounded-full">
                                <i class="fas fa-check-circle text-green-600 text-xl"></i>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Usage</h3>
                                <p class="text-3xl font-bold text-blue-700 mt-2">{{ couponStats.getTotalUsage() }}</p>
                            </div>
                            <div class="p-3 bg-blue-100 rounded-full">
                                <i class="fas fa-chart-line text-blue-600 text-xl"></i>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow duration-200">
                        <div class="flex items-center justify-between">
                            <div>
                                <h3 class="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Savings</h3>
                                <p class="text-3xl font-bold text-orange-700 mt-2">₹{{ couponStats.getTotalSavings().toLocaleString() }}</p>
                            </div>
                            <div class="p-3 bg-orange-100 rounded-full">
                                <i class="fas fa-rupee-sign text-orange-600 text-xl"></i>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                        <div class="flex flex-col sm:flex-row gap-4 flex-1">
                            <div class="relative">
                                <input
                                    type="text"
                                    [(ngModel)]="couponFiltering.searchTerm"
                                    (input)="applyFilterAndSelectionUpdate()"
                                    placeholder="Search coupons by name..."
                                    class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64"
                                />
                                <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                            </div>
                            <select [(ngModel)]="couponFiltering.statusFilter" (change)="applyFilterAndSelectionUpdate()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option value="">All Status</option>
                                <option [value]="CouponStatusEnum.Active">Active</option>
                                <option [value]="CouponStatusEnum.Expired">Expired</option>
                                <option [value]="CouponStatusEnum.Inactive">Used</option>
                            </select>
                            <select [(ngModel)]="couponFiltering.typeFilter" (change)="applyFilterAndSelectionUpdate()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option value="">All Types</option>
                                <option [value]="CouponTypeEnum.Generated">Generated</option>
                                <option [value]="CouponTypeEnum.Community">Community</option>
                            </select>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-2">
                            <button
                                (click)="deleteSelectedCouponsAndRefresh()"
                                [disabled]="couponSelection.selectedCoupons.length === 0"
                                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <i class="fas fa-trash"></i> Delete Selected
                            </button>
                            <button (click)="deleteExpiredCouponsAndRefresh()" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
                                <i class="fas fa-trash"></i> Delete Expired
                            </button>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div class="p-6 border-b border-gray-200">
                        <h3 class="text-xl font-semibold text-gray-900">Coupon List</h3>
                    </div>
                    <div class="hidden lg:block overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            [checked]="couponSelection.allCouponsSelected()"
                                            (change)="couponSelection.toggleAllSelections($event)"
                                            class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                                        />
                                    </th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL No.</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comm/Customer Name</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon Name</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon Code</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount Type</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount Value</th>
                                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" class="relative px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr *ngFor="let coupon of couponFiltering.filteredCoupons; let i = index">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <input type="checkbox" [(ngModel)]="coupon.isSelected" (change)="couponSelection.toggleCouponSelection(coupon)" class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500" />
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ i + 1 }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ coupon.type === CouponTypeEnum.Community ? coupon.communityName || 'N/A' : coupon.customerName || 'N/A' }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ coupon.name }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ coupon.code }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ couponDisplayUtils.formatDate(coupon.endDate) }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {{ couponDisplayUtils.getDiscountTypeString(coupon.discountType) }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ coupon.discountValue }}{{ coupon.discountType === DiscountTypeEnum.Percentage ? '%' : '₹' }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span [class]="couponDisplayUtils.getCouponStatusClass(coupon.status)">
                                            {{ couponDisplayUtils.getCouponStatusString(coupon.status) }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div class="flex items-center space-x-2">
                                            <button (click)="editCouponAndOpenModal(coupon)" class="text-blue-600 hover:text-blue-900">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button (click)="deleteCouponAndRefresh(coupon.id)" class="text-red-600 hover:text-red-900">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr *ngIf="couponFiltering.filteredCoupons.length === 0">
                                    <td colspan="10" class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">No coupons found.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="lg:hidden">
                        <div *ngFor="let coupon of couponFiltering.filteredCoupons; let i = index" class="p-4 border-b border-gray-100 last:border-b-0">
                            <div class="flex items-center mb-3">
                                <input type="checkbox" [(ngModel)]="coupon.isSelected" (change)="couponSelection.toggleCouponSelection(coupon)" class="mr-3 w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500" />
                                <div class="flex justify-between items-start flex-1">
                                    <div>
                                        <p class="font-semibold text-lg text-gray-900">{{ coupon.name }}</p>
                                        <p class="text-sm text-gray-600 mt-1">Code: {{ coupon.code }}</p>
                                    </div>
                                    <span [class]="couponDisplayUtils.getCouponStatusClass(coupon.status)">
                                        {{ couponDisplayUtils.getCouponStatusString(coupon.status) }}
                                    </span>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="text-gray-600 font-semibold">SL #:</span>
                                    <span class="ml-1 text-gray-700">{{ i + 1 }}</span>
                                </div>
                                <div>
                                    <span class="text-gray-600 font-semibold">Expires:</span>
                                    <span class="ml-1 text-gray-700">{{ couponDisplayUtils.formatDate(coupon.endDate) }}</span>
                                </div>
                                <div>
                                    <span class="text-gray-600 font-semibold">Discount Type:</span>
                                    <span class="ml-1 text-gray-700">
                                        {{ couponDisplayUtils.getDiscountTypeString(coupon.discountType) }}
                                    </span>
                                </div>
                                <div>
                                    <span class="text-gray-600 font-semibold">Discount Value:</span>
                                    <span class="ml-1 text-gray-700">{{ coupon.discountValue }}{{ coupon.discountType === DiscountTypeEnum.Percentage ? '%' : '₹' }}</span>
                                </div>
                                <div>
                                    <span class="text-gray-600 font-semibold">Name:</span>
                                    <span class="ml-1 text-gray-700">
                                        {{ coupon.type === CouponTypeEnum.Community ? coupon.communityName || 'N/A' : coupon.customerName || 'N/A' }}
                                    </span>
                                </div>
                            </div>
                            <div class="flex justify-end space-x-2 mt-4">
                                <button (click)="editCouponAndOpenModal(coupon)" class="text-blue-600 hover:text-blue-900 p-2 rounded-full bg-blue-100">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button (click)="deleteCouponAndRefresh(coupon.id)" class="text-red-600 hover:text-red-900 p-2 rounded-full bg-red-100">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                        <div *ngIf="couponFiltering.filteredCoupons.length === 0" class="p-4 text-center text-gray-500">No coupons found.</div>
                    </div>
                </div>
            </div>

            <div *ngIf="couponModals.showModal" class="fixed inset-0 bg-gray-600 bg-opacity-75 h-screen w-screen flex items-center justify-center z-50">
                <div class="relative p-8 bg-white w-full max-w-md mx-auto rounded-lg shadow-xl flex flex-col max-h-[90vh]">
                    <h3 class="flex-shrink-0 text-2xl font-semibold text-gray-900 mb-6">{{ couponModals.editingCoupon ? 'Edit Coupon' : couponModals.modalType === 'Generate' ? 'Generate New Coupon' : 'Create Community Coupon' }}</h3>

                    <div class="flex-grow overflow-y-auto -mr-4 pr-4">
                        <form (ngSubmit)="saveCouponAndRefresh()" class="space-y-4">
                            <div>
                                <label for="couponName" class="block text-sm font-medium text-gray-700 mb-1">Coupon Name<span class="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    id="couponName"
                                    [(ngModel)]="couponModals.currentCoupon.name"
                                    name="couponName"
                                    required
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                />
                            </div>

                            <ng-container *ngIf="couponModals.modalType === 'Community'">
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label for="communityName" class="block text-sm font-medium text-gray-700 mb-1">Community Name <span class="text-red-500">*</span></label>
                                        <select
                                            id="communityName"
                                            [(ngModel)]="couponModals.currentCoupon.communityName"
                                            name="communityName"
                                            required
                                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                        >
                                            <option value="">Select Community</option>
                                            <option *ngFor="let option of couponModals.communityOptions" [value]="option">{{ option }}</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                        <input
                                            type="text"
                                            [value]="couponModals.currentCoupon.type === CouponTypeEnum.Community ? 'Community' : 'Generated'"
                                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed sm:text-sm"
                                            readonly
                                        />
                                    </div>
                                </div>
                            </ng-container>

                            <ng-container *ngIf="couponModals.modalType === 'Generate'">
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label for="customerName" class="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                                        <input
                                            type="text"
                                            id="customerName"
                                            [(ngModel)]="couponModals.currentCoupon.customerName"
                                            name="customerName"
                                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                        <input
                                            type="text"
                                            [value]="couponModals.currentCoupon.type === CouponTypeEnum.Community ? 'Community' : 'Generated'"
                                            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 cursor-not-allowed sm:text-sm"
                                            readonly
                                        />
                                    </div>
                                </div>
                            </ng-container>

                            <div>
                                <label for="couponCode" class="block text-sm font-medium text-gray-700 mb-1">Coupon Code<span class="text-red-500">*</span></label>
                                <div class="flex">
                                    <input
                                        type="text"
                                        id="couponCode"
                                        [(ngModel)]="couponModals.currentCoupon.code"
                                        name="couponCode"
                                        required
                                        class="mt-1 block w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                        [readonly]="couponModals.editingCoupon"
                                    />
                                </div>
                            </div>

                            <div>
                                <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    id="description"
                                    [(ngModel)]="couponModals.currentCoupon.description"
                                    name="description"
                                    rows="3"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                ></textarea>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label for="discountType" class="block text-sm font-medium text-gray-700 mb-1">Discount Type<span class="text-red-500">*</span></label>
                                    <select
                                        id="discountType"
                                        [(ngModel)]="couponModals.currentCoupon.discountType"
                                        name="discountType"
                                        required
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    >
                                        <option [value]="DiscountTypeEnum.Percentage">Percentage</option>
                                        <option [value]="DiscountTypeEnum.Fixed">Fixed Amount</option>
                                    </select>
                                </div>
                                <div>
                                    <label for="discountValue" class="block text-sm font-medium text-gray-700 mb-1">Discount Value<span class="text-red-500">*</span></label>
                                    <input
                                        type="number"
                                        id="discountValue"
                                        [(ngModel)]="couponModals.currentCoupon.discountValue"
                                        name="discountValue"
                                        required
                                        min="0"
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label for="startDate" class="block text-sm font-medium text-gray-700 mb-1">Start Date<span class="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        id="startDate"
                                        [(ngModel)]="couponModals.currentCoupon.startDate"
                                        name="startDate"
                                        required
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    />
                                </div>
                                <div>
                                    <label for="endDate" class="block text-sm font-medium text-gray-700 mb-1">End Date<span class="text-red-500">*</span></label>
                                    <input
                                        type="date"
                                        id="endDate"
                                        [(ngModel)]="couponModals.currentCoupon.endDate"
                                        name="endDate"
                                        required
                                        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label for="maxUsage" class="block text-sm font-medium text-gray-700 mb-1">Max Usage (Optional)</label>
                                <input
                                    type="number"
                                    id="maxUsage"
                                    [(ngModel)]="couponModals.currentCoupon.maxUsage"
                                    name="maxUsage"
                                    min="0"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                />
                            </div>

                            <div>
                                <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Status<span class="text-red-500">*</span></label>
                                <select
                                    id="status"
                                    [(ngModel)]="couponModals.currentCoupon.status"
                                    name="status"
                                    required
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                >
                                    <option [value]="CouponStatusEnum.Active">Active</option>
                                    <option [value]="CouponStatusEnum.Inactive">Inactive</option>
                                    <option [value]="CouponStatusEnum.Expired">Expired</option>
                                </select>
                            </div>

                            <div class="pt-4 flex-shrink-0">
                                <div class="flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        (click)="couponModals.closeModal()"
                                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" class="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                                        {{ couponModals.editingCoupon ? 'Update Coupon' : 'Add Coupon' }}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `,
    styleUrls: []
})
export class CouponsComponent implements OnInit, OnDestroy {
    // Added OnDestroy
    // Inject the CouponData service, and other helper services
    constructor(
        public couponData: CouponData, // Inject CouponData
        public couponFiltering: CouponFiltering,
        public couponModals: CouponModals,
        public couponStats: CouponStats,
        public couponDisplayUtils: CouponDisplayUtils,
        public couponSelection: CouponSelection
    ) {
        // Pass the injected couponData instance to other helper classes that need it
        // Note: For CouponFiltering, CouponModals, CouponStats, CouponSelection to properly use
        // the *injected* CouponData, they should also be @Injectable() services and injected
        // directly by Angular. The manual instantiation below is a workaround if they are not.
        // The most robust solution is to make all related classes `@Injectable()` and inject them.
        this.couponFiltering = new CouponFiltering(this.couponData);
        this.couponModals = new CouponModals(this.couponData, this.couponFiltering); // couponFiltering might also need to be injected
        this.couponStats = new CouponStats(this.couponData);
        this.couponDisplayUtils = new CouponDisplayUtils(); // No dependencies
        this.couponSelection = new CouponSelection(this.couponFiltering, this.couponData); // couponFiltering might also need to be injected

        console.log('Professional Coupon Management System loaded with API Integration!');
    }

    // Expose enums to the template
    public CouponStatusEnum = CouponStatusEnum;
    public DiscountTypeEnum = DiscountTypeEnum;
    public CouponTypeEnum = CouponTypeEnum;

    // A subscription to manage the data stream from CouponData service
    private couponsSubscription: Subscription | undefined;

    ngOnInit(): void {
        // Fetch all coupons when the component initializes
        this.couponsSubscription = this.couponData.getAllCoupons().subscribe({
            next: (coupons) => {
                // Initial data load and filter
                this.couponFiltering.allCoupons = coupons; // Update allCoupons in filtering
                this.couponFiltering.filterCoupons(); // Apply initial filters
                this.couponStats.updateStats(); // Update stats based on fetched data
            },
            error: (err) => console.error('Error fetching coupons on init:', err)
        });

        // Subscribe to changes in allCoupons$ from CouponData
        this.couponData.allCoupons$.subscribe((coupons) => {
            this.couponFiltering.allCoupons = coupons; // Keep the filtering service updated
            this.couponFiltering.filterCoupons(); // Re-apply filter whenever data changes
            this.couponStats.updateStats(); // Re-calculate stats
            // Re-select checked coupons based on the updated list
            this.couponSelection.selectedCoupons = this.couponFiltering.filteredCoupons.filter((c) => c.isSelected);
        });
    }

    // It's good practice to unsubscribe to prevent memory leaks
    ngOnDestroy(): void {
        if (this.couponsSubscription) {
            this.couponsSubscription.unsubscribe();
        }
    }

    // This method will now trigger filtering based on the data in couponData.allCoupons$ (which is kept updated by the service)
    applyFilterAndSelectionUpdate(): void {
        this.couponFiltering.filterCoupons();
        // Ensure selected coupons are still valid within the filtered list
        this.couponSelection.selectedCoupons = this.couponFiltering.filteredCoupons.filter((c) => c.isSelected);
    }

    // Handles saving a coupon (add or update)
    saveCouponAndRefresh(): void {
        if (this.couponModals.editingCoupon) {
            // Update existing coupon
            this.couponData.updateCoupon(this.couponModals.currentCoupon).subscribe({
                next: () => {
                    console.log('Coupon updated successfully!');
                    this.couponModals.closeModal();
                    // Data automatically refreshes via allCoupons$ subscription in ngOnInit
                },
                error: (err) => console.error('Error updating coupon:', err)
            });
        } else {
            // Add new coupon
            this.couponData.addCoupon(this.couponModals.currentCoupon).subscribe({
                next: () => {
                    console.log('Coupon added successfully!');
                    this.couponModals.closeModal();
                    // Data automatically refreshes via allCoupons$ subscription in ngOnInit
                },
                error: (err) => console.error('Error adding coupon:', err)
            });
        }
    }

    // Handles deleting a single coupon
    deleteCouponAndRefresh(id: number): void {
        if (confirm('Are you sure you want to delete this coupon?')) {
            this.couponData.deleteCoupon(id).subscribe({
                next: () => {
                    console.log(`Coupon with ID ${id} deleted successfully.`);
                    // Data automatically refreshes via allCoupons$ subscription in ngOnInit
                },
                error: (err) => console.error('Error deleting coupon:', err)
            });
        }
    }

    // Handles deleting all selected coupons
    deleteSelectedCouponsAndRefresh(): void {
        if (this.couponSelection.selectedCoupons.length === 0) {
            alert('No coupons selected for deletion.');
            return;
        }

        if (confirm(`Are you sure you want to delete ${this.couponSelection.selectedCoupons.length} selected coupon(s)?`)) {
            const deleteObservables = this.couponSelection.selectedCoupons.map((coupon) => this.couponData.deleteCoupon(coupon.id));

            let successCount = 0;
            let errorCount = 0;
            const totalToDelete = deleteObservables.length;

            deleteObservables.forEach((obs) => {
                obs.subscribe({
                    next: () => {
                        successCount++;
                        if (successCount + errorCount === totalToDelete) {
                            console.log(`Successfully deleted ${successCount} coupons. Failed to delete ${errorCount} coupons.`);
                            this.couponSelection.clearSelections(); // Clear selection after operations
                            // Data automatically refreshes via allCoupons$ subscription in ngOnInit
                        }
                    },
                    error: (err) => {
                        errorCount++;
                        console.error('Error deleting selected coupon:', err);
                        if (successCount + errorCount === totalToDelete) {
                            console.log(`Successfully deleted ${successCount} coupons. Failed to delete ${errorCount} coupons.`);
                            this.couponSelection.clearSelections();
                            // Data automatically refreshes via allCoupons$ subscription in ngOnInit
                        }
                    }
                });
            });
        }
    }

    // Handles deleting all expired coupons
    deleteExpiredCouponsAndRefresh(): void {
        const expiredCoupons = this.couponFiltering.allCoupons.filter((coupon) => coupon.status === CouponStatusEnum.Expired);

        if (expiredCoupons.length === 0) {
            alert('No expired coupons found to delete.');
            return;
        }

        if (confirm(`Are you sure you want to delete ${expiredCoupons.length} expired coupon(s)?`)) {
            const deleteObservables = expiredCoupons.map((coupon) => this.couponData.deleteCoupon(coupon.id));

            let successCount = 0;
            let errorCount = 0;
            const totalToDelete = deleteObservables.length;

            deleteObservables.forEach((obs) => {
                obs.subscribe({
                    next: () => {
                        successCount++;
                        if (successCount + errorCount === totalToDelete) {
                            console.log(`Successfully deleted ${successCount} expired coupons. Failed to delete ${errorCount} coupons.`);
                            // Data automatically refreshes via allCoupons$ subscription in ngOnInit
                        }
                    },
                    error: (err) => {
                        errorCount++;
                        console.error('Error deleting expired coupon:', err);
                        if (successCount + errorCount === totalToDelete) {
                            console.log(`Successfully deleted ${successCount} expired coupons. Failed to delete ${errorCount} coupons.`);
                            // Data automatically refreshes via allCoupons$ subscription in ngOnInit
                        }
                    }
                });
            });
        }
    }

    // Opens the edit modal with the selected coupon's data
    editCouponAndOpenModal(coupon: Coupon): void {
        this.couponModals.showEditModal(coupon);
    }
}
