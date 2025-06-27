// ================================
// src/app/apps/backoffice/components/preferences/components/preferences-filtering.ts
// Handles filtering logic for the packing slab list.
// ================================
import { Injectable } from '@angular/core';
import { Slab } from './preferences-interfaces';

@Injectable({
    providedIn: 'root'
})
export class PreferencesFilteringService {
    constructor() {
        console.log('PreferencesFilteringService initialized.');
    }

    /**
     * Applies search and filter criteria to a list of slabs.
     * @param slabs The original array of slab objects.
     * @param searchTerm The search string for slabType or customerType.
     * @param filterCustomerType The customer type to filter by.
     * @returns {Slab[]} The filtered array of slab objects.
     */
    applyFilters(slabs: Slab[], searchTerm: string, filterCustomerType: string): Slab[] {
        return slabs.filter((slab) => {
            const matchesSearch = searchTerm === '' || slab.customerType.toLowerCase().includes(searchTerm.toLowerCase()) || slab.slabType.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesFilter = !filterCustomerType || slab.customerType === filterCustomerType;

            return matchesSearch && matchesFilter;
        });
    }
}
