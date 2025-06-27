// ==========================================================
// src/app/apps/backoffice/components/inventory/components/inventory-utils.ts
// Provides utility functions for styling, statistical calculations,
// and other display-related helpers.
// FIX: Re-implemented direct CSV download via Blob and <a> tag.
// ==========================================================
import { Injectable } from '@angular/core';
import { InventoryItem } from './interfaces';
import { InventoryModalsService } from './inventory-modals'; // Import the modals service

@Injectable({
    providedIn: 'root'
})
export class InventoryUtilsService {
    constructor(private modalsService: InventoryModalsService) {
        // Inject the modals service
        console.log('InventoryUtilsService: Service constructor called.');
    }

    // --- Styling Methods ---
    /**
     * Returns Tailwind CSS classes for stock status badges.
     * @param status The inventory item's stock status.
     * @returns Tailwind CSS class string.
     */
    getStatusColorClass(status: 'In Stock' | 'Low Stock' | 'Out of Stock'): string {
        switch (status) {
            case 'In Stock':
                return 'bg-emerald-500';
            case 'Low Stock':
                return 'bg-amber-500';
            case 'Out of Stock':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    }

    /**
     * Returns Tailwind CSS classes for filter buttons based on active state.
     * Copied from products.ts for consistent styling.
     * @param filter The filter value.
     * @param activeFilter The currently active filter value.
     * @returns Tailwind CSS class string.
     */
    getFilterButtonClass(filter: string, activeFilter: string): string {
        return activeFilter === filter ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }

    /**
     * Returns Tailwind CSS classes for subcategory buttons based on active state.
     * Copied from products.ts for consistent styling.
     * @param subcategory The subcategory value.
     * @param activeSubcategory The currently active subcategory value.
     * @returns Tailwind CSS class string.
     */
    getSubcategoryButtonClass(subcategory: string, activeSubcategory: string): string {
        return activeSubcategory === subcategory ? 'bg-amber-400 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100';
    }

    // --- Statistical Calculation Methods ---
    /**
     * Gets the count of items for a specific stock status.
     * @param items The array of inventory items.
     * @param status The status to count ('In Stock', 'Low Stock', 'Out of Stock').
     * @returns {number} The count of items with the specified status.
     */
    getStockCount(items: InventoryItem[], status: 'In Stock' | 'Low Stock' | 'Out of Stock'): number {
        return items.filter((item) => item.status === status).length;
    }

    /**
     * Gets the total number of inventory items.
     * @param items The array of inventory items.
     * @returns {number} The total count of items.
     */
    getTotalValue(items: InventoryItem[]): number {
        return items.length;
    }

    /**
     * Exports the given inventory items to a CSV file via direct download.
     * Provides user feedback via modals for success/failure.
     * @param itemsToExport The array of InventoryItem objects to export.
     */
    exportData(itemsToExport: InventoryItem[]): void {
        const headers = ['ID', 'Product Name', 'Category', 'Subcategory', 'Capacity', 'Production', 'Sample', 'Damaged', 'CF Qty', 'CF Sold', 'Total Inventory', 'Ordered', 'CF Balance', 'Fresh Balance', 'Current Balance', 'Status', 'Last Updated'];

        const rows = itemsToExport.map((item) => {
            const formatCsvValue = (value: any): string => {
                if (value === null || value === undefined) {
                    return '';
                }
                let stringValue = String(value);
                if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            };

            return [
                formatCsvValue(item.id),
                formatCsvValue(item.productName),
                formatCsvValue(item.category),
                formatCsvValue(item.subCategory || ''),
                formatCsvValue(item.capacity),
                formatCsvValue(item.production),
                formatCsvValue(item.sample),
                formatCsvValue(item.damaged),
                formatCsvValue(item.cfQty),
                formatCsvValue(item.cfSold),
                formatCsvValue(item.totalInv),
                formatCsvValue(item.ordered),
                formatCsvValue(item.cfBal),
                formatCsvValue(item.freshBal),
                formatCsvValue(item.currentBal),
                formatCsvValue(item.status),
                formatCsvValue(item.lastUpdated.toLocaleString())
            ].join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const fileName = `inventory_export_${new Date().toISOString().slice(0, 10)}.csv`;

        // Attempt direct download
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.style.display = 'none'; // Hide the link
        document.body.appendChild(link); // Temporarily append to body

        try {
            link.click(); // Trigger the download
            this.modalsService.openCustomModal('Download Initiated', `Your inventory data "${fileName}" download should start shortly.`, 'alert');
            console.log(`InventoryUtilsService: Attempted download for ${fileName}.`);
        } catch (e) {
            console.error('InventoryUtilsService: Direct download failed:', e);
            this.modalsService.openCustomModal('Download Failed', 'Direct download could not be initiated. This is often due to browser security restrictions or popup blockers in this environment. Please check your browser settings.', 'alert');
        } finally {
            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        }
    }
}
