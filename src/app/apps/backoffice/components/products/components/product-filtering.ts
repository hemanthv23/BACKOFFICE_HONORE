// ==========================================================
// src/app/apps/backoffice/components/products/components/product-filtering.ts
// Contains logic for filtering, searching, and managing category/subcategory selections.
// Depends on `ProductData` for the source of products.
// ==========================================================
import { Product } from './interfaces';
import { ProductData } from './product-data';

export class ProductFiltering {
    // Filter and search properties
    searchTerm = '';
    activeFilter = 'All'; // For category filter
    activeSubcategory = 'All Breads'; // For bread subcategory filter
    activeEnabledForFilter: string = 'All'; // For the 'Enabled For' filter card

    private _filteredProducts: Product[] = []; // The list currently displayed in the table

    constructor(private productData: ProductData) {
        this.filterProducts(); // Initial filter when instantiated
    }

    /**
     * Getter for filtered products.
     * @returns {Product[]} The array of products after applying filters.
     */
    get filteredProducts(): Product[] {
        return this._filteredProducts;
    }

    /**
     * Applies all active filters and search term to the product data.
     * Updates `_filteredProducts`.
     */
    filterProducts(): void {
        let filtered = [...this.productData.allProductsData]; // Always start filtering from the original data

        // Apply category filter
        if (this.activeFilter !== 'All') {
            filtered = filtered.filter((product) => product.category === this.activeFilter);
        }

        // Apply subcategory filter (only for Breads)
        if (this.activeFilter === 'Breads' && this.activeSubcategory !== 'All Breads') {
            filtered = filtered.filter((product) => product.subcategory === this.activeSubcategory);
        }

        // Apply Enabled For filter (from the card dropdown)
        if (this.activeEnabledForFilter !== 'All') {
            filtered = filtered.filter((product) => product.enabledFor === this.activeEnabledForFilter);
        }

        // Apply search term filter
        if (this.searchTerm.trim()) {
            const term = this.searchTerm.toLowerCase();
            filtered = filtered.filter(
                (product) =>
                    product.name.toLowerCase().includes(term) ||
                    product.description.toLowerCase().includes(term) ||
                    product.category.toLowerCase().includes(term) ||
                    (product.subcategory && product.subcategory.toLowerCase().includes(term)) ||
                    product.enabledFor.toLowerCase().includes(term)
            );
        }

        // After filtering, ensure the 'displayEnabledFor' for each *currently filtered* product is up-to-date
        // with its actual enabledFor value for its dropdown to show the correct default.
        this._filteredProducts = filtered.map((p) => ({ ...p, displayEnabledFor: p.enabledFor }));
    }

    /**
     * Sets the active category filter and re-filters products.
     * Resets subcategory filter when category changes.
     * @param {string} filter The category to filter by.
     */
    setActiveFilter(filter: string): void {
        this.activeFilter = filter;
        this.activeSubcategory = 'All Breads'; // Reset subcategory when main category filter changes
        this.filterProducts();
    }

    /**
     * Sets the active subcategory filter and re-filters products.
     * @param {string} subcategory The subcategory to filter by.
     */
    setActiveSubcategory(subcategory: string): void {
        this.activeSubcategory = subcategory;
        this.filterProducts();
    }

    /**
     * Handles change in the 'Enabled For' filter dropdown in the summary card.
     */
    onEnabledForFilterChange(): void {
        this.filterProducts();
    }
}
