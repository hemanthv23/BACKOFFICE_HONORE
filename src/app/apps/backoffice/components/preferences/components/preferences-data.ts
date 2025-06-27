// ================================
// src/app/apps/backoffice/components/preferences/components/preferences-data.ts
// Manages the core data for packing slabs.
// Handles data initialization and provides CRUD operations.
// ================================
import { Injectable } from '@angular/core';
import { Slab, SlabFormData } from './preferences-interfaces';

@Injectable({
    providedIn: 'root'
})
export class PreferencesDataService {
    // Initial dummy data for slabs
    private slabs: Slab[] = [
        {
            id: 1,
            slabType: 'Individual',
            customerType: 'Individual',
            minAmount: 0,
            maxAmount: 1000,
            amountValue: 18.3,
            gstValue: 3.29,
            totalValue: 21.59
        },
        {
            id: 2,
            slabType: 'Business',
            customerType: 'Business',
            minAmount: 1000,
            maxAmount: 5000,
            amountValue: 14.15,
            gstValue: 2.55,
            totalValue: 16.7
        },
        {
            id: 3,
            slabType: 'Commercial',
            customerType: 'Commercial',
            minAmount: 5000,
            maxAmount: 10000,
            amountValue: 15.0,
            gstValue: 2.7,
            totalValue: 17.7
        },
        {
            id: 4,
            slabType: 'POS',
            customerType: 'POS',
            minAmount: 0,
            maxAmount: 999999,
            amountValue: 23.59,
            gstValue: 4.25,
            totalValue: 27.84
        }
    ];

    constructor() {
        console.log('PreferencesDataService initialized.');
    }

    /**
     * Returns a copy of the current list of slabs.
     * @returns {Slab[]} An array of slab objects.
     */
    getSlabs(): Slab[] {
        return [...this.slabs];
    }

    /**
     * Adds a new slab to the list.
     * Calculates totalValue based on amountValue and gstValue.
     * @param newSlabData The data for the new slab from the form.
     */
    addSlab(newSlabData: SlabFormData): void {
        const gstValue = parseFloat(newSlabData.gstAmount as any) || 0;
        const amountValue = parseFloat(newSlabData.amountValue as any);
        const totalValue = amountValue + gstValue;

        const newSlab: Slab = {
            id: Date.now(), // Unique ID for the new slab
            slabType: newSlabData.amountType || newSlabData.customerType, // Use amountType if available, else customerType
            customerType: newSlabData.customerType,
            minAmount: parseFloat(newSlabData.minAmount as any),
            maxAmount: parseFloat(newSlabData.maxAmount as any),
            amountValue: amountValue,
            gstValue: gstValue,
            totalValue: totalValue
        };
        this.slabs.push(newSlab);
        console.log('PreferencesDataService: Added new slab:', newSlab);
    }

    /**
     * Updates an existing slab.
     * Recalculates totalValue.
     * @param id The ID of the slab to update.
     * @param updatedData The updated data for the slab.
     */
    updateSlab(id: number, updatedData: SlabFormData): void {
        const index = this.slabs.findIndex((slab) => slab.id === id);
        if (index !== -1) {
            const gstValue = parseFloat(updatedData.gstAmount as any) || 0;
            const amountValue = parseFloat(updatedData.amountValue as any);
            const totalValue = amountValue + gstValue;

            this.slabs[index] = {
                ...this.slabs[index], // Keep existing properties
                ...updatedData, // Apply form updates
                id: id, // Ensure ID is maintained
                minAmount: parseFloat(updatedData.minAmount as any),
                maxAmount: parseFloat(updatedData.maxAmount as any),
                amountValue: amountValue,
                gstValue: gstValue,
                totalValue: totalValue,
                slabType: updatedData.amountType || updatedData.customerType // Update slabType based on form
            };
            console.log('PreferencesDataService: Updated slab:', this.slabs[index]);
        } else {
            console.warn('PreferencesDataService: Attempted to update non-existent slab ID:', id);
        }
    }

    /**
     * Deletes a slab by its ID.
     * @param id The ID of the slab to delete.
     */
    deleteSlab(id: number): void {
        const initialLength = this.slabs.length;
        this.slabs = this.slabs.filter((slab) => slab.id !== id);
        if (this.slabs.length < initialLength) {
            console.log('PreferencesDataService: Deleted slab with ID:', id);
        } else {
            console.warn('PreferencesDataService: Attempted to delete non-existent slab ID:', id);
        }
    }

    /**
     * Finds a slab by its ID.
     * @param id The ID of the slab to find.
     * @returns {Slab | undefined} The slab object or undefined if not found.
     */
    findSlabById(id: number): Slab | undefined {
        return this.slabs.find((slab) => slab.id === id);
    }
}
