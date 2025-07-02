import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-back-office',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterOutlet],
    template: `
        <div *ngIf="isLoggedIn" class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <header class="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
                <div class="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-center justify-between h-16 sm:h-20">
                        <div class="flex items-center space-x-2 sm:space-x-4">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-r from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <span class="text-white font-bold text-base sm:text-xl">H</span>
                                </div>
                            </div>
                            <div>
                                <h1 class="text-xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">HONOR<span class="text-amber-500">E</span></h1>
                                <p class="text-xs sm:text-base text-gray-600 font-medium">Traditional | Baking</p>
                            </div>
                        </div>

                        <div class="relative" (click)="toggleDropdown()" #dropdownContainer>
                            <button
                                class="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <div class="w-8 h-8 sm:w-10 sm:h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                                    </svg>
                                </div>
                                <span class="hidden sm:block font-medium">{{ currentUserName }}</span>
                                <svg class="w-4 h-4 transition-transform duration-200" [class.rotate-180]="dropdownOpen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                            </button>

                            <div *ngIf="dropdownOpen" class="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
                                <div class="py-2">
                                    <div class="px-4 py-3 border-b border-gray-200">
                                        <p class="text-sm font-medium text-gray-900">{{ currentUserName }}</p>
                                        <p class="text-xs text-gray-500">{{ currentUserRole }}</p>
                                    </div>

                                    <a href="#" class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                                        <svg class="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01"></path>
                                        </svg>
                                        Support
                                    </a>
                                    <div class="border-t border-gray-200 my-1"></div>
                                    <a href="#" (click)="onLogout()" class="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150">
                                        <svg class="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                        </svg>
                                        Logout
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div *ngIf="showDashboard" class="mb-6 sm:mb-8">
                    <div class="flex items-center justify-between">
                        <div>
                            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Dashboard</h2>
                            <p class="text-gray-600">Manage your bakery operations from here</p>
                        </div>
                        <div class="hidden sm:flex items-center space-x-2 bg-white rounded-xl px-4 py-2 shadow-lg border border-gray-200">
                            <div class="w-3 h-3 bg-green-400 rounded-full"></div>
                            <span class="text-sm font-medium text-gray-700">{{ currentUserName }}</span>
                            <span class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{{ currentUserRole }}</span>
                        </div>
                    </div>
                </div>

                <div *ngIf="showDashboard" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
                    <div
                        *ngFor="let item of getFilteredMenuItems()"
                        [routerLink]="[item.routerLink]"
                        class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer border border-gray-100 p-4 sm:p-6 flex flex-col items-center justify-center aspect-square"
                    >
                        <div
                            class="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mb-2 sm:mb-3 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center group-hover:from-amber-200 group-hover:to-amber-300 transition-all duration-300"
                        >
                            <img
                                [src]="item.imgSrc"
                                [alt]="item.name + ' icon'"
                                class="w-10 h-10 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-cover group-hover:scale-110 transition-transform duration-300"
                                onerror="this.onerror=null;this.src='https://via.placeholder.com/80x80/F59E0B/FFFFFF?text=' + encodeURIComponent(this.alt.charAt(0));"
                            />
                        </div>
                        <h3 class="text-xs sm:text-sm lg:text-base font-semibold text-gray-800 text-center leading-tight group-hover:text-amber-600 transition-colors duration-300">
                            {{ item.name }}
                        </h3>
                    </div>
                </div>

                <router-outlet (activate)="onRouteActivate($event)" (deactivate)="onRouteDeactivate()"></router-outlet>
            </main>
        </div>
    `,
    styles: [
        `
            :host {
                font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            .rotate-180 {
                transform: rotate(180deg);
            }
        `
    ]
})
export class BackOffice {
    isLoggedIn = true;
    currentUserRole = 'Developer';
    currentUserName = 'Developer';

    dropdownOpen = false;
    showDashboard = true;

    @ViewChild('dropdownContainer') dropdownContainer!: ElementRef;

    menuItems = [
        { name: 'Customers', imgSrc: 'https://www.clipartmax.com/png/middle/185-1850008_customer-clipart-group-customers-icon-png.png', routerLink: 'customers', roles: ['Developer', 'Supporter'] },
        { name: 'Orders', imgSrc: 'https://cdn-icons-png.flaticon.com/512/3081/3081559.png', routerLink: 'orders', roles: ['Developer', 'Supporter'] },
        {
            name: 'Inventory',
            imgSrc: 'https://w1.pngwing.com/pngs/213/89/png-transparent-warehouse-inventory-inventory-management-software-inventory-control-warehouse-management-system-taking-logo-logistics-thumbnail.png',
            routerLink: 'inventory',
            roles: ['Developer']
        },
        { name: 'Products', imgSrc: 'https://cdn-icons-png.flaticon.com/512/2331/2331966.png', routerLink: 'products', roles: ['Developer'] },
        { name: 'Coupons', imgSrc: 'https://cdn-icons-png.flaticon.com/512/401/401140.png', routerLink: 'coupons', roles: ['Developer'] },
        { name: 'Community', imgSrc: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVZOZ_6N12lMzs5VdvU7z1Tu51GT7_MrWqAA&s', routerLink: 'community', roles: ['Developer', 'Supporter'] },
        { name: 'Calendar', imgSrc: 'https://w7.pngwing.com/pngs/342/269/png-transparent-calendar-december-graphy-dates-text-logo-time-thumbnail.png', routerLink: 'calendar', roles: ['Developer', 'Supporter'] },
        { name: 'Communication', imgSrc: 'https://img.freepik.com/free-vector/group-people-teamwork-with-speech-bubble_24877-56205.jpg?semt=ais_hybrid&w=740', routerLink: 'communication', roles: ['Developer'] },
        { name: 'Reports', imgSrc: 'https://cdn-icons-png.flaticon.com/512/1055/1055644.png', routerLink: 'reports', roles: ['Developer', 'Supporter'] },
        { name: 'App Settings', imgSrc: 'https://cdn-icons-png.flaticon.com/512/9662/9662287.png', routerLink: 'appsettings', roles: ['Developer'] }
        // { name: 'test', imgSrc: 'https://cdn.bap-software.net/2024/02/22165839/testdebug2.jpg', routerLink: 'test', roles: ['Developer'] }
    ];

    getFilteredMenuItems() {
        return this.menuItems.filter((item) => item.roles.includes(this.currentUserRole));
    }

    toggleDropdown() {
        this.dropdownOpen = !this.dropdownOpen;
    }

    onLogout() {
        this.isLoggedIn = false;
        this.currentUserRole = '';
        this.currentUserName = '';
        this.dropdownOpen = false;
        this.showDashboard = true;
    }

    @HostListener('document:click', ['$event'])
    onClick(event: MouseEvent) {
        if (this.dropdownOpen && this.dropdownContainer && !this.dropdownContainer.nativeElement.contains(event.target)) {
            this.dropdownOpen = false;
        }
    }

    onRouteActivate(component: any) {
        this.showDashboard = false;
        this.dropdownOpen = false;
    }

    onRouteDeactivate() {
        this.showDashboard = true;
    }
}
