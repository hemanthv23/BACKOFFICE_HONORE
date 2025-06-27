// ================================
// src/app/apps/backoffice/components/inventory/inventory.ts
// The main Angular component for Inventory management.
// FIX: Reverted CSV export to direct download, removed clipboard functionality.
// ================================
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core'; // ViewChild and ElementRef are no longer strictly needed for export, but kept if you plan other uses.
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, interval, takeUntil } from 'rxjs';

// Import interfaces and services from their new paths
import { InventoryItem } from './components/interfaces';
import { InventoryDataService } from './components/inventory-data';
import { InventoryFilteringService } from './components/inventory-filtering';
import { InventoryModalsService } from './components/inventory-modals';
import { InventoryUtilsService } from './components/inventory-utils';

@Component({
    selector: 'app-inventory',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
    template: `
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

        <div class="p-4 sm:p-5 max-w-7xl mx-auto font-inter bg-slate-50 min-h-screen rounded-lg">
            <div class="mb-4">
                <button routerLink="../" class="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors duration-200 shadow-md flex items-center space-x-1 sm:space-x-2 w-auto">
                    <svg class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    <span class="whitespace-nowrap">Back to Home</span>
                </button>
            </div>
            <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Inventory Management</h1>
                        <p class="text-gray-600">Real-time inventory tracking for {{ currentDate | date: 'dd/MM/yyyy' }}</p>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <div class="flex items-center gap-2 text-sm opacity-90 text-gray-700">
                            <i class="fas fa-sync-alt"></i>
                            Last sync: {{ lastUpdate | date: 'HH:mm:ss' }}
                        </div>
                        <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors duration-200 text-sm sm:text-base" (click)="saveAllChanges()">
                            <i class="fas fa-save mr-2"></i>Save Changes
                        </button>
                        <button class="bg-gray-600 hover:bg-gray-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors duration-200 text-sm sm:text-base" (click)="exportData()">
                            <i class="fas fa-download mr-2"></i>Export
                        </button>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
                <!-- Search Box -->
                <div class="mb-4">
                    <div class="relative w-full">
                        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input
                            type="text"
                            placeholder="Search products..."
                            [(ngModel)]="searchTerm"
                            (input)="applyFilters()"
                            class="w-full pl-12 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:border-indigo-500 transition-colors duration-300"
                        />
                    </div>
                </div>

                <!-- Category Buttons -->
                <div class="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-5">
                    <button
                        *ngFor="let category of dataService.categories"
                        [class]="utilsService.getFilterButtonClass(category, selectedCategory)"
                        (click)="filterByCategory(category)"
                        class="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                    >
                        {{ category }}
                    </button>
                </div>

                <!-- Subcategory Buttons (conditional) -->
                <div *ngIf="selectedCategory === 'BREADS'" class="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-5">
                    <button
                        *ngFor="let subcat of dataService.breadSubcategories"
                        [class]="utilsService.getSubcategoryButtonClass(subcat, selectedSubCategory)"
                        (click)="filterBySubcategory(subcat)"
                        class="px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200"
                    >
                        {{ subcat }}
                    </button>
                </div>

                <!-- Dropdowns and Reset Button -->
                <div class="flex flex-col md:flex-row md:items-center justify-start gap-3 sm:gap-4 flex-wrap">
                    <select [(ngModel)]="stockFilter" (change)="applyFilters()" class="p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg bg-white cursor-pointer min-w-[140px] sm:min-w-[150px] text-sm sm:text-base">
                        <option value="">All Stock Levels</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Low Stock">Low Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                    </select>
                    <select [(ngModel)]="sortBy" (change)="applySorting()" class="p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg bg-white cursor-pointer min-w-[140px] sm:min-w-[150px] text-sm sm:text-base">
                        <option value="productName">Sort by Name</option>
                        <option value="currentBal">Sort by Stock</option>
                        <option value="category">Sort by Category</option>
                        <option value="lastUpdated">Sort by Last Updated</option>
                    </select>

                    <button
                        class="py-2.5 px-5 sm:py-3 sm:px-6 bg-transparent border-2 border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm transition-all duration-300 flex items-center gap-2 hover:bg-gray-100 hover:border-gray-400 text-sm sm:text-base"
                        (click)="resetFilters()"
                    >
                        <i class="fas fa-times"></i>
                        Reset
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
                <div class="bg-white rounded-xl p-5 sm:p-6 flex items-center gap-4 sm:gap-5 shadow-lg transition-transform duration-300 hover:-translate-y-1">
                    <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-white text-2xl sm:text-3xl bg-emerald-500">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="flex-grow">
                        <h3 class="text-3xl sm:text-4xl font-bold m-0 text-gray-800">{{ utilsService.getStockCount(filteredItems, 'In Stock') }}</h3>
                        <p class="mt-1 text-gray-600 font-medium text-sm sm:text-base">Items In Stock</p>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-5 sm:p-6 flex items-center gap-4 sm:gap-5 shadow-lg transition-transform duration-300 hover:-translate-y-1">
                    <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-white text-2xl sm:text-3xl bg-amber-500">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="flex-grow">
                        <h3 class="text-3xl sm:text-4xl font-bold m-0 text-gray-800">{{ utilsService.getStockCount(filteredItems, 'Low Stock') }}</h3>
                        <p class="mt-1 text-gray-600 font-medium text-sm sm:text-base">Low Stock Items</p>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-5 sm:p-6 flex items-center gap-4 sm:gap-5 shadow-lg transition-transform duration-300 hover:-translate-y-1">
                    <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-white text-2xl sm:text-3xl bg-red-500">
                        <i class="fas fa-times-circle"></i>
                    </div>
                    <div class="flex-grow">
                        <h3 class="text-3xl sm:text-4xl font-bold m-0 text-gray-800">{{ utilsService.getStockCount(filteredItems, 'Out of Stock') }}</h3>
                        <p class="mt-1 text-gray-600 font-medium text-sm sm:text-base">Out of Stock</p>
                    </div>
                </div>
                <div class="bg-white rounded-xl p-5 sm:p-6 flex items-center gap-4 sm:gap-5 shadow-lg transition-transform duration-300 hover:-translate-y-1">
                    <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center text-white text-2xl sm:text-3xl bg-indigo-500">
                        <i class="fas fa-boxes"></i>
                    </div>
                    <div class="flex-grow">
                        <h3 class="text-3xl sm:text-4xl font-bold m-0 text-gray-800">{{ utilsService.getTotalValue(filteredItems) }}</h3>
                        <p class="mt-1 text-gray-600 font-medium text-sm sm:text-base">Total Items</p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl overflow-hidden shadow-lg">
                <div class="p-4 sm:p-6 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center flex-wrap gap-3 sm:gap-4">
                    <h2 class="m-0 text-xl sm:text-2xl font-semibold text-gray-800">Inventory Details</h2>
                    <div class="flex gap-2 sm:gap-3">
                        <button class="py-2.5 px-5 sm:py-3 sm:px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 flex items-center gap-2 text-sm sm:text-base" (click)="addNewItem()">
                            <i class="fas fa-plus"></i>
                            Add Item
                        </button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full border-collapse text-xs sm:text-sm">
                        <thead>
                            <tr>
                                <th class="bg-gray-50 px-2 py-3 sm:px-3 sm:py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap">
                                    <input type="checkbox" class="rounded-md h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500" (change)="selectAll($event)" [checked]="allSelected" />
                                </th>
                                <th class="bg-gray-50 px-2 py-3 sm:px-3 sm:py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap">Product Name</th>
                                <th class="bg-gray-50 px-2 py-3 sm:px-3 sm:py-4 text-right font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap">Category</th>
                                <th class="bg-gray-50 px-2 py-3 sm:px-3 sm:py-4 text-right font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap">Production</th>
                                <th class="bg-gray-50 px-2 py-3 sm:px-3 sm:py-4 text-right font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap">Sample</th>
                                <th class="bg-gray-50 px-2 py-3 sm:px-3 sm:py-4 text-right font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap">Damaged</th>
                                <th class="bg-gray-50 px-2 py-3 sm:px-3 sm:py-4 text-right font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap">Ordered</th>
                                <th class="bg-gray-50 px-2 py-3 sm:px-3 sm:py-4 text-right font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap">Current Bal</th>
                                <th class="bg-gray-50 px-2 py-3 sm:px-3 sm:py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap">Status</th>
                                <th class="bg-gray-50 px-2 py-3 sm:px-3 sm:py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-200 whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                *ngFor="let item of getPaginatedItems(); let i = index"
                                class="hover:bg-gray-50 border-b border-gray-100"
                                [class.bg-blue-50]="item.id && selectedItems.has(item.id)"
                                [class.bg-amber-50]="item.status === 'Low Stock'"
                                [class.bg-red-50]="item.status === 'Out of Stock'"
                            >
                                <td class="px-2 py-3 sm:px-3 sm:py-4 align-middle">
                                    <input type="checkbox" class="rounded-md h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500" [checked]="item.id && selectedItems.has(item.id)" (change)="toggleSelection(item.id, $event)" />
                                </td>
                                <td class="px-2 py-3 sm:px-3 sm:py-4 align-middle min-w-[180px] sm:min-w-[200px]">
                                    <div class="text-gray-800 font-semibold">{{ item.productName }}</div>
                                    <span class="text-xs text-gray-500">#{{ item.id }}</span>
                                </td>
                                <td class="px-2 py-3 sm:px-3 sm:py-4 align-middle text-right font-medium">
                                    <div class="text-gray-800">{{ item.category }}</div>
                                    <div *ngIf="item.subCategory" class="text-xs text-gray-500">{{ item.subCategory }}</div>
                                </td>
                                <td class="px-2 py-3 sm:px-3 sm:py-4 align-middle text-right font-medium cursor-pointer transition-colors duration-200 hover:bg-gray-100" (click)="editCell(item.id, 'production')">
                                    <span *ngIf="!isEditing(item.id, 'production')">{{ item.production }}</span>
                                    <input
                                        *ngIf="isEditing(item.id, 'production')"
                                        type="number"
                                        [(ngModel)]="item.production"
                                        (blur)="finishEdit()"
                                        (keyup.enter)="finishEdit()"
                                        class="w-full px-1 py-0.5 border-2 border-indigo-500 rounded text-right focus:outline-none text-xs sm:text-sm"
                                    />
                                </td>
                                <td class="px-2 py-3 sm:px-3 sm:py-4 align-middle text-right font-medium">{{ item.sample }}</td>
                                <td class="px-2 py-3 sm:px-3 sm:py-4 align-middle text-right font-medium">{{ item.damaged }}</td>
                                <td class="px-2 py-3 sm:px-3 sm:py-4 align-middle text-right font-medium cursor-pointer transition-colors duration-200 hover:bg-gray-100" (click)="editCell(item.id, 'ordered')">
                                    <span *ngIf="!isEditing(item.id, 'ordered')">{{ item.ordered }}</span>
                                    <input
                                        *ngIf="isEditing(item.id, 'ordered')"
                                        type="number"
                                        [(ngModel)]="item.ordered"
                                        (blur)="finishEdit()"
                                        (keyup.enter)="finishEdit()"
                                        class="w-full px-1 py-0.5 border-2 border-indigo-500 rounded text-right focus:outline-none text-xs sm:text-sm"
                                    />
                                </td>
                                <td
                                    class="px-2 py-3 sm:px-3 sm:py-4 align-middle text-right font-medium"
                                    [class.text-amber-500]="item.currentBal < 50 && item.currentBal > 0"
                                    [class.font-semibold]="item.currentBal < 50 && item.currentBal > 0"
                                    [class.text-red-500]="item.currentBal <= 0"
                                    [class.font-bold]="item.currentBal <= 0"
                                >
                                    {{ item.currentBal }}
                                </td>
                                <td class="px-2 py-3 sm:px-3 sm:py-4 align-middle">
                                    <span class="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white" [ngClass]="utilsService.getStatusColorClass(item.status)">
                                        <i class="fas" [class.fa-check-circle]="item.status === 'In Stock'" [class.fa-exclamation-triangle]="item.status === 'Low Stock'" [class.fa-times-circle]="item.status === 'Out of Stock'"></i>
                                        {{ item.status }}
                                    </span>
                                </td>
                                <td class="px-2 py-3 sm:px-3 sm:py-4 align-middle flex gap-1">
                                    <button class="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center bg-sky-100 text-sky-700 hover:scale-110 transition-transform duration-200" (click)="editItem(item)" title="Edit">
                                        <i class="fas fa-edit text-sm"></i>
                                    </button>
                                    <button class="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center bg-purple-100 text-purple-700 hover:scale-110 transition-transform duration-200" (click)="viewDetails(item)" title="View Details">
                                        <i class="fas fa-eye text-sm"></i>
                                    </button>
                                    <button class="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center bg-red-100 text-red-700 hover:scale-110 transition-transform duration-200" (click)="deleteItem(item.id)" title="Delete">
                                        <i class="fas fa-trash text-sm"></i>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="p-4 sm:p-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center flex-wrap gap-3 sm:gap-4">
                    <div class="text-gray-600 text-xs sm:text-sm">Showing {{ getStartIndex() }} to {{ getEndIndex() }} of {{ filteredItems.length }} entries</div>
                    <div class="flex items-center gap-3 sm:gap-4">
                        <button
                            class="w-8 h-8 sm:w-9 sm:h-9 border border-gray-300 bg-white rounded-md flex items-center justify-center transition-colors duration-200 hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            [disabled]="currentPage === 1"
                            (click)="changePage(currentPage - 1)"
                        >
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <span class="font-medium text-gray-700 text-sm">Page {{ currentPage }} of {{ getTotalPages() }}</span>
                        <button
                            class="w-8 h-8 sm:w-9 sm:h-9 border border-gray-300 bg-white rounded-md flex items-center justify-center transition-colors duration-200 hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            [disabled]="currentPage === getTotalPages()"
                            (click)="changePage(currentPage + 1)"
                        >
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Custom Alert/Confirm Modal (removed raw content display) -->
            <div *ngIf="modalsService.showModal" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-lg shadow-xl max-w-sm w-full mx-auto p-6 transform transition-all duration-300 scale-100">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold text-gray-900">{{ modalsService.modalTitle }}</h3>
                        <button (click)="modalsService.onModalCancel()" class="text-gray-400 hover:text-gray-600 focus:outline-none">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <p class="text-gray-700 mb-6">{{ modalsService.modalMessage }}</p>

                    <div class="flex justify-end gap-3">
                        <button *ngIf="modalsService.modalType === 'confirm'" (click)="modalsService.onModalCancel()" class="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium transition-colors duration-200 text-sm">
                            Cancel
                        </button>
                        <button (click)="modalsService.onModalConfirm()" class="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium transition-colors duration-200 text-sm">
                            {{ modalsService.modalType === 'confirm' ? 'Confirm' : 'OK' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Add/Edit Item Modal -->
            <div *ngIf="modalsService.showEditModal && modalsService.selectedItem" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
                <div class="bg-white rounded-lg shadow-xl max-w-sm sm:max-w-xl md:max-w-2xl w-full mx-auto p-6 transform transition-all duration-300 scale-100">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl sm:text-2xl font-bold text-gray-900">{{ modalsService.selectedItem.id === -1 ? 'Add New Item' : 'Edit Item' }}</h3>
                        <button (click)="modalsService.closeEditItemModal()" class="text-gray-400 hover:text-gray-600 focus:outline-none">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    <form (ngSubmit)="saveItemChanges()">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label for="productName" class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    id="productName"
                                    [(ngModel)]="modalsService.selectedItem.productName"
                                    name="productName"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    [readonly]="modalsService.selectedItem.id !== -1"
                                    required
                                />
                            </div>
                            <div>
                                <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select
                                    id="category"
                                    [(ngModel)]="modalsService.selectedItem.category"
                                    (change)="onCategoryChangeInModal()"
                                    name="category"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    [disabled]="modalsService.selectedItem.id !== -1"
                                    required
                                >
                                    <option value="" disabled>Select a category</option>
                                    <option *ngFor="let cat of dataService.categories.slice(1)" [value]="cat">{{ cat }}</option>
                                </select>
                            </div>
                            <div *ngIf="modalsService.selectedItem.category === 'BREADS'">
                                <label for="subCategory" class="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                                <select
                                    id="subCategory"
                                    [(ngModel)]="modalsService.selectedItem.subCategory"
                                    name="subCategory"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    [disabled]="modalsService.selectedItem.id !== -1"
                                    required
                                >
                                    <option value="" disabled>Select a subcategory</option>
                                    <option *ngFor="let subCat of dataService.breadSubcategories.slice(1)" [value]="subCat">{{ subCat }}</option>
                                </select>
                            </div>
                            <div>
                                <label for="capacity" class="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                                <input
                                    type="number"
                                    id="capacity"
                                    [(ngModel)]="modalsService.selectedItem.capacity"
                                    name="capacity"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    [readonly]="modalsService.selectedItem.id !== -1"
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <label for="production" class="block text-sm font-medium text-gray-700 mb-1">Production</label>
                                <input
                                    type="number"
                                    id="production"
                                    [(ngModel)]="modalsService.selectedItem.production"
                                    name="production"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <label for="sample" class="block text-sm font-medium text-gray-700 mb-1">Sample</label>
                                <input
                                    type="number"
                                    id="sample"
                                    [(ngModel)]="modalsService.selectedItem.sample"
                                    name="sample"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <label for="damaged" class="block text-sm font-medium text-gray-700 mb-1">Damaged</label>
                                <input
                                    type="number"
                                    id="damaged"
                                    [(ngModel)]="modalsService.selectedItem.damaged"
                                    name="damaged"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <label for="cfQty" class="block text-sm font-medium text-gray-700 mb-1">CF Qty</label>
                                <input
                                    type="number"
                                    id="cfQty"
                                    [(ngModel)]="modalsService.selectedItem.cfQty"
                                    name="cfQty"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    [readonly]="modalsService.selectedItem.id !== -1"
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <label for="cfSold" class="block text-sm font-medium text-gray-700 mb-1">CF Sold</label>
                                <input
                                    type="number"
                                    id="cfSold"
                                    [(ngModel)]="modalsService.selectedItem.cfSold"
                                    name="cfSold"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <label for="ordered" class="block text-sm font-medium text-gray-700 mb-1">Ordered</label>
                                <input
                                    type="number"
                                    id="ordered"
                                    [(ngModel)]="modalsService.selectedItem.ordered"
                                    name="ordered"
                                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    required
                                    min="0"
                                />
                            </div>
                        </div>
                        <div class="flex justify-end gap-3">
                            <button type="button" (click)="modalsService.closeEditItemModal()" class="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 font-medium transition-colors duration-200 text-sm">Cancel</button>
                            <button type="submit" class="py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium transition-colors duration-200 text-sm">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- View Details Modal -->
            <div *ngIf="modalsService.showViewDetailsModal && modalsService.selectedItem" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 overflow-y-auto">
                <div class="bg-white rounded-lg shadow-xl max-w-sm sm:max-w-xl w-full mx-auto p-6 transform transition-all duration-300 scale-100">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl sm:text-2xl font-bold text-gray-900">Details: {{ modalsService.selectedItem.productName }}</h3>
                        <button (click)="modalsService.closeViewDetailsModal()" class="text-gray-400 hover:text-gray-600 focus:outline-none">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
                        <p><strong>Product ID:</strong> {{ modalsService.selectedItem.id }}</p>
                        <p><strong>Category:</strong> {{ modalsService.selectedItem.category }}</p>
                        <p *ngIf="modalsService.selectedItem.subCategory"><strong>Sub Category:</strong> {{ modalsService.selectedItem.subCategory }}</p>
                        <p><strong>Capacity:</strong> {{ modalsService.selectedItem.capacity }}</p>
                        <p><strong>Production:</strong> {{ modalsService.selectedItem.production }}</p>
                        <p><strong>Sample:</strong> {{ modalsService.selectedItem.sample }}</p>
                        <p><strong>Damaged:</strong> {{ modalsService.selectedItem.damaged }}</p>
                        <p><strong>CF Qty:</strong> {{ modalsService.selectedItem.cfQty }}</p>
                        <p><strong>CF Sold:</strong> {{ modalsService.selectedItem.cfSold }}</p>
                        <p><strong>Total Inventory:</strong> {{ modalsService.selectedItem.totalInv }}</p>
                        <p><strong>Ordered:</strong> {{ modalsService.selectedItem.ordered }}</p>
                        <p><strong>CF Balance:</strong> {{ modalsService.selectedItem.cfBal }}</p>
                        <p><strong>Fresh Balance:</strong> {{ modalsService.selectedItem.freshBal }}</p>
                        <p><strong>Current Balance:</strong> {{ modalsService.selectedItem.currentBal }}</p>
                        <p>
                            <strong>Status:</strong>
                            <span class="px-3 py-1 rounded-full text-xs font-semibold text-white" [ngClass]="utilsService.getStatusColorClass(modalsService.selectedItem.status)"> {{ modalsService.selectedItem.status }} </span>
                        </p>
                        <p><strong>Last Updated:</strong> {{ modalsService.selectedItem.lastUpdated | date: 'medium' }}</p>
                    </div>
                    <div class="flex justify-end mt-6">
                        <button (click)="modalsService.closeViewDetailsModal()" class="py-2 px-5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium transition-colors duration-200 text-sm">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');

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

            .transition-all {
                transition: all 0.3s ease;
            }

            .hover\\:scale-105:hover {
                transform: scale(1.05);
            }
        `
    ]
})
export class InventoryComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    // Removed @ViewChild since rawContentForDisplay logic is gone from modals
    // @ViewChild('csvContentArea') csvContentArea!: ElementRef<HTMLTextAreaElement>; // No longer needed

    constructor(
        public dataService: InventoryDataService,
        public filteringService: InventoryFilteringService,
        public modalsService: InventoryModalsService,
        public utilsService: InventoryUtilsService
    ) {
        console.log('InventoryComponent: Constructor called. Services injected.');
    }

    filteredItems: InventoryItem[] = [];

    searchTerm: string = '';
    selectedCategory: string = 'All Products';
    selectedSubCategory: string = 'All Breads';
    stockFilter: '' | 'In Stock' | 'Low Stock' | 'Out of Stock' = '';
    sortBy: string = 'productName';

    lastUpdate: Date = new Date();
    currentDate: Date = new Date();
    isUpdating: boolean = false;

    selectedItems: Set<number> = new Set<number>();
    allSelected: boolean = false;

    editingCell: { id: number; field: keyof InventoryItem } | null = null;

    currentPage: number = 1;
    itemsPerPage: number = 10;

    ngOnInit(): void {
        this.applyFilters();
        interval(1000)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.lastUpdate = new Date();
            });
        console.log('InventoryComponent: ngOnInit completed. Initial filters applied.');
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        console.log('InventoryComponent: ngOnDestroy called. Subscriptions unsubscribed.');
    }

    applyFilters(): void {
        let allItems = this.dataService.getInventoryItems();
        this.filteredItems = this.filteringService.applyFilters(allItems, this.searchTerm, this.selectedCategory, this.selectedSubCategory, this.stockFilter);
        this.applySorting();
        this.currentPage = 1;
        console.log(`InventoryComponent: Filters applied. Displaying ${this.filteredItems.length} items.`);
    }

    applySorting(): void {
        this.filteredItems = this.filteringService.applySorting(this.filteredItems, this.sortBy);
        this.updatePagination();
        console.log(`InventoryComponent: Sorting applied by ${this.sortBy}.`);
    }

    filterByCategory(category: string): void {
        this.selectedCategory = category;
        if (category !== 'BREADS') {
            this.selectedSubCategory = 'All Breads';
        } else if (!this.selectedSubCategory) {
            this.selectedSubCategory = 'All Breads';
        }
        this.applyFilters();
        console.log(`InventoryComponent: Filtered by category: ${category}.`);
    }

    filterBySubcategory(subcategory: string): void {
        this.selectedSubCategory = subcategory;
        this.applyFilters();
        console.log(`InventoryComponent: Filtered by subcategory: ${subcategory}.`);
    }

    resetFilters(): void {
        this.searchTerm = '';
        this.selectedCategory = 'All Products';
        this.selectedSubCategory = 'All Breads';
        this.stockFilter = '';
        this.sortBy = 'productName';
        this.applyFilters();
        console.log('InventoryComponent: Filters reset.');
    }

    toggleSelection(id: number, event: Event): void {
        const isChecked = (event.target as HTMLInputElement).checked;
        if (isChecked) {
            this.selectedItems.add(id);
        } else {
            this.selectedItems.delete(id);
        }
        this.allSelected = this.selectedItems.size === this.filteredItems.length && this.filteredItems.length > 0;
        console.log(`InventoryComponent: Item ${id} selection toggled. Selected count: ${this.selectedItems.size}`);
    }

    selectAll(event: Event): void {
        this.allSelected = (event.target as HTMLInputElement).checked;
        this.selectedItems.clear();
        if (this.allSelected) {
            this.filteredItems.forEach((item) => {
                if (item.id) {
                    this.selectedItems.add(item.id);
                }
            });
        }
        console.log(`InventoryComponent: Select All toggled. Selected count: ${this.selectedItems.size}`);
    }

    editCell(id: number, field: keyof InventoryItem): void {
        this.editingCell = { id, field };
        console.log(`InventoryComponent: Editing cell for item ${id}, field ${field}.`);
    }

    isEditing(id: number, field: keyof InventoryItem): boolean {
        return this.editingCell?.id === id && this.editingCell?.field === field;
    }

    finishEdit(): void {
        this.editingCell = null;
        this.dataService.recalculateAllItems();
        this.applyFilters();
        console.log('InventoryComponent: Finished inline editing. Data recalculated.');
    }

    addNewItem(): void {
        this.modalsService.openEditItemModal(null);
        if (this.modalsService.selectedItem) {
            this.modalsService.selectedItem.category = this.dataService.categories[1];
            if (this.modalsService.selectedItem.category === 'BREADS') {
                this.modalsService.selectedItem.subCategory = this.dataService.breadSubcategories[1];
            }
        }
        console.log('InventoryComponent: Initiating add new item.');
    }

    editItem(item: InventoryItem): void {
        this.modalsService.openEditItemModal(item);
        console.log('InventoryComponent: Initiating edit item for ID:', item.id);
    }

    viewDetails(item: InventoryItem): void {
        this.modalsService.openViewDetailsModal(item);
        console.log('InventoryComponent: Initiating view details for ID:', item.id);
    }

    saveItemChanges(): void {
        if (!this.modalsService.selectedItem) {
            console.error('InventoryComponent: No item selected for saving changes.');
            return;
        }

        if (this.modalsService.selectedItem.id === -1) {
            this.dataService.addInventoryItem(this.modalsService.selectedItem);
            this.modalsService.openCustomModal('Success!', 'Item added successfully!', 'alert');
        } else {
            this.dataService.updateInventoryItem(this.modalsService.selectedItem);
            this.modalsService.openCustomModal('Success!', 'Item updated successfully!', 'alert');
        }
        this.modalsService.closeEditItemModal();
        this.applyFilters();
        console.log('InventoryComponent: Item changes saved.');
    }

    deleteItem(id: number): void {
        this.modalsService.openCustomModal(
            'Confirm Deletion',
            'Are you sure you want to delete this item?',
            'confirm',
            () => {
                this.dataService.deleteInventoryItem(id);
                this.selectedItems.delete(id);
                this.applyFilters();
                this.modalsService.openCustomModal('Deleted!', 'Item deleted successfully!', 'alert');
                console.log(`InventoryComponent: Item ${id} confirmed for deletion.`);
            },
            () => {
                console.log('InventoryComponent: Item deletion cancelled.');
            }
        );
    }

    getPaginatedItems(): InventoryItem[] {
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        return this.filteredItems.slice(startIndex, endIndex);
    }

    getTotalPages(): number {
        return Math.ceil(this.filteredItems.length / this.itemsPerPage);
    }

    getStartIndex(): number {
        if (this.filteredItems.length === 0) return 0;
        return (this.currentPage - 1) * this.itemsPerPage + 1;
    }

    getEndIndex(): number {
        if (this.filteredItems.length === 0) return 0;
        const endIndex = this.currentPage * this.itemsPerPage;
        return Math.min(endIndex, this.filteredItems.length);
    }

    changePage(page: number): void {
        if (page >= 1 && page <= this.getTotalPages()) {
            this.currentPage = page;
            this.updatePagination();
            console.log(`InventoryComponent: Changed page to: ${page}.`);
        }
    }

    updatePagination(): void {
        console.log('InventoryComponent: Pagination updated.');
    }

    saveAllChanges(): void {
        this.dataService.recalculateAllItems();
        this.applyFilters();
        this.modalsService.openCustomModal('Save Changes', 'All changes have been saved!', 'alert');
        console.log('InventoryComponent: Save All Changes button clicked.');
    }

    exportData(): void {
        // This will now trigger the direct download attempt in utilsService
        this.utilsService.exportData(this.filteredItems);
        console.log('InventoryComponent: Export Data button clicked, attempting direct download.');
    }

    // copyToClipboard method removed
    // onCategoryChangeInModal remains unchanged
    onCategoryChangeInModal(): void {
        if (this.modalsService.selectedItem) {
            if (this.modalsService.selectedItem.category !== 'BREADS') {
                this.modalsService.selectedItem.subCategory = undefined;
                console.log('InventoryComponent: Modal category changed to non-BREADS, subCategory cleared.');
            } else if (!this.modalsService.selectedItem.subCategory) {
                this.modalsService.selectedItem.subCategory = this.dataService.breadSubcategories[1];
                console.log('InventoryComponent: Modal category changed to BREADS, defaulting subCategory.');
            }
        }
    }
}
