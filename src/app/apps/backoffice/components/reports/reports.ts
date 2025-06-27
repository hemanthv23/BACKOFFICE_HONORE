// reports.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { interval, Subscription } from 'rxjs';

// Import Font Awesome modules and specific icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
    faChartBar, // General charts, Sales Report, main header icon
    faFileInvoiceDollar, // Purchase Orders, Invoice Report
    faTruck, // Packing Slip Report, Delivery Optimization
    faBuilding, // Building Name Report
    faMoneyBillWave, // Payment Status
    faHandshake, // Payment Collection
    faRupeeSign, // Monthly Revenue metric icon
    faChartLine, // Growth Rate metric icon
    faShoppingCart, // Active Orders metric icon
    faGrinStars, // Customer Satisfaction metric icon
    faFileExport, // Export Data quick action
    faCalendarCheck, // Schedule Report quick action
    faPlusCircle, // Create Custom quick action
    faCogs, // Settings quick action
    faArrowLeft // Back to Dashboard button
} from '@fortawesome/free-solid-svg-icons'; // Assuming you installed free-solid-svg-icons

// Interface for a Report Card displayed in the grid
interface ReportCard {
    id: string;
    title: string;
    description: string;
    route: string; // The route property is used for navigation
    icon: any; // Changed type to 'any' for Font Awesome IconDefinition
    color: string; // Tailwind text color class for the icon
    bgColor: string; // Tailwind background color class
    hoverColor: string; // Tailwind hover background color class
}

// Interface for a Metric Card displayed in the key metrics section
interface MetricCard {
    title: string;
    value: string;
    change: string;
    isPositive: boolean; // Indicates if the change is positive (for color/arrow)
    icon: any; // Changed type to 'any' for Font Awesome IconDefinition
    color: string; // Tailwind text color class for the value and icon
}

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [CommonModule, RouterLink, FontAwesomeModule], // **FontAwesomeModule added here**
    template: `
        <div class="min-h-screen bg-gray-50 py-6">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div class="flex items-center justify-between">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
                            <p class="text-gray-600">Monitor your business performance with real-time insights</p>
                            <div class="flex items-center mt-3">
                                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                                <span class="text-sm text-green-600 font-medium">Live Data</span>
                                <span class="text-sm text-gray-500 ml-2">• Last updated: {{ currentTime | date: 'short' }}</span>
                            </div>
                        </div>
                        <div class="hidden md:block">
                            <div class="p-4 rounded-lg bg-blue-50">
                                <fa-icon [icon]="faChartBar" class="w-12 h-12 text-blue-600"></fa-icon>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div *ngFor="let metric of metrics" class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <p class="text-sm font-medium text-gray-600 mb-1">{{ metric.title }}</p>
                                <p class="text-2xl font-bold" [ngClass]="metric.color">{{ metric.value }}</p>
                                <div class="flex items-center mt-2">
                                    <svg *ngIf="metric.isPositive" class="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"></path>
                                    </svg>
                                    <svg *ngIf="!metric.isPositive" class="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 13l-5 5m0 0l-5-5m5 5V6"></path>
                                    </svg>
                                    <span class="text-sm font-medium" [ngClass]="metric.isPositive ? 'text-green-600' : 'text-red-600'">
                                        {{ metric.change }}
                                    </span>
                                    <span class="text-sm text-gray-500 ml-1">vs last month</span>
                                </div>
                            </div>
                            <div class="ml-4">
                                <div class="p-3 rounded-lg" [ngClass]="metric.color.replace('text-', 'bg-').replace('-600', '-50')">
                                    <fa-icon [icon]="metric.icon" class="w-6 h-6" [ngClass]="metric.color"></fa-icon>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div class="flex items-center justify-between mb-6">
                        <h2 class="text-xl font-semibold text-gray-900">Available Reports</h2>
                        <div class="text-sm text-gray-500">{{ reportCards.length }} reports available</div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div
                            *ngFor="let report of reportCards"
                            (click)="navigateToReport(report.route)"
                            class="group cursor-pointer p-6 rounded-lg border-2 border-gray-100 hover:border-blue-200 transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
                            [ngClass]="report.bgColor"
                        >
                            <div class="flex items-start justify-between mb-4">
                                <div class="p-3 rounded-lg bg-white shadow-sm group-hover:shadow-md transition-shadow">
                                    <fa-icon [icon]="report.icon" class="w-6 h-6" [ngClass]="report.color"></fa-icon>
                                </div>
                                <svg class="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                </svg>
                            </div>

                            <h3 class="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-900 transition-colors">
                                {{ report.title }}
                            </h3>
                            <p class="text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                                {{ report.description }}
                            </p>

                            <div class="mt-4 flex items-center text-sm font-medium" [ngClass]="report.color">
                                <span>View Report</span>
                                <svg class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-8">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4 sm:mb-6">Quick Actions</h3>
                    <div class="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <button class="p-3 sm:p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center">
                            <fa-icon [icon]="faFileExport" class="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform"></fa-icon>
                            <span class="text-xs sm:text-sm font-medium text-blue-700 text-center leading-tight">Export Data</span>
                        </button>

                        <button class="p-3 sm:p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors group min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center">
                            <fa-icon [icon]="faCalendarCheck" class="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform"></fa-icon>
                            <span class="text-xs sm:text-sm font-medium text-green-700 text-center leading-tight">Schedule Report</span>
                        </button>

                        <button class="p-3 sm:p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors group min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center">
                            <fa-icon [icon]="faPlusCircle" class="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform"></fa-icon>
                            <span class="text-xs sm:text-sm font-medium text-purple-700 text-center leading-tight">Create Custom</span>
                        </button>

                        <button class="p-3 sm:p-4 text-center bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors group min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center">
                            <fa-icon [icon]="faCogs" class="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 mb-2 sm:mb-3 group-hover:scale-110 transition-transform"></fa-icon>
                            <span class="text-xs sm:text-sm font-medium text-orange-700 text-center leading-tight">Settings</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class Reports implements OnInit, OnDestroy {
    currentTime: Date = new Date();
    private subscription?: Subscription;

    // **Expose Font Awesome icons to the template**
    faChartBar = faChartBar;
    faFileInvoiceDollar = faFileInvoiceDollar;
    faTruck = faTruck;
    faBuilding = faBuilding;
    faMoneyBillWave = faMoneyBillWave;
    faHandshake = faHandshake;
    faRupeeSign = faRupeeSign;
    faChartLine = faChartLine;
    faShoppingCart = faShoppingCart;
    faGrinStars = faGrinStars;
    faFileExport = faFileExport;
    faCalendarCheck = faCalendarCheck;
    faPlusCircle = faPlusCircle;
    faCogs = faCogs;
    faArrowLeft = faArrowLeft;

    // Data for Key Metric Cards
    metrics: MetricCard[] = [
        {
            title: 'Monthly Revenue',
            value: '₹2,45,680',
            change: '+12.5%',
            isPositive: true,
            color: 'text-blue-600',
            icon: faRupeeSign // **Assigned Font Awesome Rupee icon for the card's visual**
        },
        {
            title: 'Growth Rate',
            value: '+15.8%', // Initial value
            change: '+3.3%',
            isPositive: true,
            color: 'text-green-600',
            icon: faChartLine // **Assigned Font Awesome icon**
        },
        {
            title: 'Active Orders',
            value: '1,247', // Initial value
            change: '+8.2%',
            isPositive: true,
            color: 'text-purple-600',
            icon: faShoppingCart // **Assigned Font Awesome icon**
        },
        {
            title: 'Customer Satisfaction',
            value: '4.8/5', // Initial value
            change: '+0.3',
            isPositive: true,
            color: 'text-orange-600',
            icon: faGrinStars // **Assigned Font Awesome icon**
        }
    ];

    // Data for Report Cards
    reportCards: ReportCard[] = [
        {
            id: 'purchase-orders',
            title: 'Purchase Orders',
            description: 'Track and manage all purchase orders with suppliers',
            route: 'purchase-orders',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
            hoverColor: 'hover:bg-blue-100',
            icon: faFileInvoiceDollar // **Assigned Font Awesome icon**
        },
        {
            id: 'packing-slip',
            title: 'Packing Slip Report',
            description: 'Generate and view packing slips for shipments',
            route: 'packing-slip',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
            hoverColor: 'hover:bg-green-100',
            icon: faTruck // **Assigned Font Awesome icon**
        },
        {
            id: 'building-name',
            title: 'Building Name Report',
            description: 'Analyze performance by building locations',
            route: 'building-name',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
            hoverColor: 'hover:bg-purple-100',
            icon: faBuilding // **Assigned Font Awesome icon**
        },
        {
            id: 'payment-status',
            title: 'Payment Status',
            description: 'Monitor payment status and outstanding amounts',
            route: 'payment-status',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            hoverColor: 'hover:bg-red-100',
            icon: faMoneyBillWave // **Assigned Font Awesome icon**
        },
        {
            id: 'delivery-optimization',
            title: 'Delivery Optimization',
            description: 'Optimize delivery routes and track performance',
            route: 'delivery-optimization',
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50',
            hoverColor: 'hover:bg-indigo-100',
            icon: faTruck // Re-using existing icon
        },
        {
            id: 'payment-collection',
            title: 'Payment Collection',
            description: 'Track payment collection efficiency and trends',
            route: 'payment-collection',
            color: 'text-pink-600',
            bgColor: 'bg-pink-50',
            hoverColor: 'hover:bg-pink-100',
            icon: faHandshake // Using handshake as a suitable icon for collection
        },
        {
            id: 'sales-report',
            title: 'Sales Report',
            description: 'Comprehensive sales analysis and trends',
            route: 'sales-report',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            hoverColor: 'hover:bg-yellow-100',
            icon: faChartBar // Re-using existing icon
        },
        {
            id: 'invoice-report',
            title: 'Invoice Report',
            description: 'Manage and analyze invoice generation and status',
            route: 'invoice-report',
            color: 'text-teal-600',
            bgColor: 'bg-teal-50',
            hoverColor: 'hover:bg-teal-100',
            icon: faFileInvoiceDollar // Re-using existing icon
        }
    ];

    constructor(
        private router: Router,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        // Updates the current time every minute and refreshes metrics
        this.subscription = interval(60000).subscribe(() => {
            this.currentTime = new Date();
            this.updateMetrics();
        });
    }

    ngOnDestroy() {
        // Unsubscribe to prevent memory leaks when the component is destroyed
        this.subscription?.unsubscribe();
    }

    /**
     * Navigates to the specified report route.
     * @param route The relative path to the report.
     */
    navigateToReport(route: string) {
        this.router.navigate([route], { relativeTo: this.route });
    }

    /**
     * Updates the values of the key metrics with new random data.
     */
    private updateMetrics() {
        this.metrics = this.metrics.map((metric) => ({
            ...metric,
            value: this.generateRandomValue(metric.title, metric.value)
        }));
    }

    /**
     * Generates a random value based on the metric title.
     * This is for demonstration purposes to simulate live data updates.
     * @param title The title of the metric.
     * @param currentValue The current value of the metric.
     * @returns A new randomly generated string value for the metric.
     */
    private generateRandomValue(title: string, currentValue: string): string {
        switch (title) {
            case 'Monthly Revenue':
                // Generates a random number between 200,000 and 250,000 and prepends '₹'
                return `₹${(Math.random() * 50000 + 200000).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
            case 'Growth Rate':
                // Generates a random percentage between 10.0% and 20.0%
                return `+${(Math.random() * 10 + 10).toFixed(1)}%`;
            case 'Active Orders':
                // Generates a random number of orders between 1000 and 1500
                return (Math.floor(Math.random() * 500) + 1000).toString();
            case 'Customer Satisfaction':
                // Generates a random satisfaction score between 4.5 and 5.0
                return `${(Math.random() * 0.5 + 4.5).toFixed(1)}/5`;
            default:
                console.warn(`Unknown metric title: ${title}. Returning current value.`);
                return currentValue;
        }
    }
}
