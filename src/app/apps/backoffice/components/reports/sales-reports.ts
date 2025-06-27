import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router'; // Import RouterModule

@Component({
    selector: 'app-sales-report',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule], // Add RouterModule here
    providers: [DatePipe],
    template: `
        <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div class="bg-white shadow-sm border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 class="text-3xl font-bold text-gray-900 mb-2">Sales Report</h1>
                    <p class="text-gray-600">Generate comprehensive sales reports with detailed analytics</p>
                </div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div class="bg-white rounded-xl shadow-lg p-6 md:p-8">
                    <form [formGroup]="salesReportForm" (ngSubmit)="onSubmit()">
                        <div class="mb-8">
                            <h3 class="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                                </svg>
                                Customer Information
                            </h3>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div class="space-y-2">
                                    <label for="customerType" class="block text-sm font-medium text-gray-700"> Select Customer Type * </label>
                                    <select
                                        id="customerType"
                                        formControlName="customerType"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        [class.border-red-500]="isFieldInvalid('customerType')"
                                    >
                                        <option value="">Choose customer type...</option>
                                        <option value="business">Business</option>
                                        <option value="individual">Individual</option>
                                        <option value="community">Community</option>
                                    </select>
                                    <p class="text-red-500 text-sm mt-1" *ngIf="isFieldInvalid('customerType')">Customer type is required</p>
                                </div>

                                <div class="space-y-2" *ngIf="salesReportForm.get('customerType')?.value === 'business'">
                                    <label for="businessName" class="block text-sm font-medium text-gray-700"> Business Name </label>
                                    <input
                                        type="text"
                                        id="businessName"
                                        formControlName="businessName"
                                        placeholder="Enter business/customer name"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="mb-8">
                            <h3 class="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                Report Date Range
                            </h3>

                            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div class="space-y-2">
                                    <label for="dataType" class="block text-sm font-medium text-gray-700"> Select Data Type * </label>
                                    <select
                                        id="dataType"
                                        formControlName="dataType"
                                        class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        [class.border-red-500]="isFieldInvalid('dataType')"
                                    >
                                        <option value="">Choose data type...</option>
                                        <option value="wantedOnDate">Wanted On Date</option>
                                        <option value="createdDate">Created Date</option>
                                        <option value="modifiedDate">Modified Date</option>
                                        <option value="deliveryDate">Delivery Date</option>
                                    </select>
                                    <p class="text-red-500 text-sm mt-1" *ngIf="isFieldInvalid('dataType')">Data type is required</p>
                                </div>

                                <div class="space-y-2">
                                    <label for="startDate" class="block text-sm font-medium text-gray-700"> Start Date * </label>
                                    <div class="relative">
                                        <input
                                            type="date"
                                            id="startDate"
                                            formControlName="startDate"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            [class.border-red-500]="isFieldInvalid('startDate')"
                                        />
                                        <svg class="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                    </div>
                                    <p class="text-red-500 text-sm mt-1" *ngIf="isFieldInvalid('startDate')">Start date is required</p>
                                </div>

                                <div class="space-y-2">
                                    <label for="endDate" class="block text-sm font-medium text-gray-700"> End Date * </label>
                                    <div class="relative">
                                        <input
                                            type="date"
                                            id="endDate"
                                            formControlName="endDate"
                                            class="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                            [class.border-red-500]="isFieldInvalid('endDate')"
                                        />
                                        <svg class="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                        </svg>
                                    </div>
                                    <p class="text-red-500 text-sm mt-1" *ngIf="isFieldInvalid('endDate')">End date is required</p>
                                    <p class="text-red-500 text-sm mt-1" *ngIf="salesReportForm.errors?.['dateRangeInvalid'] && !isFieldInvalid('endDate')">End date cannot be before start date</p>
                                </div>
                            </div>
                        </div>

                        <div class="mb-8">
                            <h3 class="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    ></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                                Report Options
                            </h3>

                            <div class="bg-gray-50 rounded-lg p-4">
                                <label class="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" formControlName="includeFinanceDetails" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                                    <span class="text-sm font-medium text-gray-700"> Include Product Details with Finance Information </span>
                                </label>
                                <p class="text-xs text-gray-500 mt-2 ml-7">This will include detailed financial breakdown for each product in the report</p>
                            </div>
                        </div>

                        <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                            <div class="flex flex-col sm:flex-row gap-3 flex-1">
                                <button
                                    type="button"
                                    (click)="clearForm()"
                                    class="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                                >
                                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                    Clear
                                </button>

                                <button
                                    type="button"
                                    (click)="generateExcelReport()"
                                    [disabled]="salesReportForm.invalid || isGenerating"
                                    class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium"
                                >
                                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" *ngIf="!isGenerating">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    <svg class="animate-spin w-4 h-4 inline mr-2" *ngIf="isGenerating" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {{ isGenerating ? 'Generating...' : 'Get Report (Excel)' }}
                                </button>

                                <button
                                    type="button"
                                    (click)="generatePdfReport()"
                                    [disabled]="salesReportForm.invalid || isGenerating"
                                    class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors font-medium"
                                >
                                    <svg class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" *ngIf="!isGenerating">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                    </svg>
                                    <svg class="animate-spin w-4 h-4 inline mr-2" *ngIf="isGenerating" fill="none" viewBox="0 0 24 24">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {{ isGenerating ? 'Generating...' : 'Get Report (PDF)' }}
                                </button>
                            </div>
                        </div>
                    </form>

                    <div *ngIf="showSuccessMessage" class="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                        <svg class="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="text-green-800 font-medium">Report generation simulated successfully!</span>
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
            </div>
        </div>
    `
})
export class SalesReports implements OnInit, OnDestroy {
    salesReportForm!: FormGroup;
    isGenerating = false;
    showSuccessMessage = false;

    constructor(
        private fb: FormBuilder,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.initializeForm();
    }

    ngOnDestroy(): void {
        // Cleanup if needed
    }

    private initializeForm(): void {
        this.salesReportForm = this.fb.group({
            customerType: ['', Validators.required],
            businessName: [''],
            dataType: ['', Validators.required],
            startDate: ['', Validators.required],
            endDate: ['', Validators.required],
            includeFinanceDetails: [false]
        });
        // Add custom validator for date range
        this.salesReportForm.addValidators(this.dateRangeValidator);
    }

    private dateRangeValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
        const form = control as FormGroup;
        const startDate = form.get('startDate')?.value;
        const endDate = form.get('endDate')?.value;

        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            return { dateRangeInvalid: true };
        }
        return null;
    };

    isFieldInvalid(fieldName: string): boolean {
        const field = this.salesReportForm.get(fieldName);
        return !!(field && field.invalid && (field.dirty || field.touched));
    }

    onSubmit(): void {
        if (this.salesReportForm.valid) {
            console.log('Form submitted:', this.salesReportForm.value);
            this.generateExcelReport(); // This line currently triggers the simulated Excel generation
        } else {
            this.markFormGroupTouched();
        }
    }

    private markFormGroupTouched(): void {
        Object.keys(this.salesReportForm.controls).forEach((key) => {
            const control = this.salesReportForm.get(key);
            control?.markAsTouched();
        });
    }

    clearForm(): void {
        this.salesReportForm.reset();
        this.showSuccessMessage = false;
    }

    generateExcelReport(): void {
        if (this.salesReportForm.invalid) {
            this.markFormGroupTouched();
            return;
        }

        this.isGenerating = true;
        // Simulate API call
        setTimeout(() => {
            this.isGenerating = false;
            this.showSuccessMessage = true;

            // Hide success message after 3 seconds
            setTimeout(() => {
                this.showSuccessMessage = false;
            }, 3000);

            console.log('Excel report generation simulated:', this.salesReportForm.value);
            // Here you would typically call your service to generate the Excel report
            // For actual download, you'd handle the response from a backend here.
        }, 2000);
    }

    generatePdfReport(): void {
        if (this.salesReportForm.invalid) {
            this.markFormGroupTouched();
            return;
        }

        this.isGenerating = true;
        // Simulate API call
        setTimeout(() => {
            this.isGenerating = false;
            this.showSuccessMessage = true;

            // Hide success message after 3 seconds
            setTimeout(() => {
                this.showSuccessMessage = false;
            }, 3000);

            console.log('PDF report generation simulated:', this.salesReportForm.value);
            // Here you would typically call your service to generate the PDF report
            // For actual download, you'd handle the response from a backend here.
        }, 2000);
    }
}
