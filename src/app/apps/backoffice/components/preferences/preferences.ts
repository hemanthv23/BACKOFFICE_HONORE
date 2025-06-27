import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// Font Awesome imports - ensure these are correctly installed and configured in your Angular app
import { faEdit, faTrash, faPlus, faSearch, faTimes, faSave, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

// Import interfaces and services from the nested 'components' folder
import { Slab } from './components/preferences-interfaces';
import { PreferencesDataService } from './components/preferences-data';
import { PreferencesFilteringService } from './components/preferences-filtering';
import { PreferencesModalsService } from './components/preferences-modals';

@Component({
    selector: 'app-preferences',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule, CurrencyPipe, FontAwesomeModule],
    template: `
        <script src="https://cdn.tailwindcss.com"></script>
        <!-- Ensure Font Awesome is loaded for icons -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />

        <div class="min-h-screen bg-gray-50 font-inter">
            <div class="bg-white shadow-sm border-b">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"></div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Back button -->
                <div class="mb-4">
                    <button
                        routerLink="../"
                        class="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors duration-200 shadow-md flex items-center space-x-1 sm:space-x-2 w-auto"
                        aria-label="Back to Home"
                    >
                        <fa-icon [icon]="faArrowLeft" class="text-white w-3 h-3 sm:w-4 sm:h-4"></fa-icon>
                        <span class="whitespace-nowrap">Back to Home</span>
                    </button>
                </div>
                <!-- Header Card -->
                <div class="bg-white rounded-xl shadow-lg border p-6 mb-8">
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">App Settings</h1>
                    <p class="text-gray-600">Configure application-wide preferences and parameters here. These settings control various aspects of the application's behavior.</p>
                </div>

                <!-- Packing Slabs Section -->
                <div class="mb-8">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-semibold text-gray-900">Packing Slabs</h3>
                        <button (click)="modalsService.openAddForm()" class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors shadow-md">
                            <fa-icon [icon]="faPlus"></fa-icon>
                            <span>Add Slab</span>
                        </button>
                    </div>

                    <!-- Filters and Search -->
                    <div class="flex flex-wrap gap-4 mb-6">
                        <div class="relative">
                            <fa-icon [icon]="faSearch" class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></fa-icon>
                            <input
                                type="text"
                                placeholder="Search slabs..."
                                [(ngModel)]="searchTerm"
                                (input)="applyFilters()"
                                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                aria-label="Search slabs"
                            />
                        </div>
                        <div class="relative">
                            <select
                                [(ngModel)]="filterCustomerType"
                                (change)="applyFilters()"
                                class="pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                                aria-label="Filter by customer type"
                            >
                                <option value="">All Customer Types</option>
                                <option *ngFor="let type of modalsService.customerTypes" [value]="type">{{ type }}</option>
                            </select>
                            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Slabs Table -->
                <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl. #</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slab Type</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Type</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Amount</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Amount</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount Value</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GST Value</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <ng-container *ngIf="filteredSlabs.length > 0; else noSlabsFound">
                                    <tr *ngFor="let slab of filteredSlabs; let i = index" class="hover:bg-gray-50">
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {{ i + 1 }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap">
                                            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {{ slab.slabType }}
                                            </span>
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {{ slab.customerType }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {{ slab.minAmount | currency: 'INR' : 'symbol' : '1.0-0' }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {{ slab.maxAmount | currency: 'INR' : 'symbol' : '1.0-0' }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {{ slab.amountValue | currency: 'INR' : 'symbol' : '1.2-2' }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {{ slab.gstValue | currency: 'INR' : 'symbol' : '1.2-2' }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                            {{ slab.totalValue | currency: 'INR' : 'symbol' : '1.2-2' }}
                                        </td>
                                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div class="flex space-x-2">
                                                <button (click)="editSlab(slab.id)" class="text-blue-600 hover:text-blue-900 p-1 rounded">
                                                    <fa-icon [icon]="faEdit"></fa-icon>
                                                </button>
                                                <button (click)="confirmDelete(slab.id)" class="text-red-600 hover:text-red-900 p-1 rounded">
                                                    <fa-icon [icon]="faTrash"></fa-icon>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </ng-container>
                            </tbody>
                        </table>
                    </div>
                </div>

                <ng-template #noSlabsFound>
                    <div class="text-center py-12">
                        <div class="text-gray-500">
                            <p class="text-lg">No packing slabs found</p>
                            <p class="text-sm">Try adjusting your search or filter criteria</p>
                        </div>
                    </div>
                </ng-template>
            </div>

            <!-- Add/Edit Slab Form Modal -->
            <div *ngIf="modalsService.showAddForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100" role="dialog" aria-modal="true" aria-labelledby="slab-form-title">
                    <div class="flex justify-between items-center p-6 border-b">
                        <h3 id="slab-form-title" class="text-lg font-semibold text-gray-900">
                            {{ modalsService.editingSlabId ? 'Edit Slab' : 'Add New Slab' }}
                        </h3>
                        <button (click)="modalsService.closeAddForm()" class="text-gray-400 hover:text-gray-600">
                            <fa-icon [icon]="faTimes"></fa-icon>
                        </button>
                    </div>

                    <div class="p-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2"> Customer Type * </label>
                                <select [(ngModel)]="modalsService.formData.customerType" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required>
                                    <option value="">Select Customer Type</option>
                                    <option *ngFor="let type of modalsService.customerTypes" [value]="type">{{ type }}</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2"> Amount Type </label>
                                <select [(ngModel)]="modalsService.formData.amountType" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Amount Type</option>
                                    <option *ngFor="let type of modalsService.amountTypes" [value]="type">{{ type }}</option>
                                </select>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2"> Min Amount * </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    [(ngModel)]="modalsService.formData.minAmount"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2"> Max Amount * </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    [(ngModel)]="modalsService.formData.maxAmount"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2"> Amount Value * </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    [(ngModel)]="modalsService.formData.amountValue"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="0.00"
                                    required
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2"> GST Amount </label>
                                <input type="number" step="0.01" [(ngModel)]="modalsService.formData.gstAmount" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="0.00" />
                            </div>
                        </div>

                        <div class="flex justify-end space-x-4 mt-8">
                            <button type="button" (click)="modalsService.closeAddForm()" class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
                            <button type="button" (click)="handleSubmit()" class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center space-x-2 transition-colors">
                                <fa-icon [icon]="faSave"></fa-icon>
                                <span>{{ modalsService.editingSlabId ? 'Update Slab' : 'Save Slab' }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Generic Custom Alert/Confirm Modal -->
            <div *ngIf="modalsService.showCustomModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="bg-white rounded-xl shadow-xl w-full max-w-sm transform transition-all duration-300 scale-100 opacity-100" role="dialog" aria-modal="true" aria-labelledby="custom-modal-title">
                    <div class="p-6">
                        <h3 id="custom-modal-title" class="text-xl font-bold text-gray-900 mb-4">{{ modalsService.customModalData.title }}</h3>
                        <p class="text-gray-700 mb-6">{{ modalsService.customModalData.message }}</p>
                        <div class="flex justify-end space-x-3">
                            <button
                                *ngIf="modalsService.customModalData.type === 'confirm'"
                                type="button"
                                (click)="modalsService.customModalData.onCancel?.()"
                                class="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                (click)="modalsService.customModalData.onConfirm?.()"
                                [ngClass]="{
                                    'bg-red-600 hover:bg-red-700': modalsService.customModalData.type === 'confirm',
                                    'bg-blue-600 hover:bg-blue-700': modalsService.customModalData.type === 'alert'
                                }"
                                class="px-4 py-2 text-sm font-semibold text-white rounded-md transition-colors"
                            >
                                {{ modalsService.customModalData.type === 'confirm' ? 'Confirm' : 'OK' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Simple Message Box Modal -->
            <div *ngIf="modalsService.showMessageBox" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div class="bg-white rounded-xl shadow-xl w-full max-w-sm transform transition-all duration-300 scale-100 opacity-100" role="dialog" aria-modal="true" aria-labelledby="message-box-title">
                    <div class="p-6">
                        <h3 id="message-box-title" class="text-xl font-bold text-gray-900 mb-4">{{ modalsService.messageBoxTitle }}</h3>
                        <p class="text-gray-700 mb-6">{{ modalsService.messageBoxContent }}</p>
                        <div class="flex justify-end">
                            <button type="button" (click)="modalsService.closeMessageBox()" class="px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors">OK</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [
        `
            :host {
                font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
        `
    ]
})
export class Preferences implements OnInit {
    // Public properties for filters, directly accessible in template for ngModel
    searchTerm: string = '';
    filterCustomerType: string = '';

    // Font Awesome icons
    faEdit = faEdit;
    faTrash = faTrash;
    faPlus = faPlus;
    faSearch = faSearch;
    faTimes = faTimes;
    faSave = faSave;
    faArrowLeft = faArrowLeft;

    filteredSlabs: Slab[] = [];

    // Inject services
    constructor(
        private dataService: PreferencesDataService,
        private filteringService: PreferencesFilteringService,
        public modalsService: PreferencesModalsService // Made public to access state and methods directly in template
    ) {}

    ngOnInit() {
        this.loadSlabs();
    }

    /**
     * Loads slabs from the data service and applies current filters.
     * This method should be called whenever underlying data changes (add, update, delete).
     */
    loadSlabs(): void {
        this.filteredSlabs = this.filteringService.applyFilters(this.dataService.getSlabs(), this.searchTerm, this.filterCustomerType);
    }

    /**
     * Handles form submission for both adding and updating slabs.
     * Delegates logic to data service and modal service.
     */
    handleSubmit(): void {
        // Basic validation
        if (!this.modalsService.formData.customerType || this.modalsService.formData.minAmount === '' || this.modalsService.formData.maxAmount === '' || this.modalsService.formData.amountValue === '') {
            this.modalsService.showAlertDialog('Validation Error', 'Please fill in all required fields (Customer Type, Min/Max Amount, Amount Value).');
            return;
        }

        if (this.modalsService.editingSlabId) {
            // Update existing slab
            this.dataService.updateSlab(this.modalsService.editingSlabId, this.modalsService.formData);
            this.modalsService.showMessage('Slab updated successfully!');
        } else {
            // Add new slab
            this.dataService.addSlab(this.modalsService.formData);
            this.modalsService.showMessage('Slab added successfully!');
        }
        this.modalsService.closeAddForm(); // Close the form modal
        this.loadSlabs(); // Reload and re-filter the displayed slabs
    }

    /**
     * Confirms and then initiates deletion of a slab.
     * Uses the custom confirmation modal.
     * @param id The ID of the slab to delete.
     */
    confirmDelete(id: number): void {
        this.modalsService.showConfirmDialog(
            'Confirm Deletion',
            'Are you sure you want to delete this slab? This action cannot be undone.',
            () => this.deleteSlab(id) // Callback if confirmed
        );
    }

    /**
     * Deletes a slab by its ID.
     * This method is called by the confirmation dialog's callback.
     * @param id The ID of the slab to delete.
     */
    private deleteSlab(id: number): void {
        this.dataService.deleteSlab(id);
        this.loadSlabs(); // Reload and re-filter the displayed slabs
        this.modalsService.showMessage('Slab deleted successfully!');
    }

    /**
     * Initiates the edit process for a slab, opening the form modal with pre-filled data.
     * @param id The ID of the slab to edit.
     */
    editSlab(id: number): void {
        this.modalsService.openEditForm(id);
    }

    /**
     * Applies search and filter criteria to the displayed slabs.
     * This method is called when search term or filter selection changes.
     */
    applyFilters(): void {
        this.filteredSlabs = this.filteringService.applyFilters(this.dataService.getSlabs(), this.searchTerm, this.filterCustomerType);
    }
}
