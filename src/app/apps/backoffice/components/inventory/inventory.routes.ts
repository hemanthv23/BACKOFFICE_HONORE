// ==========================================================
// src/app/apps/backoffice/components/inventory/inventory.routes.ts
// Defines the routes for the Inventory feature.
// ==========================================================
import { Routes } from '@angular/router';
import { InventoryComponent } from './inventory'; // Import the main Inventory component

export const INVENTORY_ROUTES: Routes = [
    {
        path: '', // This path is relative to where `loadChildren` points to this file (e.g., '/backoffice/inventory')
        component: InventoryComponent,
        title: 'Inventory Management' // Title for the browser tab
    }
];
