// ================================
// src/app/apps/backoffice/components/preferences/components/preferences-interfaces.ts
// Defines interfaces for Slab data and form data structures.
// ================================

// Interface for Slab data structure
export interface Slab {
    id: number;
    slabType: string;
    customerType: string;
    minAmount: number;
    maxAmount: number;
    amountValue: number;
    gstValue: number;
    totalValue: number;
}

// Interface for the form data used to add/edit slabs
export interface SlabFormData {
    customerType: string;
    amountType: string; // e.g., 'Fixed', 'Percentage', 'Tiered'
    minAmount: number | '';
    maxAmount: number | '';
    amountValue: number | '';
    gstAmount: number | '';
}

// Interface for the generic modal data
export interface CustomModalData {
    title: string;
    message: string;
    type: 'alert' | 'confirm';
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
}
