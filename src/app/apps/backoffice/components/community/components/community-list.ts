import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import interfaces from the new interface.ts file
import { CommunityInterface } from './interface'; // Corrected path

@Component({
    selector: 'app-community-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-4 sm:p-6 border-b border-gray-200">
                <h2 class="text-lg sm:text-xl font-semibold text-gray-900">Community List</h2>
            </div>
            <!-- Filter and Search Inputs -->
            <div class="p-4 sm:p-6 bg-white border-b border-gray-200 space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:gap-4 sm:items-end sm:justify-end">
                <input
                    type="text"
                    [ngModel]="searchTerm"
                    (ngModelChange)="onSearchTermChange($event)"
                    placeholder="Search community name..."
                    class="w-full sm:flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                />

                <select
                    [ngModel]="filterDay"
                    (ngModelChange)="onFilterDayChange($event)"
                    class="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                >
                    <option value="">Filter by Day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                </select>

                <select
                    [ngModel]="filterTime"
                    (ngModelChange)="onFilterTimeChange($event)"
                    class="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150"
                >
                    <option value="">Filter by Time</option>
                    <option value="4PM - 6PM">4PM - 6PM</option>
                    <option value="6PM - 8PM">6PM - 8PM</option>
                    <option value="Other">Other</option>
                </select>

                <button (click)="resetFiltersEvent.emit()" class="w-full sm:w-auto bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-150">Reset Filters</button>
            </div>

            <!-- Communities Table (responsive with overflow-x-auto) -->
            <div class="overflow-x-auto">
                <table class="w-full min-w-[640px]">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl #</th>
                            <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Community Name</th>
                            <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Day</th>
                            <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Time</th>
                            <th class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Orders/Day</th>
                            <th class="px-3 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr *ngFor="let community of communities; let i = index" class="hover:bg-gray-50 transition-colors duration-150">
                            <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ i + 1 }}</td>
                            <td class="px-3 sm:px-6 py-4 whitespace-nowrap">
                                <div class="text-sm font-medium text-gray-900">{{ community.name }}</div>
                                <div class="text-xs sm:text-sm text-gray-500">{{ community.postalCode }}</div>
                            </td>
                            <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ community.deliveryDay }}</td>
                            <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ community.deliveryTime }}</td>
                            <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ community.maxOrderPerDay }}</td>
                            <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div class="flex flex-wrap gap-1 sm:gap-2">
                                    <!-- Action Buttons (using Lucide icons for consistency and responsiveness) -->
                                    <button
                                        (click)="openReminderModalEvent.emit(community)"
                                        class="bg-blue-100 hover:bg-blue-200 text-blue-800 p-1.5 sm:p-2 rounded-md text-xs font-medium transition-colors duration-150 flex items-center justify-center"
                                        title="Send Reminder"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="lucide lucide-bell sm:w-4 sm:h-4"
                                        >
                                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                                        </svg>
                                    </button>
                                    <button
                                        (click)="openSMSModalEvent.emit(community)"
                                        class="bg-orange-100 hover:bg-orange-200 text-orange-800 p-1.5 sm:p-2 rounded-md text-xs font-medium transition-colors duration-150 flex items-center justify-center"
                                        title="Send SMS"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="lucide lucide-message-square sm:w-4 sm:h-4"
                                        >
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                        </svg>
                                    </button>
                                    <button
                                        (click)="openInfoModalEvent.emit(community)"
                                        class="bg-green-100 hover:bg-green-200 text-green-800 p-1.5 sm:p-2 rounded-md text-xs font-medium transition-colors duration-150 flex items-center justify-center"
                                        title="View Info"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="lucide lucide-info sm:w-4 sm:h-4"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <path d="M12 16v-4" />
                                            <path d="M12 8h.01" />
                                        </svg>
                                    </button>
                                    <button
                                        (click)="editCommunityEvent.emit(community)"
                                        class="bg-purple-100 hover:bg-purple-200 text-purple-800 p-1.5 sm:p-2 rounded-md text-xs font-medium transition-colors duration-150 flex items-center justify-center"
                                        title="Edit Community"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="14"
                                            height="14"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="2"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="lucide lucide-edit sm:w-4 sm:h-4"
                                        >
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                        <tr *ngIf="communities.length === 0">
                            <td colspan="6" class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No communities found matching your criteria.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `
})
export class CommunityListComponent {
    @Input() communities: CommunityInterface[] = [];
    @Input() searchTerm: string = '';
    @Input() filterDay: string = '';
    @Input() filterTime: string = '';

    @Output() editCommunityEvent = new EventEmitter<CommunityInterface>();
    @Output() openInfoModalEvent = new EventEmitter<CommunityInterface>();
    @Output() openReminderModalEvent = new EventEmitter<CommunityInterface>();
    @Output() openSMSModalEvent = new EventEmitter<CommunityInterface>();
    @Output() searchTermChange = new EventEmitter<string>();
    @Output() filterDayChange = new EventEmitter<string>();
    @Output() filterTimeChange = new EventEmitter<string>();
    @Output() resetFiltersEvent = new EventEmitter<void>();

    onSearchTermChange(value: string): void {
        this.searchTermChange.emit(value);
    }

    onFilterDayChange(value: string): void {
        this.filterDayChange.emit(value);
    }

    onFilterTimeChange(value: string): void {
        this.filterTimeChange.emit(value);
    }
}
