import { Routes } from '@angular/router';

export default [
    {
        path: 'backoffice',
        loadChildren: () => import('./backoffice/backoffice.routes').then((m) => m.BACKOFFICE_ROUTES),
        data: { breadcrumb: 'Back-Office' }
    }
] as Routes;
