// components/customers/customers.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router'; // Import Router
import { FormsModule, NgForm } from '@angular/forms'; // Import NgForm for type checking

// Expanded Customer interface to include optional fields for different types
interface Customer {
    id: number;
    name: string;
    customerType: 'Individual' | 'Business' | 'Community';
    phoneNumber: string;
    emailAddress: string;
    communityName: string; // This will store the final community name for display
    createdDate: string;
    businessRegNumber?: string; // Optional for Business type
    contactPerson?: string; // Optional for Community type (derived from firstName/lastName)
    // New fields based on your provided breakdown:
    firstName?: string; // For Individual, Business Contact, and Community Contact
    lastName?: string; // For Individual, Business Contact, and Community Contact
    doorNo?: string; // For Individual and Business
    apartmentName?: string; // For Individual
    address?: string; // For Individual, Business, Community (auto-filled for Community)
    pinCode?: string; // For Individual, Business, Community (auto-filled for Community)
    establishmentName?: string; // For Business
    establishmentGSTNo?: string; // For Business
    establishmentPhoneNo?: string; // For Business
    mobileNumber?: string; // For Individual and Business
    buildingName?: string; // For Business
    selectedCommunityName?: string; // Used internally for Community type selection in modal
}

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    inStock: boolean;
    category: string;
}

// Interface for order summary details
interface OrderSummary {
    itemsAmount: number;
    discountAmount: number;
    taxableAmount: number;
    taxAmount: number;
    deliveryCharges: number;
    totalAmount: number;
}

interface SelectedProductItem {
    product: Product;
    quantity: number;
}

@Component({
    selector: 'app-customers',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule],
    template: `
        <!-- Load Tailwind CSS -->
        <script src="https://cdn.tailwindcss.com"></script>
        <!-- Font Awesome for icons -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <!-- Inter font -->
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

        <div class="min-h-screen bg-slate-50 p-4 sm:p-6 font-inter">
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
                <!-- Header Section -->
                <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Customer Management</h1>
                            <p class="text-gray-600">Efficiently manage your customer base and orders</p>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <button (click)="addNewCustomer()" class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-colors duration-200 text-sm sm:text-base">
                                <i class="fas fa-user-plus mr-2"></i>Add New Customer
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Main Content Area -->
                <div class="bg-white rounded-xl shadow-lg p-6">
                    <div *ngIf="!showNewOrderForm">
                        <!-- Filters and Search Section -->
                        <div class="border-b pb-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
                            <div class="relative w-full md:max-w-md">
                                <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                                <input
                                    type="text"
                                    [(ngModel)]="searchTerm"
                                    (ngModelChange)="filterCustomers()"
                                    placeholder="Search by name or email..."
                                    class="w-full pl-12 pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:border-indigo-500 transition-colors duration-300"
                                />
                            </div>

                            <select [(ngModel)]="selectedCustomerType" (ngModelChange)="filterCustomers()" class="p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg bg-white cursor-pointer min-w-[140px] sm:min-w-[150px] text-sm sm:text-base">
                                <option value="">All Customer Types</option>
                                <option value="Individual">Individual</option>
                                <option value="Business">Business</option>
                                <option value="Community">Community</option>
                            </select>

                            <button
                                (click)="resetFilters()"
                                class="py-2.5 px-5 sm:py-3 sm:px-6 bg-transparent border-2 border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm transition-all duration-300 flex items-center gap-2 hover:bg-gray-100 hover:border-gray-400 text-sm sm:text-base"
                            >
                                <i class="fas fa-times"></i>
                                Reset
                            </button>
                        </div>

                        <!-- Customer Table -->
                        <div class="overflow-x-auto rounded-lg border border-gray-200">
                            <table class="min-w-full divide-y divide-gray-200">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Type</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone No</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Community Name</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
                                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    </tr>
                                </thead>
                                <tbody class="bg-white divide-y divide-gray-200">
                                    <tr *ngFor="let customer of displayedCustomers" class="hover:bg-gray-50">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {{ customer.name }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <span [class]="getCustomerTypeClass(customer.customerType)" class="px-2 py-1 rounded-full text-xs font-medium">
                                                {{ customer.customerType }}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ customer.phoneNumber }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ customer.emailAddress }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ customer.communityName }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {{ customer.createdDate }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                                            <button
                                                (click)="createNewOrder(customer)"
                                                class="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center bg-emerald-100 text-emerald-700 hover:scale-110 transition-transform duration-200"
                                                title="New Order"
                                            >
                                                <i class="fas fa-shopping-cart text-sm"></i>
                                            </button>
                                            <button (click)="editCustomer(customer)" class="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center bg-sky-100 text-sky-700 hover:scale-110 transition-transform duration-200" title="Edit">
                                                <i class="fas fa-edit text-sm"></i>
                                            </button>
                                            <button
                                                (click)="deleteCustomer(customer.id)"
                                                class="w-7 h-7 sm:w-8 sm:h-8 rounded-md flex items-center justify-center bg-red-100 text-red-700 hover:scale-110 transition-transform duration-200"
                                                title="Delete"
                                            >
                                                <i class="fas fa-trash text-sm"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div *ngIf="showNewOrderForm">
                        <div class="bg-blue-600 text-white p-4 rounded-t-lg -mx-6 -mt-6 mb-6">
                            <div class="flex justify-between items-center">
                                <div class="flex flex-wrap items-center gap-4 text-sm">
                                    <span class="font-semibold">{{ selectedCustomer?.name }}</span>
                                    <span><i class="fas fa-envelope mr-1"></i>{{ selectedCustomer?.emailAddress }}</span>
                                    <span><i class="fas fa-phone mr-1"></i>{{ selectedCustomer?.phoneNumber }}</span>
                                    <span class="px-2 py-0.5 rounded-full text-xs" [class]="getCustomerTypeClass(selectedCustomer?.customerType)">{{ selectedCustomer?.customerType }}</span>
                                    <span class="bg-orange-500 px-3 py-1 rounded-full text-sm font-bold">₹{{ orderSummary.totalAmount.toFixed(2) }}</span>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <span class="text-sm font-medium">Creating New Order</span>
                                    <button class="py-1 px-3 bg-blue-500 hover:bg-blue-700 rounded-md text-white text-xs font-semibold transition-colors">Subscription</button>
                                    <button class="py-1 px-3 bg-green-500 hover:bg-green-700 rounded-md text-white text-xs font-semibold transition-colors">Delivery Charges</button>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div class="lg:col-span-2">
                                <h3 class="text-xl font-semibold mb-4 text-gray-800">Product List</h3>

                                <div class="flex flex-wrap gap-2 mb-4 border-b-2 border-gray-200 pb-2">
                                    <button
                                        *ngFor="let category of categories"
                                        (click)="selectedCategory = category"
                                        [class]="selectedCategory === category ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'text-gray-700 hover:text-indigo-600 border-gray-300 hover:border-indigo-500'"
                                        class="px-4 py-2 rounded-full font-medium transition-all duration-300 border"
                                    >
                                        {{ category }}
                                    </button>
                                </div>

                                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    <div *ngFor="let product of getProductsByCategory()" class="border border-gray-200 rounded-xl p-4 text-center shadow-sm flex flex-col justify-between items-center">
                                        <img [src]="product.image" [alt]="product.name" class="w-full h-24 object-cover rounded-lg mb-3 shadow-sm" />
                                        <h4 class="font-semibold text-sm sm:text-base mb-1 text-gray-800 truncate w-full">{{ product.name }}</h4>
                                        <p class="text-orange-600 font-bold mb-3 text-base">₹{{ product.price.toFixed(2) }}</p>
                                        <button *ngIf="product.inStock" (click)="addToOrder(product)" class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold w-full transition-colors shadow-md">Add to Order</button>
                                        <span *ngIf="!product.inStock" class="text-red-500 text-xs font-semibold px-3 py-1 bg-red-50 rounded-full">OUT OF STOCK</span>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-gray-50 rounded-xl p-5 shadow-lg">
                                <h3 class="text-xl font-semibold mb-4 text-gray-800">Order Summary</h3>

                                <div class="mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    <h4 class="font-medium mb-3 text-gray-700">Selected Products</h4>
                                    <div *ngIf="selectedProducts.length === 0" class="text-gray-500 text-sm text-center py-4 bg-gray-100 rounded-lg">No products selected yet</div>
                                    <div *ngFor="let item of selectedProducts" class="flex justify-between items-center py-2 px-3 border-b border-gray-200 last:border-b-0">
                                        <div>
                                            <span class="text-sm font-medium text-gray-800">{{ item.product.name }}</span>
                                            <span class="text-xs text-gray-500 block">₹{{ item.product.price.toFixed(2) }} x {{ item.quantity }}</span>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                            <button (click)="decreaseQuantity(item)" class="w-6 h-6 rounded-full bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center text-sm font-bold transition-colors">-</button>
                                            <span class="text-sm font-semibold text-gray-800">{{ item.quantity }}</span>
                                            <button (click)="increaseQuantity(item)" class="w-6 h-6 rounded-full bg-green-100 text-green-600 hover:bg-green-200 flex items-center justify-center text-sm font-bold transition-colors">+</button>
                                        </div>
                                    </div>
                                </div>

                                <div class="space-y-2 text-sm text-gray-700">
                                    <div class="flex justify-between">
                                        <span>Items Amount:</span>
                                        <span class="font-semibold">₹{{ orderSummary.itemsAmount.toFixed(2) }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Discount Amount:</span>
                                        <span class="font-semibold">₹{{ orderSummary.discountAmount.toFixed(2) }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Taxable Amount:</span>
                                        <span class="font-semibold">₹{{ orderSummary.taxableAmount.toFixed(2) }}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Jam Tax Amount:</span>
                                        <span class="font-semibold">₹{{ orderSummary.taxAmount.toFixed(2) }}</span>
                                    </div>
                                    <div class="flex justify-between font-bold text-base border-t border-gray-300 pt-2 text-gray-900">
                                        <span>Total Amount:</span>
                                        <span>₹{{ orderSummary.totalAmount.toFixed(2) }}</span>
                                    </div>
                                </div>

                                <div class="mt-4">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Charges:</label>
                                    <input
                                        type="number"
                                        [(ngModel)]="orderSummary.deliveryCharges"
                                        (ngModelChange)="calculateTotal()"
                                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                    />
                                </div>

                                <div class="mt-4">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Payment By:</label>
                                    <select [(ngModel)]="selectedPaymentMethod" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                                        <option value="">Select Payment Method</option>
                                        <option value="cash">Cash</option>
                                        <option value="card">Card</option>
                                        <option value="upi">UPI</option>
                                        <option value="online">Online</option>
                                    </select>
                                </div>

                                <div class="mt-4">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Order Notes:</label>
                                    <textarea
                                        [(ngModel)]="orderNotes"
                                        rows="3"
                                        class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                                        placeholder="Add any special instructions..."
                                    ></textarea>
                                </div>

                                <div class="mt-4">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Time:</label>
                                    <input type="datetime-local" [(ngModel)]="deliveryTime" class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                                </div>

                                <div class="mt-6 space-y-3">
                                    <button
                                        (click)="confirmOrder()"
                                        [disabled]="selectedProducts.length === 0"
                                        class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors shadow-md"
                                    >
                                        Confirm Order
                                    </button>
                                    <button
                                        (click)="confirmSubscriptionOrder()"
                                        [disabled]="selectedProducts.length === 0"
                                        class="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold transition-colors shadow-md"
                                    >
                                        Confirm Subscription Order
                                    </button>
                                    <button (click)="cancelOrder()" class="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors shadow-md">Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- New/Edit Customer Modal -->
                <div *ngIf="showNewCustomerModal" class="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md transform transition-all duration-300 scale-100">
                        <h3 class="text-xl font-bold text-gray-900 mb-6">{{ editingCustomer ? 'Edit Customer' : 'Add New Customer' }}</h3>

                        <form (ngSubmit)="saveCustomer()" #customerForm="ngForm">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Customer Name *</label>
                                    <input
                                        type="text"
                                        [(ngModel)]="newCustomer.name"
                                        name="name"
                                        required
                                        class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    />
                                </div>

                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Customer Type *</label>
                                    <select
                                        [(ngModel)]="newCustomer.customerType"
                                        name="customerType"
                                        required
                                        (change)="onCustomerTypeChange()"
                                        class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    >
                                        <option value="">Select Customer Type</option>
                                        <option value="Individual">Individual</option>
                                        <option value="Business">Business</option>
                                        <option value="Community">Community</option>
                                    </select>
                                </div>

                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                                    <input
                                        type="tel"
                                        [(ngModel)]="newCustomer.phoneNumber"
                                        name="phoneNumber"
                                        required
                                        pattern="[0-9]{10}"
                                        class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    />
                                </div>

                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        [(ngModel)]="newCustomer.emailAddress"
                                        name="emailAddress"
                                        required
                                        class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    />
                                </div>

                                <div class="md:col-span-2">
                                    <label class="block text-sm font-medium text-gray-700 mb-1">Community Name *</label>
                                    <input
                                        type="text"
                                        [(ngModel)]="newCustomer.communityName"
                                        name="communityName"
                                        required
                                        class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                    />
                                </div>

                                <ng-container *ngIf="newCustomer.customerType === 'Individual'">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                                        <input
                                            type="text"
                                            [(ngModel)]="newCustomer.firstName"
                                            name="individualFirstName"
                                            required
                                            class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                                        <input
                                            type="text"
                                            [(ngModel)]="newCustomer.lastName"
                                            name="individualLastName"
                                            required
                                            class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Door No</label>
                                        <input
                                            type="text"
                                            [(ngModel)]="newCustomer.doorNo"
                                            name="individualDoorNo"
                                            class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Apartment Name</label>
                                        <input
                                            type="text"
                                            [(ngModel)]="newCustomer.apartmentName"
                                            name="individualApartmentName"
                                            class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        />
                                    </div>
                                    <div class="md:col-span-2">
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                        <textarea
                                            [(ngModel)]="newCustomer.address"
                                            name="individualAddress"
                                            required
                                            rows="2"
                                            class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Pin Code *</label>
                                        <input
                                            type="text"
                                            [(ngModel)]="newCustomer.pinCode"
                                            name="individualPinCode"
                                            required
                                            pattern="[0-9]{6}"
                                            class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        />
                                    </div>
                                </ng-container>

                                <ng-container *ngIf="newCustomer.customerType === 'Business'">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Contact Person First Name *</label>
                                        <input
                                            type="text"
                                            [(ngModel)]="newCustomer.firstName"
                                            name="businessContactFirstName"
                                            required
                                            class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Contact Person Last Name *</label>
                                        <input
                                            type="text"
                                            [(ngModel)]="newCustomer.lastName"
                                            name="businessContactLastName"
                                            required
                                            class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        />
                                    </div>
                                    <div class="md:col-span-2">
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Establishment Name *</label>
                                        <input
                                            type="text"
                                            [(ngModel)]="newCustomer.establishmentName"
                                            name="establishmentName"
                                            required
                                            class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        />
                                    </div>
                                    <div class="md:col-span-2">
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Establishment GST No</label>
                                        <input
                                            type="text"
                                            [(ngModel)]="newCustomer.establishmentGSTNo"
                                            name="establishmentGSTNo"
                                            class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Establishment Phone No *</label>
                                        <input
                                            type="tel"
                                            [(ngModel)]="newCustomer.establishmentPhoneNo"
                                            name="establishmentPhoneNo"
                                            required
                                            pattern="[0-9]{10}"
                                            class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                        <input
                                            type="tel"
                                            [(ngModel)]="newCustomer.mobileNumber"
                                            name="businessMobileNumber"
                                            pattern="[0-9]{10}"
                                            class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Door No</label>
                                        <input
                                            type="text"
                                            [(ngModel)]="newCustomer.doorNo"
                                            name="businessDoorNo"
                                            class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Building Name</label>
                                        <input
                                            type="text"
                                            [(ngModel)]="newCustomer.buildingName"
                                            name="buildingName"
                                            class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        />
                                    </div>
                                    <div class="md:col-span-2">
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                                        <textarea
                                            [(ngModel)]="newCustomer.address"
                                            name="businessAddress"
                                            required
                                            rows="2"
                                            class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        ></textarea>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Pin Code *</label>
                                        <input
                                            type="text"
                                            [(ngModel)]="newCustomer.pinCode"
                                            name="businessPinCode"
                                            required
                                            pattern="[0-9]{6}"
                                            class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        />
                                    </div>
                                </ng-container>

                                <ng-container *ngIf="newCustomer.customerType === 'Community'">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Contact First Name *</label>
                                        <input
                                            type="text"
                                            [(ngModel)]="newCustomer.firstName"
                                            name="communityContactFirstName"
                                            required
                                            class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Contact Last Name *</label>
                                        <input
                                            type="text"
                                            [(ngModel)]="newCustomer.lastName"
                                            name="communityContactLastName"
                                            required
                                            class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        />
                                    </div>
                                    <div class="md:col-span-2">
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Select Community *</label>
                                        <select
                                            [(ngModel)]="newCustomer.selectedCommunityName"
                                            name="selectedCommunity"
                                            required
                                            (change)="onCommunitySelectInModal()"
                                            class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                                        >
                                            <option value="">Select Existing Community</option>
                                            <option *ngFor="let communityName of getCommunityNames()" [value]="communityName">{{ communityName }}</option>
                                        </select>
                                    </div>
                                    <div class="md:col-span-2">
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <input type="text" [(ngModel)]="newCustomer.address" name="communityAddress" readonly class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-500 text-sm" />
                                    </div>
                                    <div class="md:col-span-2">
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                                        <input type="text" [(ngModel)]="newCustomer.pinCode" name="communityPinCode" readonly class="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-500 text-sm" />
                                    </div>
                                </ng-container>
                            </div>

                            <div class="flex justify-end space-x-3 mt-6">
                                <button type="button" (click)="cancelNewCustomer()" class="py-2.5 px-5 sm:py-3 sm:px-6 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition-colors duration-200 text-sm">Cancel</button>
                                <button
                                    type="submit"
                                    [disabled]="!customerForm.valid"
                                    class="py-2.5 px-5 sm:py-3 sm:px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-semibold rounded-lg shadow-md transition-colors duration-300 text-sm"
                                >
                                    {{ editingCustomer ? 'Update Customer' : 'Add Customer' }}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <style>
            /* Custom scrollbar for product list in order summary */
            .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
            }

            .custom-scrollbar::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 10px;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #888;
                border-radius: 10px;
            }

            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #555;
            }
        </style>
    `
})
export class Customers implements OnInit {
    // Mock Data
    customers: Customer[] = [
        {
            id: 1,
            name: 'John Doe',
            customerType: 'Individual',
            phoneNumber: '1234567890',
            emailAddress: 'john.doe@example.com',
            communityName: 'Green Meadows',
            createdDate: '2023-01-15',
            firstName: 'John',
            lastName: 'Doe',
            doorNo: '101',
            apartmentName: 'Maple Apt',
            address: '123 Elm Street',
            pinCode: '10001'
        },
        {
            id: 2,
            name: 'Acme Corp',
            customerType: 'Business',
            phoneNumber: '9876543210',
            emailAddress: 'contact@acmecorp.com',
            communityName: 'Tech Hub',
            createdDate: '2022-11-20',
            firstName: 'Jane',
            lastName: 'Smith',
            establishmentName: 'Acme Corp',
            establishmentGSTNo: 'GSTIN123ABC',
            establishmentPhoneNo: '9988776655',
            mobileNumber: '9988776655',
            buildingName: 'Acme Tower',
            doorNo: '500',
            address: '456 Oak Avenue',
            pinCode: '20002'
        },
        {
            id: 3,
            name: 'Community Center A',
            customerType: 'Community',
            phoneNumber: '5551234567',
            emailAddress: 'info@communityA.org',
            communityName: 'Riverside Community',
            createdDate: '2023-03-10',
            firstName: 'David',
            lastName: 'Lee',
            selectedCommunityName: 'Riverside Community', // Set for existing community customers
            address: '123 River Rd, City', // Should match lookup
            pinCode: '300030' // Should match lookup
        },
        {
            id: 4,
            name: 'Maria Garcia',
            customerType: 'Individual',
            phoneNumber: '1122334455',
            emailAddress: 'maria.g@example.com',
            communityName: 'Blue Meadows',
            createdDate: '2024-01-05',
            firstName: 'Maria',
            lastName: 'Garcia',
            doorNo: '205',
            apartmentName: 'Willow Residences',
            address: '321 Birch Street',
            pinCode: '10005'
        },
        {
            id: 5,
            name: 'Global Logistics',
            customerType: 'Business',
            phoneNumber: '7788990011',
            emailAddress: 'sales@globallog.com',
            communityName: 'Sunrise Estates',
            createdDate: '2023-08-22',
            firstName: 'Chris',
            lastName: 'Evans',
            establishmentName: 'Global Logistics Inc.',
            establishmentGSTNo: 'GSTINXYZ789',
            establishmentPhoneNo: '7788990011',
            mobileNumber: '7788990011',
            buildingName: 'Logistics Hub',
            doorNo: '10',
            address: '654 Cedar Road',
            pinCode: '20010'
        },
        {
            id: 6,
            name: 'Sports Club Z',
            customerType: 'Community',
            phoneNumber: '4455667788',
            emailAddress: 'contact@sportsclubz.com',
            communityName: 'Silver Oak',
            createdDate: '2024-02-18',
            firstName: 'Sarah',
            lastName: 'Connor',
            selectedCommunityName: 'Silver Oak', // Set for existing community customers
            address: '202 Silver Rd, District', // Should match lookup
            pinCode: '300070' // Should match lookup
        }
    ];

    products: Product[] = [
        { id: 1, name: 'Artisan Bread', price: 150, image: 'https://placehold.co/100x100/E0F7FA/00796B?text=Bread1', inStock: true, category: 'Breads' },
        { id: 2, name: 'Chocolate Croissant', price: 80, image: 'https://placehold.co/100x100/E0F7FA/00796B?text=Croissant', inStock: true, category: 'Pastries' },
        { id: 3, name: 'Vegan Muffin', price: 60, image: 'https://placehold.co/100x100/FFF3E0/E65100?text=Muffin', inStock: false, category: 'Muffins' },
        { id: 4, name: 'Sourdough Loaf', price: 180, image: 'https://placehold.co/100x100/E0F7FA/00796B?text=Sourdough', inStock: true, category: 'Breads' },
        { id: 5, name: 'Almond Croissant', price: 90, image: 'https://placehold.co/100x100/E0F7FA/00796B?text=AlmondCroissant', inStock: true, category: 'Pastries' },
        { id: 6, name: 'Blueberry Muffin', price: 65, image: 'https://placehold.co/100x100/FFF3E0/E65100?text=BlueberryMuffin', inStock: true, category: 'Muffins' },
        { id: 7, name: 'Rye Bread', price: 160, image: 'https://placehold.co/100x100/E0F7FA/00796B?text=RyeBread', inStock: true, category: 'Breads' },
        { id: 8, name: 'Pain au Chocolat', price: 85, image: 'https://placehold.co/100x100/E0F7FA/00796B?text=PainChoc', inStock: true, category: 'Pastries' },
        { id: 9, name: 'Banana Nut Muffin', price: 70, image: 'https://placehold.co/100x100/FFF3E0/E65100?text=BananaMuffin', inStock: false, category: 'Muffins' }
    ];

    categories: string[] = ['All', 'Breads', 'Pastries', 'Muffins'];
    selectedCategory: string = 'All';

    displayedCustomers: Customer[] = [];
    searchTerm: string = '';
    selectedCustomerType: '' | 'Individual' | 'Business' | 'Community' = '';

    showNewCustomerModal: boolean = false;
    newCustomer: Customer = this.initializeNewCustomer();
    editingCustomer: boolean = false;

    showNewOrderForm: boolean = false;
    selectedCustomer: Customer | null = null;
    selectedProducts: SelectedProductItem[] = [];
    orderSummary: OrderSummary = this.initializeOrderSummary();
    selectedPaymentMethod: string = '';
    orderNotes: string = '';
    deliveryTime: string = '';

    // Lookup for community addresses and pin codes
    communityLookup: { [key: string]: { address: string; pinCode: string } } = {
        'Riverside Community': { address: '123 River Rd, City', pinCode: '300030' },
        'Green Garden': { address: '456 Garden St, Town', pinCode: '300040' },
        'Blue Meadows': { address: '789 Blue Ave, Village', pinCode: '300050' },
        'Sunrise Estates': { address: '101 Sun Blvd, County', pinCode: '300060' },
        'Silver Oak': { address: '202 Silver Rd, District', pinCode: '300070' },
        'Tech Hub': { address: '303 Tech Park, Metro', pinCode: '300080' },
        'Palm Residency': { address: '404 Palm Lane, Island', pinCode: '300090' }
    };

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.filterCustomers(); // Initialize displayed customers
    }

    // --- Customer Management Functions ---

    initializeNewCustomer(): Customer {
        return {
            id: 0,
            name: '',
            customerType: 'Individual', // Default to Individual
            phoneNumber: '',
            emailAddress: '',
            communityName: '',
            createdDate: new Date().toISOString().slice(0, 10), // Current date in YYYY-MM-DD format
            // Initialize all optional fields to undefined to ensure clean state
            firstName: undefined,
            lastName: undefined,
            doorNo: undefined,
            apartmentName: undefined,
            address: undefined,
            pinCode: undefined,
            businessRegNumber: undefined,
            contactPerson: undefined,
            establishmentName: undefined,
            establishmentGSTNo: undefined,
            establishmentPhoneNo: undefined,
            mobileNumber: undefined,
            buildingName: undefined,
            selectedCommunityName: undefined
        };
    }

    addNewCustomer(): void {
        this.editingCustomer = false;
        this.newCustomer = this.initializeNewCustomer();
        this.showNewCustomerModal = true;
    }

    editCustomer(customer: Customer): void {
        this.editingCustomer = true;
        this.newCustomer = { ...customer }; // Create a copy for editing

        // Special handling for Community type when editing to populate selectedCommunityName
        if (this.newCustomer.customerType === 'Community' && customer.communityName) {
            this.newCustomer.selectedCommunityName = customer.communityName;
            // Ensure address and pinCode are correctly populated if they were from lookup
            this.onCommunitySelectInModal();
        }
        this.showNewCustomerModal = true;
    }

    onCustomerTypeChange(): void {
        const currentType = this.newCustomer.customerType;

        // Preserve common fields first
        const preservedCustomer: Customer = {
            id: this.newCustomer.id,
            name: this.newCustomer.name,
            customerType: currentType,
            phoneNumber: this.newCustomer.phoneNumber,
            emailAddress: this.newCustomer.emailAddress,
            communityName: this.newCustomer.communityName,
            createdDate: this.newCustomer.createdDate
        };

        // Reset all type-specific fields to undefined/empty string
        preservedCustomer.firstName = undefined;
        preservedCustomer.lastName = undefined;
        preservedCustomer.doorNo = undefined;
        preservedCustomer.apartmentName = undefined;
        preservedCustomer.address = undefined;
        preservedCustomer.pinCode = undefined;
        preservedCustomer.businessRegNumber = undefined;
        preservedCustomer.contactPerson = undefined;
        preservedCustomer.establishmentName = undefined;
        preservedCustomer.establishmentGSTNo = undefined;
        preservedCustomer.establishmentPhoneNo = undefined;
        preservedCustomer.mobileNumber = undefined;
        preservedCustomer.buildingName = undefined;
        preservedCustomer.selectedCommunityName = undefined;

        // Apply fields relevant to the selected type
        if (currentType === 'Individual') {
            // Re-apply if they had values before the type change
            preservedCustomer.firstName = this.newCustomer.firstName;
            preservedCustomer.lastName = this.newCustomer.lastName;
            preservedCustomer.doorNo = this.newCustomer.doorNo;
            preservedCustomer.apartmentName = this.newCustomer.apartmentName;
            preservedCustomer.address = this.newCustomer.address;
            preservedCustomer.pinCode = this.newCustomer.pinCode;
        } else if (currentType === 'Business') {
            preservedCustomer.firstName = this.newCustomer.firstName; // Contact Person First Name
            preservedCustomer.lastName = this.newCustomer.lastName; // Contact Person Last Name
            preservedCustomer.establishmentName = this.newCustomer.establishmentName;
            preservedCustomer.establishmentGSTNo = this.newCustomer.establishmentGSTNo;
            preservedCustomer.establishmentPhoneNo = this.newCustomer.establishmentPhoneNo;
            preservedCustomer.mobileNumber = this.newCustomer.mobileNumber;
            preservedCustomer.doorNo = this.newCustomer.doorNo;
            preservedCustomer.buildingName = this.newCustomer.buildingName;
            preservedCustomer.address = this.newCustomer.address;
            preservedCustomer.pinCode = this.newCustomer.pinCode;
        } else if (currentType === 'Community') {
            preservedCustomer.firstName = this.newCustomer.firstName; // Contact First Name
            preservedCustomer.lastName = this.newCustomer.lastName; // Contact Last Name
            preservedCustomer.selectedCommunityName = this.newCustomer.selectedCommunityName; // Preserve selected community
            // Address and PinCode will be set by onCommunitySelectInModal
        }

        this.newCustomer = preservedCustomer; // Assign the cleaned and re-populated object

        // If switching to Community, trigger initial population of address/pin if a community is pre-selected
        if (this.newCustomer.customerType === 'Community') {
            this.onCommunitySelectInModal();
        }
    }

    onCommunitySelectInModal(): void {
        if (this.newCustomer.customerType === 'Community' && this.newCustomer.selectedCommunityName) {
            const community = this.communityLookup[this.newCustomer.selectedCommunityName];
            if (community) {
                this.newCustomer.address = community.address;
                this.newCustomer.pinCode = community.pinCode;
                // For new community customers, also update the main communityName and customer name field
                if (!this.editingCustomer || this.newCustomer.name === '') {
                    // If new or name not set
                    this.newCustomer.name = this.newCustomer.selectedCommunityName;
                    this.newCustomer.communityName = this.newCustomer.selectedCommunityName;
                }
            } else {
                this.newCustomer.address = '';
                this.newCustomer.pinCode = '';
                if (!this.editingCustomer) {
                    this.newCustomer.name = '';
                    this.newCustomer.communityName = '';
                }
            }
        } else {
            // Clear address and pin code if not a community type or no community selected
            this.newCustomer.address = undefined;
            this.newCustomer.pinCode = undefined;
        }
    }

    getCommunityNames(): string[] {
        return Object.keys(this.communityLookup);
    }

    saveCustomer(): void {
        // Final pruning/setting of fields before saving to keep data clean
        if (this.newCustomer.customerType === 'Individual') {
            this.newCustomer.businessRegNumber = undefined;
            this.newCustomer.contactPerson = undefined;
            this.newCustomer.establishmentName = undefined;
            this.newCustomer.establishmentGSTNo = undefined;
            this.newCustomer.establishmentPhoneNo = undefined;
            this.newCustomer.mobileNumber = undefined;
            this.newCustomer.buildingName = undefined;
            this.newCustomer.selectedCommunityName = undefined;
            // Ensure communityName for Individual is empty string if not explicitly set elsewhere
            if (this.newCustomer.communityName === undefined) {
                this.newCustomer.communityName = '';
            }
        } else if (this.newCustomer.customerType === 'Business') {
            this.newCustomer.apartmentName = undefined;
            this.newCustomer.selectedCommunityName = undefined;
            // Set contact person from first and last name
            this.newCustomer.contactPerson = `${this.newCustomer.firstName || ''} ${this.newCustomer.lastName || ''}`.trim();
            if (this.newCustomer.contactPerson === '') this.newCustomer.contactPerson = undefined;
            // Ensure communityName for Business is empty string if not explicitly set elsewhere
            if (this.newCustomer.communityName === undefined) {
                this.newCustomer.communityName = '';
            }
        } else if (this.newCustomer.customerType === 'Community') {
            this.newCustomer.businessRegNumber = undefined;
            this.newCustomer.apartmentName = undefined;
            this.newCustomer.establishmentName = undefined;
            this.newCustomer.establishmentGSTNo = undefined;
            this.newCustomer.establishmentPhoneNo = undefined;
            this.newCustomer.mobileNumber = undefined;
            this.newCustomer.buildingName = undefined;
            // Ensure communityName is set from selectedCommunityName if it exists
            if (this.newCustomer.selectedCommunityName) {
                this.newCustomer.communityName = this.newCustomer.selectedCommunityName;
            } else {
                this.newCustomer.communityName = ''; // Fallback if no community selected
            }
            // Set contact person from first and last name
            this.newCustomer.contactPerson = `${this.newCustomer.firstName || ''} ${this.newCustomer.lastName || ''}`.trim();
            if (this.newCustomer.contactPerson === '') this.newCustomer.contactPerson = undefined;
        }

        // Handle the save logic as before
        if (this.editingCustomer) {
            const index = this.customers.findIndex((c) => c.id === this.newCustomer.id);
            if (index !== -1) {
                this.customers[index] = { ...this.newCustomer };
            }
        } else {
            const newId = this.customers.length > 0 ? Math.max(...this.customers.map((c) => c.id)) + 1 : 1;
            this.newCustomer.id = newId;
            this.customers.push({ ...this.newCustomer });
        }
        this.filterCustomers(); // Re-filter to update the table
        this.showNewCustomerModal = false;
    }

    cancelNewCustomer(): void {
        this.showNewCustomerModal = false;
        this.newCustomer = this.initializeNewCustomer(); // Reset form
    }

    deleteCustomer(id: number): void {
        if (confirm('Are you sure you want to delete this customer?')) {
            this.customers = this.customers.filter((customer) => customer.id !== id);
            this.filterCustomers(); // Re-filter to update the table
        }
    }

    filterCustomers(): void {
        let filtered = this.customers;

        if (this.searchTerm) {
            filtered = filtered.filter((customer) => customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) || customer.emailAddress.toLowerCase().includes(this.searchTerm.toLowerCase()));
        }

        if (this.selectedCustomerType) {
            filtered = filtered.filter((customer) => customer.customerType === this.selectedCustomerType);
        }

        this.displayedCustomers = filtered;
    }

    getCustomerTypeClass(type: Customer['customerType'] | undefined): string {
        // Updated type to allow undefined
        switch (type) {
            case 'Individual':
                return 'bg-blue-100 text-blue-800';
            case 'Business':
                return 'bg-green-100 text-green-800';
            case 'Community':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    // --- Order Management Functions ---

    initializeOrderSummary(): OrderSummary {
        return {
            itemsAmount: 0,
            discountAmount: 0,
            taxableAmount: 0,
            taxAmount: 0,
            deliveryCharges: 0,
            totalAmount: 0
        };
    }

    createNewOrder(customer: Customer): void {
        this.selectedCustomer = customer;
        this.showNewOrderForm = true;
        this.selectedProducts = []; // Reset selected products for new order
        this.orderSummary = this.initializeOrderSummary(); // Reset order summary
        this.selectedPaymentMethod = '';
        this.orderNotes = '';
        this.deliveryTime = '';
    }

    cancelOrder(): void {
        this.showNewOrderForm = false;
        this.selectedCustomer = null;
        this.selectedProducts = [];
        this.orderSummary = this.initializeOrderSummary();
    }

    getProductsByCategory(): Product[] {
        if (this.selectedCategory === 'All') {
            return this.products;
        }
        return this.products.filter((product) => product.category === this.selectedCategory);
    }

    addToOrder(product: Product): void {
        const existingItem = this.selectedProducts.find((item) => item.product.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.selectedProducts.push({ product, quantity: 1 });
        }
        this.calculateTotal();
    }

    increaseQuantity(item: SelectedProductItem): void {
        item.quantity++;
        this.calculateTotal();
    }

    decreaseQuantity(item: SelectedProductItem): void {
        item.quantity--;
        if (item.quantity <= 0) {
            this.selectedProducts = this.selectedProducts.filter((p) => p.product.id !== item.product.id);
        }
        this.calculateTotal();
    }

    calculateTotal(): void {
        let itemsAmount = 0;
        this.selectedProducts.forEach((item) => {
            itemsAmount += item.product.price * item.quantity;
        });

        const discountAmount = 0; // For now, no discount logic
        const taxableAmount = itemsAmount - discountAmount;
        const taxRate = 0.05; // Example 5% tax
        const taxAmount = taxableAmount * taxRate;
        const deliveryCharges = this.orderSummary.deliveryCharges || 0; // Use existing if available

        this.orderSummary = {
            itemsAmount,
            discountAmount,
            taxableAmount,
            taxAmount,
            deliveryCharges,
            totalAmount: taxableAmount + taxAmount + deliveryCharges
        };
    }

    confirmOrder(): void {
        if (this.selectedProducts.length === 0) {
            alert('Please select at least one product for the order.');
            return;
        }
        if (!this.selectedPaymentMethod) {
            alert('Please select a payment method.');
            return;
        }
        if (!this.deliveryTime) {
            alert('Please select a delivery time.');
            return;
        }
        alert(`Order confirmed for ${this.selectedCustomer?.name}. Total: ₹${this.orderSummary.totalAmount.toFixed(2)}`);
        // Here you would typically send the order data to a backend
        this.cancelOrder(); // Close order form after confirmation
    }

    confirmSubscriptionOrder(): void {
        if (this.selectedProducts.length === 0) {
            alert('Please select at least one product for the subscription order.');
            return;
        }
        alert(`Subscription Order confirmed for ${this.selectedCustomer?.name}. Total: ₹${this.orderSummary.totalAmount.toFixed(2)}. (Subscription details would be configured here)`);
        // Logic for subscription order confirmation
        this.cancelOrder(); // Close order form after confirmation
    }

    resetFilters(): void {
        this.searchTerm = '';
        this.selectedCustomerType = '';
        this.filterCustomers();
    }
}
