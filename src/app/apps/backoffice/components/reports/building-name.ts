import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

interface Building {
    id: number;
    name: string;
    code: string;
    address: string;
    floors: number;
    units: number;
    status: 'Active' | 'Inactive' | 'Under Construction' | 'Maintenance';
    type: 'Residential' | 'Commercial' | 'Mixed Use' | 'Industrial';
    constructionDate: Date;
    lastInspection: Date;
    manager: string;
    contact: string;
    totalArea: number;
    occupancyRate: number;
}

@Component({
    selector: 'app-building-name',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
    providers: [DatePipe],
    template: `
        <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <!-- Header Section -->
            <div class="bg-white shadow-sm border-b border-gray-200">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 class="text-3xl font-bold text-gray-900 mb-2">Building Management</h1>
                            <p class="text-gray-600">Comprehensive building portfolio management and reporting</p>
                        </div>
                        <div class="mt-4 sm:mt-0 flex space-x-3">
                            <button
                                (click)="exportReport()"
                                class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                            >
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export Report
                            </button>
                            <button
                                (click)="openAddModal()"
                                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            >
                                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Add Building
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <!-- Analytics Dashboard -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Total Buildings</p>
                                <p class="text-3xl font-bold text-gray-900">{{ getTotalBuildings() }}</p>
                            </div>
                            <div class="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Active Buildings</p>
                                <p class="text-3xl font-bold text-green-600">{{ getActiveBuildings() }}</p>
                            </div>
                            <div class="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Avg. Occupancy</p>
                                <p class="text-3xl font-bold text-purple-600">{{ getAverageOccupancy() }}%</p>
                            </div>
                            <div class="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="text-sm font-medium text-gray-600">Total Area</p>
                                <p class="text-3xl font-bold text-orange-600">{{ getTotalArea() | number: '1.0-0' }} m²</p>
                            </div>
                            <div class="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Search and Filter Section -->
                <div class="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Search Buildings</label>
                            <div class="relative">
                                <input
                                    type="text"
                                    [(ngModel)]="searchTerm"
                                    (input)="onSearchChange($event)"
                                    placeholder="Search by name, code, or address..."
                                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
                            <select [(ngModel)]="statusFilter" (change)="applyFilters()" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">All Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Under Construction">Under Construction</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Type Filter</label>
                            <select [(ngModel)]="typeFilter" (change)="applyFilters()" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                <option value="">All Types</option>
                                <option value="Residential">Residential</option>
                                <option value="Commercial">Commercial</option>
                                <option value="Mixed Use">Mixed Use</option>
                                <option value="Industrial">Industrial</option>
                            </select>
                        </div>

                        <div class="flex items-end">
                            <button (click)="resetFilters()" class="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Buildings Table -->
                <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                    <div class="px-6 py-4 border-b border-gray-200">
                        <h3 class="text-lg font-semibold text-gray-900">Buildings Directory</h3>
                        <p class="text-sm text-gray-600 mt-1">{{ filteredBuildings.length }} buildings found</p>
                    </div>

                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building Info</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Occupancy</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manager</th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr *ngFor="let building of paginatedBuildings; trackBy: trackByBuildingId" class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div class="text-sm font-medium text-gray-900">{{ building.name }}</div>
                                            <div class="text-sm text-gray-500">Code: {{ building.code }}</div>
                                            <div class="text-xs text-gray-400 mt-1">{{ building.address }}</div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">
                                            <div>{{ building.floors }} floors • {{ building.units }} units</div>
                                            <div class="text-xs text-gray-500 mt-1">{{ building.totalArea | number: '1.0-0' }} m² • {{ building.type }}</div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span
                                            class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                                            [ngClass]="{
                                                'bg-green-100 text-green-800': building.status === 'Active',
                                                'bg-red-100 text-red-800': building.status === 'Inactive',
                                                'bg-yellow-100 text-yellow-800': building.status === 'Under Construction',
                                                'bg-blue-100 text-blue-800': building.status === 'Maintenance'
                                            }"
                                        >
                                            {{ building.status }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div class="w-16 bg-gray-200 rounded-full h-2 mr-3">
                                                <div
                                                    class="h-2 rounded-full"
                                                    [style.width.%]="building.occupancyRate"
                                                    [ngClass]="{
                                                        'bg-green-500': building.occupancyRate >= 80,
                                                        'bg-yellow-500': building.occupancyRate >= 60 && building.occupancyRate < 80,
                                                        'bg-red-500': building.occupancyRate < 60
                                                    }"
                                                ></div>
                                            </div>
                                            <span class="text-sm text-gray-900">{{ building.occupancyRate }}%</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">{{ building.manager }}</div>
                                        <div class="text-xs text-gray-500">{{ building.contact }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div class="flex space-x-2">
                                            <button (click)="viewBuilding(building)" class="text-blue-600 hover:text-blue-900 transition-colors" title="View Details">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            <button (click)="editBuilding(building)" class="text-indigo-600 hover:text-indigo-900 transition-colors" title="Edit Building">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button (click)="deleteBuilding(building.id)" class="text-red-600 hover:text-red-900 transition-colors" title="Delete Building">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination -->
                    <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6" *ngIf="filteredBuildings.length > pageSize">
                        <div class="flex-1 flex justify-between sm:hidden">
                            <button
                                (click)="previousPage()"
                                [disabled]="currentPage === 1"
                                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                (click)="nextPage()"
                                [disabled]="currentPage === totalPages"
                                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p class="text-sm text-gray-700">
                                    Showing <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> to <span class="font-medium">{{ Math.min(currentPage * pageSize, filteredBuildings.length) }}</span> of
                                    <span class="font-medium">{{ filteredBuildings.length }}</span> results
                                </p>
                            </div>
                            <div>
                                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        (click)="previousPage()"
                                        [disabled]="currentPage === 1"
                                        class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                                        </svg>
                                    </button>

                                    <button
                                        *ngFor="let page of getVisiblePages()"
                                        (click)="goToPage(page)"
                                        [class]="
                                            page === currentPage
                                                ? 'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600'
                                                : 'relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50'
                                        "
                                    >
                                        {{ page }}
                                    </button>

                                    <button
                                        (click)="nextPage()"
                                        [disabled]="currentPage === totalPages"
                                        class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Back Button -->
                <div class="text-center pt-8">
                    <button
                        type="button"
                        routerLink="../"
                        class="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
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

        <!-- Building Form Modal (Add/Edit) -->
        <div *ngIf="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" (click)="closeModal()">
            <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" (click)="$event.stopPropagation()">
                <div class="mt-3">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">
                        {{ isEditMode ? 'Edit Building' : 'Add New Building' }}
                    </h3>

                    <form [formGroup]="buildingForm" (ngSubmit)="onSubmit()">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Building Name</label>
                                <input type="text" formControlName="name" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter building name" />
                                <div *ngIf="buildingForm.get('name')?.invalid && buildingForm.get('name')?.touched" class="mt-1 text-sm text-red-600">Building name is required</div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Building Code</label>
                                <input type="text" formControlName="code" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter building code" />
                                <div *ngIf="buildingForm.get('code')?.invalid && buildingForm.get('code')?.touched" class="mt-1 text-sm text-red-600">Building code is required</div>
                            </div>

                            <div class="md:col-span-2">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                <input type="text" formControlName="address" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter complete address" />
                                <div *ngIf="buildingForm.get('address')?.invalid && buildingForm.get('address')?.touched" class="mt-1 text-sm text-red-600">Address is required</div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Number of Floors</label>
                                <input type="number" formControlName="floors" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter number of floors" min="1" />
                                <div *ngIf="buildingForm.get('floors')?.invalid && buildingForm.get('floors')?.touched" class="mt-1 text-sm text-red-600">Valid number of floors is required</div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Number of Units</label>
                                <input type="number" formControlName="units" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter number of units" min="1" />
                                <div *ngIf="buildingForm.get('units')?.invalid && buildingForm.get('units')?.touched" class="mt-1 text-sm text-red-600">Valid number of units is required</div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Building Status</label>
                                <select formControlName="status" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Status</option>
                                    <option value="Active">Active</option>
                                    <option value="Inactive">Inactive</option>
                                    <option value="Under Construction">Under Construction</option>
                                    <option value="Maintenance">Maintenance</option>
                                </select>
                                <div *ngIf="buildingForm.get('status')?.invalid && buildingForm.get('status')?.touched" class="mt-1 text-sm text-red-600">Building status is required</div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Building Type</label>
                                <select formControlName="type" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">Select Type</option>
                                    <option value="Residential">Residential</option>
                                    <option value="Commercial">Commercial</option>
                                    <option value="Mixed Use">Mixed Use</option>
                                    <option value="Industrial">Industrial</option>
                                </select>
                                <div *ngIf="buildingForm.get('type')?.invalid && buildingForm.get('type')?.touched" class="mt-1 text-sm text-red-600">Building type is required</div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Construction Date</label>
                                <input type="date" formControlName="constructionDate" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                <div *ngIf="buildingForm.get('constructionDate')?.invalid && buildingForm.get('constructionDate')?.touched" class="mt-1 text-sm text-red-600">Construction date is required</div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Last Inspection Date</label>
                                <input type="date" formControlName="lastInspection" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                                <div *ngIf="buildingForm.get('lastInspection')?.invalid && buildingForm.get('lastInspection')?.touched" class="mt-1 text-sm text-red-600">Last inspection date is required</div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Building Manager</label>
                                <input type="text" formControlName="manager" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter manager name" />
                                <div *ngIf="buildingForm.get('manager')?.invalid && buildingForm.get('manager')?.touched" class="mt-1 text-sm text-red-600">Manager name is required</div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Contact Information</label>
                                <input type="text" formControlName="contact" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter contact details" />
                                <div *ngIf="buildingForm.get('contact')?.invalid && buildingForm.get('contact')?.touched" class="mt-1 text-sm text-red-600">Contact information is required</div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Total Area (m²)</label>
                                <input
                                    type="number"
                                    formControlName="totalArea"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter total area in square meters"
                                    min="1"
                                />
                                <div *ngIf="buildingForm.get('totalArea')?.invalid && buildingForm.get('totalArea')?.touched" class="mt-1 text-sm text-red-600">Valid total area is required</div>
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Occupancy Rate (%)</label>
                                <input
                                    type="number"
                                    formControlName="occupancyRate"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter occupancy percentage"
                                    min="0"
                                    max="100"
                                />
                                <div *ngIf="buildingForm.get('occupancyRate')?.invalid && buildingForm.get('occupancyRate')?.touched" class="mt-1 text-sm text-red-600">Valid occupancy rate (0-100) is required</div>
                            </div>
                        </div>

                        <div class="flex justify-end space-x-3 mt-6">
                            <button type="button" (click)="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                                Cancel
                            </button>
                            <button
                                type="submit"
                                [disabled]="buildingForm.invalid"
                                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {{ isEditMode ? 'Update Building' : 'Add Building' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `
})
export class Buildingname implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private searchSubject = new Subject<string>();

    // Form and Modal
    buildingForm!: FormGroup;
    showModal = false;
    isEditMode = false;
    editingBuildingId: number | null = null;

    // Data
    buildings: Building[] = [];
    filteredBuildings: Building[] = [];
    paginatedBuildings: Building[] = [];

    // Search and Filter
    searchTerm = '';
    statusFilter = '';
    typeFilter = '';

    // Pagination
    currentPage = 1;
    pageSize = 10;
    totalPages = 1;

    // Utility
    Math = Math;

    constructor(
        private fb: FormBuilder,
        private datePipe: DatePipe
    ) {
        this.initializeForm();
        this.initializeSampleData();
        this.setupSearch();
    }

    ngOnInit(): void {
        this.applyFilters();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initializeForm(): void {
        this.buildingForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            code: ['', [Validators.required, Validators.minLength(2)]],
            address: ['', [Validators.required, Validators.minLength(5)]],
            floors: ['', [Validators.required, Validators.min(1)]],
            units: ['', [Validators.required, Validators.min(1)]],
            status: ['', Validators.required],
            type: ['', Validators.required],
            constructionDate: ['', Validators.required],
            lastInspection: ['', Validators.required],
            manager: ['', [Validators.required, Validators.minLength(2)]],
            contact: ['', [Validators.required, Validators.minLength(5)]],
            totalArea: ['', [Validators.required, Validators.min(1)]],
            occupancyRate: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
        });
    }

    private initializeSampleData(): void {
        this.buildings = [
            {
                id: 1,
                name: 'Metropolitan Tower',
                code: 'MT-001',
                address: '123 Business District, Downtown',
                floors: 25,
                units: 200,
                status: 'Active',
                type: 'Commercial',
                constructionDate: new Date('2018-06-15'),
                lastInspection: new Date('2024-01-15'),
                manager: 'John Smith',
                contact: '+1-555-0123',
                totalArea: 15000,
                occupancyRate: 85
            },
            {
                id: 2,
                name: 'Riverside Apartments',
                code: 'RA-002',
                address: '456 River View Lane, Riverside',
                floors: 8,
                units: 120,
                status: 'Active',
                type: 'Residential',
                constructionDate: new Date('2020-03-20'),
                lastInspection: new Date('2024-02-10'),
                manager: 'Sarah Johnson',
                contact: '+1-555-0456',
                totalArea: 8500,
                occupancyRate: 92
            },
            {
                id: 3,
                name: 'Tech Innovation Center',
                code: 'TIC-003',
                address: '789 Innovation Boulevard, Tech Park',
                floors: 12,
                units: 50,
                status: 'Under Construction',
                type: 'Commercial',
                constructionDate: new Date('2023-09-01'),
                lastInspection: new Date('2024-01-20'),
                manager: 'Michael Chen',
                contact: '+1-555-0789',
                totalArea: 12000,
                occupancyRate: 0
            },
            {
                id: 4,
                name: 'Heritage Square',
                code: 'HS-004',
                address: '321 Heritage Street, Old Town',
                floors: 6,
                units: 80,
                status: 'Maintenance',
                type: 'Mixed Use',
                constructionDate: new Date('2015-11-10'),
                lastInspection: new Date('2023-12-05'),
                manager: 'Emma Davis',
                contact: '+1-555-0321',
                totalArea: 6800,
                occupancyRate: 75
            },
            {
                id: 5,
                name: 'Industrial Park A',
                code: 'IPA-005',
                address: '654 Industrial Way, Manufacturing District',
                floors: 3,
                units: 15,
                status: 'Active',
                type: 'Industrial',
                constructionDate: new Date('2019-04-12'),
                lastInspection: new Date('2024-01-30'),
                manager: 'Robert Wilson',
                contact: '+1-555-0654',
                totalArea: 25000,
                occupancyRate: 88
            },
            {
                id: 6,
                name: 'Sunset Gardens',
                code: 'SG-006',
                address: '987 Sunset Drive, Suburban Area',
                floors: 4,
                units: 60,
                status: 'Active',
                type: 'Residential',
                constructionDate: new Date('2021-08-25'),
                lastInspection: new Date('2024-02-15'),
                manager: 'Lisa Anderson',
                contact: '+1-555-0987',
                totalArea: 4200,
                occupancyRate: 96
            },
            {
                id: 7,
                name: 'City Mall Complex',
                code: 'CMC-007',
                address: '147 Shopping Center Drive, Mall District',
                floors: 5,
                units: 180,
                status: 'Active',
                type: 'Commercial',
                constructionDate: new Date('2017-12-03'),
                lastInspection: new Date('2024-01-08'),
                manager: 'David Brown',
                contact: '+1-555-0147',
                totalArea: 22000,
                occupancyRate: 78
            },
            {
                id: 8,
                name: 'Green Valley Condos',
                code: 'GVC-008',
                address: '258 Valley Road, Green Hills',
                floors: 10,
                units: 150,
                status: 'Inactive',
                type: 'Residential',
                constructionDate: new Date('2016-05-18'),
                lastInspection: new Date('2023-11-22'),
                manager: 'Jennifer Taylor',
                contact: '+1-555-0258',
                totalArea: 9800,
                occupancyRate: 45
            }
        ];
    }

    private setupSearch(): void {
        this.searchSubject.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(() => {
            this.applyFilters();
        });
    }

    // Analytics Methods
    getTotalBuildings(): number {
        return this.buildings.length;
    }

    getActiveBuildings(): number {
        return this.buildings.filter((b) => b.status === 'Active').length;
    }

    getAverageOccupancy(): number {
        if (this.buildings.length === 0) return 0;
        const total = this.buildings.reduce((sum, b) => sum + b.occupancyRate, 0);
        return Math.round(total / this.buildings.length);
    }

    getTotalArea(): number {
        return this.buildings.reduce((sum, b) => sum + b.totalArea, 0);
    }

    // Search and Filter Methods
    onSearchChange(event: any): void {
        this.searchTerm = event.target.value;
        this.searchSubject.next(this.searchTerm);
    }

    applyFilters(): void {
        let filtered = [...this.buildings];

        // Apply search filter
        if (this.searchTerm.trim()) {
            const searchLower = this.searchTerm.toLowerCase();
            filtered = filtered.filter(
                (building) => building.name.toLowerCase().includes(searchLower) || building.code.toLowerCase().includes(searchLower) || building.address.toLowerCase().includes(searchLower) || building.manager.toLowerCase().includes(searchLower)
            );
        }

        // Apply status filter
        if (this.statusFilter) {
            filtered = filtered.filter((building) => building.status === this.statusFilter);
        }

        // Apply type filter
        if (this.typeFilter) {
            filtered = filtered.filter((building) => building.type === this.typeFilter);
        }

        this.filteredBuildings = filtered;
        this.currentPage = 1;
        this.updatePagination();
    }

    resetFilters(): void {
        this.searchTerm = '';
        this.statusFilter = '';
        this.typeFilter = '';
        this.applyFilters();
    }

    // Pagination Methods
    updatePagination(): void {
        this.totalPages = Math.ceil(this.filteredBuildings.length / this.pageSize);
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedBuildings = this.filteredBuildings.slice(startIndex, endIndex);
    }

    previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePagination();
        }
    }

    nextPage(): void {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePagination();
        }
    }

    goToPage(page: number): void {
        this.currentPage = page;
        this.updatePagination();
    }

    getVisiblePages(): number[] {
        const pages: number[] = [];
        const maxVisible = 5;
        let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(this.totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    }

    // CRUD Operations
    openAddModal(): void {
        this.isEditMode = false;
        this.editingBuildingId = null;
        this.buildingForm.reset();
        this.showModal = true;
    }

    editBuilding(building: Building): void {
        this.isEditMode = true;
        this.editingBuildingId = building.id;
        this.buildingForm.patchValue({
            name: building.name,
            code: building.code,
            address: building.address,
            floors: building.floors,
            units: building.units,
            status: building.status,
            type: building.type,
            constructionDate: this.datePipe.transform(building.constructionDate, 'yyyy-MM-dd'),
            lastInspection: this.datePipe.transform(building.lastInspection, 'yyyy-MM-dd'),
            manager: building.manager,
            contact: building.contact,
            totalArea: building.totalArea,
            occupancyRate: building.occupancyRate
        });
        this.showModal = true;
    }

    viewBuilding(building: Building): void {
        // Implement view logic - could open a detailed view modal
        console.log('Viewing building:', building);
        alert(`Viewing ${building.name}\n\nDetails:\n- Code: ${building.code}\n- Status: ${building.status}\n- Type: ${building.type}\n- Manager: ${building.manager}\n- Occupancy: ${building.occupancyRate}%`);
    }

    deleteBuilding(buildingId: number): void {
        if (confirm('Are you sure you want to delete this building? This action cannot be undone.')) {
            this.buildings = this.buildings.filter((b) => b.id !== buildingId);
            this.applyFilters();
        }
    }

    onSubmit(): void {
        if (this.buildingForm.valid) {
            const formData = this.buildingForm.value;

            if (this.isEditMode && this.editingBuildingId) {
                // Update existing building
                const index = this.buildings.findIndex((b) => b.id === this.editingBuildingId);
                if (index !== -1) {
                    this.buildings[index] = {
                        ...this.buildings[index],
                        ...formData,
                        constructionDate: new Date(formData.constructionDate),
                        lastInspection: new Date(formData.lastInspection)
                    };
                }
            } else {
                // Add new building
                const newBuilding: Building = {
                    id: Math.max(...this.buildings.map((b) => b.id)) + 1,
                    ...formData,
                    constructionDate: new Date(formData.constructionDate),
                    lastInspection: new Date(formData.lastInspection)
                };
                this.buildings.push(newBuilding);
            }

            this.closeModal();
            this.applyFilters();
        }
    }

    closeModal(): void {
        this.showModal = false;
        this.buildingForm.reset();
        this.isEditMode = false;
        this.editingBuildingId = null;
    }

    // Export functionality
    exportReport(): void {
        const reportData = this.filteredBuildings.map((building) => ({
            'Building Name': building.name,
            Code: building.code,
            Address: building.address,
            Type: building.type,
            Status: building.status,
            Floors: building.floors,
            Units: building.units,
            'Total Area (m²)': building.totalArea,
            'Occupancy Rate (%)': building.occupancyRate,
            Manager: building.manager,
            Contact: building.contact,
            'Construction Date': this.datePipe.transform(building.constructionDate, 'yyyy-MM-dd'),
            'Last Inspection': this.datePipe.transform(building.lastInspection, 'yyyy-MM-dd')
        }));

        // Convert to CSV
        const headers = Object.keys(reportData[0] || {});
        const csvContent = [headers.join(','), ...reportData.map((row) => headers.map((header) => `"${row[header as keyof typeof row] || ''}"`).join(','))].join('\n');

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `building-report-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    // Track by function for performance
    trackByBuildingId(index: number, building: Building): number {
        return building.id;
    }
}
