// ==========================================================
// src/app/apps/backoffice/products/products.routes.ts
// Defines the routes for the Products feature.
// ==========================================================
import { Routes } from '@angular/router';
import { ProductsComponent } from './products'; // Import the main Products component

export const PRODUCTS_ROUTES: Routes = [
    {
        path: '', // This path is relative to where `loadChildren` points to this file (e.g., '/backoffice/products')
        component: ProductsComponent, // Directly assign component for eager loading (if not lazy-loaded)
        // If you prefer lazy loading for this specific component:
        // loadComponent: () => import('./products').then((m) => m.ProductsComponent),
        title: 'Products Management' // Title for the browser tab
    }
];
