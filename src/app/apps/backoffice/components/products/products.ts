// ==========================================================
// src/app/apps/backoffice/components/products/products.ts
// Minimal shell component for Products, importing and utilizing modular logic.
// ==========================================================
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Import all new modular logic classes and interfaces
import { Product, FuturePriceConfig } from './components/interfaces';
import { ProductData } from './components/product-data';
import { ProductFiltering } from './components/product-filtering';
import { ProductModals } from './components/product-modals';
import { ProductUtils } from './components/product-utils';

@Component({
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    template: `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <div class="mb-4">
                <button
                    routerLink="../"
                    class="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg
font-semibold text-xs sm:text-sm transition-colors duration-200 shadow-md flex items-center space-x-1 sm:space-x-2 w-auto"
                >
                    <svg class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    <span class="whitespace-nowrap">Back to Home</span>
                </button>
            </div>
            <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 class="text-xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Products Management</h1>
                        <p class="text-sm sm:text-base text-gray-600">Manage your bakery's product catalog and inventory</p>
                    </div>
                    <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                            (click)="productModals.openAddProductModal()"
                            class="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-colors duration-200 shadow-md"
                        >
                            Add New Product
                        </button>
                        <button
                            (click)="productModals.openFutureProductModal()"
                            class="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4
py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-colors duration-200 shadow-md"
                        >
                            Manage Future Products
                        </button>
                        <button
                            (click)="productModals.openConfigAllProductsModal()"
                            class="w-full sm:w-auto bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold text-sm sm:text-base transition-colors duration-200 shadow-md"
                        >
                            Configure All Products
                        </button>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
                <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                    <div class="flex items-center">
                        <div
                            class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100
rounded-lg flex items-center justify-center flex-shrink-0"
                        >
                            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                            </svg>
                        </div>
                        <div class="ml-3 sm:ml-4">
                            <p class="text-xs sm:text-sm font-medium text-gray-600">Total Products</p>
                            <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ productUtils.getTotalProducts() }}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                    <div class="flex items-center">
                        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg
                                class="w-5
h-5 sm:w-6 sm:h-6 text-yellow-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.865-.833-2.635 0L4.178 16.5c-.77.833.192 2.5 1.732 2.5z"
                                ></path>
                            </svg>
                        </div>
                        <div class="ml-3 sm:ml-4">
                            <p class="text-xs sm:text-sm font-medium text-gray-600">Low Quantity</p>
                            <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ productUtils.getLowStockProducts() }}</p>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6">
                    <div class="flex items-center">
                        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users">
                                <path d="M16 21v-2a4 0 0 0-4-4H6a4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M22 21v-2a4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 0 0 1 0 7.75" />
                            </svg>
                        </div>
                        <div class="ml-3 sm:ml-4 flex-grow">
                            <p class="text-xs sm:text-sm font-medium text-gray-600 mb-1">Enabled For</p>
                            <select
                                [(ngModel)]="productFiltering.activeEnabledForFilter"
                                (change)="productFiltering.onEnabledForFilterChange()"
                                class="w-full border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                            >
                                <option *ngFor="let option of productUtils.enabledForOptions" [value]="option">{{ option }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-lg overflow-hidden">
                <div class="px-4 sm:px-6 py-4 border-b border-gray-200">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3 sm:gap-2">
                        <h3 class="text-lg sm:text-xl font-semibold text-gray-900">Product List</h3>
                        <input
                            type="text"
                            [(ngModel)]="productFiltering.searchTerm"
                            (input)="productFiltering.filterProducts()"
                            placeholder="Search products..."
                            class="w-full sm:w-auto border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                        />
                    </div>

                    <div class="flex flex-wrap gap-2 mb-4">
                        <button
                            (click)="productFiltering.setActiveFilter('All')"
                            [class]="productUtils.getFilterButtonClass('All', productFiltering.activeFilter)"
                            class="px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200"
                        >
                            All Products
                        </button>
                        <button
                            *ngFor="let category of productUtils.categories"
                            (click)="productFiltering.setActiveFilter(category)"
                            [class]="productUtils.getFilterButtonClass(category, productFiltering.activeFilter)"
                            class="px-3 py-1.5 rounded-lg text-xs sm:text-sm
font-medium transition-colors duration-200"
                        >
                            {{ category }}
                        </button>
                    </div>

                    <div *ngIf="productFiltering.activeFilter === 'Breads'" class="flex flex-wrap gap-2">
                        <button
                            (click)="productFiltering.setActiveSubcategory('All Breads')"
                            [class]="productUtils.getSubcategoryButtonClass('All Breads', productFiltering.activeSubcategory)"
                            class="px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200"
                        >
                            All Breads
                        </button>
                        <button
                            *ngFor="let subcategory of productUtils.breadSubcategories"
                            (click)="productFiltering.setActiveSubcategory(subcategory)"
                            [class]="productUtils.getSubcategoryButtonClass(subcategory, productFiltering.activeSubcategory)"
                            class="px-3 py-1 rounded-lg text-xs font-medium transition-colors duration-200"
                        >
                            {{ subcategory }}
                        </button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl. No.</th>
                                <th class="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th class="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th class="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enabled For</th>
                                <th class="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                                <th class="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th class="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                                <th class="px-3 py-2 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr *ngFor="let product of productFiltering.filteredProducts; let i = index" class="hover:bg-gray-50">
                                <td class="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ i + 1 }}</td>
                                <td class="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                                    <div class="flex items-center">
                                        <div class="ml-0">
                                            <div class="text-sm sm:text-base font-medium text-gray-900">{{ product.name }}</div>
                                            <div class="text-xs sm:text-sm text-gray-500">{{ product.description }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                                    <div>
                                        <span class="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {{ product.category }}
                                        </span>
                                        <div *ngIf="product.subcategory" class="mt-1">
                                            <span class="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-600">
                                                {{ product.subcategory }}
                                            </span>
                                        </div>
                                        <div *ngIf="product.isFutureProduct" class="mt-1">
                                            <span
                                                class="px-2 py-1
text-xs font-semibold rounded-full bg-orange-100 text-orange-800"
                                            >
                                                Future Product
                                            </span>
                                            <div *ngIf="product.futurePrice && product.futureEffectiveDate" class="text-xs text-gray-600 mt-1">Future Price: ₹{{ product.futurePrice }} (Eff. {{ product.futureEffectiveDate | date: 'shortDate' }})</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                                    <select
                                        [(ngModel)]="product.displayEnabledFor"
                                        (change)="productData.updateProductEnabledFor(product.id, product.displayEnabledFor!)"
                                        class="border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm w-full sm:w-auto"
                                    >
                                        <option *ngFor="let option of productUtils.enabledForOptions" [value]="option">{{ option }}</option>
                                    </select>
                                </td>
                                <td class="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{{ product.weight }}g</td>
                                <td class="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">₹{{ product.price }}</td>
                                <td class="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">{{ product.stock }}</td>
                                <td class="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium">
                                    <button (click)="productModals.editProduct(product)" class="text-amber-600 hover:text-amber-900 mr-2 sm:mr-3">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                    </button>
                                    <button (click)="productModals.prepareDeleteProduct(product.id)" class="text-red-600 hover:text-red-900">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div *ngIf="productFiltering.filteredProducts.length === 0" class="text-center py-8 px-4">
                    <p class="text-gray-500 text-base">No products found matching your criteria.</p>
                </div>
            </div>
        </div>

        <div *ngIf="productModals.showAddProductModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg mx-auto overflow-y-auto max-h-[90vh]">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg sm:text-xl font-bold text-gray-900">{{ productModals.editingProduct ? 'Edit Product' : 'Add New Product' }}</h2>
                    <button (click)="productModals.closeAddProductModal()" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <form (ngSubmit)="productModals.saveProduct()" #productForm="ngForm">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input
                                type="text"
                                [(ngModel)]="productModals.newProduct.name"
                                name="name"
                                required
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                placeholder="Enter product name"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <input
                                type="text"
                                [(ngModel)]="productModals.newProduct.description"
                                name="description"
                                required
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                placeholder="Enter product description"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                [(ngModel)]="productModals.newProduct.category"
                                name="category"
                                required
                                (change)="productModals.onCategoryChangeForNewProduct()"
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                            >
                                <option value="">Select a category</option>
                                <option *ngFor="let category of productUtils.categories" [value]="category">{{ category }}</option>
                            </select>
                        </div>

                        <div *ngIf="productModals.newProduct.category === 'Breads'">
                            <label class="block text-sm font-medium text-gray-700 mb-1">Bread Type</label>
                            <select [(ngModel)]="productModals.newProduct.subcategory" name="subcategory" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm">
                                <option value="">Select bread type</option>
                                <option *ngFor="let subcategory of productUtils.breadSubcategories" [value]="subcategory">{{ subcategory }}</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Enabled For</label>
                            <select [(ngModel)]="productModals.newProduct.enabledFor" name="enabledFor" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm">
                                <option *ngFor="let option of productUtils.enabledForOptions" [value]="option">{{ option }}</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Weight (grams)</label>
                            <input
                                type="number"
                                [(ngModel)]="productModals.newProduct.weight"
                                name="weight"
                                required
                                min="1"
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                placeholder="Enter weight in grams"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                            <input
                                type="number"
                                [(ngModel)]="productModals.newProduct.price"
                                name="price"
                                required
                                min="0"
                                [disabled]="!!productModals.editingProduct"
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm disabled:bg-gray-100 disabled:text-gray-500"
                                placeholder="Enter price"
                            />
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                                type="number"
                                [(ngModel)]="productModals.newProduct.stock"
                                name="stock"
                                required
                                min="0"
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                placeholder="Enter quantity"
                            />
                        </div>
                    </div>

                    <div class="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                        <button
                            type="button"
                            (click)="productModals.closeAddProductModal()"
                            class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2
px-4 rounded-lg font-medium transition-colors duration-200 text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            [disabled]="!productForm.form.valid"
                            class="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-sm"
                        >
                            {{ productModals.editingProduct ? 'Update' : 'Add' }} Product
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div
            *ngIf="productModals.showConfirmDeleteModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center
justify-center z-50 p-4"
        >
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-auto">
                <h2 class="text-lg font-bold text-gray-900 mb-4">Confirm Deletion</h2>
                <p class="text-gray-700 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
                <div class="flex space-x-3">
                    <button (click)="productModals.cancelDelete()" class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-sm">Cancel</button>
                    <button (click)="productModals.confirmDelete()" class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-sm">Delete</button>
                </div>
            </div>
        </div>

        <div *ngIf="productModals.showFutureProductModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl mx-auto overflow-y-auto max-h-[90vh]">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg sm:text-xl font-bold text-gray-900">Manage Future Products (Set Price)</h2>
                    <button (click)="productModals.closeFutureProductModal()" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18
6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>

                <form (ngSubmit)="productModals.saveFutureProductPriceConfig()" #futurePriceForm="ngForm">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Price Description:</label>
                            <input
                                type="text"
                                [(ngModel)]="productModals.futurePriceConfig.description"
                                name="futurePriceDescription"
                                required
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                placeholder="e.g., Seasonal Price Adjustments"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Status:</label>
                            <select [(ngModel)]="productModals.futurePriceConfig.status" name="futurePriceStatus" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Draft">Draft</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Start Date:</label>
                            <input
                                type="date"
                                [(ngModel)]="productModals.futurePriceConfig.startDate"
                                name="futurePriceStartDate"
                                required
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">End Date:</label>
                            <input
                                type="date"
                                [(ngModel)]="productModals.futurePriceConfig.endDate"
                                name="futurePriceEndDate"
                                required
                                class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                    </div>

                    <div class="mb-4">
                        <h3 class="text-md font-semibold text-gray-800 mb-3">Previous Future Product Price Lists</h3>
                        <div class="border border-gray-300 rounded-lg p-3 min-h-[100px] max-h-[150px] overflow-y-auto bg-gray-50">
                            <ul class="space-y-1 text-sm text-gray-700">
                                <li *ngFor="let config of productModals.previousFuturePriceLists">Price - {{ config.description }} ({{ config.startDate }} to {{ config.endDate }})</li>
                                <li *ngIf="productModals.previousFuturePriceLists.length === 0" class="text-gray-500">No previous future price configurations.</li>
                            </ul>
                        </div>
                    </div>

                    <h3 class="text-md font-semibold text-gray-800 mb-3">Select Future Products and Set New Prices</h3>
                    <div class="overflow-x-auto border border-gray-200 rounded-lg">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Future Price</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr *ngFor="let product of productData.allProductsData; let i = index">
                                    <td class="px-3 py-3 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            [(ngModel)]="product.isFutureProduct"
                                            name="isFuture_{{ product.id }}"
                                            (change)="productModals.onFutureProductSelectionChange(product)"
                                            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                    </td>
                                    <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900">{{ product.name }}</td>
                                    <td class="px-3 py-3 whitespace-nowrap text-sm text-gray-900">₹{{ product.price }}</td>
                                    <td class="px-3 py-3 whitespace-nowrap">
                                        <input
                                            type="number"
                                            [(ngModel)]="product.futurePrice"
                                            name="futurePrice_{{ product.id }}"
                                            min="0"
                                            [disabled]="!product.isFutureProduct"
                                            class="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                                            placeholder="Enter future price"
                                        />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div *ngIf="productData.allProductsData.length === 0" class="text-center py-4 text-gray-500">No products available for future price configuration.</div>
                    </div>

                    <div class="flex justify-end space-x-3 mt-6">
                        <button type="button" (click)="productModals.closeFutureProductModal()" class="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-sm">Cancel</button>
                        <button
                            type="submit"
                            [disabled]="!futurePriceForm.form.valid"
                            class="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-sm"
                        >
                            Save Future Price Configuration
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div *ngIf="productModals.showConfigAllProductsModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-auto overflow-y-auto max-h-[90vh]">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg sm:text-xl font-bold text-gray-900">Selected Category: All Products</h2>
                    <button (click)="productModals.closeConfigAllProductsModal()" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 class="text-md font-semibold text-gray-800 mb-3">Available Products</h3>
                        <div class="border border-gray-300 rounded-lg overflow-hidden max-h-80 overflow-y-auto">
                            <ul class="divide-y divide-gray-200">
                                <li *ngIf="productModals.availableProductsForSelection.length === 0" class="px-4 py-2 text-gray-500 text-sm">No products to add.</li>
                                <li *ngFor="let product of productModals.availableProductsForSelection; let i = index" class="flex items-center justify-between px-4 py-2 hover:bg-gray-50">
                                    <span class="text-sm text-gray-800 flex-1 truncate">{{ i + 1 }}. {{ product.name }}</span>
                                    <button
                                        (click)="productModals.addToSelectedProducts(product.id)"
                                        class="ml-2 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-semibold
px-2 py-1 rounded"
                                    >
                                        Add
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <h3 class="text-md font-semibold text-gray-800 mb-3">Selected Products</h3>
                        <div class="border border-gray-300 rounded-lg overflow-hidden max-h-80 overflow-y-auto">
                            <ul class="divide-y divide-gray-200">
                                <li *ngIf="productModals.selectedProductsForRemoval.length === 0" class="px-4 py-2 text-gray-500 text-sm">No products selected.</li>
                                <li *ngFor="let product of productModals.selectedProductsForRemoval; let i = index" class="flex items-center justify-between px-4 py-2 hover:bg-gray-50">
                                    <span class="text-sm text-gray-800 flex-1 truncate">{{ i + 1 }}. {{ product.name }}</span>
                                    <button
                                        (click)="productModals.removeFromSelectedProducts(product.id)"
                                        class="ml-2 bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold
px-2 py-1 rounded"
                                    >
                                        Remove
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end space-x-3 mt-6">
                    <button (click)="productModals.closeConfigAllProductsModal()" class="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-sm">Close</button>
                    <button
                        (click)="productModals.applySelectionChanges()"
                        class="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4
rounded-lg font-medium transition-colors duration-200 text-sm"
                    >
                        Apply Changes
                    </button>
                </div>
            </div>
        </div>
    `,
    styles: []
})
export class ProductsComponent implements OnInit {
    // Instantiate all logic classes
    productData: ProductData;
    productFiltering: ProductFiltering;
    productModals: ProductModals;
    productUtils: ProductUtils;

    constructor() {
        // Initialize instances, passing dependencies as needed
        this.productData = new ProductData();
        this.productFiltering = new ProductFiltering(this.productData);
        // ProductModals needs ProductData and ProductFiltering
        this.productModals = new ProductModals(this.productData, this.productFiltering);
        // ProductUtils needs ProductData
        this.productUtils = new ProductUtils(this.productData);

        console.log('Products component loaded!');
    }

    ngOnInit(): void {}
}
