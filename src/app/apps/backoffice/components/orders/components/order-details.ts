import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-order-details',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
        <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div class="mb-4">
                <button
                    routerLink="../../"
                    class="bg-gray-800 hover:bg-gray-900 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-colors duration-200 shadow-md flex items-center space-x-1 sm:space-x-2 w-auto"
                >
                    <svg class="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                    </svg>
                    <span class="whitespace-nowrap">Back to Orders </span>
                </button>
            </div>

            <div class="bg-white rounded-xl shadow-lg p-6">
                <h1 class="text-2xl font-bold text-gray-900 mb-4">Order Details - #{{ orderId }}</h1>
                <p class="text-gray-600">Order ID: {{ orderId }}</p>
                <p class="text-gray-600 mt-2">This is a sample order details page.</p>
            </div>
        </div>
    `
})
export class OrderDetails implements OnInit {
    orderId: string = '';

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.orderId = this.route.snapshot.params['id'];
    }
}
