import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as XLSX from 'xlsx'; // Import xlsx library

@Component({
    selector: 'app-packing-slip',
    standalone: true,
    imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
    providers: [DatePipe],
    template: `
        <div class="min-h-screen bg-gray-50">
            <div class="bg-white shadow-sm border-b">
                <div class="max-w-7xl mx-auto px-6 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 class="text-xl font-semibold text-gray-900">Packing Slip Report</h1>

                                <p class="text-sm text-gray-500">Generate community packing slips between dates</p>
                            </div>
                        </div>

                        <div class="text-sm text-gray-500">
                            {{ getCurrentDate() }}
                        </div>
                    </div>
                </div>
            </div>

            <div class="max-w-4xl mx-auto px-6 py-8">
                <div class="bg-white rounded-xl shadow-sm border border-gray-200">
                    <div class="p-8">
                        <form [formGroup]="packingSlipForm" (ngSubmit)="onSubmit()" class="space-y-8">
                            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div class="space-y-6">
                                    <div>
                                        <label for="customerType" class="block text-sm font-medium text-gray-700 mb-2"> Customer Type * </label>

                                        <select
                                            id="customerType"
                                            formControlName="customerType"
                                            (change)="onCustomerTypeChange($event)"
                                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors 
                                            bg-white text-gray-900"
                                        >
                                            <option value="">Select customer type</option>

                                            <option value="retail">Retail Customer</option>
                                            <option value="wholesale">Wholesale Customer</option>

                                            <option value="distributor">Distributor</option>
                                            <option value="corporate">Corporate Client</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label for="communityName" class="block text-sm font-medium text-gray-700 mb-2"> Community Name * </label>

                                        <select
                                            id="communityName"
                                            formControlName="communityName"
                                            [disabled]="!packingSlipForm.get('customerType')?.value"
                                            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 
                                            disabled:bg-gray-50 disabled:text-gray-500"
                                        >
                                            <option value="">Select community</option>

                                            <option *ngFor="let community of availableCommunities" [value]="community.value">
                                                {{ community.label }}
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label for="orderStatus" class="block text-sm font-medium text-gray-700 mb-2"> Order Status * </label>
                                        <select id="orderStatus" formControlName="orderStatus" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900">
                                            <option value="">Select status</option>
                                            <option value="pending">Pending</option>

                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>

                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>

                                            <option value="returned">Returned</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="space-y-6">
                                    <div class="bg-gray-50 rounded-lg p-6">
                                        <h3 class="text-lg font-medium text-gray-900 mb-4">Date Range</h3>

                                        <div class="mb-4">
                                            <label for="startDate" class="block text-sm font-medium text-gray-700 mb-2"> Start Date * </label>
                                            <input
                                                type="date"
                                                id="startDate"
                                                formControlName="startDate"
                                                [max]="maxDate"
                                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                            />
                                        </div>

                                        <div>
                                            <label for="endDate" class="block text-sm font-medium text-gray-700 mb-2"> End Date * </label>
                                            <input
                                                type="date"
                                                id="endDate"
                                                formControlName="endDate"
                                                [min]="packingSlipForm.get('startDate')?.value"
                                                [max]="maxDate"
                                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                            />
                                        </div>
                                    </div>

                                    <div class="bg-blue-50 rounded-lg p-6" *ngIf="isFormValid()">
                                        <h4 class="text-sm font-medium text-blue-900 mb-2">Report Summary</h4>
                                        <div class="text-sm text-blue-700 space-y-1">
                                            <p><span class="font-medium">Type:</span> {{ getCustomerTypeLabel() }}</p>
                                            <p><span class="font-medium">Community:</span> {{ getCommunityLabel() }}</p>

                                            <p><span class="font-medium">Status:</span> {{ getOrderStatusLabel() }}</p>
                                            <p><span class="font-medium">Period:</span> {{ getDateRange() }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="border-t pt-8">
                                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        type="button"
                                        (click)="clearForm()"
                                        class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                    >
                                        Clear Form
                                    </button>

                                    <button
                                        type="button"
                                        (click)="generateExcelReport()"
                                        [disabled]="!isFormValid()"
                                        class="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Generate Excel Report
                                    </button>

                                    <button
                                        type="button"
                                        (click)="generateNewExcelReport()"
                                        [disabled]="!isFormValid()"
                                        class="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Generate Advanced Report
                                    </button>
                                </div>
                            </div>

                            <div class="text-center pt-6 border-t">
                                <button
                                    type="button"
                                    routerLink="../"
                                    class="inline-flex items-center 
                                    px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                                >
                                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2 2z"
                                        />
                                    </svg>
                                    Back to Reports
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div *ngIf="isLoading" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
                <div class="bg-white rounded-xl shadow-xl p-8 max-w-sm mx-4 text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>

                    <h3 class="text-lg font-semibold text-gray-900 mb-2">Generating Report</h3>
                    <p class="text-gray-600">Please wait while we process your request...</p>
                </div>
            </div>
        </div>
    `
})
export class PackingSlip implements OnInit, OnDestroy {
    @ViewChild('dateInput', { static: false }) dateInput!: ElementRef;
    packingSlipForm: FormGroup;
    isLoading = false;
    maxDate: string;
    availableCommunities: { value: string; label: string }[] = [];
    private allCommunities = {
        retail: [
            { value: 'community1', label: 'Downtown Retail Community' },
            { value: 'community2', label: 'Mall Plaza Community' },
            { value: 'community3', label: 'Shopping Center Community' }
        ],
        wholesale: [
            { value: 'wholesale1', label: 'Wholesale District A' },
            { value: 'wholesale2', label: 'Wholesale District B' },
            { value: 'wholesale3', label: 'Industrial Wholesale Hub' }
        ],
        distributor: [
            { value: 'dist1', label: 'Regional Distribution Center' },
            { value: 'dist2', label: 'Central Distribution Hub' },

            { value: 'dist3', label: 'Logistics Distribution Point' }
        ],
        corporate: [
            { value: 'corp1', label: 'Corporate Headquarters' },
            { value: 'corp2', label: 'Corporate Branch Office' },
            { value: 'corp3', label: 'Enterprise Business Center' }
        ]
    };

    private customerTypeLabels: { [key: string]: string } = {
        retail: 'Retail Customer',
        wholesale: 'Wholesale Customer',
        distributor: 'Distributor',
        corporate: 'Corporate Client'
    };
    private orderStatusLabels: { [key: string]: string } = {
        pending: 'Pending',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',
        cancelled: 'Cancelled',
        returned: 'Returned'
    };
    constructor(
        private fb: FormBuilder,
        private datePipe: DatePipe
    ) {
        this.packingSlipForm = this.createForm();
        this.maxDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd') || '';
    }

    ngOnInit(): void {
        this.initializeForm();
    }

    ngOnDestroy(): void {
        // Cleanup subscriptions if any
    }

    private createForm(): FormGroup {
        return this.fb.group({
            customerType: ['', Validators.required],
            communityName: ['', Validators.required],
            orderStatus: ['', Validators.required],
            startDate: ['', Validators.required],

            endDate: ['', Validators.required]
        });
    }

    private initializeForm(): void {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);

        this.packingSlipForm.patchValue({
            startDate: this.datePipe.transform(startDate, 'yyyy-MM-dd'),
            endDate: this.datePipe.transform(endDate, 'yyyy-MM-dd')
        });
    }

    onCustomerTypeChange(event: any): void {
        const selectedType = event.target.value;
        if (selectedType && this.allCommunities[selectedType as keyof typeof this.allCommunities]) {
            this.availableCommunities = this.allCommunities[selectedType as keyof typeof this.allCommunities];
        } else {
            this.availableCommunities = [];
        }

        this.packingSlipForm.patchValue({ communityName: '' });
    }

    isFormValid(): boolean {
        return this.packingSlipForm.valid;
    }

    clearForm(): void {
        this.packingSlipForm.reset();
        this.availableCommunities = [];
        this.initializeForm();
    }

    onSubmit(): void {
        if (this.packingSlipForm.valid) {
            console.log('Form submitted:', this.packingSlipForm.value);
        }
    }

    generateExcelReport(): void {
        if (!this.isFormValid()) return;
        this.isLoading = true;

        setTimeout(() => {
            this.isLoading = false;
            console.log('Generating Excel Report:', this.packingSlipForm.value);
            this.downloadReport('standard');
        }, 2000);
    }

    generateNewExcelReport(): void {
        if (!this.isFormValid()) return;
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = false;
            console.log('Generating Advanced Report:', this.packingSlipForm.value);
            this.downloadReport('advanced');
        }, 2000);
    }

    private downloadReport(type: 'standard' | 'advanced'): void {
        const formData = this.packingSlipForm.value;

        // Prepare data for the Excel sheet
        // Explicitly type reportData as an array of arrays where each inner array can hold strings or numbers
        const reportData: (string | number)[][] = [
            ['Packing Slip Report - ' + (type === 'standard' ? 'Standard' : 'Advanced')],
            ['Customer Type:', this.getCustomerTypeLabel()],
            ['Community Name:', this.getCommunityLabel()],
            ['Order Status:', this.getOrderStatusLabel()],
            ['Date Range:', this.getDateRange()],
            [], // Empty row for spacing
            // Example data - replace with your actual report data structure
            ['Order ID', 'Item', 'Quantity', 'Price', 'Total']
        ];

        // Add some dummy data for demonstration
        for (let i = 1; i <= 5; i++) {
            reportData.push([
                `ORD-${100 + i}`,
                `Product A${i}`,
                Math.floor(Math.random() * 10) + 1, // This is a number
                parseFloat((Math.random() * 100).toFixed(2)), // Ensure this is a number for Excel if needed
                parseFloat((Math.random() * 500).toFixed(2)) // Ensure this is a number for Excel if needed
            ]);
        }

        const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(reportData);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Packing Slip');

        // Generate filename
        const filename = `packing_slip_${type}_${formData.startDate}_to_${formData.endDate}.xlsx`;

        // Write and download the Excel file
        XLSX.writeFile(wb, filename);

        console.log(`Downloading ${filename}`);
    }

    getCurrentDate(): string {
        return this.datePipe.transform(new Date(), 'MMM dd, yyyy') || '';
    }

    getCustomerTypeLabel(): string {
        const type = this.packingSlipForm.get('customerType')?.value;
        return this.customerTypeLabels[type as keyof typeof this.customerTypeLabels] || '';
    }

    getCommunityLabel(): string {
        const communityValue = this.packingSlipForm.get('communityName')?.value;
        const community = this.availableCommunities.find((c) => c.value === communityValue);
        return community?.label || '';
    }

    getOrderStatusLabel(): string {
        const status = this.packingSlipForm.get('orderStatus')?.value;
        return this.orderStatusLabels[status as keyof typeof this.orderStatusLabels] || '';
    }

    getDateRange(): string {
        const startDate = this.packingSlipForm.get('startDate')?.value;
        const endDate = this.packingSlipForm.get('endDate')?.value;

        if (startDate && endDate) {
            const start = this.datePipe.transform(startDate, 'MMM dd, yyyy');
            const end = this.datePipe.transform(endDate, 'MMM dd, yyyy');
            return `${start} - ${end}`;
        }
        return '';
    }
}
