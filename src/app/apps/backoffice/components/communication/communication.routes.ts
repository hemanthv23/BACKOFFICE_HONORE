// ==========================================================
// src/app/apps/backoffice/components/communication/communication.routes.ts
// Defines the routing configuration for the Communication component.
// ==========================================================
import { Routes } from '@angular/router';

export const COMMUNICATION_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./communication').then((c) => c.CommunicationComponent),
        title: 'Communication Center',
        data: { breadcrumb: 'Communication' }
    }
];
