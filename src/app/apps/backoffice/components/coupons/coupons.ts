// ==========================================================
// src/app/apps/backoffice/components/coupons/coupons.ts
// Minimal shell component for Coupons, importing and utilizing modular logic.
// Updated: Styles array and button classes reverted to their original state.
// ==========================================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
// Import all new modular logic classes and interfaces
import { Coupon } from './components/interfaces';
import { CouponData } from './components/coupon-data';
import { CouponFiltering } from './components/coupon-filtering';
import { CouponModals } from './components/coupon-modals';
import { CouponStats } from './components/coupon-stats';
import { CouponDisplayUtils } from './components/coupon-display-utils';
import { CouponSelection } from './components/coupon-selection';
@Component({
    selector: 'app-coupons',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    template: `
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <div
            class="min-h-screen bg-gray-50 
p-4 lg:p-8"
        >
            <div class="max-w-7xl mx-auto">
                <div class="mb-4">
                    <button
                        routerLink="../"
                        class="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors duration-200 shadow-md flex items-center space-x-1 
sm:space-x-2 w-auto"
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
                    <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <h1 class="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Coupon Management</h1>

                            <p class="text-gray-600">Create, manage, and track your discount coupons and promotional offers</p>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-3">
                            <button
                                (click)="couponModals.showCreateModal('Generate')"
                                class="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-colors duration-200 shadow-md"
                            >
                                <i class="fas fa-plus mr-2"></i>Generate Coupon
                            </button>
                            <button
                                (click)="couponModals.showCreateModal('Community')"
                                class="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-colors duration-200 shadow-md"
                            >
                                <i class="fas fa-users mr-2"></i>Community Coupon
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

                    <div
                        class="bg-white rounded-2xl 
shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-200"
                    >
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
                                    placeholder="Search coupons..."
                                    class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
focus:ring-purple-500 focus:border-transparent w-full sm:w-64"
                                />
                                <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                            </div>

                            <select [(ngModel)]="couponFiltering.statusFilter" (change)="applyFilterAndSelectionUpdate()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Expired">Expired</option>
                                <option value="Inactive">Used</option>
                            </select>

                            <select [(ngModel)]="couponFiltering.typeFilter" (change)="applyFilterAndSelectionUpdate()" class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option value="">All Types</option>
                                <option value="Generate">Generated</option>
                                <option value="Community">Community</option>
                            </select>
                        </div>

                        <div class="flex flex-col sm:flex-row gap-2">
                            <button
                                (click)="couponSelection.deleteSelectedCoupons()"
                                [disabled]="couponSelection.selectedCoupons.length === 0"
                                class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <i class="fas fa-trash"></i>
                                Delete Selected
                            </button>

                            <button (click)="couponSelection.deleteExpiredCoupons()" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">
                                <i class="fas fa-trash"></i>
                                Delete Expired
                            </button>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div class="p-6 border-b border-gray-200">
                        <h3 class="text-xl font-semibold text-gray-900">Coupon List</h3>
                    </div>

                    <div class="lg:hidden">
                        <div *ngFor="let coupon of couponFiltering.filteredCoupons; let i = index" class="p-4 border-b border-gray-100 last:border-b-0">
                            <div class="flex items-center mb-3">
                                <input type="checkbox" [(ngModel)]="coupon.isSelected" (change)="couponSelection.toggleCouponSelection(coupon)" class="mr-3 w-5 h-5 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500" />

                                <div class="flex justify-between items-start flex-1">
                                    <div>
                                        <p class="font-semibold text-lg text-gray-900">{{ coupon.code }}</p>

                                        <p class="text-sm text-gray-600 mt-1">{{ coupon.description }}</p>
                                    </div>

                                    <span [class]="couponDisplayUtils.getCouponStatusClass(coupon.status)">{{ coupon.status === 'Inactive' ? 'Used' : coupon.status }}</span>
                                </div>
                            </div>

                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="text-gray-600">SL #:</span>
                                    <span class="font-medium ml-1">{{ i + 1 }}</span>
                                </div>
                                <div *ngIf="coupon.type === 'Generate'">
                                    <span class="text-gray-600">Customer:</span>
                                    <span class="font-medium ml-1">{{ coupon.customerName || 'N/A' }}</span>
                                </div>
                                <div *ngIf="coupon.type === 'Community'">
                                    <span class="text-gray-600">Community:</span>
                                    <span class="font-medium ml-1">{{ coupon.communityName || 'N/A' }}</span>
                                </div>
                                <div>
                                    <span class="text-gray-600">Discount:</span>
                                    <span class="font-medium ml-1">
                                        {{ coupon.discountType === 'percentage' ? coupon.discountValue + '%' : '₹' + coupon.discountValue }}
                                    </span>
                                </div>

                                <div>
                                    <span class="text-gray-600">Type:</span>
                                    <span [class]="couponDisplayUtils.getCouponTypeClass(coupon.type)">{{ coupon.type }}</span>
                                </div>
                                <div>
                                    <span class="text-gray-600">Usage:</span>
                                    <span class="font-medium ml-1">{{ coupon.usageCount }}</span>
                                </div>
                                <div>
                                    <span class="text-gray-600">Expires:</span>
                                    <span class="font-medium ml-1">{{ couponDisplayUtils.formatDate(coupon.endDate) }}</span>
                                </div>
                            </div>

                            <div class="flex gap-2 mt-4">
                                <button
                                    (click)="couponModals.editCoupon(coupon)"
                                    class="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors 
duration-200"
                                >
                                    <i class="fas fa-edit mr-1"></i>Edit
                                </button>

                                <button (click)="couponSelection.deleteCoupon(coupon.id)" class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200">
                                    <i class="fas fa-trash mr-1"></i>Delete
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="hidden lg:block overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            (change)="couponSelection.toggleAllSelections($event)"
                                            [checked]="couponSelection.allCouponsSelected()"
                                            class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                                        />
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SL #</th>
                                    <th
                                        class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase 
tracking-wider"
                                    >
                                        Customer/Community Name
                                    </th>

                                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon Number</th>
                                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coupon Code</th>

                                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount Type</th>

                                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount Value</th>
                                    <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr *ngFor="let coupon of couponFiltering.filteredCoupons; let i = index" class="hover:bg-gray-50 transition-colors duration-200">
                                    <td class="px-6 py-4">
                                        <input type="checkbox" [(ngModel)]="coupon.isSelected" (change)="couponSelection.toggleCouponSelection(coupon)" class="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500" />
                                    </td>
                                    <td class="px-6 py-4">{{ i + 1 }}</td>

                                    <td class="px-6 py-4">
                                        <p class="text-sm text-gray-600">
                                            <span *ngIf="coupon.type === 'Generate'">{{ coupon.customerName || 'N/A' }}</span>
                                            <span *ngIf="coupon.type === 'Community'">{{ coupon.communityName || 'N/A' }}</span>
                                        </p>
                                    </td>
                                    <td class="px-6 py-4 font-semibold text-gray-900">{{ coupon.code }}</td>

                                    <td class="px-6 py-4 text-gray-700">
                                        <span [class]="couponDisplayUtils.getCouponTypeClass(coupon.type)">{{ coupon.type }}</span>
                                    </td>

                                    <td class="px-6 py-4 text-sm text-gray-600">{{ couponDisplayUtils.formatDate(coupon.endDate) }}</td>
                                    <td class="px-6 py-4">
                                        <span class="text-sm font-medium">
                                            {{ coupon.discountType === 'percentage' ? '%' : '₹' }}
                                        </span>
                                    </td>

                                    <td class="px-6 py-4 font-semibold">
                                        {{ coupon.discountType === 'percentage' ? coupon.discountValue + '%' : '₹' + coupon.discountValue }}
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="flex gap-2 justify-center items-center">
                                            <button
                                                *ngIf="coupon.status === 'Active'"
                                                (click)="couponSelection.updateCouponStatus(coupon.id, 'Inactive')"
                                                class="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 rounded-full text-xs font-semibold transition-colors duration-200 flex items-center gap-1"
                                                title="Mark as Used"
                                            >
                                                <i class="fas fa-check-circle"></i>Used
                                            </button>
                                            <span *ngIf="coupon.status === 'Expired'" [class]="couponDisplayUtils.getCouponStatusClass(coupon.status)">Expired</span>

                                            <span *ngIf="coupon.status === 'Inactive'" [class]="couponDisplayUtils.getCouponStatusClass(coupon.status)">Used</span>
                                            <button (click)="couponModals.editCoupon(coupon)" class="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors duration-200" title="Edit Coupon">
                                                <i class="fas fa-edit"></i>
                                            </button>

                                            <button (click)="couponSelection.deleteCoupon(coupon.id)" class="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-lg transition-colors duration-200" title="Delete Coupon">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div *ngIf="couponFiltering.filteredCoupons.length === 0" class="text-center py-12">
                        <i class="fas fa-ticket-alt text-gray-300 text-6xl mb-4"></i>
                        <h3 class="text-lg font-medium text-gray-900 mb-2">No coupons found</h3>
                        <p class="text-gray-600">Try adjusting your search or filter criteria</p>
                    </div>
                </div>
            </div>
        </div>

        <div *ngIf="couponModals.showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-screen overflow-y-auto">
                <div class="p-6 border-b border-gray-200">
                    <h2 class="text-xl font-semibold text-gray-900">{{ couponModals.editingCoupon ? 'Edit' : 'Create' }} {{ couponModals.modalType }} Coupon</h2>
                </div>

                <form (ngSubmit)="couponModals.saveCoupon()" class="p-6 space-y-4">
                    <div *ngIf="couponModals.modalType === 'Community'">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Community Name</label>

                        <select [(ngModel)]="couponModals.currentCoupon.communityName" name="communityName" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                            <option value="">Select Community</option>
                            <option *ngFor="let community of couponModals.communityOptions" [value]="community">{{ community }}</option>
                        </select>
                    </div>

                    <div *ngIf="couponModals.modalType === 'Generate'">
                        <label class="block text-sm font-medium text-gray-700 mb-2">Number of Coupons</label>
                        <input
                            type="number"
                            [(ngModel)]="couponModals.numberOfCouponsToGenerate"
                            name="numberOfCoupons"
                            required
                            min="1"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter number of coupons to generate"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Coupon Code </label>
                        <input
                            type="text"
                            [(ngModel)]="couponModals.currentCoupon.code"
                            name="code"
                            [required]="couponModals.modalType === 'Community'"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter coupon code (auto-generated if empty)"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            [(ngModel)]="couponModals.currentCoupon.description"
                            name="description"
                            required
                            rows="3"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Enter coupon description"
                        ></textarea>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Discount Type</label>

                            <select [(ngModel)]="couponModals.currentCoupon.discountType" name="discountType" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (₹)</option>
                            </select>
                        </div>

                        <div>
                            <label
                                class="block text-sm 
font-medium text-gray-700 mb-2"
                                >Discount Value</label
                            >
                            <input
                                type="number"
                                [(ngModel)]="couponModals.currentCoupon.discountValue"
                                name="discountValue"
                                required
                                min="1"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Enter value"
                            />
                        </div>
                    </div>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                            <input type="date" [(ngModel)]="couponModals.currentCoupon.startDate" name="startDate" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                            <input type="date" [(ngModel)]="couponModals.currentCoupon.endDate" name="endDate" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
                        </div>
                    </div>

                    <div class="flex gap-3 pt-4">
                        <button type="button" (click)="couponModals.closeModal()" class="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">Cancel</button>

                        <button type="submit" class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                            {{ couponModals.editingCoupon ? 'Update' : 'Create' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `,
    styles: [] // Reverted to original empty styles array
})
export class Coupons implements OnInit {
    // Instantiate all logic classes
    couponData: CouponData;
    couponFiltering: CouponFiltering;
    couponModals: CouponModals;
    couponStats: CouponStats;
    couponDisplayUtils: CouponDisplayUtils;
    couponSelection: CouponSelection; // Added couponSelection instance

    constructor() {
        // Initialize instances, passing dependencies as needed
        this.couponData = new CouponData();
        this.couponFiltering = new CouponFiltering(this.couponData);
        // couponModals needs couponData and couponFiltering
        this.couponModals = new CouponModals(this.couponData, this.couponFiltering);
        // couponStats needs couponData
        this.couponStats = new CouponStats(this.couponData);
        // couponDisplayUtils has no dependencies
        this.couponDisplayUtils = new CouponDisplayUtils();
        // couponSelection needs couponFiltering and couponData
        this.couponSelection = new CouponSelection(this.couponFiltering, this.couponData);
        console.log('Professional Coupon Management System loaded!');
    }

    ngOnInit(): void {
        // Initial filtering is handled by the constructor of CouponFiltering.
        // No explicit calls needed here unless a specific re-initialization is required.
    }

    /**
     * Applies filters and updates the selection list after a filter change.
     * This method consolidates the logic that was causing parser errors in the template.
     */
    applyFilterAndSelectionUpdate(): void {
        this.couponFiltering.filterCoupons();
        this.couponSelection.selectedCoupons = this.couponFiltering.filteredCoupons.filter((c) => c.isSelected);
    }
}
