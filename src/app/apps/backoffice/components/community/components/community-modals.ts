import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import interfaces from the new interface.ts file
import { CommunityInterface, Customer } from './interface'; // Corrected path

@Component({
    selector: 'app-community-modals',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <!-- Customer Information Modal -->
        <div *ngIf="showInfoModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
                <div class="p-4 sm:p-6 border-b border-gray-200">
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-900">Customer Information for {{ selectedCommunity?.name }}</h3>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full min-w-[480px]">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl No</th>
                                <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                                <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Email</th>
                                <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Count</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr *ngFor="let customer of customersForSelectedCommunity; let i = index" class="hover:bg-gray-50">
                                <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ i + 1 }}</td>
                                <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ customer.name }}</td>
                                <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ customer.email }}</td>
                                <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ customer.orderCount }}</td>
                            </tr>
                            <tr *ngIf="customersForSelectedCommunity.length === 0">
                                <td colspan="4" class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No customers found for this community.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="p-4 sm:p-6 border-t border-gray-200 text-right">
                    <button (click)="closeAllModalsEvent.emit()" class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 sm:px-6 py-2 rounded-lg font-medium text-sm transition-colors duration-150">Cancel</button>
                </div>
            </div>
        </div>

        <!-- Send Reminder Modal -->
        <div *ngIf="showReminderModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
                <div class="p-4 sm:p-6 border-b border-gray-200">
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-900">Send Reminder</h3>
                </div>

                <div class="p-4 sm:p-6 space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Cutoff Date</label>
                        <input type="date" [(ngModel)]="reminderForm.cutoffDate" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Date</label>
                        <input type="date" [(ngModel)]="reminderForm.deliveryDate" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
                        <textarea [ngModel]="reminderMessage" rows="8" readonly class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50"></textarea>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-3 pt-4">
                        <button (click)="closeAllModalsEvent.emit()" class="w-full sm:flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-150">Cancel</button>
                        <button (click)="sendReminderEvent.emit()" class="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-150">Send Reminder</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- New Delivery Time SMS Modal -->
        <div *ngIf="showSMSModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4">
                <div class="p-4 sm:p-6 border-b border-gray-200">
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-900">New Delivery Time</h3>
                </div>

                <div class="p-4 sm:p-6 space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">New Delivery Time</label>
                        <input type="text" [(ngModel)]="smsForm.newDeliveryTime" placeholder="e.g., 6PM - 8PM" class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
                        <textarea [ngModel]="smsMessage" rows="8" readonly class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50"></textarea>
                    </div>

                    <div class="flex flex-col sm:flex-row gap-3 pt-4">
                        <button (click)="closeAllModalsEvent.emit()" class="w-full sm:flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-150">Cancel</button>
                        <button (click)="sendSMSEvent.emit()" class="w-full sm:flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-150">Send SMS</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Message Box Modal (for notifications) -->
        <div *ngIf="showMessageModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto mx-4">
                <div class="p-4 sm:p-6 border-b border-gray-200">
                    <h3 class="text-lg sm:text-xl font-semibold text-gray-900">Notification</h3>
                </div>
                <div class="p-4 sm:p-6">
                    <p class="text-gray-700 text-center text-sm sm:text-base">{{ messageBoxContent }}</p>
                </div>
                <div class="p-4 sm:p-6 border-t border-gray-200 text-right">
                    <button (click)="closeMessageBoxEvent.emit()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg font-medium text-sm transition-colors duration-150">OK</button>
                </div>
            </div>
        </div>
    `
})
export class CommunityModalsComponent {
    @Input() showInfoModal: boolean = false;
    @Input() showReminderModal: boolean = false;
    @Input() showSMSModal: boolean = false;
    @Input() showMessageModal: boolean = false;
    @Input() messageBoxContent: string = '';
    @Input() selectedCommunity: CommunityInterface | null = null;
    @Input() customersForSelectedCommunity: Customer[] = [];
    @Input() reminderForm: { cutoffDate: string; deliveryDate: string } = { cutoffDate: '', deliveryDate: '' };
    @Input() smsForm: { newDeliveryTime: string } = { newDeliveryTime: '' };

    @Output() closeAllModalsEvent = new EventEmitter<void>();
    @Output() closeMessageBoxEvent = new EventEmitter<void>();
    @Output() sendReminderEvent = new EventEmitter<void>();
    @Output() sendSMSEvent = new EventEmitter<void>();

    // These getters provide the message content based on inputs
    get reminderMessage(): string {
        return `Dear Honore User,

Gentle reminder to place your order for the next designated delivery. Thank you.

Order by date: ${this.reminderForm.cutoffDate || '6/13/2025'}
Order by time: 12pm
Delivery date: ${this.reminderForm.deliveryDate || '6/13/2025'}
Delivery time: ${this.selectedCommunity?.deliveryTime || '4pm to 7pm'}
Delivery to: ${this.selectedCommunity?.address || 'Your Location'}`;
    }

    get smsMessage(): string {
        return `Dear Customer,

We regret to inform you that there is a delay in serving you. Sincerely apologise and the new details are as below.

Order no: xxx
Delivery Date: 6/13/2025
New Delivery time: ${this.smsForm.newDeliveryTime || 'TBD'}
Delivery to: ${this.selectedCommunity?.address || 'Your Location'}

Thanks,
Honore.`;
    }
}
