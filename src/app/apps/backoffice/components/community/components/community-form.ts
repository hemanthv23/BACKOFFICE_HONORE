import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import interfaces from the new interface.ts file
import { CommunityInterface } from './interface'; // Corrected path

@Component({
    selector: 'app-community-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <!-- Create/Edit Community Modal (responsive fixed overlay) -->
        <div *ngIf="showCreateForm || showEditForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto mx-4">
                <div class="p-4 sm:p-6 border-b border-gray-200">
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-900">
                        {{ showCreateForm ? 'Create Community' : 'Edit Community' }}
                    </h3>
                </div>

                <form (ngSubmit)="onSaveCommunity()" class="p-4 sm:p-6 space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Community Name</label>
                        <input
                            type="text"
                            [(ngModel)]="currentCommunityForm.name"
                            name="name"
                            required
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Day</label>
                        <select
                            [(ngModel)]="currentCommunityForm.deliveryDay"
                            name="deliveryDay"
                            required
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                        >
                            <option value="">Select Day</option>
                            <option value="Monday">Monday</option>
                            <option value="Tuesday">Tuesday</option>
                            <option value="Wednesday">Wednesday</option>
                            <option value="Thursday">Thursday</option>
                            <option value="Friday">Friday</option>
                            <option value="Saturday">Saturday</option>
                            <option value="Sunday">Sunday</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                        <input
                            type="text"
                            [(ngModel)]="currentCommunityForm.deliveryTime"
                            name="deliveryTime"
                            placeholder="e.g., 4PM - 6PM"
                            required
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Max Orders Per Day</label>
                        <input
                            type="number"
                            [(ngModel)]="currentCommunityForm.maxOrderPerDay"
                            name="maxOrderPerDay"
                            required
                            min="1"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                        <input
                            type="text"
                            [(ngModel)]="currentCommunityForm.postalCode"
                            name="postalCode"
                            required
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                            [(ngModel)]="currentCommunityForm.address"
                            name="address"
                            required
                            rows="3"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                        ></textarea>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-3 pt-4">
                        <button type="button" (click)="closeCommunityFormModalsEvent.emit()" class="w-full sm:flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-150">Cancel</button>
                        <button type="submit" class="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-150">
                            {{ showCreateForm ? 'Save' : 'Update' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    `
})
export class CommunityFormComponent implements OnChanges {
    @Input() showCreateForm: boolean = false;
    @Input() showEditForm: boolean = false;
    @Input() communityForm: any; // Using any for now, better to define a type if this form is complex
    @Input() selectedCommunity: CommunityInterface | null = null;

    @Output() saveCommunityEvent = new EventEmitter<{ form: any; isCreate: boolean }>();
    @Output() closeCommunityFormModalsEvent = new EventEmitter<void>();

    currentCommunityForm: any = {
        // Internal copy of the form data
        name: '',
        deliveryDay: '',
        deliveryTime: '',
        maxOrderPerDay: 50,
        postalCode: '',
        address: '',
        customerIds: [] as number[]
    };

    ngOnChanges(changes: SimpleChanges): void {
        // When selectedCommunity or showEditForm changes, update the internal form copy
        if (changes['selectedCommunity'] && this.selectedCommunity) {
            this.currentCommunityForm = { ...this.selectedCommunity };
        } else if (changes['showCreateForm'] && this.showCreateForm) {
            // Reset form for create
            this.currentCommunityForm = {
                name: '',
                deliveryDay: '',
                deliveryTime: '',
                maxOrderPerDay: 50,
                postalCode: '',
                address: '',
                customerIds: [] as number[]
            };
        } else if (changes['communityForm'] && this.communityForm) {
            // This is to handle the initial population from the parent or resets
            this.currentCommunityForm = { ...this.communityForm };
        }
    }

    onSaveCommunity(): void {
        // Emit the form data and whether it's a create operation
        this.saveCommunityEvent.emit({ form: this.currentCommunityForm, isCreate: this.showCreateForm });
    }
}
