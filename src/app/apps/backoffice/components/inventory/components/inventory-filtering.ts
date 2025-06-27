// ==========================================================
// src/app/apps/backoffice/components/inventory/components/inventory-filtering.ts
// Contains the logic for filtering and sorting inventory items.
// ==========================================================
import { Injectable } from '@angular/core';
import { InventoryItem } from './interfaces';

@Injectable({
    providedIn: 'root'
})
export class InventoryFilteringService {
    constructor() {
        console.log('InventoryFilteringService: Service constructor called.');
    }

    /**
     * Applies all given filter criteria to the provided list of inventory items.
     * This function does not modify the original items array.
     * @param items The array of items to filter.
     * @param searchTerm The search term string.
     * @param selectedCategory The active category filter (e.g., 'All Products', 'BREADS').
     * @param selectedSubCategory The active subcategory filter (e.g., 'All Breads', 'Sourdough').
     * @param stockFilter The active stock status filter.
     * @returns {InventoryItem[]} The array of items after applying all filters.
     */
    applyFilters(items: InventoryItem[], searchTerm: string, selectedCategory: string, selectedSubCategory: string, stockFilter: '' | 'In Stock' | 'Low Stock' | 'Out of Stock'): InventoryItem[] {
        let filtered = [...items]; // Start with a copy of the input items to ensure immutability

        // Apply search term filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter((item) => item.productName.toLowerCase().includes(term) || item.category.toLowerCase().includes(term) || (item.subCategory && item.subCategory.toLowerCase().includes(term)));
        }

        // Apply category filter
        if (selectedCategory !== 'All Products') {
            filtered = filtered.filter((item) => item.category === selectedCategory);
        }

        // Apply subcategory filter if 'BREADS' is selected
        if (selectedCategory === 'BREADS' && selectedSubCategory !== 'All Breads') {
            filtered = filtered.filter((item) => item.subCategory === selectedSubCategory);
        }

        // Apply stock status filter
        if (stockFilter) {
            filtered = filtered.filter((item) => item.status === stockFilter);
        }

        console.log(`InventoryFilteringService: Applied filters. Result count: ${filtered.length}`);
        return filtered;
    }

    /**
     * Sorts a given list of inventory items based on the specified criteria.
     * This function modifies the array in place, but operates on an already filtered copy.
     * @param items The array of items to sort.
     * @param sortBy The field to sort by (e.g., 'productName', 'currentBal').
     * @returns {InventoryItem[]} The sorted array of items.
     */
    applySorting(items: InventoryItem[], sortBy: string): InventoryItem[] {
        items.sort((a, b) => {
            if (sortBy === 'productName') {
                return a.productName.localeCompare(b.productName);
            } else if (sortBy === 'currentBal') {
                return a.currentBal - b.currentBal;
            } else if (sortBy === 'category') {
                return a.category.localeCompare(b.category);
            } else if (sortBy === 'lastUpdated') {
                return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
            }
            return 0; // No sorting or invalid sortBy
        });
        console.log(`InventoryFilteringService: Applied sorting by ${sortBy}.`);
        return items;
    }
}
