import { Routes } from '@angular/router';
// No direct import needed for 'Coupons' if using loadComponent for lazy loading

export const COUPONS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./coupons').then((c) => c.CouponsComponent),
        title: 'Coupon Management', // Added title for browser tab
        data: { breadcrumb: 'Coupons' }
    }
];
