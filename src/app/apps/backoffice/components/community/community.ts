import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// Import the new components
import { CommunityListComponent } from './components/community-list';
import { CommunityFormComponent } from './components/community-form';
import { CommunityModalsComponent } from './components/community-modals';

// Import interfaces from the new interface.ts file
import { CommunityInterface, Customer } from './components/interface';

@Component({
    selector: 'app-community',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        FormsModule,
        CommunityListComponent, // Add new components to imports
        CommunityFormComponent,
        CommunityModalsComponent
    ],
    template: `
        <!-- Main container with responsive padding and min-height -->
        <div class="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6 font-sans">
            <div class="max-w-7xl mx-auto">
                <!-- Back button section -->
                <div class="mb-4 sm:mb-6">
                    <button
                        routerLink="../"
                        class="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 sm:px-4 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-1 sm:space-x-2"
                    >
                        <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        <span>Back to Home</span>
                    </button>
                </div>

                <!-- Page Header and Create Community Button -->
                <div class="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">Community Management</h1>
                            <p class="text-sm sm:text-base text-gray-600">Manage your delivery communities and customer relationships</p>
                        </div>
                        <button
                            (click)="showCreateForm = true"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                        >
                            <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                            </svg>
                            <span>Create Community</span>
                        </button>
                    </div>
                </div>

                <!-- Statistics Cards Grid -->
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
                    <!-- Total Communities Card -->
                    <div class="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-6 hover:shadow-xl transition-shadow duration-200">
                        <div class="flex items-center">
                            <div class="p-2 sm:p-3 bg-blue-100 rounded-full">
                                <svg class="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    ></path>
                                </svg>
                            </div>
                            <div class="ml-2 sm:ml-4 min-w-0 flex-1">
                                <h3 class="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Communities</h3>
                                <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ communities.length }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-6 hover:shadow-xl transition-shadow duration-200">
                        <div class="flex items-center">
                            <div class="p-2 sm:p-3 bg-green-100 rounded-full">
                                <svg class="w-4 h-4 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                                </svg>
                            </div>
                            <div class="ml-2 sm:ml-4 min-w-0 flex-1">
                                <h3 class="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Orders</h3>
                                <p class="text-lg sm:text-2xl font-bold text-gray-900">1,247</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-6 hover:shadow-xl transition-shadow duration-200">
                        <div class="flex items-center">
                            <div class="p-2 sm:p-3 bg-yellow-100 rounded-full">
                                <svg class="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                    ></path>
                                </svg>
                            </div>
                            <div class="ml-2 sm:ml-4 min-w-0 flex-1">
                                <h3 class="text-xs sm:text-sm font-medium text-gray-500 truncate">Average Rating</h3>
                                <p class="text-lg sm:text-2xl font-bold text-gray-900">4.8★</p>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-6 hover:shadow-xl transition-shadow duration-200">
                        <div class="flex items-center">
                            <div class="p-2 sm:p-3 bg-purple-100 rounded-full">
                                <svg class="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                                </svg>
                            </div>
                            <div class="ml-2 sm:ml-4 min-w-0 flex-1">
                                <h3 class="text-xs sm:text-sm font-medium text-gray-500 truncate">Active Customers</h3>
                                <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ customers.length }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Community List Section - Now a separate component -->
                <app-community-list
                    [communities]="filteredCommunities"
                    [searchTerm]="searchTerm"
                    [filterDay]="filterDay"
                    [filterTime]="filterTime"
                    (editCommunityEvent)="editCommunity($event)"
                    (openInfoModalEvent)="openInfoModal($event)"
                    (openReminderModalEvent)="openReminderModal($event)"
                    (openSMSModalEvent)="openSMSModal($event)"
                    (searchTermChange)="searchTerm = $event; applyFilters()"
                    (filterDayChange)="filterDay = $event; applyFilters()"
                    (filterTimeChange)="filterTime = $event; applyFilters()"
                    (resetFiltersEvent)="resetFilters()"
                ></app-community-list>

                <!-- Create/Edit Community Modal - Now a separate component -->
                <app-community-form
                    [showCreateForm]="showCreateForm"
                    [showEditForm]="showEditForm"
                    [communityForm]="communityForm"
                    [selectedCommunity]="selectedCommunity"
                    (saveCommunityEvent)="saveCommunity($event)"
                    (closeCommunityFormModalsEvent)="closeCommunityFormModals()"
                ></app-community-form>

                <!-- Other Modals (Customer Info, Reminder, SMS, Message Box) - Now a separate component -->
                <app-community-modals
                    [showInfoModal]="showInfoModal"
                    [showReminderModal]="showReminderModal"
                    [showSMSModal]="showSMSModal"
                    [showMessageModal]="showMessageModal"
                    [messageBoxContent]="messageBoxContent"
                    [selectedCommunity]="selectedCommunity"
                    [customersForSelectedCommunity]="customersForSelectedCommunity"
                    [reminderForm]="reminderForm"
                    [smsForm]="smsForm"
                    (closeAllModalsEvent)="closeAllModals()"
                    (closeMessageBoxEvent)="closeMessageBox()"
                    (sendReminderEvent)="sendReminder()"
                    (sendSMSEvent)="sendSMS()"
                ></app-community-modals>
            </div>
        </div>
    `
})
export class Community {
    communities: CommunityInterface[] = [];
    customers: Customer[] = [];
    customersForSelectedCommunity: Customer[] = [];

    showCreateForm = false;
    showEditForm = false;
    showInfoModal = false;
    showReminderModal = false;
    showSMSModal = false;
    showMessageModal = false;
    messageBoxContent = '';

    selectedCommunity: CommunityInterface | null = null;

    communityForm = {
        name: '',
        deliveryDay: '',
        deliveryTime: '',
        maxOrderPerDay: 50,
        postalCode: '',
        address: '',
        customerIds: [] as number[]
    };
    reminderForm = {
        cutoffDate: '',
        deliveryDate: ''
    };
    smsForm = {
        newDeliveryTime: ''
    };

    searchTerm: string = '';
    filterDay: string = '';
    filterTime: string = '';

    private firstNames = [
        'Aarav',
        'Advik',
        'Vivaan',
        'Ananya',
        'Diya',
        'Ishaan',
        'Kiara',
        'Rohan',
        'Sara',
        'Ved',
        'Myra',
        'Aryan',
        'Navya',
        'Reyansh',
        'Siya',
        'Dhruv',
        'Pari',
        'Kabir',
        'Tara',
        'Samar',
        'Aditi',
        'Dev',
        'Esha',
        'Gaurav',
        'Jhanvi',
        'Karan',
        'Lakshmi',
        'Nikhil',
        'Priya',
        'Rahul',
        'Sakshi',
        'Udit',
        'Vani',
        'Yash',
        'Zoya',
        'Arjun',
        'Shruti',
        'Krishna',
        'Mansi',
        'Raj',
        'Shreya',
        'Virat',
        'Anushka',
        'Riddhima',
        'Kian',
        'Zara',
        'Riya',
        'Mohit',
        'Nisha'
    ];
    private lastNames = [
        'Kumar',
        'Singh',
        'Sharma',
        'Reddy',
        'Gupta',
        'Patel',
        'Das',
        'Khan',
        'Choudhary',
        'Yadav',
        'Malik',
        'Rao',
        'Mehta',
        'Jain',
        'Verma',
        'Saha',
        'Dubey',
        'Naidu',
        'Thakur',
        'Goyal',
        'Mishra',
        'Agarwal',
        'Pillai',
        'Raina',
        'Chopra',
        'Kapoor',
        'Mehra',
        'Soni',
        'Bhatia',
        'Kohli',
        'Dhawan',
        'Sharma',
        'Pandey',
        'Tiwari',
        'Shukla',
        'Joshi',
        'Chauhan',
        'Dixit',
        'Roy',
        'Sen',
        'Mitra',
        'Ghosh',
        'Bose',
        'Mukherjee',
        'Datta',
        'Pal',
        'Chakraborty',
        'Sarkar',
        'Basu',
        'Ganguly'
    ];

    constructor() {
        this.generateCustomers(230);
        this.initializeCommunities();
        console.log('Community Management System loaded!');
    }

    private generateCustomers(count: number): void {
        for (let i = 1; i <= count; i++) {
            const firstName = this.firstNames[Math.floor(Math.random() * this.firstNames.length)];
            const lastName = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
            const fullName = `${firstName} ${lastName}`;

            this.customers.push({
                id: i,
                name: fullName,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
                orderCount: Math.floor(Math.random() * 30) + 1
            });
        }
    }

    private initializeCommunities(): void {
        const baseCommunities = [
            { id: 1, name: 'Adarsh Palm Meadows', deliveryDay: 'Friday', deliveryTime: '4PM - 6PM', maxOrderPerDay: 50, postalCode: '560001', address: 'Whitefield, Bangalore' },
            { id: 5, name: 'Adarsh Vista', deliveryDay: 'Friday', deliveryTime: '4PM - 6PM', maxOrderPerDay: 50, postalCode: '560048', address: 'Varthur, Bangalore' },
            { id: 6, name: 'Brigade Gateway Resident Lane', deliveryDay: 'Thursday', deliveryTime: '4PM - 6PM', maxOrderPerDay: 50, postalCode: '560066', address: 'Malleshwaram, Bangalore' },
            { id: 7, name: 'DivyaSree 77 East', deliveryDay: 'Friday', deliveryTime: '4PM - 6PM', maxOrderPerDay: 50, postalCode: '560048', address: 'Varthur, Bangalore' },
            { id: 8, name: 'DivyaSree 77 Place', deliveryDay: 'Thursday', deliveryTime: '4PM - 6PM', maxOrderPerDay: 50, postalCode: '560066', address: 'Malleshwaram, Bangalore' },
            { id: 9, name: 'Embassy Pristine', deliveryDay: 'Friday', deliveryTime: '4PM - 6PM', maxOrderPerDay: 50, postalCode: '560048', address: 'Varthur, Bangalore' },
            { id: 10, name: 'Epsilon Residential Villas', deliveryDay: 'Thursday', deliveryTime: '4PM - 6PM', maxOrderPerDay: 50, postalCode: '560066', address: 'Malleshwaram, Bangalore' },
            { id: 11, name: 'Mantri Espana', deliveryDay: 'Friday', deliveryTime: '4PM - 6PM', maxOrderPerDay: 50, postalCode: '560048', address: 'Varthur, Bangalore' },
            { id: 12, name: 'Phoenix One Bangalore West', deliveryDay: 'Thursday', deliveryTime: '4PM - 6PM', maxOrderPerDay: 50, postalCode: '560066', address: 'Malleshwaram, Bangalore' },
            { id: 13, name: 'Prestige Acropolis', deliveryDay: 'Friday', deliveryTime: '4PM - 6PM', maxOrderPerDay: 50, postalCode: '560048', address: 'Varthur, Bangalore' },
            { id: 14, name: 'Prestige Lakeside Habitat', deliveryDay: 'Thursday', deliveryTime: '4PM - 6PM', maxOrderPerDay: 50, postalCode: '560066', address: 'Malleshwaram, Bangalore' },
            { id: 15, name: 'Prestige Ozone', deliveryDay: 'Friday', deliveryTime: '4PM - 6PM', maxOrderPerDay: 50, postalCode: '560048', address: 'Varthur, Bangalore' },
            { id: 16, name: 'Prestige Shantiniketan', deliveryDay: 'Thursday', deliveryTime: '4PM - 6PM', maxOrderPerDay: 50, postalCode: '560066', address: 'Malleshwaram, Bangalore' },
            { id: 17, name: 'Prestige St. Johns Wood', deliveryDay: 'Friday', deliveryTime: '4PM - 6PM', maxOrderPerDay: 50, postalCode: '560048', address: 'Varthur, Bangalore' },
            { id: 18, name: 'Prestige White Meadows', deliveryDay: 'Thursday', deliveryTime: '4PM - 6PM', maxOrderPerDay: 50, postalCode: '560066', address: 'Malleshwaram, Bangalore' },
            { id: 19, name: 'Pursuit of a Radical Rhapsody', deliveryDay: 'Friday', deliveryTime: '4PM - 6PM', maxOrderPerDay: 50, postalCode: '560048', address: 'Varthur, Bangalore' },
            { id: 20, name: 'SNN Clermont', deliveryDay: 'Thursday', deliveryTime: '4PM - 6PM', maxOrderPerDay: 50, postalCode: '560066', address: 'Malleshwaram, Bangalore' },
            { id: 21, name: 'The Embassy', deliveryDay: 'Friday', deliveryTime: '4PM - 6PM', maxOrderPerDay: 50, postalCode: '560048', address: 'Varthur, Bangalore' },
            { id: 22, name: 'Windmills Of Your Mind', deliveryDay: 'Thursday', deliveryTime: '4PM - 6PM', maxOrderPerDay: 50, postalCode: '560066', address: 'Malleshwaram, Bangalore' },
            { id: 23, name: 'Zen Garden', deliveryDay: 'Friday', deliveryTime: '4PM - 6PM', maxOrderPerDay: 50, postalCode: '560048', address: 'Varthur, Bangalore' }
        ];

        let customerIdTracker = 0;
        this.communities = baseCommunities.map((community, index) => {
            const customerIds: number[] = [];
            let numCustomersToAssign = 10;

            if (index === 0) {
                numCustomersToAssign = 7;
            }

            for (let i = 0; i < numCustomersToAssign; i++) {
                if (customerIdTracker + i + 1 <= this.customers.length) {
                    customerIds.push(customerIdTracker + i + 1);
                }
            }
            customerIdTracker += numCustomersToAssign;
            return { ...community, customerIds: customerIds };
        });
    }

    get filteredCommunities(): CommunityInterface[] {
        return this.communities.filter((community) => {
            const matchesSearchTerm = this.searchTerm === '' || community.name.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesDay = this.filterDay === '' || community.deliveryDay === this.filterDay;
            const matchesTime = this.filterTime === '' || community.deliveryTime === this.filterTime;
            return matchesSearchTerm && matchesDay && matchesTime;
        });
    }

    applyFilters(): void {
        console.log('Applying filters:', this.searchTerm, this.filterDay, this.filterTime);
        // The filteredCommunities getter will automatically update the list component
    }

    resetFilters(): void {
        this.searchTerm = '';
        this.filterDay = '';
        this.filterTime = '';
        this.applyFilters();
    }

    // Handlers for events emitted from child components
    saveCommunity(communityData: { form: any; isCreate: boolean }): void {
        let message = '';
        if (communityData.isCreate) {
            const newCommunity: CommunityInterface = {
                id: this.communities.length + 1,
                ...communityData.form,
                customerIds: [] // New communities start with no associated customers
            };
            this.communities.push(newCommunity);
            message = 'New community created successfully!';
        } else if (this.selectedCommunity) {
            const index = this.communities.findIndex((c) => c.id === this.selectedCommunity!.id);
            if (index !== -1) {
                // Preserve existing customerIds for edited community
                this.communities[index] = { ...this.selectedCommunity, ...communityData.form, customerIds: this.selectedCommunity.customerIds };
            }
            message = 'Community updated successfully!';
        }

        this.showCreateForm = false;
        this.showEditForm = false;
        this.resetForms();
        this.showMessage(message);
    }

    editCommunity(community: CommunityInterface): void {
        this.selectedCommunity = community;
        this.communityForm = { ...community }; // Populate the form with selected community data
        this.showEditForm = true;
    }

    openInfoModal(community: CommunityInterface): void {
        this.selectedCommunity = community;
        this.customersForSelectedCommunity = this.customers.filter((customer) => community.customerIds.includes(customer.id));
        this.showInfoModal = true;
    }

    openReminderModal(community: CommunityInterface): void {
        this.selectedCommunity = community;
        this.reminderForm = {
            cutoffDate: '',
            deliveryDate: ''
        };
        this.showReminderModal = true;
    }

    openSMSModal(community: CommunityInterface): void {
        this.selectedCommunity = community;
        this.smsForm = {
            newDeliveryTime: ''
        };
        this.showSMSModal = true;
    }

    sendReminder(): void {
        const message = `Dear Honore User,

Gentle reminder to place your order for the next designated delivery. Thank you.

Order by date: ${this.reminderForm.cutoffDate || '6/13/2025'}
Order by time: 12pm
Delivery date: ${this.reminderForm.deliveryDate || '6/13/2025'}
Delivery time: ${this.selectedCommunity?.deliveryTime || '4pm to 7pm'}
Delivery to: ${this.selectedCommunity?.address || 'Your Location'}`;

        console.log('Sending reminder...', message);
        this.showMessage('Reminder sent successfully!');
        this.closeAllModals();
    }

    sendSMS(): void {
        const message = `Dear Customer,

We regret to inform you that there is a delay in serving you. Sincerely apologise and the new details are as below.

Order no: xxx
Delivery Date: 6/13/2025
New Delivery time: ${this.smsForm.newDeliveryTime || 'TBD'}
Delivery to: ${this.selectedCommunity?.address || 'Your Location'}

Thanks,
Honore.`;

        console.log('Sending SMS...', message);
        this.showMessage('SMS sent successfully!');
        this.closeAllModals();
    }

    showMessage(message: string): void {
        this.messageBoxContent = message;
        this.showMessageModal = true;
    }

    closeMessageBox(): void {
        this.showMessageModal = false;
        this.messageBoxContent = '';
    }

    closeAllModals(): void {
        this.showCreateForm = false;
        this.showEditForm = false;
        this.showInfoModal = false;
        this.showReminderModal = false;
        this.showSMSModal = false;
        this.selectedCommunity = null;
        this.customersForSelectedCommunity = [];
        this.resetForms();
    }

    closeCommunityFormModals(): void {
        this.showCreateForm = false;
        this.showEditForm = false;
        this.resetForms();
    }

    private resetForms(): void {
        this.communityForm = {
            name: '',
            deliveryDay: '',
            deliveryTime: '',
            maxOrderPerDay: 50,
            postalCode: '',
            address: '',
            customerIds: []
        };
        this.reminderForm = {
            cutoffDate: '',
            deliveryDate: ''
        };
        this.smsForm = {
            newDeliveryTime: ''
        };
    }
}
