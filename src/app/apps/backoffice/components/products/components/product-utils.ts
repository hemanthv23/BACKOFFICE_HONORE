// ==========================================================
// src/app/apps/backoffice/components/products/components/product-utils.ts
// Provides utility methods for product-related data and display.
// Depends on `ProductData` for access to all products.
// ==========================================================
import { Product } from './interfaces';
import { ProductData } from './product-data';

export class ProductUtils {
    // Define static lists for categories and enabledFor options
    categories = ['Breads', 'Cookies', 'Cakes', 'Brownies', 'Savouries', 'Viennoiserie', 'Sweet Pies'];
    breadSubcategories = ['Vegan Breads', 'Sourdough Breads', 'Sourdough Hybrid Breads', 'Yeast Breads', 'Eggless', 'Toasted'];
    enabledForOptions = ['All', 'Individual', 'Business', 'Business + Individual', 'Community'];

    constructor(private productData: ProductData) {}

    /**
     * Returns the total count of all products.
     * @returns {number} The total number of products.
     */
    getTotalProducts(): number {
        return this.productData.allProductsData.length;
    }

    /**
     * Returns the number of products with low stock (less than 10).
     * @returns {number} The count of low stock products.
     */
    getLowStockProducts(): number {
        return this.productData.allProductsData.filter((product) => product.stock < 10).length;
    }

    /**
     * Returns the appropriate CSS class for product stock level.
     * @param {number} stock The stock quantity.
     * @returns {string} Tailwind CSS classes.
     */
    getStockClass(stock: number): string {
        if (stock < 5) {
            return 'text-red-600 font-semibold';
        } else if (stock < 10) {
            return 'text-yellow-600 font-semibold';
        } else {
            return 'text-green-600';
        }
    }

    /**
     * Returns the CSS class for category filter buttons.
     * @param {string} filter The filter value.
     * @param {string} activeFilter The currently active filter.
     * @returns {string} Tailwind CSS classes.
     */
    getFilterButtonClass(filter: string, activeFilter: string): string {
        return activeFilter === filter ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    }

    /**
     * Returns the CSS class for subcategory filter buttons.
     * @param {string} subcategory The subcategory value.
     * @param {string} activeSubcategory The currently active subcategory filter.
     * @returns {string} Tailwind CSS classes.
     */
    getSubcategoryButtonClass(subcategory: string, activeSubcategory: string): string {
        return activeSubcategory === subcategory ? 'bg-amber-400 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100';
    }
}
