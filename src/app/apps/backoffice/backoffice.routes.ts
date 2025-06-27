// ================================
// src/app/apps/backoffice/backoffice.routes.ts
// Defines the main routing for the Backoffice module, including all sub-modules.
// ================================
import { Routes } from '@angular/router'; // Single import for Routes

// NOTE: These imports for ROUTES constants are primarily for type inference and clarity.
// The actual module loading for lazy-loaded routes happens via `loadChildren`.
// Components loaded directly use `loadComponent`.

import { REPORTS_ROUTES } from './components/reports/reports.routes';
import { ORDERS_ROUTES } from './components/orders/orders.routes';
import { PRODUCTS_ROUTES } from './components/products/products.routes';
import { COUPONS_ROUTES } from './components/coupons/coupons.routes';
import { COMMUNICATION_ROUTES } from './components/communication/communication.routes';
import { INVENTORY_ROUTES } from './components/inventory/inventory.routes';
// Only import PREFERENCES_ROUTES here, as that's the one we're changing to loadChildren
import { PREFERENCES_ROUTES } from './components/preferences/preferences.routes';

export const BACKOFFICE_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./backoffice').then((c) => c.BackOffice),
        children: [
            {
                path: '',
                redirectTo: 'backoffice', // Reverted to original redirectTo
                pathMatch: 'full'
            },
            {
                path: 'customers',
                loadComponent: () => import('./components/customers/customer').then((c) => c.Customers),
                data: { breadcrumb: 'Customers' }
            },
            {
                path: 'products',
                loadChildren: () => import('./components/products/products.routes').then((m) => m.PRODUCTS_ROUTES),
                data: { breadcrumb: 'Products' }
            },
            {
                path: 'orders',
                loadChildren: () => import('./components/orders/orders.routes').then((m) => m.ORDERS_ROUTES),
                data: { breadcrumb: 'Orders' }
            },
            {
                path: 'calendar',
                loadComponent: () => import('./components/calendar/calendar').then((c) => c.Calendar),
                data: { breadcrumb: 'Calendar' }
            },
            {
                path: 'inventory',
                // This path was correct, keeping it as is
                loadChildren: () => import('./components/inventory/inventory.routes').then((m) => m.INVENTORY_ROUTES),
                data: { breadcrumb: 'Inventory' }
            },
            {
                path: 'community',
                // Reverted to original loadComponent as per your instruction "don't touch other"
                loadComponent: () => import('./components/community/community').then((c) => c.Community),
                data: { breadcrumb: 'Community' }
            },
            {
                path: 'communication',
                loadChildren: () => import('./components/communication/communication.routes').then((m) => m.COMMUNICATION_ROUTES),
                data: { breadcrumb: 'Communication' }
            },
            {
                path: 'coupons',
                loadChildren: () => import('./components/coupons/coupons.routes').then((m) => m.COUPONS_ROUTES),
                data: { breadcrumb: 'Coupons' }
            },
            {
                path: 'reports',
                loadChildren: () => import('./components/reports/reports.routes').then((m) => m.REPORTS_ROUTES),
                data: { breadcrumb: 'Reports' }
            },
            {
                path: 'appsettings',
                // **ONLY THIS SECTION UPDATED:**
                // Changed from loadComponent to loadChildren to correctly load PREFERENCES_ROUTES
                loadChildren: () => import('./components/preferences/preferences.routes').then((m) => m.PREFERENCES_ROUTES),
                data: { breadcrumb: 'App-Settings' }
            }
        ]
    }
];
