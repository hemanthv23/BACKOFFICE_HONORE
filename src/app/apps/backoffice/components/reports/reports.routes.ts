import { Routes } from '@angular/router';
import { Reports } from './reports';
import { PurchaseOrders } from './purchase-orders';
import { PackingSlip } from './packing-slip';
import { Buildingname } from './building-name';
import { SalesReports } from './sales-reports';
import { PaymentStatus } from './payment-status';
import { DeliveryOptimization } from './delivery-optimization';
import { PaymentCollection } from './payment-collection';
import { InvoiceReports } from './invoice-report';

export const REPORTS_ROUTES: Routes = [
    {
        path: '',
        component: Reports,
        data: { breadcrumb: 'Reports' }
    },
    {
        path: 'purchase-orders',
        component: PurchaseOrders,
        title: 'Purchase Orders Reports',
        data: { breadcrumb: 'Purchase Orders' }
    },
    {
        path: 'packing-slip',
        component: PackingSlip,
        title: 'Packing Slip Reports',
        data: { breadcrumb: 'Packing Slip' }
    },
    {
        path: 'building-name',
        component: Buildingname,
        title: 'Building Name Reports',
        data: { breadcrumb: 'Building Name' }
    },
    {
        path: 'sales-report',
        component: SalesReports,
        title: 'Sales Reports',
        data: { breadcrumb: 'Sales Report' }
    },
    {
        path: 'payment-status',
        component: PaymentStatus,
        title: 'Payment Status',
        data: { breadcrumb: 'Payment-Sales' }
    },
    {
        path: 'delivery-optimization',
        component: DeliveryOptimization,
        title: 'DeliveryOptimization',
        data: { breadcrumb: 'delivery-optimization' }
    },
    {
        path: 'payment-collection',
        component: PaymentCollection,
        title: 'Payment Collectipon',
        data: { breadcrumb: 'payment-collection' }
    },
    {
        path: 'invoice-report',
        component: InvoiceReports,
        title: 'Invoice Reports',
        data: { breadcrumb: 'invoice-report' }
    }
];
