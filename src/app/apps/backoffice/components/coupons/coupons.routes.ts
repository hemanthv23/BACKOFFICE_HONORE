// ==========================================================
// src/app/apps/backoffice/components/coupons/coupons.routes.ts
// Defines the routing configuration for the Coupons component.
// ==========================================================
import { Routes } from '@angular/router';
// No direct import needed for 'Coupons' if using loadComponent for lazy loading

export const COUPONS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./coupons').then((c) => c.Coupons),
        title: 'Coupon Management', // Added title for browser tab
        data: { breadcrumb: 'Coupons' }
    }
];
