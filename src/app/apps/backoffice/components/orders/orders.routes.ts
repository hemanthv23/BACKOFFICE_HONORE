// ==========================================================
// src/app/apps/backoffice/components/orders/orders.routes.ts
// Defines the routing configuration for the Orders component.
// ==========================================================
import { Routes } from '@angular/router';
import { Orders } from './orders'; // Import the main Orders component

export const ORDERS_ROUTES: Routes = [
    {
        path: '',
        component: Orders,
        title: 'Orders Management', // Added title for browser tab
        data: { breadcrumb: 'Orders' }
    }
];
