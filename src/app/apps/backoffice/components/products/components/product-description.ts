// ==========================================================
// src/app/apps/backoffice/components/products/components/product-description.ts
// Provides detailed descriptions for products.
// ==========================================================

/**
 * Interface for a detailed product description, including rich HTML content.
 */
export interface ProductDescription {
    productId: number;
    longDescriptionHtml: string;
}

/**
 * Manages and provides detailed product descriptions.
 * This class serves as a mock data source for product-specific rich text content.
 */
export class ProductDescriptionData {
    private descriptions: ProductDescription[] = [];

    constructor() {
        this.loadDescriptions();
    }

    /**
     * Loads sample detailed product descriptions into the class.
     * Each description now contains plain text for easier editing.
     */
    private loadDescriptions(): void {
        this.descriptions = [
            {
                productId: 1, // Artisan Sourdough Bread
                longDescriptionHtml: `
Product Description: Traditional handcrafted sourdough, made with a slow fermentation process for exceptional flavor and texture.

About the Product:
- Crispy crust with a soft, airy, and tangy interior.
- Perfect for sandwiches, toast, or alongside your favorite meal.
- Made with natural starter, no commercial yeast.

Ingredients: Wheat Flour, Water, Sourdough Starter, Salt.

Shape and Size:
- Round Boule shape.
- Weight: 750g.
- Yields approximately 10-12 slices.
                `
            },
            {
                productId: 2, // Butter Croissants
                longDescriptionHtml: `
Product Description: Our Butter Croissants are classic flaky French pastries, golden brown and incredibly buttery.

About the Product:
- Crisp on the outside, soft and airy on the inside.
- Perfect for breakfast or a delightful snack.
- Made with high-quality French butter.

Ingredients: Wheat Flour, Butter, Water, Sugar, Yeast, Salt, Egg.

Shape and Size:
- Classic crescent shape.
- Weight: 80g per croissant.
                `
            },
            {
                productId: 3, // Chocolate Chip Cookies
                longDescriptionHtml: `
Product Description: These are classic homemade chocolate chip cookies, soft and chewy with generous amounts of rich chocolate chips.

About the Product:
- Baked to perfection with a golden edge and gooey center.
- A timeless favorite for all ages.
- Packed with real chocolate.

Ingredients: Wheat Flour, Butter, Brown Sugar, Granulated Sugar, Chocolate Chips, Eggs, Vanilla Extract, Baking Soda, Salt.

Shape and Size:
- Round, flat cookie shape.
- Weight: 50g per cookie.
                `
            },
            {
                productId: 4, // Red Velvet Cake
                longDescriptionHtml: `
Product Description: Our Red Velvet Cake is a moist and rich cake with a hint of cocoa, beautifully complemented by a luscious cream cheese frosting.

About the Product:
- Vibrant red color, perfect for special occasions.
- Balanced sweetness with a velvety texture.
- Hand-piped cream cheese frosting for an elegant finish.

Ingredients: Wheat Flour, Sugar, Cocoa Powder, Buttermilk, Eggs, Vegetable Oil, Cream Cheese, Butter, Vanilla Extract, Red Food Color, Baking Soda.

Shape and Size:
- Round layered cake.
- Weight: 1000g (1kg).
- Serves 8-10 people.
                `
            },
            {
                productId: 5, // Blueberry Muffins
                longDescriptionHtml: `
Product Description: Enjoy our freshly baked Blueberry Muffins, bursting with real blueberries and a delightful streusel topping.

About the Product:
- Moist and tender crumb with juicy blueberries in every bite.
- Perfect for breakfast, brunch, or an afternoon treat.
- Made with natural ingredients.

Ingredients: Wheat Flour, Blueberries, Sugar, Milk, Eggs, Vegetable Oil, Baking Powder, Vanilla Extract, Streusel Topping (Flour, Butter, Sugar).

Shape and Size:
- Standard muffin shape.
- Weight: 120g per muffin.
                `
            },
            {
                productId: 6, // Whole Wheat Loaf
                longDescriptionHtml: `
Product Description: Our Whole Wheat Loaf is a healthy and hearty bread, baked to a golden perfection with a rich, wholesome flavor.

About the Product:
- High in fiber and nutrients, ideal for a balanced diet.
- Soft texture, perfect for sandwiches or toast.
- Made with 100% whole wheat flour.

Ingredients: Whole Wheat Flour, Water, Yeast, Salt, Honey (optional).

Shape and Size:
- Classic rectangular loaf.
- Weight: 600g.
- Yields approximately 14-16 slices.
                `
            },
            {
                productId: 7, // Multigrain Bread
                longDescriptionHtml: `
Product Description: Our Multigrain Bread is a nutrient-rich loaf packed with a blend of various wholesome grains, offering a unique texture and flavor.

About the Product:
- Hearty and full of texture from various grains.
- Great for a nutritious breakfast or robust sandwiches.
- Includes oats, flax seeds, sunflower seeds, and more.

Ingredients: Wheat Flour, Multigrain Blend (Oats, Flax Seeds, Sunflower Seeds, Millet, etc.), Water, Yeast, Salt, Brown Sugar.

Shape and Size:
- Rectangular loaf.
- Weight: 550g.
- Yields approximately 12-14 slices.
                `
            },
            {
                productId: 8, // Almond Croissant
                longDescriptionHtml: `
Product Description: Our Almond Croissant is a delightful twist on the classic, filled with a sweet almond paste and topped with toasted almonds and powdered sugar.

About the Product:
- Flaky pastry combined with a rich, nutty filling.
- A perfect indulgent treat with coffee.
- Baked to golden perfection with a generous almond topping.

Ingredients: Wheat Flour, Butter, Water, Sugar, Almond Paste (Almonds, Sugar, Egg Whites), Toasted Almonds, Powdered Sugar, Yeast, Salt, Egg.

Shape and Size:
- Crescent shape, slightly larger than regular croissants due to filling.
- Weight: 90g per croissant.
                `
            }
        ];
    }

    /**
     * Retrieves the detailed description for a given product ID.
     * @param {number} productId The ID of the product.
     * @returns {ProductDescription | undefined} The product description object or undefined if not found.
     */
    getDescription(productId: number): ProductDescription | undefined {
        return this.descriptions.find((desc) => desc.productId === productId);
    }

    /**
     * Updates the detailed description for a given product ID.
     * If the product description does not exist, it will be added.
     * @param {number} productId The ID of the product to update.
     * @param {string} newHtml The new HTML content for the description.
     */
    updateDescription(productId: number, newHtml: string): void {
        const descriptionIndex = this.descriptions.findIndex((desc) => desc.productId === productId);
        if (descriptionIndex !== -1) {
            this.descriptions[descriptionIndex].longDescriptionHtml = newHtml;
            console.log(`Updated detailed description for product ID ${productId}`);
        } else {
            // If a description doesn't exist for a product (e.g., a newly added product), add it.
            this.descriptions.push({ productId, longDescriptionHtml: newHtml });
            console.log(`Added new detailed description for product ID ${productId}`);
        }
    }
}
