// ==========================================================
// src/app/apps/backoffice/components/products/components/product-data.ts
// Manages the core product data, including loading sample data,
// and methods for adding, updating, and deleting products.
// ==========================================================
import { Product } from './interfaces';

export class ProductData {
    private _allProductsData: Product[] = []; // To hold the original data for filtering and saving

    constructor() {
        this.loadInitialProducts();
    }

    /**
     * Getter for all product data.
     * @returns {Product[]} The array of all products.
     */
    get allProductsData(): Product[] {
        return this._allProductsData;
    }

    /**
     * Loads initial sample product data.
     */
    private loadInitialProducts(): void {
        this._allProductsData = [
            {
                id: 1,
                name: 'Artisan Sourdough Bread',
                description: 'Traditional handcrafted sourdough',
                category: 'Breads',
                subcategory: 'Sourdough Breads',
                price: 180,
                stock: 25,
                weight: 500,
                enabledFor: 'Community',
                isFutureProduct: false
            },
            {
                id: 2,
                name: 'Butter Croissants',
                description: 'Flaky French pastries',
                category: 'Viennoiserie',
                price: 45,
                stock: 25,
                weight: 80,
                enabledFor: 'Business',
                isFutureProduct: false
            },
            {
                id: 3,
                name: 'Chocolate Chip Cookies',
                description: 'Classic homemade cookies',
                category: 'Cookies',
                price: 120,
                stock: 25,
                weight: 50,
                enabledFor: 'Individual',
                isFutureProduct: false
            },
            {
                id: 4,
                name: 'Red Velvet Cake',
                description: 'Moist cake with cream cheese frosting',
                category: 'Cakes',
                price: 850,
                stock: 25,
                weight: 1000,
                enabledFor: 'Business + Individual',
                isFutureProduct: true, // Example: This product is initially marked as future
                futurePrice: 900,
                futureEffectiveDate: '2025-07-01'
            },
            {
                id: 5,
                name: 'Blueberry Muffins',
                description: 'Fresh baked with real blueberries',
                category: 'Sweet Pies',
                price: 180.0,
                stock: 25,
                weight: 120,
                enabledFor: 'Community',
                isFutureProduct: false
            },
            {
                id: 6,
                name: 'Whole Wheat Loaf',
                description: 'Healthy and hearty whole wheat bread',
                category: 'Breads',
                subcategory: 'Yeast Breads',
                price: 150.0,
                stock: 30,
                weight: 600,
                enabledFor: 'All',
                isFutureProduct: false
            },
            {
                id: 7,
                name: 'Multigrain Bread',
                description: 'Nutrient-rich bread with various grains',
                category: 'Breads',
                subcategory: 'Yeast Breads',
                price: 160.0,
                stock: 20,
                weight: 550,
                enabledFor: 'All',
                isFutureProduct: true,
                futurePrice: 175,
                futureEffectiveDate: '2025-08-15'
            },
            {
                id: 8,
                name: 'Almond Croissant',
                description: 'Flaky croissant with almond filling',
                category: 'Viennoiserie',
                price: 60.0,
                stock: 15,
                weight: 90,
                enabledFor: 'Individual',
                isFutureProduct: false
            }
        ].map((p) => ({
            ...p,
            displayEnabledFor: p.enabledFor, // Initialize display value from actual enabledFor
            isFutureProduct: p.isFutureProduct || false, // Ensure it's boolean
            futurePrice: p.futurePrice || undefined, // Ensure it's number or undefined
            futureEffectiveDate: p.futureEffectiveDate || undefined // Ensure it's string or undefined
        }));
    }

    /**
     * Adds a new product to the data list.
     * @param {Omit<Product, 'id'>} newProductData The product data to add (without ID).
     * @returns {Product} The newly added product with a generated ID.
     */
    addProduct(newProductData: Omit<Product, 'id'>): Product {
        const newId = Math.max(...this._allProductsData.map((p) => p.id), 0) + 1;
        const product: Product = {
            id: newId,
            ...newProductData,
            displayEnabledFor: newProductData.enabledFor,
            isFutureProduct: newProductData.isFutureProduct || false,
            futurePrice: newProductData.futurePrice,
            futureEffectiveDate: newProductData.futureEffectiveDate
        };
        this._allProductsData.push(product);
        return product;
    }

    /**
     * Updates an existing product in the data list.
     * @param {Product} updatedProduct The product object with updated values.
     */
    updateProduct(updatedProduct: Product): void {
        const index = this._allProductsData.findIndex((p) => p.id === updatedProduct.id);
        if (index !== -1) {
            this._allProductsData[index] = {
                ...updatedProduct,
                displayEnabledFor: updatedProduct.enabledFor // Ensure display value is kept updated
            };
        }
    }

    /**
     * Deletes a product from the data list by its ID.
     * @param {number} productId The ID of the product to delete.
     */
    deleteProduct(productId: number): void {
        this._allProductsData = this._allProductsData.filter((p) => p.id !== productId);
    }

    /**
     * Updates the 'enabledFor' property of a specific product.
     * @param {number} productId The ID of the product to update.
     * @param {string} newEnabledForValue The new value for 'enabledFor'.
     */
    updateProductEnabledFor(productId: number, newEnabledForValue: string): void {
        const product = this._allProductsData.find((p) => p.id === productId);
        if (product) {
            product.enabledFor = newEnabledForValue;
            product.displayEnabledFor = newEnabledForValue; // Keep display property in sync
        }
    }

    /**
     * Finds a product by its ID.
     * @param {number} id The ID of the product to find.
     * @returns {Product | undefined} The found product or undefined.
     */
    findProductById(id: number): Product | undefined {
        return this._allProductsData.find((p) => p.id === id);
    }
}
