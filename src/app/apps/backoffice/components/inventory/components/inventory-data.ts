// ==========================================================
// src/app/apps/backoffice/components/inventory/components/inventory-data.ts
// Manages the raw inventory data. Handles initial loading,
// adding new items, and updating/deleting existing ones.
// ==========================================================
import { Injectable } from '@angular/core';
import { InventoryItem } from './interfaces';

@Injectable({
    providedIn: 'root'
})
export class InventoryDataService {
    private _inventoryItems: InventoryItem[] = [];
    private nextId: number = 1; // For generating unique IDs for new items

    // Define categories and subcategories here as they are data-related lookup lists
    public categories: string[] = ['All Products', 'BREADS', 'BROWNIES', 'CAKES', 'COOKIES', 'SAVOURIES', 'VIENNOISERIE', 'SWEET PIES'];
    public breadSubcategories: string[] = ['All Breads', 'Enriched Breads', 'Flatbreads', 'German Breads', 'Healthy Breads', 'Italian Breads', 'Sourdough', 'Specialty Breads', 'Yeast Breads'];

    constructor() {
        console.log('InventoryDataService: Service constructor called.');
        this.loadInitialData(); // Load initial mock data
    }

    /**
     * Loads initial mock inventory data and calculates derived fields.
     */
    private loadInitialData(): void {
        const initialData: InventoryItem[] = [
            {
                id: 1,
                productName: 'Classic Sourdough Loaf',
                category: 'BREADS',
                subCategory: 'Sourdough',
                capacity: 148,
                production: 95,
                sample: 0,
                damaged: 2,
                cfQty: 93,
                cfSold: 59,
                totalInv: 0, // Will be calculated
                ordered: 6,
                cfBal: 0, // Will be calculated
                freshBal: 0, // Will be calculated
                currentBal: 0, // Will be calculated
                status: 'Out of Stock', // Will be calculated
                lastUpdated: new Date()
            },
            {
                id: 2,
                productName: 'Italian Ciabatta Rolls (Pack of 4)',
                category: 'BREADS',
                subCategory: 'Italian Breads',
                capacity: 115,
                production: 104,
                sample: 4,
                damaged: 0,
                cfQty: 100,
                cfSold: 84,
                totalInv: 0,
                ordered: 6,
                cfBal: 0,
                freshBal: 0,
                currentBal: 0,
                status: 'Out of Stock',
                lastUpdated: new Date()
            },
            {
                id: 3,
                productName: 'Multigrain Yeast Bread',
                category: 'BREADS',
                subCategory: 'Yeast Breads', // Changed to Yeast Breads as per common classification
                capacity: 126,
                production: 68,
                sample: 4,
                damaged: 1,
                cfQty: 63,
                cfSold: 53,
                totalInv: 0,
                ordered: 1,
                cfBal: 0,
                freshBal: 0,
                currentBal: 0,
                status: 'Out of Stock',
                lastUpdated: new Date()
            },
            {
                id: 4,
                productName: 'Rosemary & Sea Salt Grissini',
                category: 'SAVOURIES',
                capacity: 129,
                production: 128,
                sample: 0,
                damaged: 0,
                cfQty: 128,
                cfSold: 13,
                totalInv: 0,
                ordered: 12,
                cfBal: 0,
                freshBal: 0,
                currentBal: 0,
                status: 'Out of Stock',
                lastUpdated: new Date()
            },
            {
                id: 5,
                productName: 'Spicy Cheese & Jalapeno Bites',
                category: 'SAVOURIES',
                capacity: 172,
                production: 151,
                sample: 4,
                damaged: 0,
                cfQty: 147,
                cfSold: 37,
                totalInv: 0,
                ordered: 12,
                cfBal: 0,
                freshBal: 0,
                currentBal: 0,
                status: 'Out of Stock',
                lastUpdated: new Date()
            },
            {
                id: 6,
                productName: 'Dark Chocolate Fudge Brownies (Dozen)',
                category: 'BROWNIES',
                capacity: 133,
                production: 106,
                sample: 2,
                damaged: 2,
                cfQty: 102,
                cfSold: 14,
                totalInv: 0,
                ordered: 18,
                cfBal: 0,
                freshBal: 0,
                currentBal: 0,
                status: 'Out of Stock',
                lastUpdated: new Date()
            },
            {
                id: 7,
                productName: 'Whole Wheat Pita Pockets',
                category: 'BREADS',
                subCategory: 'Flatbreads',
                capacity: 103,
                production: 80,
                sample: 4,
                damaged: 1,
                cfQty: 75,
                cfSold: 1,
                totalInv: 0,
                ordered: 10,
                cfBal: 0,
                freshBal: 0,
                currentBal: 0,
                status: 'Out of Stock',
                lastUpdated: new Date()
            },
            {
                id: 8,
                productName: 'Soft Pretzel Rolls (Pack of 6)',
                category: 'BREADS',
                subCategory: 'German Breads',
                capacity: 90,
                production: 85,
                sample: 1,
                damaged: 0,
                cfQty: 84,
                cfSold: 60,
                totalInv: 0,
                ordered: 5,
                cfBal: 0,
                freshBal: 0,
                currentBal: 0,
                status: 'Out of Stock',
                lastUpdated: new Date()
            },
            {
                id: 9,
                productName: 'Artisan Baguette (Crusty)',
                category: 'BREADS',
                subCategory: 'Specialty Breads',
                capacity: 70,
                production: 65,
                sample: 0,
                damaged: 0,
                cfQty: 65,
                cfSold: 50,
                totalInv: 0,
                ordered: 2,
                cfBal: 0,
                freshBal: 0,
                currentBal: 0,
                status: 'Out of Stock',
                lastUpdated: new Date()
            }
        ];

        this._inventoryItems = initialData.map((item) => this.calculateDerivedFields(item));
        this.nextId = Math.max(...this._inventoryItems.map((item) => item.id), 0) + 1;
        console.log(`InventoryDataService: Loaded ${this._inventoryItems.length} initial items. Next ID: ${this.nextId}`);
    }

    /**
     * Calculates all derived fields for an inventory item.
     * This is a helper for both initial load and updates.
     * @param item The inventory item to calculate fields for.
     * @returns The item with updated derived fields.
     */
    private calculateDerivedFields(item: InventoryItem): InventoryItem {
        item.totalInv = item.production - item.sample - item.damaged;
        item.cfBal = item.cfQty - item.cfSold;
        item.freshBal = item.production - item.sample - item.damaged;
        item.currentBal = item.cfBal + item.freshBal - item.ordered;
        item.lastUpdated = new Date(); // Update timestamp on any calculation
        this.updateStatus(item); // Update status based on new balance
        return item;
    }

    /**
     * Updates the stock status of an item based on its current balance.
     * @param item The inventory item to update status for.
     */
    private updateStatus(item: InventoryItem): void {
        if (item.currentBal <= 0) {
            item.status = 'Out of Stock';
        } else if (item.currentBal < 50) {
            // Threshold for "Low Stock"
            item.status = 'Low Stock';
        } else {
            item.status = 'In Stock';
        }
    }

    /**
     * Returns a deep copy of all current inventory items.
     * Components should call this method to get the latest data.
     * @returns {InventoryItem[]} A deep copy of the array of all inventory items.
     */
    getInventoryItems(): InventoryItem[] {
        return JSON.parse(JSON.stringify(this._inventoryItems));
    }

    /**
     * Adds a new inventory item to the internal list.
     * Assigns a new ID and calculates derived fields.
     * @param newItemData The data for the new item (without ID).
     * @returns {InventoryItem} The newly added item including its assigned ID.
     */
    addInventoryItem(newItemData: Omit<InventoryItem, 'id' | 'totalInv' | 'cfBal' | 'freshBal' | 'currentBal' | 'status' | 'lastUpdated'>): InventoryItem {
        const newItem: InventoryItem = {
            id: this.nextId++,
            ...newItemData,
            totalInv: 0, // Placeholder, will be calculated
            cfBal: 0, // Placeholder, will be calculated
            freshBal: 0, // Placeholder, will be calculated
            currentBal: 0, // Placeholder, will be calculated
            status: 'Out of Stock', // Placeholder, will be calculated
            lastUpdated: new Date() // Will be updated by calculateDerivedFields
        };
        const calculatedItem = this.calculateDerivedFields(newItem);
        this._inventoryItems.push(calculatedItem);
        console.log('InventoryDataService: Added new item:', calculatedItem.productName);
        return calculatedItem;
    }

    /**
     * Updates an existing inventory item in the internal list.
     * Finds the item by ID and replaces its data, recalculating derived fields.
     * @param updatedItemData The item data with updates (must include ID).
     */
    updateInventoryItem(updatedItemData: InventoryItem): void {
        const index = this._inventoryItems.findIndex((item) => item.id === updatedItemData.id);
        if (index !== -1) {
            const calculatedItem = this.calculateDerivedFields(updatedItemData);
            this._inventoryItems[index] = calculatedItem;
            console.log('InventoryDataService: Updated item:', calculatedItem.productName);
        } else {
            console.warn('InventoryDataService: Item not found for update with ID:', updatedItemData.id);
        }
    }

    /**
     * Deletes an inventory item by its ID from the internal list.
     * @param id The ID of the item to delete.
     */
    deleteInventoryItem(id: number): void {
        const initialLength = this._inventoryItems.length;
        this._inventoryItems = this._inventoryItems.filter((item) => item.id !== id);
        if (this._inventoryItems.length < initialLength) {
            console.log('InventoryDataService: Deleted item with ID:', id);
        } else {
            console.warn('InventoryDataService: Item not found for deletion with ID:', id);
        }
    }

    /**
     * Re-calculates derived fields and status for all items after a mass update (e.g., inline edits).
     */
    recalculateAllItems(): void {
        this._inventoryItems = this._inventoryItems.map((item) => this.calculateDerivedFields(item));
        console.log('InventoryDataService: Recalculated all items derived fields and statuses.');
    }
}
