// ==========================================================
// src/app/apps/backoffice/components/products/components/product-modals.ts
// Manages the state and logic for various modals in the Products module.
// Depends on `ProductData` for data manipulation and `ProductFiltering` for re-filtering.
// Now also depends on `ProductDescriptionData` for detailed product descriptions.
// ==========================================================
import { Product, FuturePriceConfig } from './interfaces';
import { ProductData } from './product-data';
import { ProductFiltering } from './product-filtering';
import { ProductDescriptionData } from './product-description'; // New import

export class ProductModals {
    // Add/Edit Product Modal
    showAddProductModal = false;
    editingProduct: Product | null = null;
    newProduct: Omit<Product, 'id'> = {
        name: '',
        description: '',
        category: '',
        subcategory: '',
        price: 0,
        stock: 0,
        weight: 0,
        enabledFor: 'All', // Default for new products in the modal
        isFutureProduct: false, // Default for new products
        futurePrice: undefined, // Default
        futureEffectiveDate: undefined // Default
    };

    // Property for editable detailed product description HTML
    editableProductLongDescription: string = ''; // Changed from currentProductDetailedDescriptionHtml

    // Confirm Delete Modal
    showConfirmDeleteModal = false;
    productToDeleteId: number | null = null;

    // Future Product Modal (Set Price)
    showFutureProductModal = false;
    futurePriceConfig: FuturePriceConfig = {
        description: '',
        status: '',
        startDate: '',
        endDate: ''
    };
    previousFuturePriceLists: { description: string; startDate: string; endDate: string }[] = [
        // Example previous configurations (static for demonstration)
        { description: 'Q1 2025 Future Price', startDate: '2025-01-01', endDate: '2025-03-31' }
    ];

    // Configure All Products Modal
    showConfigAllProductsModal = false;
    availableProductsForSelection: Product[] = []; // Products that can be added
    selectedProductsForRemoval: Product[] = []; // Products that are currently selected (and can be removed)

    constructor(
        private productData: ProductData,
        private productFiltering: ProductFiltering,
        private productDescriptionData: ProductDescriptionData // New dependency
    ) {}

    // --- Add/Edit Product Modal Methods ---

    /**
     * Opens the add product modal.
     */
    openAddProductModal(): void {
        this.editingProduct = null;
        this.newProduct = {
            name: '',
            description: '',
            category: '',
            subcategory: '',
            price: 0,
            stock: 0,
            weight: 0,
            enabledFor: 'All',
            isFutureProduct: false,
            futurePrice: undefined,
            futureEffectiveDate: undefined
        };
        this.editableProductLongDescription = ''; // Clear description for new product
        this.showAddProductModal = true;
    }

    /**
     * Opens the edit product modal, populating the form with product data.
     * Also loads the detailed product description for editing.
     * @param {Product} product The product to edit.
     */
    editProduct(product: Product): void {
        this.editingProduct = product;
        // When editing, load the actual values into the modal's form
        this.newProduct = {
            name: product.name,
            description: product.description,
            category: product.category,
            subcategory: product.subcategory || '',
            price: product.price,
            stock: product.stock,
            weight: product.weight,
            enabledFor: product.enabledFor,
            isFutureProduct: product.isFutureProduct || false, // Load existing future status
            futurePrice: product.futurePrice, // Load existing future price
            futureEffectiveDate: product.futureEffectiveDate // Load existing future effective date
        };

        // Load detailed product description for editing
        const detailedDesc = this.productDescriptionData.getDescription(product.id);
        this.editableProductLongDescription = detailedDesc ? detailedDesc.longDescriptionHtml : '<p>Enter detailed description here...</p>'; // Default placeholder

        this.showAddProductModal = true;
    }

    /**
     * Saves a new or edited product and its detailed description.
     */
    saveProduct(): void {
        let savedProduct: Product;

        if (this.editingProduct) {
            // Logic for updating an existing product
            const updatedProduct: Product = {
                ...this.editingProduct, // Keep existing ID and other properties not directly in newProduct
                ...this.newProduct, // Apply new form values
                enabledFor: this.newProduct.enabledFor, // Explicitly ensure enabledFor is updated
                displayEnabledFor: this.newProduct.enabledFor, // Keep display updated
                isFutureProduct: this.newProduct.isFutureProduct, // Update future product status
                futurePrice: this.newProduct.futurePrice,
                futureEffectiveDate: this.newProduct.futureEffectiveDate
            };
            this.productData.updateProduct(updatedProduct);
            savedProduct = updatedProduct;
        } else {
            // Logic for adding a new product
            savedProduct = this.productData.addProduct(this.newProduct);
        }

        // Always update the detailed description using the ID of the saved product
        if (savedProduct) {
            this.productDescriptionData.updateDescription(savedProduct.id, this.editableProductLongDescription);
        }

        this.closeAddProductModal();
        this.productFiltering.filterProducts(); // Refresh the table
    }

    /**
     * Closes the add/edit product modal and resets the form.
     */
    closeAddProductModal(): void {
        this.showAddProductModal = false;
        this.editingProduct = null;
        this.newProduct = {
            name: '',
            description: '',
            category: '',
            subcategory: '',
            price: 0,
            stock: 0,
            weight: 0,
            enabledFor: 'All',
            isFutureProduct: false,
            futurePrice: undefined,
            futureEffectiveDate: undefined
        };
        this.editableProductLongDescription = ''; // Clear description on close
    }

    /**
     * Handles category change in the add/edit product modal, resetting subcategory if needed.
     */
    onCategoryChangeForNewProduct(): void {
        if (this.newProduct.category !== 'Breads') {
            this.newProduct.subcategory = '';
        }
    }

    // --- Confirm Delete Modal Methods ---

    /**
     * Prepares for deleting a product by setting the ID and opening the confirmation modal.
     * @param {number} id The ID of the product to delete.
     */
    prepareDeleteProduct(id: number): void {
        this.productToDeleteId = id;
        this.showConfirmDeleteModal = true;
    }

    /**
     * Confirms and performs the product deletion.
     */
    confirmDelete(): void {
        if (this.productToDeleteId !== null) {
            this.productData.deleteProduct(this.productToDeleteId);
            this.cancelDelete();
            this.productFiltering.filterProducts(); // Refresh the table
        }
    }

    /**
     * Cancels the product deletion process.
     */
    cancelDelete(): void {
        this.showConfirmDeleteModal = false;
        this.productToDeleteId = null;
    }

    // --- Future Product Modal Methods ---

    /**
     * Opens the Future Product Modal (Set Price interface).
     */
    openFutureProductModal(): void {
        // Reset form fields when opening
        this.futurePriceConfig = {
            description: '',
            status: '',
            startDate: '',
            endDate: ''
        };
        // Note: productData.allProductsData will directly be used in the table within the modal.
        this.showFutureProductModal = true;
    }

    /**
     * Closes the Future Product Modal.
     */
    closeFutureProductModal(): void {
        this.showFutureProductModal = false;
        // Discard any unsaved changes to futurePrice/isFutureProduct in the modal when closing
        this.productFiltering.filterProducts();
    }

    /**
     * Handles changes in the checkbox for future product selection.
     * @param {Product} product The product whose future status is being changed.
     */
    onFutureProductSelectionChange(product: Product): void {
        if (!product.isFutureProduct) {
            product.futurePrice = undefined;
            product.futureEffectiveDate = undefined;
        }
    }

    /**
     * Saves the future product price configuration.
     * (Updates are directly bound via ngModel, this confirms the metadata).
     */
    saveFutureProductPriceConfig(): void {
        console.log('Future Product Price Configuration Details:', this.futurePriceConfig);

        // You might want to save the futurePriceConfig metadata as well (e.g., to previousFuturePriceLists)
        this.previousFuturePriceLists.push({ ...this.futurePriceConfig });

        this.closeFutureProductModal();
        this.productFiltering.filterProducts(); // Re-filter to update the main table with new future product tags and prices
    }

    // --- Configure All Products Modal Methods ---

    /**
     * Opens the Configure All Products Modal.
     */
    openConfigAllProductsModal(): void {
        // Initialize available and selected lists based on existing data
        // For this mock-up, let's assume initially all products are 'selected' and can be 'removed'.
        this.availableProductsForSelection = this.productData.allProductsData.filter((p) => !this.selectedProductsForRemoval.some((s) => s.id === p.id));
        this.selectedProductsForRemoval = [...this.productData.allProductsData]; // Start with all products as 'selected' for demonstration matching the screenshot.

        this.showConfigAllProductsModal = true;
    }

    /**
     * Closes the Configure All Products Modal.
     */
    closeConfigAllProductsModal(): void {
        this.showConfigAllProductsModal = false;
        // Reset selections
        this.availableProductsForSelection = [];
        this.selectedProductsForRemoval = [];
    }

    /**
     * Adds a product to the selected list in the "Configure All Products" modal.
     * @param {number} productId The ID of the product to add.
     */
    addToSelectedProducts(productId: number): void {
        const productToAdd = this.availableProductsForSelection.find((p) => p.id === productId);
        if (productToAdd) {
            this.selectedProductsForRemoval.push(productToAdd);
            this.availableProductsForSelection = this.availableProductsForSelection.filter((p) => p.id !== productId);
            // Sort to keep lists tidy
            this.selectedProductsForRemoval.sort((a, b) => a.name.localeCompare(b.name));
        }
    }

    /**
     * Removes a product from the selected list in the "Configure All Products" modal.
     * @param {number} productId The ID of the product to remove.
     */
    removeFromSelectedProducts(productId: number): void {
        const productToRemove = this.selectedProductsForRemoval.find((p) => p.id === productId);
        if (productToRemove) {
            this.availableProductsForSelection.push(productToRemove);
            this.selectedProductsForRemoval = this.selectedProductsForRemoval.filter((p) => p.id !== productId);
            // Sort to keep lists tidy
            this.availableProductsForSelection.sort((a, b) => a.name.localeCompare(b.name));
        }
    }

    /**
     * Applies the changes made in the "Configure All Products" modal.
     */
    applySelectionChanges(): void {
        // In a real application, you would save the 'selectedProductsForRemoval' as the
        // new set of products for "All Products" or apply some configuration based on this selection.
        // For this example, we'll just log it.
        console.log(
            'Final Selected Products for "All Products" configuration:',
            this.selectedProductsForRemoval.map((p) => p.name)
        );
        // Using a custom message box instead of alert()
        const messageBox = document.createElement('div');
        messageBox.innerHTML = `
            <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
                <div class="bg-white rounded-xl shadow-2xl p-6 w-full max-w-xs mx-auto text-center">
                    <h2 class="text-lg font-bold text-gray-900 mb-4">Success!</h2>
                    <p class="text-gray-700 mb-6">Changes applied! (Check console for updated selection)</p>
                    <button class="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 text-sm" onclick="this.parentElement.parentElement.remove()">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(messageBox);

        this.closeConfigAllProductsModal();
    }
}
