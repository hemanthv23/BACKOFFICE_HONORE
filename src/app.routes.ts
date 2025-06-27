import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        children: [
            { path: '', redirectTo: '/apps/backoffice', pathMatch: 'full' },

            {
                path: 'apps',
                data: { breadcrumb: 'Apps' },
                loadChildren: () => import('./app/apps/apps.routes')
            }
        ]
    },
    { path: '**', redirectTo: '/notfound' }
];
